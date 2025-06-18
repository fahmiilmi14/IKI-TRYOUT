document.addEventListener("DOMContentLoaded", () => {
    const pembahasanContainer = document.getElementById("pembahasanContainer");
    const scoreInfo = document.getElementById("scoreInfo");
    const prevSubtestBtn = document.getElementById("prevSubtestBtn");
    const nextSubtestBtn = document.getElementById("nextSubtestBtn");
    const currentSubtestNameDisplay = document.getElementById("currentSubtestName");

    
    
    const allSubtests = [
        { id: "pu", name: "Penalaran Umum" },
        { id: "pbm", name: "Pengetahuan dan Pemahaman Membaca" },
        { id: "pk", name: "Pengetahuan Kuantitatif" },
        { id: "ppu", name: "Pengetahuan dan Pemahaman Umum" },
        { id: "bin", name: "Literasi Bahasa Indonesia" },
        { id: "bing", name: "Literasi Bahasa Inggris" },
        { id: "Penalaran matematika", name: "Penalaran Matematika"},
        
    ];

    let completedSubtestsData = []; 
    let currentSubtestIndex = 0; 

    
    function displayCurrentSubtestPembahasan() {
        pembahasanContainer.innerHTML = ""; 

        if (completedSubtestsData.length === 0) {
            pembahasanContainer.innerHTML = "<p>Tidak ada subtes yang diselesaikan. Silakan selesaikan tryout terlebih dahulu.</p>";
            prevSubtestBtn.disabled = true;
            nextSubtestBtn.disabled = true;
            currentSubtestNameDisplay.textContent = "";
            return;
        }

        const currentSubtestEntry = completedSubtestsData[currentSubtestIndex];
        const currentSubtestId = currentSubtestEntry.id;
        const currentSubtestDetails = currentSubtestEntry.details;
        const subtestName = currentSubtestEntry.name; 

        currentSubtestNameDisplay.textContent = subtestName;

        
        if (!currentSubtestDetails || !currentSubtestDetails.answerDetails || currentSubtestDetails.answerDetails.length === 0) {
             pembahasanContainer.innerHTML = `<p>Data pembahasan untuk subtes "${subtestName}" tidak ditemukan atau kosong.</p>`;
             
             prevSubtestBtn.disabled = currentSubtestIndex === 0;
             nextSubtestBtn.disabled = currentSubtestIndex === completedSubtestsData.length - 1;
             return;
        }
        


        currentSubtestDetails.answerDetails.forEach((detail, questionIndex) => {
            const questionPembahasan = document.createElement("div");
            questionPembahasan.className = "question-pembahasan";

            const questionText = document.createElement("p");
            questionText.className = "question-text";
            questionText.innerHTML = `<strong>Soal ${questionIndex + 1}:</strong> ${detail.questionText.replace(/\n/g, "<br>")}`;
            questionPembahasan.appendChild(questionText);

            const optionsDiv = document.createElement("div");
            optionsDiv.className = "options";
            detail.options.forEach(option => {
                const label = document.createElement("label");
                label.textContent = option;
                optionsDiv.appendChild(label);
            });
            questionPembahasan.appendChild(optionsDiv);

            const userAnswerP = document.createElement("p");
            userAnswerP.className = "user-answer";
            if (detail.isCorrect) {
                userAnswerP.classList.add("correct");
                userAnswerP.innerHTML = `Jawaban Anda: <strong>${detail.userAnswer}</strong> <i class="fas fa-check-circle"></i>`;
            } else {
                userAnswerP.classList.add("incorrect");
                userAnswerP.innerHTML = `Jawaban Anda: <strong>${detail.userAnswer}</strong> <i class="fas fa-times-circle"></i>`;
            }
            questionPembahasan.appendChild(userAnswerP);

            const correctAnswerP = document.createElement("p");
            correctAnswerP.className = "correct-answer";
            correctAnswerP.innerHTML = `Jawaban Benar: <strong>${detail.correctAnswer}</strong>`;
            questionPembahasan.appendChild(correctAnswerP);

            
            const whatsappBtn = document.createElement("a");
            whatsappBtn.className = "whatsapp-button";
            whatsappBtn.textContent = "Pembahasan AI WhatsApp";
            whatsappBtn.target = "_blank";

            let whatsappMessage = `Halo iki aku jelasin soal ${questionIndex + 1} (${subtestName}) dong:\n\n`;
            whatsappMessage += `${detail.questionText.replace(/\n/g, " ")}\n\n`;
            whatsappMessage += `Opsi Jawaban:\n`;
            detail.options.forEach((opt, optIndex) => {
                whatsappMessage += `${String.fromCharCode(65 + optIndex)}. ${opt}\n`;
            });
            whatsappMessage += `\nJawaban saya: ${detail.userAnswer}\n`;
            whatsappMessage += `Jawaban benar: ${detail.correctAnswer}\n`;
            whatsappMessage += `Apakah jawaban saya (${detail.userAnswer}) sudah benar? Kalau salah kenapa salah? Kalau benar kenapa benar?`;

            whatsappBtn.href = `https://wa.me/6285732361586?text=${encodeURIComponent(whatsappMessage)}`;
            questionPembahasan.appendChild(whatsappBtn);
            

            pembahasanContainer.appendChild(questionPembahasan);
        });

        
        prevSubtestBtn.disabled = currentSubtestIndex === 0;
        nextSubtestBtn.disabled = currentSubtestIndex === completedSubtestsData.length - 1;
    }

    
    const snbtTryoutProgress = JSON.parse(localStorage.getItem('snbtTryoutProgress'));

    if (snbtTryoutProgress) {
        
        allSubtests.forEach(subtest => {
            if (snbtTryoutProgress[subtest.id] && snbtTryoutProgress[subtest.id].completed) {
                completedSubtestsData.push({
                    id: subtest.id,
                    name: subtest.name,
                    details: snbtTryoutProgress[subtest.id] 
                });
            }
        });

        
        console.log("Completed Subtests Data:", completedSubtestsData);

        
        let totalScore = 0;
        if (completedSubtestsData.length > 0) {
            completedSubtestsData.forEach(subtest => {
                totalScore += subtest.details.score;
            });
            const averageScore = totalScore / completedSubtestsData.length;
            scoreInfo.innerHTML = `Skor Rata-rata Anda: <strong>${averageScore.toFixed(0)}</strong>`;
        } else {
            scoreInfo.innerHTML = "Belum ada subtes yang diselesaikan.";
        }

        
        displayCurrentSubtestPembahasan();
    } else {
        pembahasanContainer.innerHTML = "<p>Tidak ada data tryout yang ditemukan. Silakan selesaikan tryout terlebih dahulu.</p>";
        prevSubtestBtn.disabled = true;
        nextSubtestBtn.disabled = true;
        currentSubtestNameDisplay.textContent = "";
    }

    
    prevSubtestBtn.addEventListener("click", () => {
        if (currentSubtestIndex > 0) {
            currentSubtestIndex--;
            displayCurrentSubtestPembahasan();
            window.scrollTo(0, 0); 
        }
    });

    nextSubtestBtn.addEventListener("click", () => {
        if (currentSubtestIndex < completedSubtestsData.length - 1) {
            currentSubtestIndex++;
            displayCurrentSubtestPembahasan();
            window.scrollTo(0, 0); 
        }
    });
});
