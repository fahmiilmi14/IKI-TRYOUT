document.addEventListener('DOMContentLoaded', () => {
    console.log('pembahasan.js: DOMContentLoaded event fired.');

    const pembahasanContent = document.getElementById('pembahasanContent');
    const pembahasanAiBtn = document.getElementById('pembahasanAiBtn');

    
    function getAllTryoutProgress() {
        try {
            const allTryoutData = JSON.parse(localStorage.getItem('snbtTryoutProgress')) || {};
            return allTryoutData;
        } catch (e) {
            console.error("pembahasan.js: Error parsing localStorage 'snbtTryoutProgress':", e);
            return {};
        }
    }

    function renderPembahasan() {
        const allTryoutData = getAllTryoutProgress();
        pembahasanContent.innerHTML = '';
        let fullQuestionsDataForAI = []; 

        
        for (const subtestId in allTryoutData) {
            const subtestData = allTryoutData[subtestId];
            if (subtestData.completed && subtestData.answerDetails) {
                const subtestTitle = getSubtestNameById(subtestId); 
                const subtestHeader = document.createElement('h3');
                subtestHeader.textContent = `Subtes: ${subtestTitle} (Skor: ${subtestData.score})`;
                subtestHeader.style.marginTop = '30px';
                pembahasanContent.appendChild(subtestHeader);

                
                fullQuestionsDataForAI.push({
                    subtestId: subtestId,
                    subtestName: subtestTitle,
                    questions: subtestData.answerDetails
                });

                subtestData.answerDetails.forEach((detail, index) => {
                    const questionBlock = document.createElement('div');
                    questionBlock.classList.add('question-pembahasan');

                    const questionNumber = document.createElement('h4');
                    questionNumber.textContent = `Soal No. ${index + 1}`;
                    questionBlock.appendChild(questionNumber);

                    const questionText = document.createElement('p');
                    questionText.innerHTML = detail.questionText.replace(/\n/g, "<br>"); 
                    questionBlock.appendChild(questionText);

                    const optionsDiv = document.createElement('div');
                    optionsDiv.classList.add('options-pembahasan');

                    detail.options.forEach(option => {
                        const optionLabel = document.createElement('label');
                        optionLabel.textContent = option;

                        
                        if (option.charAt(0) === detail.userAnswer) {
                            optionLabel.classList.add('user-answer');
                            if (!detail.isCorrect) {
                                optionLabel.classList.add('incorrect-answer'); 
                            }
                        }
                        if (option.charAt(0) === detail.correctAnswer) {
                            optionLabel.classList.add('correct-answer');
                        }
                        optionsDiv.appendChild(optionLabel);
                    });

                    questionBlock.appendChild(optionsDiv);

                    
                    const statusText = document.createElement('p');
                    statusText.innerHTML = `Jawaban Anda: <span style="color: ${detail.isCorrect ? 'green' : 'red'}; font-weight: bold;">${detail.isCorrect ? 'Benar' : 'Salah'}</span>`;
                    questionBlock.appendChild(statusText);

                    const correctAnswerDisplay = document.createElement('p');
                    correctAnswerDisplay.innerHTML = `Kunci Jawaban: <span style="font-weight: bold;">${detail.correctAnswer}</span>`;
                    questionBlock.appendChild(correctAnswerDisplay);

                    pembahasanContent.appendChild(questionBlock);
                });
            }
        }
        
        
        localStorage.setItem('fullQuestionsDataForAI', JSON.stringify(fullQuestionsDataForAI));
    }

    
    function getSubtestNameById(id) {
        const SUBTESTS = [
            { id: 'pu', name: 'Penalaran Umum' },
            { id: 'pk', name: 'Pengetahuan Kuantitatif' },
            { id: 'pbm', name: 'Pengetahuan & Pemahaman Membaca' },
            { id: 'ppu', name: 'Penalaran & Pengetahuan Umum' },
            { id: 'bing', name: 'Bahasa Inggris' },
            { id: 'bi', name: 'Bahasa Indonesia' },
            { id: 'Penalaran matematika', name: 'Penalaran matematika' } 
        ];
        const subtest = SUBTESTS.find(s => s.id === id);
        return subtest ? subtest.name : id;
    }

    
    if (pembahasanAiBtn) {
        pembahasanAiBtn.addEventListener('click', () => {
            const userName = localStorage.getItem('snbtUserName') || 'Pengguna';
            const fullQuestionsData = JSON.parse(localStorage.getItem('fullQuestionsDataForAI'));
            let whatsappMessage = `Halo iki aku ${userName}, tolong jelasin pembahasan tryout ini dong:\n\n`;

            if (fullQuestionsData && fullQuestionsData.length > 0) {
                fullQuestionsData.forEach(subtest => {
                    whatsappMessage += `--- Subtes: ${subtest.subtestName} ---\n`;
                    subtest.questions.forEach((q, index) => {
                        whatsappMessage += `Soal No. ${index + 1}:\n`;
                        whatsappMessage += `Pertanyaan: ${q.questionText}\n`;
                        whatsappMessage += `Opsi: ${q.options.join(', ')}\n`;
                        whatsappMessage += `Jawaban Anda: ${q.userAnswer}\n`;
                        whatsappMessage += `Kunci Jawaban: ${q.correctAnswer}\n`;
                        whatsappMessage += `Status: ${q.isCorrect ? 'Benar' : 'Salah'}\n\n`;
                    });
                });
            } else {
                whatsappMessage += "Tidak ada data pembahasan yang tersedia.";
            }

            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/6285732361586?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    renderPembahasan();
});
