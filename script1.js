// script1.js

// Data Soal Lengkap
// PENTING: Untuk setiap soal, properti 'category' HARUS cocok persis
// dengan 'id' dari subtes yang Anda definisikan di main.js (misalnya 'pu', 'pk', 'pbm', dll.)
const ALL_QUESTIONS_DATA = [
    {
        id: 1,
        category: "pu", // Penalaran Umum
        question: "1.	Apabila tidak pernah menang dalam kompetisi tingkat daerah, atlet tidak boleh ikut audisi untuk pertandingan nasional. Hal ini berlaku bagi atlet badminton. Manakah simpulan berikut yang BENAR?",
        options: ["A.	Atlet badminton diharapkan menang dalam kompetisi daerah agar dapat mengikuti kegiatan audisi nasional.", "B.	Semua atlet boleh ikut audisi untuk pertandingan nasional jika pernah menang dalam kompetisi daerah.", "C.	Para atlet boleh ikut audisi untuk pertandingan nasional meski tidak pernah menang di kompetisi daerah.", "D.	Semua atlet pernah menang dalam kegiatan kompetisi di tingkat daerah, kecuali para pemain badminton.", "E.	Atlet badminton tidak boleh mengikuti audisi pertandingan nasional jika tidak pernah menang di kompetisi daerah."],
        correctAnswer: "E",
        difficulty: -0.5,
        discrimination: 1.2,
        guessing: 0.1
    },
    {
        id: 2,
        category: "ppu", // Pengetahuan Kuantitatif
        question: "TEKS 1 \n\n(1) Perkembangan industri kopi di Indonesia ditandai dengan munculnya kedai kopi modern. (2) Kedai kopi ini menawarkan kopi berkualitas tinggi serta suasana nyaman dan desain interior yang menarik. (3) Kedai kopi modern menjadi tempat berkumpul, bekerja, dan bersosialisasi bagi kaum urban. \n\n(4) Saat ini industri kopi di Indonesia telah berkembang pesat. (5) Indonesia menjadi salah satu produsen kopi terbesar di dunia, bersama dengan Brasil, Vietnam, dan Kolombia. (6) Kopi Indonesia telah menjadi komoditas ekspor yang penting karena menyumbang devisa bagi negara. (7) Di balik kesuksesan industri kopi Indonesia, terdapat peran penting para petani kopi. (8) Perjalanan industri kopi di Indonesia adalah sebuah kisah panjang yang penuh lika-liku. (9) Ada jerih payah para petani kopi sekaligus sejarah panjang kopi di bumi pertiwi saat kita menikmati secangkir kopi. \n\n1.	Kelompok kata dalam bacaan tersebut yang memiliki pola makna sama dengan bengkel mobil adalah...",
        options: ["A.	kedai kopi (kalimat 1)", "B.	desain interior (kalimat 2)", "C.	kaum urban (kalimat 3)", "D.	peran penting (kalimat 7)", "E.	sejarah panjang (kalimat 9)"],
        correctAnswer: "A",
        difficulty: 0.0,
        discrimination: 1.5,
        guessing: 0.05
    },
    {
        id: 3,
        category: "ppu", 
        question: "TEKS 1 \n\n(1) Perkembangan industri kopi di Indonesia ditandai dengan munculnya kedai kopi modern. (2) Kedai kopi ini menawarkan kopi berkualitas tinggi serta suasana nyaman dan desain interior yang menarik. (3) Kedai kopi modern menjadi tempat berkumpul, bekerja, dan bersosialisasi bagi kaum urban. \n\n(4) Saat ini industri kopi di Indonesia telah berkembang pesat. (5) Indonesia menjadi salah satu produsen kopi terbesar di dunia, bersama dengan Brasil, Vietnam, dan Kolombia. (6) Kopi Indonesia telah menjadi komoditas ekspor yang penting karena menyumbang devisa bagi negara. (7) Di balik kesuksesan industri kopi Indonesia, terdapat peran penting para petani kopi. (8) Perjalanan industri kopi di Indonesia adalah sebuah kisah panjang yang penuh lika-liku. (9) Ada jerih payah para petani kopi sekaligus sejarah panjang kopi di bumi pertiwi saat kita menikmati secangkir kopi. \n\n2.	Fungsi kata penghubung 'serta' dalam kalimat (2) adalah....",
        options: ["A.	menjelaskan hubungan sebab-akibat", "B.	menunjukkan alasan", "C.	memberikan informasi tambahan", "D.	memerinci pernyataan", "E.	menandai hubungan logis"],
        correctAnswer: "C",
        difficulty: 0.8,
        discrimination: 1.8,
        guessing: 0.08
    },
    {
        id: 4,
        category: "pbm", // Pengetahuan 
        question: "(1)Tujuan pendidikan adalah mengembangkan dan mengoptimalkan daya anak didik agar siap menyongsong masa depan sesuai dengan zamannya. (2)Saat ini teknologi yang berkembang dengan pesat memicu pada perubahan yang cepat pula, bahkan tidak terduga. (3)Laporan Dell Technology menyebutkan bahwa 85 persen pekerjaan pada 2030 yang akan dimasuki Generasi Z dan Alpha belum ditemukan. (4)Sementara itu, konsep otomasi di era 4.0 juga akan mengubah struktur dan lapangan pekerjaan. 5Padahal, institusi dari pendidikan formal saat ini dinilai belum optimal membekali siswa dengan keterampilan praktis yang menjadi modal siswa untuk mengembangkan diri secara mandiri atau masuk dunia kerja. 6Paradigma pendidikan sudah bergeser mengikuti perkembangan zaman, tetapi sistem pendidikan belum....\n\n1.	Kata daya dalam kalimat (1) seharusnya....", 
        options: ["A.	dihilangkan", "B.	didahului kata semua", "C.	diikuti kata upaya", "D.	dibiarkan saja (sudah benar)", "E.	diganti kata potensi"],
        correctAnswer: "D",
        difficulty: 0.5,
        discrimination: 1.4,
        guessing: 0.8
    },
    {
        id: 5,
        category: "pk", 
        question: "1. Sembilan bilangan, yaitu 2,4,8,3,6,5,7,8,4, diurutkan dari yang terbesar hingga terkecil. Jika u dan t berturut-turut merepresentasikan bilangan pada posisi ke-3 dan ke-8 setelah diurutkan, nilai (2×u)-t sama dengan…",
        options: ["A.	14", "B. 13", "C. 12", "D. 11", "E. 10"],
        correctAnswer: "D",
        difficulty: 0.3,
        discrimination: 1.3,
        guessing: 0.4
    },
    {
        id: 6,
        category: "bi", 
        question: "Teks 1 untuk soal nomor 1 – 4\n\nSusu merupakan minuman bergizi tinggj yang dibutuhkan oleh balita untuk dapat tumbuh dan berkembang secara optimal. Namun, susu sering kali digolongkan sebagai minuman yang berharga cukup mahal, terutama sediaan susu yang telah mengalami berbagai proses pengolahan. Di pasaran, susu tersedia dalam bentuk minuman kemasan yang biasanya telah ditambahkan sukrosa serta zat perisai tertentu untuk memberikan variasi rasa. Kandungan gizi dalam susu sangat dipengaruhi oleh jenis ternak yang menghasilkannya, jenis makanan yang dikonsumsi ternak, dan tingkat kesehatan ternak. Setiap 100 mL susu sapi murni rata-rata dapat menghasilkan energi sekitar 259 kJ.\n\nUmumnya, kandungan susu sapi murni menurut berat adalah 87% air, 3,7% lemak, 3,5% protein, 4,9% laktosa, 0,07% mineral, dan sisanya berupa berbagai jenis vitamin, enzim, dan lain-lain. Mineral yang terdapat dalam susu sapi murni di antaranya adalah kalsium, fosfor, natrium, besi, tembaga, dan seng. Kalsium dan fosfor merupakan mineral penting untuk pertumbuhan tulang dan gigi.\n\nSusu juga mengandung vitamin yang larut dalam lemak, yaitu vitamin A, D, E, dan K, serta vitamin yang larut dalam air, yaitu vitamin B dan C. Selain itu, di dalam susu juga terdapat beberapa jenis enzim, seperti peroksidase, katalase, fosfatase, dan lipase. Lipase berfungsi untuk menghidrolisis lipid. Di antara enzim-enzim tersebut, peroksidase dan fosfatase umumnya digunakan sebagai indikator kecukupan pasteurisasi susu karena kedua enzim ini akan rusak pada suhu pasteurisasi, sementara vitamin, mineral, dan enzim lain tidak mengalami perubahan.\n\n1.	Simbol salah satu mineral yang terkandung dalam susu sesuai dengan bacaan di atas adalah…",
        options: ["A. F", "B. N", "C. Be", "D. Cu", "E. Se"],
        correctAnswer: "B",
        difficulty: 0.3,
        discrimination: 1.0,
        guessing: 0.5
    },
    {
        id: 7,
        category: "bing", // Bahasa Inggris
        question: "Text 1\n\nAt Frieze London this year, three large artworks by the artist Nengi Omuku were hung away from the walls so viewers could walk around them. With each work, one side offered a vibrant nature-filled painting. The other presented strips of sanyan, a thick traditional Nigerian fabric that Omuku uses to replace the usual canvas fabric painters often used as their base. “The fact I’m painting on a vintage surface gives soul to my work,” Omuku said over Zoom two days before the fair opened. For the 37-year-old, the fabric she works on has become as crucial as her paintings themselves. “Even when it’s not a vintage surface, it is a surface that has been made collaboratively with craftsmen from Nigeria.\n\nOmuku’s reason to use sanyan initially came from a place of necessity, but has now become an integral part of her practice. “I worked on canvas for a little while, but eventually shifted to working on sanyan, which is a pre-colonial Yoruba textile,” she told CNN in a video call, adding that she “made the switch” after eight years of studying in the UK. “I was trying to rediscover myself and my identity,” she said. “When I moved back to Nigeria, I couldn’t find high-quality canvas, and I was also really fascinated by how, as Nigerians, we identify ourselves through our clothes.” However, she found sanyan more appealing than other more contemporary fabrics. “I’d never seen a pre-colonial Nigerian textile before, and it looked quite similar to linen.”\n\n1.	According to Text 1, which of the following is NOT the reason why sanyan is used by Nengi Omuku? It ",
        options: ["A.	is a high-quality canvas", "B.	is a thick Nigerian fabric", "C.	gives soul to the painting", "D.	is a pre-colonial textile from Nigeria", "E.	has a better quality compared to linen"],
        correctAnswer: "E",
        difficulty: 0.2,
        discrimination: 1.1,
        guessing: 0.3
    },
    {
        id: 9,
        category: "Penalaran matematika", // Literasi
        question: "Pertemuan keluarga RT IX dihadiri oleh 15 laki-laki dan 10 perempuan. Pada pertemuan ini setiap keluarga diwakili satu orang. Salah satu agenda pertemuan tersebut adalah memilih pengurus RT baru yang terdiri atas ketua, bendahara, dan sekretaris. Para calon diambil di antara yang hadir. Pemilihan dilakukan secara acak.\n\n1.	Banyak cara terpilihnya pengurus dengan sekretaris perempuan adalah...",
        options: ["A. 5400", "B. 5520", "C. 5750", "D. 5760", "E. 6000"],
        correctAnswer: "B",
        difficulty: 0.6,
        discrimination: 1.4,
        guessing: 0.08
    }
    
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
let userAnswers = {}; 
const savedAnswers = localStorage.getItem(`answers_${currentSubtestId}`);
if (savedAnswers) {
    userAnswers = JSON.parse(savedAnswers);
}// Menyimpan jawaban pengguna: {questionId: 'selectedOption'}
const savedTime = localStorage.getItem(`timer_${currentSubtestId}`);
let timeLeft = savedTime ? parseInt(savedTime, 10) : 30 * 60;
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
questionText.style.textAlign = "justify";
questionText.style.lineHeight = "1.6";

    const questionWithNewlines = question.question.replace(/\n/g, "<br>");
questionText.innerHTML = `${currentQuestionIndex + 1}. ${questionWithNewlines}`;
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

    // ✅ Simpan jawaban ke localStorage
    localStorage.setItem(`answers_${currentSubtestId}`, JSON.stringify(userAnswers));

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

        localStorage.setItem(`timer_${currentSubtestId}`, timeLeft);

if (timeLeft <= 0) {
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
    clearInterval(timerInterval);
    localStorage.removeItem(`timer_${currentSubtestId}`);
    const submissionDetails = [];
    let correctCount = 0;
    localStorage.removeItem(`answers_${currentSubtestId}`);

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
