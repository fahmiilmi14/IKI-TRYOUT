// main.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('main.js: DOMContentLoaded event fired.');

    const nameModal = document.getElementById('nameModal');
    const userNameInput = document.getElementById('userNameInput');
    const saveNameBtn = document.getElementById('saveNameBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const subtestContainer = document.getElementById('subtestContainer');
    const downloadCertificateBtn = document.getElementById('downloadCertificateBtn');
    const downloadMessage = document.getElementById('downloadMessage');
    const viewPembahasanBtn = document.getElementById('viewPembahasanBtn'); // Ambil elemen tombol pembahasan

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
                console.error("main.js: Elemen nameModal tidak ditemukan.");
            }
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
            console.error("main.js: Error parsing localStorage 'snbtTryoutProgress':", e);
            return {};
        }
    }

    // Fungsi ini sekarang juga akan menyimpan detail jawaban untuk pembahasan
    function saveSubtestProgress(subtestId, score, answerDetails) { // Tambahkan parameter answerDetails
        
        const allTryoutData = getSubtestProgress();
        allTryoutData[subtestId] = {
            completed: true,
            score: score,
            timestamp: new Date().toISOString(),
            answerDetails: answerDetails // Simpan detail jawaban di sini
        };
        try {
            localStorage.setItem('snbtTryoutProgress', JSON.stringify(allTryoutData));
            
        } catch (e) {
            console.error("main.js: Error saving to localStorage 'snbtTryoutProgress':", e);
            alert("Gagal menyimpan progres tryout Anda. Pastikan browser Anda tidak dalam mode private/incognito.");
        }
        renderSubtests();
        checkAllSubtestsCompleted();
    }

    function renderSubtests() {
        console.log('main.js: renderSubtests called.');
        if (!subtestContainer) {
            console.error('main.js: Elemen subtestContainer tidak ditemukan. Tidak dapat merender subtes.');
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
                
                // Tampilkan tombol pembahasan
                if (viewPembahasanBtn) {
                    viewPembahasanBtn.style.display = 'inline-block';
                }
            } else {
                downloadCertificateBtn.disabled = true;
                downloadCertificateBtn.style.backgroundColor = '#ccc';
                if (downloadMessage) downloadMessage.textContent = 'Selesaikan semua subtes untuk mengunduh sertifikat.';
                
                // Sembunyikan tombol pembahasan
                if (viewPembahasanBtn) {
                    viewPembahasanBtn.style.display = 'none';
                }
            }
        }
    }

    if (downloadCertificateBtn) {
        downloadCertificateBtn.addEventListener('click', () => {
           
            window.location.href = 'sertifikat.html';
        });
    }

    // Event listener untuk tombol pembahasan
    if (viewPembahasanBtn) {
        viewPembahasanBtn.addEventListener('click', () => {
            window.location.href = 'pembahasan.html'; // Arahkan ke halaman pembahasan
        });
    }

    
    const urlParams = new URLSearchParams(window.location.search);
    const completedSubtestId = urlParams.get('subtestId');
    const finalScore = urlParams.get('score');
    // Ambil detail jawaban dari URL jika ada
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
      
        // Kirim detail jawaban ke fungsi saveSubtestProgress
        saveSubtestProgress(completedSubtestId, parseInt(finalScore), answerDetails);
        // Clear URL parameters after processing
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

        // Fungsi untuk memuat data profil
        function loadProfileHeader() {
            const userName = localStorage.getItem('snbtUserName') || 'Profil'; // Default 'Profil' jika belum ada nama
            const profilePicture = localStorage.getItem('snbtProfilePicture');

            headerUserName.textContent = userName;

            if (profilePicture) {
                headerProfilePic.src = profilePicture;
            } else {
                headerProfilePic.src = "https://via.placeholder.com/40"; // Placeholder default
            }
        }

        // Panggil fungsi saat halaman dimuat
        loadProfileHeader();

        // Tambahkan event listener untuk navigasi ke halaman profil
        if (profileNav) {
            profileNav.addEventListener('click', () => {
                window.location.href = 'profil.html'; // Arahkan ke halaman profil
            });
        }
    });
