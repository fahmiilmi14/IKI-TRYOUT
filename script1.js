let KUNCI_RAHASIA = "";
let questions = [];
let currentQuestionIndex = 0;

let userAnswers = [];
let timeLeft = 30 * 60;
let timerInterval;

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

async function loadEncryptedQuestions() {
    try {
        const response = await fetch("soal.enc.json");

        if (!response.ok) {
            throw new Error(`Gagal memuat soal.enc.json: ${response.status} ${response.statusText}`);
        }

        const { data } = await response.json();

        if (!KUNCI_RAHASIA) {
            throw new Error("Kunci rahasia belum diatur.");
        }

        const bytes = CryptoJS.AES.decrypt(data, KUNCI_RAHASIA);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        if (!decrypted) {
            localStorage.removeItem("tryoutAccessKey");
            throw new Error("Hasil dekripsi kosong, kemungkinan kunci salah atau data rusak.");
        }

        let parsed;
        try {
            parsed = JSON.parse(decrypted);
        } catch (parseError) {
            localStorage.removeItem("tryoutAccessKey");
            throw new Error("Gagal parsing hasil dekripsi menjadi JSON. Data dekripsi mungkin rusak atau kunci salah.");
        }

        const filteredQuestions = parsed.filter(q => q.category === currentSubtestId);

        if (filteredQuestions.length === 0) {
            alert("Tidak ada soal tersedia untuk kategori ini. Pastikan kunci benar dan soal memiliki kategori yang sesuai.");
            localStorage.removeItem("tryoutAccessKey");
            keyModal.style.display = "flex";
            return [];
        }

        return filteredQuestions;
    } catch (e) {
        alert("❌ Gagal memuat soal. Kunci salah, file rusak, atau masalah jaringan: " + e.message);
        console.error("Kesalahan dekripsi atau pemprosesan:", e);
        localStorage.removeItem("tryoutAccessKey");
        keyModal.style.display = "flex";
        return [];
    }
}

function submitKunci() {
    const input = document.getElementById("kunciInput").value.trim();
    if (!input) {
        alert("Kunci tidak boleh kosong!");
        return;
    }
    KUNCI_RAHASIA = input;
    localStorage.setItem("tryoutAccessKey", KUNCI_RAHASIA);

    keyModal.style.display = "none";
    initTryout();
}

async function initTryout() {
    const savedQuestionIndex = localStorage.getItem(`currentQuestionIndex_${currentSubtestId}`);
    if (savedQuestionIndex !== null) {
        currentQuestionIndex = parseInt(savedQuestionIndex, 10);

    } else {
        currentQuestionIndex = 0;
    }

    const data = await loadEncryptedQuestions();
    if (!data.length) {
        console.warn("Inisialisasi Tryout: Tidak ada data soal yang dimuat.");
        return;
    }
    questions = data;


    const savedAnswers = localStorage.getItem(`answers_${currentSubtestId}`);
    if (savedAnswers) {
        try {
            
            userAnswers = JSON.parse(savedAnswers);

        } catch (parseError) {
            console.error("Gagal parse jawaban tersimpan:", parseError);
            userAnswers = [];
        }
    } else {
        
        userAnswers = new Array(questions.length).fill(null);
    }

    displayQuestion();
    
if (!localStorage.getItem(`deadline_${currentSubtestId}`)) {
    const now = Date.now();
    const durasi = durasiPerSubtest[currentSubtestId] || 30 * 60;
    const deadline = now + durasi * 1000;
    localStorage.setItem(`deadline_${currentSubtestId}`, deadline);
}
    startTimer();
}

function displayQuestion() {
    tryoutForm.innerHTML = "";

    const q = questions[currentQuestionIndex];
    if (!q) {
        console.warn("displayQuestion: Pertanyaan tidak ditemukan pada indeks:", currentQuestionIndex);
        return;
    }

    const block = document.createElement("div");
    block.className = "question-block active";

    const text = document.createElement("p");
    text.innerHTML = ` ${currentQuestionIndex + 1}. ${q.question.replace(/\n/g, "<br>")}`;
    block.appendChild(text);

    const options = document.createElement("div");
    options.className = "options";
    q.options.forEach((opt, index) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `question${currentQuestionIndex}`; 
        input.value = opt.charAt(0);

        
        if (userAnswers[currentQuestionIndex] === opt.charAt(0)) {
            input.checked = true;
        }

        input.onchange = (e) => {
            
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

    if (!deadline) {
        console.warn("❌ Timer gagal dimulai karena deadline tidak ditemukan.");
        return;
    }

    timerInterval = setInterval(() => {
        const now = Date.now();
        const timeLeftMs = deadline - now;
        timeLeft = Math.floor(timeLeftMs / 1000);

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
            if (q.correctAnswer === undefined || ua === undefined || ua === null) continue; 

            const correct = ua === q.correctAnswer;
            const guessing = q.guessing !== undefined ? q.guessing : 0.25;
            const discrimination = q.discrimination !== undefined ? q.discrimination : 1.0;
            const difficulty = q.difficulty !== undefined ? q.difficulty : 0;

            const P = guessing + (1 - guessing) / (1 + Math.exp(-discrimination * (theta - difficulty)));
            grad += discrimination * (correct ? (1 - P) : (P - 1));
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
    KUNCI_RAHASIA = "";
localStorage.removeItem("tryoutAccessKey");

    let benar = 0;
    const answerDetails = [];

    
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const userAnswer = userAnswers[i] || "Tidak Dijawab"; 
        const isCorrect = userAnswer === q.correctAnswer;

        if (isCorrect) {
            benar++;
        }

        answerDetails.push({
            questionNumber: i + 1, 
            questionText: q.question,
            options: q.options,
            userAnswer: userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect: isCorrect,
            subtestId: currentSubtestId 
        });
    }

    const theta = estimateTheta(userAnswers, questions); 
    const score = scaleTheta(theta);

    
    answerDetails.forEach((detail, index) => {
        localStorage.setItem(`Jawaban_${currentSubtestId}(${index + 1})`, JSON.stringify(detail));
    });
localStorage.removeItem(`deadline_${currentSubtestId}`);
    
    localStorage.setItem(`totalCorrect_${currentSubtestId}`, benar);
    localStorage.setItem(`totalQuestions_${currentSubtestId}`, questions.length);
    localStorage.setItem(`finalScore_${currentSubtestId}`, score);


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

    let snbtTryoutProgress = JSON.parse(localStorage.getItem('snbtTryoutProgress')) || {};
    snbtTryoutProgress[currentSubtestId] = {
        completed: true,
        score: score,
        
    };
    localStorage.setItem('snbtTryoutProgress', JSON.stringify(snbtTryoutProgress));

    setTimeout(() => {
        window.location.href = `coba.html?subtestId=${currentSubtestId}`; 
    }, 3000);
}



nextBtn.onclick = () => {
    const currentBlock = tryoutForm.querySelector('.question-block.active');
    if (currentBlock) {
        currentBlock.classList.remove('active');
    }

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;

        localStorage.setItem(`currentQuestionIndex_${currentSubtestId}`, currentQuestionIndex);

        displayQuestion();
    }
};

prevBtn.onclick = () => {
    const currentBlock = tryoutForm.querySelector('.question-block.active');
    if (currentBlock) {
        currentBlock.classList.remove('active');
    }

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

    if (headerUserName) {
        headerUserName.textContent = userName;
    }
    if (headerProfilePic) {
        headerProfilePic.src = userProfilePic;
    }
    const requestKeyBtn = document.querySelector('a[href="https://wa.me/6285732361586"]');
    if (requestKeyBtn) {
        const actualUserName = localStorage.getItem("snbtUserName") || "Pengguna";
        const message = `Halo saya ${actualUserName}, ingin meminta kunci soal`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/6285732361586?text=${encodedMessage}`;
        requestKeyBtn.href = whatsappUrl;
    }
});
