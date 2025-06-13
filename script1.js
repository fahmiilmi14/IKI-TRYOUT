// script1.js

// Data Soal Lengkap
// PENTING: Untuk setiap soal, properti 'category' HARUS cocok persis
// dengan 'id' dari subtes yang Anda definisikan di main.js (misalnya 'pu', 'pk', 'pbm', dll.)
const ALL_QUESTIONS_DATA = [
    {
        id: 1,
        category: "pu", // Penalaran Umum
        question: "Jika semua burung bisa terbang, dan penguin adalah burung, maka...",
        options: ["A. Penguin bisa terbang.", "B. Beberapa penguin tidak bisa terbang.", "C. Penguin tidak bisa terbang.", "D. Tidak ada kesimpulan yang bisa ditarik.", "E. Semua burung adalah penguin."],
        correctAnswer: "C",
        difficulty: -0.5,
        discrimination: 1.2,
        guessing: 0.1
    },
    {
        id: 2,
        category: "pk", // Pengetahuan Kuantitatif
        question: "Jika $3x + 5 = 14$, berapakah nilai $x$?",
        options: ["A. 1", "B. 2", "C. 3", "D. 4", "E. 5"],
        correctAnswer: "C",
        difficulty: 0.0,
        discrimination: 1.5,
        guessing: 0.05
    },
    {
        id: 3,
        category: "pu", // Penalaran Umum
        question: "Manakah dari berikut ini yang bukan merupakan bilangan prima?",
        options: ["A. 2", "B. 3", "C. 7", "D. 9", "E. 11"],
        correctAnswer: "D",
        difficulty: 0.8,
        discrimination: 1.8,
        guessing: 0.08
    },
    {
        id: 4,
        category: "pk", // Pengetahuan Kuantitatif
        question: "Berapakah hasil dari $2^3 \\times 3^2$?", // Gunakan \\ untuk MathJax
        options: ["A. 24", "B. 36", "C. 48", "D. 72", "E. 96"],
        correctAnswer: "D",
        difficulty: 0.3,
        discrimination: 1.4,
        guessing: 0.1
    },
    {
        id: 5,
        category: "pbm", // Pengetahuan & Pemahaman Membaca
        question: "Pilihlah sinonim yang tepat untuk kata 'apati':",
        options: ["A. Semangat", "B. Acuh tak acuh", "C. Antusias", "D. Peduli", "E. Marah"],
        correctAnswer: "B",
        difficulty: 0.2,
        discrimination: 1.3,
        guessing: 0.1
    },
    {
        id: 6,
        category: "ppu", // Penalaran & Pengetahuan Umum
        question: "Apa ibu kota negara Jepang?",
        options: ["A. Seoul", "B. Beijing", "C. Tokyo", "D. Bangkok", "E. Jakarta"],
        correctAnswer: "C",
        difficulty: -0.8,
        discrimination: 1.0,
        guessing: 0.05
    },
    {
        id: 7,
        category: "bing", // Bahasa Inggris
        question: "What is the past tense of 'go'?",
        options: ["A. Going", "B. Goes", "C. Went", "D. Gone", "E. Goed"],
        correctAnswer: "C",
        difficulty: -0.7,
        discrimination: 1.1,
        guessing: 0.03
    },
    {
        id: 8,
        category: "bi", // Bahasa Indonesia
        question: "Pilihlah kalimat yang menggunakan kata baku dengan benar:",
        options: ["A. Saya akan merubah peraturan.", "B. Kita harus taat azas.", "C. Dia memiliki bakat yang luar biasa.", "D. Jadwalnya sangat padat sekali.", "E. Antriannya panjang."],
        correctAnswer: "C",
        difficulty: 0.5,
        discrimination: 1.2,
        guessing: 0.1
    },
    {
        id: 9,
        category: "Penalaran matematika", // Literasi
        question: "Bacalah teks berikut: 'Edukasi finansial sangat penting bagi generasi muda.' Apa tujuan utama kalimat tersebut?",
        options: ["A. Mengajak menabung.", "B. Menjelaskan pentingnya literasi keuangan.", "C. Mengkritik gaya hidup boros.", "D. Mengulas investasi.", "E. Menyuruh berhemat."],
        correctAnswer: "B",
        difficulty: 0.6,
        discrimination: 1.4,
        guessing: 0.08
    }
    // Tambahkan lebih banyak soal di sini, pastikan 'category' sesuai dengan ID subtes di main.js
];

let questions = []; // Variabel ini akan diisi setelah filtering

// Dapatkan ID subtes saat ini dari localStorage
const currentSubtestId = localStorage.getItem('currentSubtestId');
console.log('script1.js: currentSubtestId dari localStorage:', currentSubtestId);

// Filter soal berdasarkan subtes yang dipilih
if (currentSubtestId) {
    questions = ALL_QUESTIONS_DATA.filter(q => q.category === currentSubtestId);
    console.log(`script1.js: Soal difilter untuk subtes '${currentSubtestId}'. Jumlah soal: ${questions.length}`);
}

// Jika setelah filter array 'questions' kosong, atau jika currentSubtestId tidak ditemukan,
// kita akan menggunakan semua soal sebagai fallback.
if (questions.length === 0) {
    console.warn(`script1.js: Tidak ada soal spesifik ditemukan untuk subtes '${currentSubtestId}'. Menggunakan SEMUA soal yang tersedia sebagai fallback.`);
    questions = ALL_QUESTIONS_DATA; // Gunakan semua soal
}

// Jika masih tidak ada soal sama sekali, beri peringatan dan redirect
if (questions.length === 0) {
    console.error("script1.js: Tidak ada soal yang tersedia di ALL_QUESTIONS_DATA. Harap definisikan soal.");
    alert("Maaf, soal untuk tryout ini belum tersedia. Silakan hubungi admin.");
    window.location.href = 'coba.html'; // Redirect kembali ke halaman utama
    // Menghentikan eksekusi script untuk mencegah error lebih lanjut
    throw new Error("No questions available for tryout.");
}


// Variabel dan elemen DOM
let currentQuestionIndex = 0;
let userAnswers = {}; // Menyimpan jawaban pengguna: {questionId: 'selectedOption'}
let timeLeft = 30 * 60; // 30 menit dalam detik (Anda bisa atur durasi per subtes jika diinginkan)
let timerInterval;

const tryoutForm = document.getElementById('tryoutForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const timerDisplay = document.getElementById('timer');
const resultDiv = document.getElementById('result');
// Pastikan elemen-elemen di atas ada di tryout.html dan ID-nya cocok!
// Contoh: <div id="tryoutForm">, <button id="prevBtn">, <div id="timer">, etc.

// --- Fungsi untuk menampilkan soal ---
function displayQuestion() {
    console.log('script1.js: displayQuestion() dipanggil. Menampilkan soal ke-', currentQuestionIndex + 1);

    if (!tryoutForm) {
        console.error('script1.js: Elemen tryoutForm tidak ditemukan. Soal tidak dapat ditampilkan.');
        return;
    }
    tryoutForm.innerHTML = ''; // Hapus soal sebelumnya

    const question = questions[currentQuestionIndex];
    if (!question) {
        console.error('script1.js: Soal tidak ditemukan pada indeks saat ini:', currentQuestionIndex);
        return; // Hentikan jika soal tidak ada
    }

    const questionBlock = document.createElement('div');
    questionBlock.classList.add('question-block', 'active');
    questionBlock.dataset.questionId = question.id;

    const questionText = document.createElement('p');
    questionText.classList.add('question-text');
    // Menggunakan innerHTML untuk mendukung MathJax (jika dimuat) dan simbol HTML
    questionText.innerHTML = `${currentQuestionIndex + 1}. ${question.question}`;
    questionBlock.appendChild(questionText);

    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('options');
    question.options.forEach(option => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question${question.id}`; // Nama unik per soal
        input.value = option.charAt(0); // Ambil huruf opsi (A, B, C, D, E)

        // Cek jika pengguna sudah pernah menjawab soal ini
        if (userAnswers[question.id] === option.charAt(0)) {
            input.checked = true;
        }

        input.addEventListener('change', (event) => {
            userAnswers[question.id] = event.target.value;
            console.log(`Jawaban soal ${question.id}: ${userAnswers[question.id]}`);
        });

        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        optionsDiv.appendChild(label);
    });
    questionBlock.appendChild(optionsDiv);
    tryoutForm.appendChild(questionBlock);

    updateNavigationButtons();

    // Render ulang MathJax setelah DOM diupdate (jika MathJax digunakan)
    // Pastikan MathJax library sudah di-load di tryout.html
    if (typeof MathJax !== 'undefined') {
        console.log('script1.js: Memanggil MathJax.typesetPromise...');
        MathJax.typesetPromise([tryoutForm]).catch((err) => console.error('MathJax rendering error:', err));
    }
}

// --- Fungsi untuk memperbarui tombol navigasi ---
function updateNavigationButtons() {
    if (prevBtn) prevBtn.style.display = currentQuestionIndex === 0 ? 'none' : 'inline-block';
    if (nextBtn) nextBtn.style.display = currentQuestionIndex === questions.length - 1 ? 'none' : 'inline-block';
    if (submitBtn) submitBtn.style.display = currentQuestionIndex === questions.length - 1 ? 'inline-block' : 'none';

    // Gunakan kelas CSS untuk tombol (opsional, tergantung CSS Anda)
    if (prevBtn) prevBtn.className = 'btn-primary';
    if (nextBtn) nextBtn.className = 'btn-primary';
    if (submitBtn) submitBtn.className = 'btn-primary';
}

// --- Event Listeners untuk tombol navigasi ---
// Tambahkan pengecekan null untuk tombol, agar tidak error jika elemen tidak ada
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        }
    });
} else {
    console.warn("script1.js: Elemen dengan ID 'nextBtn' tidak ditemukan.");
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    });
} else {
    console.warn("script1.js: Elemen dengan ID 'prevBtn' tidak ditemukan.");
}

// --- Fungsi untuk menghitung waktu mundur ---
function startTimer() {
    console.log('script1.js: startTimer() dipanggil');
    if (!timerDisplay) {
        console.error('script1.js: Elemen timerDisplay (ID "timer") tidak ditemukan. Timer tidak dapat berjalan.');
        return;
    }

    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        timerDisplay.textContent = `Waktu tersisa: ${minutes}:${seconds}`;
        // console.log(`script1.js: Waktu tersisa: ${minutes}:${seconds}`); // Bisa diaktifkan untuk debugging detik per detik

        if (timeLeft <= 0) {
            console.log('script1.js: Waktu habis!');
            clearInterval(timerInterval);
            timerDisplay.textContent = "Waktu habis!";
            submitTryout(); // Otomatis submit jika waktu habis
        }
        timeLeft--;
    }, 1000);
}

// --- IRT Calculation Functions (tetap sama) ---

// Sigmoid function (logistic function)
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

// Probability of a correct answer for 3PL model
function probCorrect(theta, a, b, c) {
    // a: discrimination, b: difficulty, c: guessing
    return c + (1 - c) * sigmoid(a * (theta - b));
}

// Simple iterative estimation of theta (ability)
// This is a very basic approximation. Real IRT estimation uses more complex methods.
function estimateTheta(userResponses, questions, initialTheta = 0, iterations = 50, learningRate = 0.1) {
    let theta = initialTheta;
    for (let i = 0; i < iterations; i++) {
        let gradient = 0;
        for (let j = 0; j < questions.length; j++) {
            const question = questions[j];
            const userAnswer = userResponses[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            const P = probCorrect(theta, question.discrimination, question.difficulty, question.guessing);

            // Derivative of log-likelihood with respect to theta (simplified)
            // This is a simplified form for gradient descent
            if (isCorrect) {
                gradient += question.discrimination * (1 - P);
            } else {
                gradient += question.discrimination * (P - 1);
            }
        }
        theta += learningRate * gradient;
    }
    return theta;
}

// --- Function to scale Theta to a desired score range ---
function scaleThetaToScore(theta, minTheta = -3.0, maxTheta = 3.0, minScore = 300, maxScore = 1000) {
    // Clamp theta to stay within the defined min/max range
    const clampedTheta = Math.max(minTheta, Math.min(maxTheta, theta));

    // Perform linear transformation
    const scaledScore = ((clampedTheta - minTheta) / (maxTheta - minTheta)) * (maxScore - minScore) + minScore;
    return Math.round(scaledScore); // Round to nearest integer
}

// --- Fungsi untuk submit tryout ---
if (submitBtn) {
    submitBtn.addEventListener('click', submitTryout);
} else {
    console.warn("script1.js: Elemen dengan ID 'submitBtn' tidak ditemukan.");
}

function submitTryout() {
    console.log('script1.js: submitTryout() dipanggil');
    clearInterval(timerInterval); // Hentikan timer

    const submissionDetails = [];
    let correctCount = 0;

    questions.forEach(q => {
        const userAnswer = userAnswers[q.id] || 'Tidak Dijawab'; // Jika user tidak menjawab
        const isCorrect = userAnswer === q.correctAnswer;
        submissionDetails.push({
            questionId: q.id,
            userAnswer: userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect: isCorrect,
            difficulty: q.difficulty,
            discrimination: q.discrimination,
            guessing: q.guessing
        });
        if (isCorrect) {
            correctCount++;
        }
    });

    // Estimasi kemampuan (theta) berdasarkan jawaban pengguna
    const estimatedTheta = estimateTheta(userAnswers, questions);

    // Scale theta to the desired score range
    const finalScaledScore = scaleThetaToScore(estimatedTheta);

    // Sembunyikan form tryout dan tampilkan hasil
    if (tryoutForm) tryoutForm.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'none';
    if (timerDisplay) timerDisplay.style.display = 'none'; // Sembunyikan timer setelah submit

    if (resultDiv) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <h3>Hasil Tryout Anda</h3>
            <p>Jumlah jawaban benar: ${correctCount} dari ${questions.length} soal.</p>
            <p>Estimasi Kemampuan Anda (Theta): <strong style="color: var(--primary-color);">${estimatedTheta.toFixed(2)}</strong></p>
            <p>Skor SNBT Anda (Estimasi IRT): <strong style="font-size: 1.8em; color: var(--primary-color);">${finalScaledScore}</strong></p>
            <p>Skor ${finalScaledScore} berada dalam skala ${300} hingga ${1000}.</p>
            <p>Anda akan diarahkan kembali ke halaman utama dalam 3 detik.</p>
        `;
    } else {
        console.error("script1.js: Elemen resultDiv tidak ditemukan. Hasil tidak dapat ditampilkan.");
    }


    // Kirim data ke backend (opsional, karena instruksi awal adalah localStorage)
    // sendResultToBackend(correctCount, estimatedTheta, finalScaledScore, submissionDetails);

    // Redirect kembali ke index.html dengan membawa skor
    setTimeout(() => {
        console.log('script1.js: Mengalihkan kembali ke coba.html...');
        window.location.href = `coba.html?subtestId=${currentSubtestId}&score=${finalScaledScore}`;
    }, 3000); // Redirect setelah 3 detik
}

// Fungsi untuk mengirim hasil ke backend (opsional, Anda bisa aktifkan jika ada backend)
async function sendResultToBackend(correctCount, estimatedTheta, finalScaledScore, submissionDetails) {
    console.log('script1.js: Mencoba mengirim hasil ke backend...');
    try {
        const response = await fetch('/api/submit-tryout', { // Endpoint API Anda
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: 'someUserId', // Anda perlu mengelola ID pengguna yang login
                subtestId: currentSubtestId,
                score: correctCount, // Tetap kirim jumlah benar juga
                estimatedTheta: estimatedTheta.toFixed(2), // Kirim theta
                scaledScore: finalScaledScore, // Kirim skor yang sudah diskala
                duration: (30 * 60) - timeLeft, // Waktu yang dihabiskan
                answers: submissionDetails
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('script1.js: Hasil tryout berhasil disimpan di backend:', result);
        } else {
            console.error('script1.js: Gagal menyimpan hasil tryout di backend:', response.status, response.statusText);
            // alert('Terjadi kesalahan saat menyimpan hasil tryout. Silakan coba lagi.'); // Aktifkan jika ingin alert
        }
    } catch (error) {
        console.error('script1.js: Error saat mengirim hasil tryout ke backend:', error);
        // alert('Terjadi masalah jaringan atau server. Silakan coba lagi.'); // Aktifkan jika ingin alert
    }
}

// --- Inisialisasi Aplikasi ---
// Pastikan init hanya dipanggil jika ada soal yang tersedia
if (questions.length > 0) {
    console.log('script1.js: Inisialisasi tryout: memanggil displayQuestion() dan startTimer().');
    displayQuestion(); // Tampilkan soal pertama
    startTimer();      // Mulai timer
} else {
    console.error('script1.js: Tidak ada soal untuk ditampilkan. Inisialisasi tryout dibatalkan.');
    // Alert dan redirect sudah ditangani di bagian filtering di atas
}
