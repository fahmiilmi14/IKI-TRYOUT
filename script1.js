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
const keyModal = document.getElementById("keyModal");



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
        console.error("Kesalahan dekripsi atau pemrosesan:", e);
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
            userAnswers = {};
        }
    }
    
    displayQuestion();
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
    text.innerHTML = q.question.replace(/\n/g, "<br>");
    block.appendChild(text);
    
    const options = document.createElement("div");
    options.className = "options"; 
    q.options.forEach((opt, index) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `question${q.id}`; 
        input.value = opt.charAt(0);
        
        if (userAnswers[q.id] === opt.charAt(0)) {
            input.checked = true;
        }

        input.onchange = (e) => { 
            userAnswers[q.id] = e.target.value;
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
    const savedTime = localStorage.getItem(`timer_${currentSubtestId}`);
    if (savedTime) {
        timeLeft = parseInt(savedTime, 10);
    } else {
        timeLeft = 30 * 60;
    }

    timerDisplay.style.display = "block";

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

function estimateTheta(userResponses, questions) {
    let theta = 0;
    for (let i = 0; i < 50; i++) {
        let grad = 0;
        for (let q of questions) {
            const ua = userResponses[q.id];
            if (q.correctAnswer === undefined || ua === undefined) continue;

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
    localStorage.removeItem(`answers_${currentSubtestId}`);
    localStorage.removeItem(`currentQuestionIndex_${currentSubtestId}`);
    localStorage.removeItem("tryoutAccessKey");

    let benar = 0;
    const answerDetails = [];

    for (const q of questions) {
        const userAnswer = userAnswers[q.id] || "Tidak Dijawab";
        const isCorrect = userAnswer === q.correctAnswer;
        if (isCorrect) benar++;

        answerDetails.push({
            questionId: q.id,
            questionText: q.question,
            options: q.options,
            userAnswer: userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect: isCorrect
        });
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

    
    let snbtTryoutProgress = JSON.parse(localStorage.getItem('snbtTryoutProgress')) || {};
    snbtTryoutProgress[currentSubtestId] = {
        completed: true,
        score: score,
        answerDetails: answerDetails
    };
    localStorage.setItem('snbtTryoutProgress', JSON.stringify(snbtTryoutProgress));

    setTimeout(() => {
        
        window.location.href = `coba.html?subtestId=${currentSubtestId}&score=${score}`;
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
    const userProfilePic = localStorage.getItem("snbtProfilePicture") || "https://via.placeholder.com/40";

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
