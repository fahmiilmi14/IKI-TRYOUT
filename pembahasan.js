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

const pembahasanContainer = document.getElementById("pembahasanContainer");
const prevQuestionBtn = document.getElementById("prevQuestionBtn");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const whatsappPembahasanBtn = document.getElementById("whatsappPembahasanBtn");


function compareSubtestOrder(a, b) {
  const indexA = urutanSubtes.indexOf(a.subtestId);
  const indexB = urutanSubtes.indexOf(b.subtestId);

  
  if (indexA !== indexB) {
    return indexA - indexB;
  }
  
  return a.questionNumber - b.questionNumber;
}

function loadAnswerDetails() {
    allAnswerDetails = []; 

    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key.startsWith("Jawaban_")) {
            try {
                const answerDetail = JSON.parse(localStorage.getItem(key));
                
                if (answerDetail && answerDetail.subtestId && typeof answerDetail.questionNumber === 'number') {
                    allAnswerDetails.push(answerDetail);
                } else {
                    console.warn(`Data jawaban tidak lengkap atau format salah untuk kunci: ${key}`, answerDetail);
                }
            } catch (e) {
                console.error(`Gagal parse data dari localStorage untuk kunci ${key}:`, e);
            }
        }
    }

    
    totalQuestions = 0;
    correctAnswers = 0;
    finalScore = 0;
    const summaryKeys = ["pu", "pk", "ppu", "pbm", "bi", "bing", "Penalaran matematika"];
    for (const sub of summaryKeys) {
        const total = localStorage.getItem(`totalQuestions_${sub}`);
        const correct = localStorage.getItem(`totalCorrect_${sub}`);
        const score = localStorage.getItem(`finalScore_${sub}`);
        if (total && correct && score) {
            totalQuestions += parseInt(total);
            correctAnswers += parseInt(correct);
            finalScore += parseFloat(score); 
        }
    }

    
    document.getElementById("totalQuestionsSummary").textContent = totalQuestions;
    document.getElementById("correctAnswersSummary").textContent = correctAnswers;
    document.getElementById("finalScoreDisplay").textContent = finalScore.toFixed(2); 

    if (allAnswerDetails.length === 0) {
        pembahasanContainer.innerHTML = "<p>Tidak ada data pembahasan yang ditemukan. Pastikan Anda telah menyelesaikan tryout.</p>";
        prevQuestionBtn.style.display = "none";
        nextQuestionBtn.style.display = "none";
        whatsappPembahasanBtn.style.display = "none";
        return;
    }

    
    allAnswerDetails.sort(compareSubtestOrder);

    
    currentQuestionIndex = 0;
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

    
    const subId = detail.subtestId ? detail.subtestId.toUpperCase() : "-";
    const questionNumber = document.createElement("p");
    questionNumber.innerHTML = `<strong>Soal ${detail.questionNumber} (${subId})</strong>`;
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
    
    const subtestName = detail.subtestId ? detail.subtestId.toUpperCase() : "Subtes";
    const message = `Halo Iki Aku ${userName}, jelasin Soal ${detail.questionNumber} (${subtestName}): "${detail.questionText.replace(/<br>/g, "\n")}" \n\nOpsi: ${detail.options.join(', ')} \n\nJawaban Benar: ${detail.correctAnswer} \n\nKenapa?`;
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
