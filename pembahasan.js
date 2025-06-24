let currentQuestionIndex = 0;
let allAnswerDetails = [];
let totalQuestions = 0;
let correctAnswers = 0;
let finalScore = 0;
const urutanSubtes = [
  'pu',
  'ppu',
  'pbm',
  'pk',
  'bi',
  'bing',
  'Penalaran matematika'
];

const semuaPembahasan = [];

urutanSubtes.forEach(namaSubtes => {
  const pembahasanSubtes = JSON.parse(localStorage.getItem(`pembahasan_${namaSubtes}`));
  if (pembahasanSubtes) {
    semuaPembahasan.push(...pembahasanSubtes);
  }
});

const pembahasanContainer = document.getElementById("pembahasanContainer");
const prevQuestionBtn = document.getElementById("prevQuestionBtn");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const whatsappPembahasanBtn = document.getElementById("whatsappPembahasanBtn");

function loadAnswerDetails() {
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("Jawaban_")) {
            try {
                const answerDetail = JSON.parse(localStorage.getItem(key));
                if (answerDetail) {
                    allAnswerDetails.push(answerDetail);
                }
            } catch (e) {
                console.error(`Gagal parse ${key}:`, e);
            }
        }
    }

    
    const summaryKeys = ["pu", "pk", "ppu", "pbm", "litbin", "litbing", "pm"];
    for (const sub of summaryKeys) {
        const total = localStorage.getItem(`totalQuestions_${sub}`);
        const correct = localStorage.getItem(`totalCorrect_${sub}`);
        const score = localStorage.getItem(`finalScore_${sub}`);
        if (total && correct && score) {
            totalQuestions += parseInt(total);
            correctAnswers += parseInt(correct);
            finalScore += parseInt(score);
        }
    }

    
    document.getElementById("totalQuestionsSummary").textContent = totalQuestions;
    document.getElementById("correctAnswersSummary").textContent = correctAnswers;
    document.getElementById("finalScoreDisplay").textContent = finalScore;

    if (allAnswerDetails.length === 0) {
        pembahasanContainer.innerHTML = "<p>Tidak ada data pembahasan yang ditemukan. Pastikan Anda telah menyelesaikan tryout.</p>";
        prevQuestionBtn.style.display = "none";
        nextQuestionBtn.style.display = "none";
        whatsappPembahasanBtn.style.display = "none";
        return;
    }

    
    allAnswerDetails.sort((a, b) => a.questionNumber - b.questionNumber);

    displayQuestionPembahasan(currentQuestionIndex);
    updateNavigationButtons();
}

function displayQuestionPembahasan(index) {
    pembahasanContainer.innerHTML = ""; 

    if (index < 0 || index >= allAnswerDetails.length) {
        console.warn("Indeks soal di luar batas:", index);
        return;
    }

    const detail = allAnswerDetails[index];
    const questionBlock = document.createElement("div");
    questionBlock.className = "question-block";

    const subId = detail.subtestId || detail.id || "-";
    const questionNumber = document.createElement("p");
    questionNumber.innerHTML = `<strong>Soal ${detail.questionNumber} (${subId.toUpperCase()})</strong>`;
    questionBlock.appendChild(questionNumber);

    const questionText = document.createElement("p");
    questionText.innerHTML = detail.questionText.replace(/\n/g, "<br>");
    questionBlock.appendChild(questionText);

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options";

    detail.options.forEach(option => {
        const optionDiv = document.createElement("div");
        optionDiv.textContent = option;

        const optionChar = option.charAt(0);

        if (optionChar === detail.correctAnswer) {
            optionDiv.classList.add("option-correct");
            optionDiv.innerHTML += ' &#10003; (Jawaban Benar)';
        } else if (optionChar === detail.userAnswer) {
            optionDiv.classList.add("option-incorrect");
            optionDiv.innerHTML += ' &#10007; (Jawaban Anda)';
        } else {
            optionDiv.classList.add("option-default");
        }

        optionsDiv.appendChild(optionDiv);
    });

    questionBlock.appendChild(optionsDiv);
    pembahasanContainer.appendChild(questionBlock);

    updateNavigationButtons();
    updateWhatsappButton(detail);
}

function updateNavigationButtons() {
    prevQuestionBtn.disabled = currentQuestionIndex === 0;
    nextQuestionBtn.disabled = currentQuestionIndex === allAnswerDetails.length - 1;
}

function updateWhatsappButton(detail) {
    const userName = localStorage.getItem("snbtUserName") || "Pengguna";
    const message = `Halo Iki Aku ${userName}, jelasin Soal \n\n ${detail.questionNumber}: "${detail.questionText.replace(/<br>/g, "\n")}" \n\nOpsi: ${detail.options.join(', ')} \n\nJawaban Benar: ${detail.correctAnswer} \n\nKenapa?`;
    const encodedMessage = encodeURIComponent(message);
    whatsappPembahasanBtn.href = `https://wa.me/6285732361586?text=${encodedMessage}`;
}

prevQuestionBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestionPembahasan(currentQuestionIndex);
    }
});

nextQuestionBtn.addEventListener("click", () => {
    if (currentQuestionIndex < allAnswerDetails.length - 1) {
        currentQuestionIndex++;
        displayQuestionPembahasan(currentQuestionIndex);
    }
});

document.addEventListener("DOMContentLoaded", loadAnswerDetails);
