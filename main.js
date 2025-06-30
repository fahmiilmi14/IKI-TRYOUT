document.addEventListener('DOMContentLoaded', () => {
    

    const nameModal = document.getElementById('nameModal');
    const userNameInput = document.getElementById('userNameInput');
    const saveNameBtn = document.getElementById('saveNameBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const subtestContainer = document.getElementById('subtestContainer');
    const downloadCertificateBtn = document.getElementById('downloadCertificateBtn');
    const downloadMessage = document.getElementById('downloadMessage');
    const viewPembahasanBtn = document.getElementById('viewPembahasanBtn'); 

    const SUBTESTS = [
        { id: 'pu', name: 'Penalaran Umum', description: 'Menguji kemampuan penalaran Anda.' },
        { id: 'pk', name: 'Pengetahuan Kuantitatif', description: 'Menguji kemampuan matematika dasar Anda.' },
        { id: 'pbm', name: 'Pengetahuan & Pemahaman Membaca', description: 'Menguji pemahaman teks Anda.' },
        { id: 'ppu', name: 'Penalaran & Pengetahuan Umum', description: 'Menguji wawasan umum dan analitis.' },
        { id: 'bing', name: 'Bahasa Inggris', description: 'Menguji kemampuan bahasa Inggris Anda.' },
        { id: 'bi', name: 'Bahasa Indonesia', description: 'Menguji pemahaman kaidah bahasa Indonesia.' },
        { id: 'Penalaran matematika', name: 'Penalaran matematika', description: 'Menguji kemampuan literasi baca-tulis.' }
    ];

    function checkUserName() {
        const userName = localStorage.getItem('snbtUserName');
        
        if (!userName) {
            if (nameModal) {
                nameModal.style.display = 'flex';
                userNameInput.focus();
            
        } else {
            if (welcomeMessage) welcomeMessage.textContent = `Selamat Datang, ${userName}!`;
            if (nameModal) nameModal.style.display = 'none';
            renderSubtests();
            checkAllSubtestsCompleted();
        }
    }

    if (saveNameBtn) {
        saveNameBtn.addEventListener('click', () => {
            const userName = userNameInput.value.trim();
            if (userName) {
                localStorage.setItem('snbtUserName', userName);
                checkUserName();
            } else {
                alert('Nama tidak boleh kosong!');
            }
        });
    } else {
        console.warn("main.js: Elemen saveNameBtn tidak ditemukan.");
    }

    function getSubtestProgress() {
        try {
            const allTryoutData = JSON.parse(localStorage.getItem('snbtTryoutProgress')) || {};
            
            return allTryoutData;
        } catch (e) {
            
            return {};
        }
    }

    
    function saveSubtestProgress(subtestId, score, answerDetails) { 
        
        const allTryoutData = getSubtestProgress();
        allTryoutData[subtestId] = {
            completed: true,
            score: score,
            timestamp: new Date().toISOString(),
            answerDetails: answerDetails 
        };
        try {
            localStorage.setItem('snbtTryoutProgress', JSON.stringify(allTryoutData));
            
        } catch (e) {
            
            alert("Gagal menyimpan progres tryout Anda. Pastikan browser Anda tidak dalam mode private/incognito.");
        }
        renderSubtests();
        checkAllSubtestsCompleted();
    }

    function renderSubtests() {
        
        if (!subtestContainer) {
            
            return;
        }
        subtestContainer.innerHTML = '';
        const allTryoutData = getSubtestProgress();

        SUBTESTS.forEach(subtest => {
            const isCompleted = allTryoutData[subtest.id] && allTryoutData[subtest.id].completed;
            const subtestScore = isCompleted ? allTryoutData[subtest.id].score : '-';

            const card = document.createElement('div');
            card.classList.add('subtest-card');
            if (isCompleted) {
                card.classList.add('completed');
            }

            card.innerHTML = `
                <h4>${subtest.name}</h4>
                <p>${subtest.description}</p>
                <p>Skor Anda: <span class="score">${subtestScore}</span></p>
                <button class="btn-primary" data-subtest-id="${subtest.id}" ${isCompleted ? 'disabled' : ''}>
                    ${isCompleted ? 'Selesai Dikerjakan' : 'Mulai Tryout'}
                </button>
            `;
            subtestContainer.appendChild(card);
        });

        document.querySelectorAll('.subtest-card .btn-primary').forEach(button => {
            if (!button.disabled) {
                button.addEventListener('click', (event) => {
                    const subtestId = event.target.dataset.subtestId;
                    localStorage.setItem('currentSubtestId', subtestId);
                    window.location.href = 'tryout_reguler.html';
                });
            }
        });
        console.log('main.js: Subtests rendered.');
    }

    function checkAllSubtestsCompleted() {
    console.log('main.js: checkAllSubtestsCompleted called.');
    const allTryoutData = getSubtestProgress();
    const allCompleted = SUBTESTS.every(subtest => allTryoutData[subtest.id] && allTryoutData[subtest.id].completed);

    if (downloadCertificateBtn) {
        if (allCompleted) {
            downloadCertificateBtn.disabled = false;
            downloadCertificateBtn.style.backgroundColor = '#28a745';
            if (downloadMessage) downloadMessage.textContent = 'Semua subtes selesai! Klik untuk mengunduh sertifikat Anda.';
            console.log('main.js: All subtests completed. Download button enabled.');
            
            if (viewPembahasanBtn) {
                viewPembahasanBtn.style.display = 'inline-block';
            }

            const leaderboardBtn = document.getElementById('viewLeaderboardBtn');
            if (leaderboardBtn) {
                leaderboardBtn.style.display = 'inline-block';
            }

        } else {
            downloadCertificateBtn.disabled = true;
            downloadCertificateBtn.style.backgroundColor = '#ccc';
            if (downloadMessage) downloadMessage.textContent = 'Selesaikan semua subtes untuk mengunduh sertifikat.';
            console.log('main.js: Not all subtests completed. Download button disabled.');

            if (viewPembahasanBtn) {
                viewPembahasanBtn.style.display = 'none';
            }

            const leaderboardBtn = document.getElementById('viewLeaderboardBtn');
            if (leaderboardBtn) {
                leaderboardBtn.style.display = 'none';
            }
        }
    }
}
    if (viewPembahasanBtn) {
        viewPembahasanBtn.addEventListener('click', () => {
            window.location.href = 'pembahasan.html'; 
        });
    }
const leaderboardBtn = document.getElementById('viewLeaderboardBtn');
if (leaderboardBtn) {
    leaderboardBtn.addEventListener('click', () => {
        window.location.href = 'leaderboard.html'; 
    });
}
    console.log('main.js: Starting page initialization.');
    const urlParams = new URLSearchParams(window.location.search);
    const completedSubtestId = urlParams.get('subtestId');
    const finalScore = urlParams.get('score');
    
    const answerDetailsString = urlParams.get('answerDetails');
    let answerDetails = [];
    if (answerDetailsString) {
        try {
            answerDetails = JSON.parse(decodeURIComponent(answerDetailsString));
        } catch (e) {
            console.error("main.js: Error parsing answerDetails from URL:", e);
        }
    }


    if (completedSubtestId && finalScore) {
        console.log(`main.js: Detected completed subtest. ID: ${completedSubtestId}, Score: ${finalScore}`);
        
        saveSubtestProgress(completedSubtestId, parseInt(finalScore), answerDetails);
        
        window.history.replaceState({}, document.title, window.location.pathname);
        console.log('main.js: URL parameters cleared.');
    }

    checkUserName();
    console.log('main.js: Page initialization finished.');
});
document.addEventListener('DOMContentLoaded', () => {
        const headerProfilePic = document.getElementById('headerProfilePic');
        const headerUserName = document.getElementById('headerUserName');
        const profileNav = document.getElementById('profileNav');

        
        function loadProfileHeader() {
            const userName = localStorage.getItem('snbtUserName') || 'Profil'; 
            const profilePicture = localStorage.getItem('snbtProfilePicture');

            headerUserName.textContent = userName;

            if (profilePicture) {
                headerProfilePic.src = profilePicture;
            } else {
                headerProfilePic.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA5PEwhbsNXhz2W4XBW7nQNkoGq7jQwRe9ho3K05jZ4F9b93VdyqE-zPs&s=10"; 
            }
        }

        
        loadProfileHeader();

        
        if (profileNav) {
            profileNav.addEventListener('click', () => {
                window.location.href = 'profil.html'; 
            });
        }
    });
