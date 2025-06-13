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
        console.log('main.js: checkUserName called. userName:', userName);
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
            console.log('main.js: getSubtestProgress - Current progress:', allTryoutData);
            return allTryoutData;
        } catch (e) {
            console.error("main.js: Error parsing localStorage 'snbtTryoutProgress':", e);
            return {};
        }
    }

    function saveSubtestProgress(subtestId, score) {
        console.log(`main.js: saveSubtestProgress called for subtestId: ${subtestId}, score: ${score}`);
        const allTryoutData = getSubtestProgress();
        allTryoutData[subtestId] = {
            completed: true,
            score: score,
            timestamp: new Date().toISOString()
        };
        try {
            localStorage.setItem('snbtTryoutProgress', JSON.stringify(allTryoutData));
            console.log('main.js: Progress saved to localStorage:', allTryoutData);
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
                console.log('main.js: All subtests completed. Download button enabled.');
            } else {
                downloadCertificateBtn.disabled = true;
                downloadCertificateBtn.style.backgroundColor = '#ccc';
                if (downloadMessage) downloadMessage.textContent = 'Selesaikan semua subtes untuk mengunduh sertifikat.';
                console.log('main.js: Not all subtests completed. Download button disabled.');
            }
        }
    }

    if (downloadCertificateBtn) {
        downloadCertificateBtn.addEventListener('click', () => {
            console.log('main.js: Download certificate button clicked. Redirecting to sertifikat.html');
            // Kita tidak perlu menyimpan data di localStorage lagi, karena sertifikat.html akan membacanya langsung
            window.location.href = 'sertifikat.html';
        });
    }

    console.log('main.js: Starting page initialization.');
    const urlParams = new URLSearchParams(window.location.search);
    const completedSubtestId = urlParams.get('subtestId');
    const finalScore = urlParams.get('score');

    if (completedSubtestId && finalScore) {
        console.log(`main.js: Detected completed subtest. ID: ${completedSubtestId}, Score: ${finalScore}`);
        saveSubtestProgress(completedSubtestId, parseInt(finalScore));
        // Clear URL parameters after processing
        window.history.replaceState({}, document.title, window.location.pathname);
        console.log('main.js: URL parameters cleared.');
    }

    checkUserName();
    console.log('main.js: Page initialization finished.');
});
