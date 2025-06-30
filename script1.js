let KUNCI_RAHASIA = "";
let questions = [];
let currentQuestionIndex = 0;

let userAnswers = [];
let timeLeft = 30 * 60;
let timerInterval;

const URL_WEB_APP = "https://script.google.com/macros/s/AKfycbxseuyapNriZ0WE1r5fyEWRT8nNroKBIbSYIXhg-p1DhhqPw0qUSsDfXzCxHbAlv5GeMg/exec";
const currentSubtestId = localStorage.getItem("currentSubtestId") || "pu";
const tryoutForm = document.getElementById("tryoutForm");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const timerDisplay = document.getElementById("timer");
const resultDiv = document.getElementById("result");
const keyModal = document.getElementById("keyModal");

const durasiPerSubtest = {
    pu: 30 * 60,
    ppu: 15 * 60,
    pbm: 20 * 60,
    pk: 20 * 60,
    bi: 42.5 * 60,
    bing: 20 * 60,
    "Penalaran matematika": 42.5 * 60,
};

function kirimKeFirebase(nama, skor, subtest) {
    const ref = db.ref("leaderboard").push();
    ref.set({
        nama: nama,
        skor: skor,
        subtest: subtest,
        waktu: new Date().toISOString()
    })
    .then(() => {
        console.log("✅ Data tersimpan di Firebase");
    })
    .catch((err) => {
        console.error("❌ Gagal simpan ke Firebase:", err);
    });
}

async function loadEncryptedQuestions() {
    try {
        const response = await fetch("soal.enc.json");
        if (!response.ok) throw new Error("Gagal fetch soal");

        const { data } = await response.json();
        if (!KUNCI_RAHASIA) throw new Error("Kunci belum diisi");

        const bytes = CryptoJS.AES.decrypt(data, KUNCI_RAHASIA);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (!decrypted) throw new Error("Kunci salah atau data rusak");

        const parsed = JSON.parse(decrypted);
        const filtered = parsed.filter(q => q.category === currentSubtestId);
        if (filtered.length === 0) {
            alert("Soal tidak ditemukan");
            keyModal.style.display = "flex";
            return [];
        }
        return filtered;
    } catch (e) {
        alert("Gagal muat soal: " + e.message);
        console.error(e);
        keyModal.style.display = "flex";
        return [];
    }
}

function submitKunci() {
    const input = document.getElementById("kunciInput").value.trim();
    if (!input) return alert("Kunci tidak boleh kosong");
    KUNCI_RAHASIA = input;
    localStorage.setItem("tryoutAccessKey", input);
    keyModal.style.display = "none";
    initTryout();
}

async function initTryout() {
    currentQuestionIndex = parseInt(localStorage.getItem(`currentQuestionIndex_${currentSubtestId}`)) || 0;

    const data = await loadEncryptedQuestions();
    if (!data.length) return;
    questions = data;

    try {
        userAnswers = JSON.parse(localStorage.getItem(`answers_${currentSubtestId}`)) || [];
    } catch {
        userAnswers = [];
    }

    if (userAnswers.length === 0) userAnswers = new Array(questions.length).fill(null);

    if (!localStorage.getItem(`deadline_${currentSubtestId}`)) {
        const durasi = durasiPerSubtest[currentSubtestId] || 30 * 60;
        const deadline = Date.now() + durasi * 1000;
        localStorage.setItem(`deadline_${currentSubtestId}`, deadline);
    }

    displayQuestion();
    startTimer();
}

function displayQuestion() {
    tryoutForm.innerHTML = "";
    const q = questions[currentQuestionIndex];
    if (!q) return;

    const block = document.createElement("div");
    block.className = "question-block active";

    const text = document.createElement("p");
    text.innerHTML = `${currentQuestionIndex + 1}. ${q.question.replace(/\n/g, "<br>")}`;
    block.appendChild(text);

    const options = document.createElement("div");
    options.className = "options";
    q.options.forEach(opt => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `question${currentQuestionIndex}`;
        input.value = opt.charAt(0);
        if (userAnswers[currentQuestionIndex] === opt.charAt(0)) input.checked = true;

        input.onchange = e => {
            userAnswers[currentQuestionIndex] = e.target.value;
            localStorage.setItem(`answers_${currentSubtestId}`, JSON.stringify(userAnswers));
            localStorage.setItem(`currentQuestionIndex_${currentSubtestId}`, currentQuestionIndex);
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

function startTimer() {
    const deadline = parseInt(localStorage.getItem(`deadline_${currentSubtestId}`), 10);
    if (!deadline) return;

    timerInterval = setInterval(() => {
        const now = Date.now();
        timeLeft = Math.floor((deadline - now) / 1000);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitTryout();
        } else {
            const min = Math.floor(timeLeft / 60);
            const sec = timeLeft % 60;
            timerDisplay.textContent = `Waktu tersisa: ${min}:${sec < 10 ? "0" : ""}${sec}`;
        }
    }, 1000);

    timerDisplay.style.display = "block";
}

function estimateTheta(userResponses, questions) {
    let theta = 0;
    for (let i = 0; i < 50; i++) {
        let grad = 0;
        for (let qIndex = 0; qIndex < questions.length; qIndex++) {
            const q = questions[qIndex];
            const ua = userResponses[qIndex];
            if (!q.correctAnswer || ua == null) continue;

            const correct = ua === q.correctAnswer;
            const g = q.guessing ?? 0.25;
            const a = q.discrimination ?? 1.0;
            const b = q.difficulty ?? 0;

            const P = g + (1 - g) / (1 + Math.exp(-a * (theta - b)));
            grad += a * (correct ? (1 - P) : (P - 1));
        }
        theta += 0.1 * grad;
    }
    return theta;
}

function scaleTheta(theta, minT = -3, maxT = 3, minS = 300, maxS = 1000) {
    const t = Math.max(minT, Math.min(maxT, theta));
    return Math.round(((t - minT) / (maxT - minT)) * (maxS - minS) + minS);
}

function submitTryout() {
    clearInterval(timerInterval);

    localStorage.removeItem(`timer_${currentSubtestId}`);
    localStorage.removeItem(`currentQuestionIndex_${currentSubtestId}`);
    localStorage.removeItem(`deadline_${currentSubtestId}`);
    localStorage.removeItem("tryoutAccessKey");
    KUNCI_RAHASIA = "";

    let benar = 0;
    const answerDetails = [];

    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const userAnswer = userAnswers[i] || "Tidak Dijawab";
        const isCorrect = userAnswer === q.correctAnswer;
        if (isCorrect) benar++;

        answerDetails.push({
            questionNumber: i + 1,
            questionText: q.question,
            options: q.options,
            userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect,
            subtestId: currentSubtestId
        });
    }

    const theta = estimateTheta(userAnswers, questions);
    const score = scaleTheta(theta);

    answerDetails.forEach((detail, index) => {
        localStorage.setItem(`Jawaban_${currentSubtestId}(${index + 1})`, JSON.stringify(detail));
    });

    localStorage.setItem(`totalCorrect_${currentSubtestId}`, benar);
    localStorage.setItem(`totalQuestions_${currentSubtestId}`, questions.length);
    localStorage.setItem(`finalScore_${currentSubtestId}`, score);

    const namaUser = localStorage.getItem("snbtUserName") || "Tanpa Nama";
    kirimKeFirebase(namaUser, score, currentSubtestId);

    tryoutForm.style.display = "none";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    submitBtn.style.display = "none";
    timerDisplay.style.display = "none";

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
        <h3>Hasil Subtes Anda</h3>
        <p>Benar: ${benar} dari ${questions.length}</p>
        <p>Skor Subtes: <strong>${score}</strong></p>
        <p>Anda akan dialihkan ke halaman pembahasan dalam 3 detik...</p>
    `;

    const snbtTryoutProgress = JSON.parse(localStorage.getItem('snbtTryoutProgress')) || {};
    snbtTryoutProgress[currentSubtestId] = { completed: true, score };
    localStorage.setItem('snbtTryoutProgress', JSON.stringify(snbtTryoutProgress));

    setTimeout(() => {
        window.location.href = `coba.html?subtestId=${currentSubtestId}`;
    }, 3000);
}

nextBtn.onclick = () => {
    const block = tryoutForm.querySelector('.question-block.active');
    if (block) block.classList.remove('active');
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        localStorage.setItem(`currentQuestionIndex_${currentSubtestId}`, currentQuestionIndex);
        displayQuestion();
    }
};

prevBtn.onclick = () => {
    const block = tryoutForm.querySelector('.question-block.active');
    if (block) block.classList.remove('active');
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        localStorage.setItem(`currentQuestionIndex_${currentSubtestId}`, currentQuestionIndex);
        displayQuestion();
    }
};

submitBtn.onclick = submitTryout;

window.addEventListener("DOMContentLoaded", () => {
    const savedAccessKey = localStorage.getItem("tryoutAccessKey");
    if (savedAccessKey) {
        KUNCI_RAHASIA = savedAccessKey;
        keyModal.style.display = "none";
        initTryout();
    } else {
        keyModal.style.display = "flex";
    }

    const headerProfilePic = document.getElementById("headerProfilePic");
    const headerUserName = document.getElementById("headerUserName");
    const userName = localStorage.getItem("snbtUserName") || "Profil";
    const userProfilePic = localStorage.getItem("snbtProfilePicture") || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA5PEwhbsNXhz2W4XBW7nQNkoGq7jQwRe9ho3K05jZ4F9b93VdyqE-zPs&s=10";

    if (headerUserName) headerUserName.textContent = userName;
    if (headerProfilePic) headerProfilePic.src = userProfilePic;

    const requestKeyBtn = document.querySelector('a[href^="https://wa.me"]');
    if (requestKeyBtn) {
        const msg = encodeURIComponent(`Halo saya ${userName}, ingin meminta kunci soal`);
        requestKeyBtn.href = `https://wa.me/6285732361586?text=${msg}`;
    }
});
