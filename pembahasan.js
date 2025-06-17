// pembahasan.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('pembahasan.js: DOMContentLoaded event fired.');

    const pembahasanContent = document.getElementById('pembahasanContent');
    const pembahasanAiBtn = document.getElementById('pembahasanAiBtn');
    const prevPembahasanBtn = document.getElementById('prevPembahasanBtn'); // Get new button
    const nextPembahasanBtn = document.getElementById('nextPembahasanBtn'); // Get new button

    let allQuestionsForDisplay = []; // Global array to hold all questions from all subtests
    let currentQuestionDisplayIndex = 0; // Index for current question being displayed

    // Fungsi untuk mendapatkan semua progres tryout, termasuk detail jawaban
    function getAllTryoutProgress() {
        try {
            const allTryoutData = JSON.parse(localStorage.getItem('snbtTryoutProgress')) || {};
            return allTryoutData;
        } catch (e) {
            console.error("pembahasan.js: Error parsing localStorage 'snbtTryoutProgress':", e);
            return {};
        }
    }

    function renderPembahasanInitial() {
        const allTryoutData = getAllTryoutProgress();
        pembahasanContent.innerHTML = '';
        allQuestionsForDisplay = []; // Reset global array

        // Urutan subtes yang diinginkan
        const SUBTEST_ORDER = ['pk', 'pbm', 'ppu', 'bing', 'bi', 'Penalaran matematika']; // Sesuaikan ID di sini!

        // Mengumpulkan semua pertanyaan ke dalam satu array tunggal sesuai urutan
        SUBTEST_ORDER.forEach(subtestId => {
            const subtestData = allTryoutData[subtestId];
            if (subtestData && subtestData.completed && subtestData.answerDetails && subtestData.answerDetails.length > 0) {
                const subtestTitle = getSubtestNameById(subtestId);

                // Tambahkan header subtes sebagai "pseudo-question" atau penanda
                allQuestionsForDisplay.push({
                    type: 'subtest_header',
                    subtestId: subtestId,
                    subtestName: subtestTitle,
                    score: subtestData.score
                });

                // Tambahkan detail pertanyaan dari subtes ini ke array lengkap
                subtestData.answerDetails.forEach(detail => {
                    allQuestionsForDisplay.push({
                        type: 'question',
                        subtestId: subtestId, // Keep subtest ID for context
                        subtestName: subtestTitle, // Keep subtest name for context
                        ...detail // Spread all question details
                    });
                });
            }
        });

        // Simpan data soal lengkap ke localStorage agar bisa diakses oleh tombol AI
        localStorage.setItem('fullQuestionsDataForAI', JSON.stringify(allQuestionsForDisplay.filter(q => q.type === 'question')));

        // Set indeks awal dan tampilkan pertanyaan pertama
        currentQuestionDisplayIndex = 0;
        displayCurrentQuestion();
    }

    function displayCurrentQuestion() {
        pembahasanContent.innerHTML = ''; // Clear previous content

        if (allQuestionsForDisplay.length === 0) {
            pembahasanContent.innerHTML = "<p>Tidak ada data pembahasan soal yang tersedia.</p>";
            prevPembahasanBtn.style.display = "none";
            nextPembahasanBtn.style.display = "none";
            return;
        }

        const currentItem = allQuestionsForDisplay[currentQuestionDisplayIndex];

        if (!currentItem) {
            // Ini bisa terjadi jika indeks di luar batas, seharusnya tidak terjadi jika logika benar
            pembahasanContent.innerHTML = "<p>Terjadi kesalahan saat memuat soal.</p>";
            prevPembahasanBtn.style.display = "none";
            nextPembahasanBtn.style.display = "none";
            return;
        }

        if (currentItem.type === 'subtest_header') {
            const subtestHeader = document.createElement('div');
            subtestHeader.classList.add('question-pembahasan', 'active'); // Re-use class for styling
            subtestHeader.innerHTML = `
                <h3>Subtes: ${currentItem.subtestName} (Skor: ${currentItem.score})</h3>
                <p>Silakan klik "Selanjutnya" untuk melihat pembahasan soal.</p>
            `;
            pembahasanContent.appendChild(subtestHeader);
        } else if (currentItem.type === 'question') {
            const questionBlock = document.createElement('div');
            questionBlock.classList.add('question-pembahasan', 'active');

            const questionNumber = document.createElement('h4');
            // Menampilkan nomor soal dalam subtesnya, bukan nomor global
            // Ini akan membutuhkan penyesuaian jika Anda ingin nomor global
            // Untuk sementara, saya akan menggunakan indeks global untuk contoh ini
            // Jika Anda ingin nomor soal per subtes, Anda perlu menghitungnya secara dinamis
            questionNumber.textContent = `Soal No. ${getQuestionNumberInSubtest(currentItem.subtestId, currentItem.questionId)}`;
            questionBlock.appendChild(questionNumber);

            const questionText = document.createElement('p');
            questionText.innerHTML = currentItem.questionText.replace(/\n/g, "<br>"); // Render MathJax
            questionBlock.appendChild(questionText);

            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('options-pembahasan');

            currentItem.options.forEach(option => {
                const optionLabel = document.createElement('label');
                optionLabel.textContent = option;

                // Tandai jawaban pengguna dan kunci jawaban
                if (option.charAt(0) === currentItem.userAnswer) {
                    optionLabel.classList.add('user-answer');
                    if (!currentItem.isCorrect) {
                        optionLabel.classList.add('incorrect-answer'); // Tandai jika salah
                    }
                }
                if (option.charAt(0) === currentItem.correctAnswer) {
                    optionLabel.classList.add('correct-answer');
                }
                optionsDiv.appendChild(optionLabel);
            });

            questionBlock.appendChild(optionsDiv);

            // Tampilkan status benar/salah
            const statusText = document.createElement('p');
            statusText.innerHTML = `Jawaban Anda: <span style="color: ${currentItem.isCorrect ? 'green' : 'red'}; font-weight: bold;">${currentItem.isCorrect ? 'Benar' : 'Salah'}</span>`;
            questionBlock.appendChild(statusText);

            const correctAnswerDisplay = document.createElement('p');
            correctAnswerDisplay.innerHTML = `Kunci Jawaban: <span style="font-weight: bold;">${currentItem.correctAnswer}</span>`;
            questionBlock.appendChild(correctAnswerDisplay);

            pembahasanContent.appendChild(questionBlock);
        }

        // Update button states
        prevPembahasanBtn.disabled = currentQuestionDisplayIndex === 0;
        nextPembahasanBtn.disabled = currentQuestionDisplayIndex === allQuestionsForDisplay.length - 1;
    }

    // Helper to get question number within its subtest
    function getQuestionNumberInSubtest(subtestId, questionId) {
        let count = 0;
        let foundSubtest = false;
        for (const item of allQuestionsForDisplay) {
            if (item.type === 'subtest_header' && item.subtestId === subtestId) {
                foundSubtest = true;
                count = 0; // Reset count for new subtest
                continue;
            }
            if (foundSubtest && item.type === 'question' && item.subtestId === subtestId) {
                count++;
                if (item.questionId === questionId) {
                    return count;
                }
            }
            if (item.type === 'subtest_header' && item.subtestId !== subtestId && foundSubtest) {
                // Moved to next subtest header
                foundSubtest = false;
            }
        }
        return 'N/A'; // Should not happen if data is consistent
    }


    // Fungsi helper untuk mendapatkan nama subtes dari ID
    function getSubtestNameById(id) {
        // PERHATIKAN: Pastikan ID di sini sesuai dengan ID yang disimpan di localStorage oleh script1.js
        const SUBTESTS = [
            { id: 'pu', name: 'Penalaran Umum' },
            { id: 'pk', name: 'Pengetahuan Kuantitatif' },
            { id: 'pbm', name: 'Pengetahuan & Pemahaman Membaca' },
            { id: 'ppu', name: 'Penalaran & Pengetahuan Umum' },
            { id: 'bing', name: 'Bahasa Inggris' },
            { id: 'bi', name: 'Bahasa Indonesia' },
            // Ubah ID ini jika di script1.js Anda menggunakan ID singkat seperti 'pm'
            { id: 'Penalaran matematika', name: 'Penalaran matematika' }
        ];
        const subtest = SUBTESTS.find(s => s.id === id);
        return subtest ? subtest.name : id; // Jika tidak ditemukan, kembalikan ID aslinya
    }

    // Event listener untuk tombol navigasi
    if (prevPembahasanBtn) {
        prevPembahasanBtn.addEventListener('click', () => {
            if (currentQuestionDisplayIndex > 0) {
                currentQuestionDisplayIndex--;
                displayCurrentQuestion();
            }
        });
    }

    if (nextPembahasanBtn) {
        nextPembahasanBtn.addEventListener('click', () => {
            if (currentQuestionDisplayIndex < allQuestionsForDisplay.length - 1) {
                currentQuestionDisplayIndex++;
                displayCurrentQuestion();
            }
        });
    }

    // Event listener untuk tombol pembahasan AI
    if (pembahasanAiBtn) {
        pembahasanAiBtn.addEventListener('click', () => {
            const userName = localStorage.getItem('snbtUserName') || 'Pengguna';
            const fullQuestionsData = JSON.parse(localStorage.getItem('fullQuestionsDataForAI')); // This already contains only 'question' type items
            let whatsappMessage = `Halo iki aku ${userName}, tolong jelasin pembahasan tryout ini dong:\n\n`;

            if (fullQuestionsData && fullQuestionsData.length > 0) {
                fullQuestionsData.forEach((q, index) => {
                    // Hanya sertakan detail pertanyaan, bukan header subtes
                    if (q.type === 'question') {
                         whatsappMessage += `--- Subtes: ${q.subtestName} ---\n`; // Tambahkan nama subtes per soal
                         whatsappMessage += `Soal No. ${getQuestionNumberInSubtest(q.subtestId, q.questionId)}:\n`;
                         whatsappMessage += `Pertanyaan: ${q.questionText}\n`;
                         whatsappMessage += `Opsi: ${q.options.join(', ')}\n`;
                         whatsappMessage += `Jawaban Anda: ${q.userAnswer}\n`;
                         whatsappMessage += `Kunci Jawaban: ${q.correctAnswer}\n`;
                         whatsappMessage += `Status: ${q.isCorrect ? 'Benar' : 'Salah'}\n\n`;
                    }
                });
            } else {
                whatsappMessage += "Tidak ada data pembahasan yang tersedia.";
            }

            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/6285732361586?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // Panggil fungsi inisialisasi saat DOMContentLoaded
    renderPembahasanInitial();
});
