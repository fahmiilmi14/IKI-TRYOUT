let KUNCI_RAHASIA = "";

let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let timeLeft = 30 * 60;
let timerInterval;

const currentSubtestId = localStorage.getItem("currentSubtestId") || "pu";
const tryoutForm = document.getElementById("tryoutForm");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const timerDisplay = document.getElementById("timer");
const resultDiv = document.getElementById("result");

// Fungsi untuk mendekripsi soal
async function loadEncryptedQuestions() {
    try {
        const response = await fetch("soal.enc.json");
        const { data } = await response.json();
        const bytes = CryptoJS.AES.decrypt(data, KUNCI_RAHASIA);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        const parsed = JSON.parse(decrypted);
        return parsed.filter(q => q.category === currentSubtestId);
    } catch (e) {
        alert("❌ Gagal memuat soal. Kunci salah atau file rusak.");
        console.error(e);
        return [];
    }
}

// Minta kunci dari user
function submitKunci() {
    const input = document.getElementById("kunciInput").value.trim();
    if (!input) return alert("Kunci tidak boleh kosong!");
    KUNCI_RAHASIA = input;
    document.getElementById("keyModal").style.display = "none";
    initTryout();
}

// Inisialisasi tryout setelah dapat soal
async function initTryout() {
    const data = await loadEncryptedQuestions();
    if (!data.length) {
        alert("Tidak ada soal tersedia.");
        return;
    }
    questions = data;
    const saved = localStorage.getItem(`answers_${currentSubtestId}`);
    if (saved) userAnswers = JSON.parse(saved);
    displayQuestion();
    startTimer();
}

// Tampilkan soal
function displayQuestion() {
    tryoutForm.innerHTML = "";

    const q = questions[currentQuestionIndex];
    if (!q) return;

    const block = document.createElement("div");
    block.className = "question-block";
    const text = document.createElement("p");
    text.innerHTML = q.question.replace(/\n/g, "<br>");
    block.appendChild(text);

    const options = document.createElement("div");
    q.options.forEach(opt => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `question${q.id}`;
        input.value = opt.charAt(0);
        if (userAnswers[q.id] === opt.charAt(0)) input.checked = true;
        input.onchange = e => {
            userAnswers[q.id] = e.target.value;
            localStorage.setItem(`answers_${currentSubtestId}`, JSON.stringify(userAnswers));
        };
        label.appendChild(input);
        label.appendChild(document.createTextNode(opt));
        options.appendChild(label);
    });

    block.appendChild(options);
    tryoutForm.appendChild(block);

    prevBtn.style.display = currentQuestionIndex === 0 ? "none" : "inline-block";
    nextBtn.style.display = currentQuestionIndex === questions.length - 1 ? "none" : "inline-block";
    submitBtn.style.display = currentQuestionIndex === questions.length - 1 ? "inline-block" : "none";
}

// Timer
function startTimer() {
    const saved = localStorage.getItem(`timer_${currentSubtestId}`);
    if (saved) timeLeft = parseInt(saved, 10);

    timerInterval = setInterval(() => {
        const min = Math.floor(timeLeft / 60);
        const sec = timeLeft % 60;
        timerDisplay.textContent = `Waktu tersisa: ${min}:${sec < 10 ? "0" : ""}${sec}`;
        localStorage.setItem(`timer_${currentSubtestId}`, timeLeft);
        if (--timeLeft < 0) {
            clearInterval(timerInterval);
            submitTryout();
        }
    }, 1000);
}

// Penilaian
function estimateTheta(userResponses, questions) {
    let theta = 0;
    for (let i = 0; i < 50; i++) {
        let grad = 0;
        for (let q of questions) {
            const ua = userResponses[q.id];
            const correct = ua === q.correctAnswer;
            const P = q.guessing + (1 - q.guessing) / (1 + Math.exp(-q.discrimination * (theta - q.difficulty)));
            grad += q.discrimination * (correct ? (1 - P) : (P - 1));
        }
        theta += 0.1 * grad;
    }
    return theta;
}

function scaleTheta(theta, minT = -3, maxT = 3, minS = 300, maxS = 1000) {
    const t = Math.max(minT, Math.min(maxT, theta));
    return Math.round(((t - minT) / (maxT - minT)) * (maxS - minS) + minS);
}

// Submit
function submitTryout() {
    clearInterval(timerInterval);
    localStorage.removeItem(`timer_${currentSubtestId}`);
    localStorage.removeItem(`answers_${currentSubtestId}`);

    let benar = 0;
    const detail = [];

    for (const q of questions) {
        const jawaban = userAnswers[q.id] || "Tidak Dijawab";
        const isBenar = jawaban === q.correctAnswer;
        if (isBenar) benar++;
        detail.push({ id: q.id, jawaban, benar: isBenar });
    }

    const theta = estimateTheta(userAnswers, questions);
    const score = scaleTheta(theta);

    tryoutForm.style.display = "none";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    submitBtn.style.display = "none";
    timerDisplay.style.display = "none";

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
        <h3>Hasil Tryout</h3>
        <p>Benar: ${benar} dari ${questions.length}</p>
        <p>Theta: <strong>${theta.toFixed(2)}</strong></p>
        <p>Skor: <strong>${score}</strong> dari 1000</p>
        <p>Redirect ke beranda dalam 3 detik...</p>
    `;

    setTimeout(() => {
        window.location.href = `coba.html?subtestId=${currentSubtestId}&score=${score}`;
    }, 3000);
}

// Navigasi
nextBtn.onclick = () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
};
prevBtn.onclick = () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
};
submitBtn.onclick = submitTryout;

// Tunggu kunci dimasukkan
window.addEventListener("DOMContentLoaded", () => {
    // Tombol submitKunci akan dipanggil dari HTML modal
});
