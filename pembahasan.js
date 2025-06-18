
document.addEventListener('DOMContentLoaded', () => {
    const pembahasanContent = document.getElementById('pembahasanContent');
    const pembahasanAiBtn = document.getElementById('pembahasanAiBtn');
    const prevPembahasanBtn = document.getElementById('prevPembahasanBtn');
    const nextPembahasanBtn = document.getElementById('nextPembahasanBtn');

    let allQuestionsForDisplay = [];
    let currentQuestionDisplayIndex = 0;

    function getAllTryoutProgress() {
        try {
            const data = JSON.parse(localStorage.getItem('snbtTryoutProgress')) || {};
            return data;
        } catch (e) {
            console.error("âŒ Gagal membaca snbtTryoutProgress dari localStorage:", e);
            return {};
        }
    }

    function getSubtestNameById(id) {
        const SUBTESTS = [
            { id: 'pu', name: 'Penalaran Umum' },
            { id: 'pk', name: 'Pengetahuan Kuantitatif' },
            { id: 'pbm', name: 'Pengetahuan & Pemahaman Membaca' },
            { id: 'ppu', name: 'Penalaran & Pengetahuan Umum' },
            { id: 'bing', name: 'Bahasa Inggris' },
            { id: 'bi', name: 'Bahasa Indonesia' },
            { id: 'pm', name: 'Penalaran Matematika' }
        ];
        const subtest = SUBTESTS.find(s => s.id === id);
        return subtest ? subtest.name : id;
    }

    function getQuestionNumberInSubtest(subtestId, questionId) {
        let count = 0;
        let found = false;
        for (const item of allQuestionsForDisplay) {
            if (item.type === 'subtest_header' && item.subtestId === subtestId) {
                found = true;
                count = 0;
                continue;
            }
            if (found && item.type === 'question' && item.subtestId === subtestId) {
                count++;
                if (item.questionId === questionId) return count;
            }
            if (item.type === 'subtest_header' && item.subtestId !== subtestId && found) {
                found = false;
            }
        }
        return 'N/A';
    }

    function renderPembahasanInitial() {
        const allTryoutData = getAllTryoutProgress();
        pembahasanContent.innerHTML = '';
        allQuestionsForDisplay = [];

        const SUBTEST_ORDER = ['pu', 'pk', 'pbm', 'ppu', 'bing', 'bi', 'pm'];

        SUBTEST_ORDER.forEach(subtestId => {
            const subtestData = allTryoutData[subtestId];
            if (subtestData?.completed && Array.isArray(subtestData.answerDetails)) {
                const subtestTitle = getSubtestNameById(subtestId);
                allQuestionsForDisplay.push({
                    type: 'subtest_header',
                    subtestId,
                    subtestName: subtestTitle,
                    score: subtestData.score
                });
                subtestData.answerDetails.forEach(detail => {
                    allQuestionsForDisplay.push({
                        type: 'question',
                        subtestId,
                        subtestName: subtestTitle,
                        ...detail
                    });
                });
            }
        });

        localStorage.setItem('fullQuestionsDataForAI', JSON.stringify(allQuestionsForDisplay.filter(q => q.type === 'question')));
        currentQuestionDisplayIndex = 0;
        displayCurrentQuestion();
    }

    function displayCurrentQuestion() {
        pembahasanContent.innerHTML = '';

        if (allQuestionsForDisplay.length === 0) {
            pembahasanContent.innerHTML = "<p>Tidak ada data pembahasan soal yang tersedia.</p>";
            prevPembahasanBtn.style.display = "none";
            nextPembahasanBtn.style.display = "none";
            return;
        }

        const currentItem = allQuestionsForDisplay[currentQuestionDisplayIndex];
        if (!currentItem) {
            pembahasanContent.innerHTML = "<p>Terjadi kesalahan saat memuat soal.</p>";
            return;
        }

        if (currentItem.type === 'subtest_header') {
            pembahasanContent.innerHTML = `
                <div class="question-pembahasan active">
                    <h3>Subtes: ${currentItem.subtestName} (Skor: ${currentItem.score})</h3>
                    <p>Silakan klik "Selanjutnya" untuk melihat pembahasan soal.</p>
                </div>
            `;
        } else if (currentItem.type === 'question') {
            const optionsHTML = currentItem.options.map(opt => {
                const isUser = opt[0] === currentItem.userAnswer;
                const isCorrect = opt[0] === currentItem.correctAnswer;
                const isWrong = isUser && !currentItem.isCorrect;
                return `<label class="${isUser ? 'user-answer' : ''} ${isCorrect ? 'correct-answer' : ''} ${isWrong ? 'incorrect-answer' : ''}">${opt}</label>`;
            }).join('');

            pembahasanContent.innerHTML = `
                <div class="question-pembahasan active">
                    <h4>Soal No. ${getQuestionNumberInSubtest(currentItem.subtestId, currentItem.questionId)}</h4>
                    <p>${currentItem.questionText.replace(/\n/g, "<br>")}</p>
                    <div class="options-pembahasan">${optionsHTML}</div>
                    <p>Jawaban Anda: <span style="color: ${currentItem.isCorrect ? 'green' : 'red'}; font-weight: bold;">${currentItem.isCorrect ? 'Benar' : 'Salah'}</span></p>
                    <p>Kunci Jawaban: <strong>${currentItem.correctAnswer}</strong></p>
                </div>
            `;
        }

        prevPembahasanBtn.disabled = currentQuestionDisplayIndex === 0;
        nextPembahasanBtn.disabled = currentQuestionDisplayIndex === allQuestionsForDisplay.length - 1;
    }

    prevPembahasanBtn?.addEventListener('click', () => {
        if (currentQuestionDisplayIndex > 0) {
            currentQuestionDisplayIndex--;
            displayCurrentQuestion();
        }
    });

    nextPembahasanBtn?.addEventListener('click', () => {
        if (currentQuestionDisplayIndex < allQuestionsForDisplay.length - 1) {
            currentQuestionDisplayIndex++;
            displayCurrentQuestion();
        }
    });

    pembahasanAiBtn?.addEventListener('click', () => {
        const userName = localStorage.getItem('snbtUserName') || 'Pengguna';
        const fullQuestionsData = JSON.parse(localStorage.getItem('fullQuestionsDataForAI')) || [];
        let message = `Halo iki aku ${userName}, tolong jelasin pembahasan tryout ini dong:\n\n`;

        fullQuestionsData.forEach((q) => {
            message += `--- Subtes: ${q.subtestName} ---\n`;
            message += `Soal No. ${getQuestionNumberInSubtest(q.subtestId, q.questionId)}\n`;
            message += `Pertanyaan: ${q.questionText}\n`;
            message += `Opsi: ${q.options.join(', ')}\n`;
            message += `Jawaban Anda: ${q.userAnswer}\n`;
            message += `Kunci Jawaban: ${q.correctAnswer}\n`;
            message += `Status: ${q.isCorrect ? 'Benar' : 'Salah'}\n\n`;
        });

        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/6285732361586?text=${encoded}`, '_blank');
    });

    renderPembahasanInitial();
});
