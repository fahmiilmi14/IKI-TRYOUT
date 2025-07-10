document.addEventListener('DOMContentLoaded', () => {
  const nameModal = document.getElementById('nameModal');
  const userNameInput = document.getElementById('userNameInput');
  const userPasswordInput = document.getElementById('userPasswordInput');
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
    { id: 'bi', name: 'Bahasa Indonesia', description: 'Menguji pemahaman literasi bahasa Indonesia.' },
    { id: 'Penalaran matematika', name: 'Penalaran Matematika', description: 'Menguji kemampuan Matematika dan Penalaran Anda.' }
  ];

  function checkUserName() {
    const userName = localStorage.getItem('snbtUserName');
    const userPassword = localStorage.getItem('snbtUserPassword');
    if (!userName || !userPassword) {
      nameModal.style.display = 'flex';
      userNameInput.focus();
    } else {
      welcomeMessage.textContent = `Selamat Datang, ${userName}!`;
      nameModal.style.display = 'none';
      renderSubtests();
      checkAllSubtestsCompleted();
    }
  }

  saveNameBtn.addEventListener('click', () => {
    const userName = userNameInput.value.trim();
    const userPassword = userPasswordInput.value.trim();

    if (!userName || !userPassword) {
      alert("Nama dan Password wajib diisi!");
      return;
    }

    firebase.database().ref("akun").once("value").then(snapshot => {
      const data = snapshot.val();
      let found = false;

      for (const key in data) {
        const item = data[key];
        if (item.nama === userName && item.password === userPassword) {
          found = true;
          break;
        }
      }

      if (found) {
        localStorage.setItem('snbtUserName', userName);
        localStorage.setItem('snbtUserPassword', userPassword);
        checkUserName();
      } else {
        alert("Nama atau Password salah atau belum terdaftar.");
      }
    }).catch(err => {
      alert("Gagal terhubung ke server: " + err.message);
    });
  });

  function getSubtestProgress() {
    try {
      return JSON.parse(localStorage.getItem('snbtTryoutProgress')) || {};
    } catch {
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
    } catch {
      alert("Gagal menyimpan progres. Coba nonaktifkan mode incognito.");
    }
    renderSubtests();
    checkAllSubtestsCompleted();
  }

  function renderSubtests() {
    if (!subtestContainer) return;
    subtestContainer.innerHTML = '';
    const allTryoutData = getSubtestProgress();

    SUBTESTS.forEach(subtest => {
      const isCompleted = allTryoutData[subtest.id]?.completed;
      const subtestScore = isCompleted ? allTryoutData[subtest.id].score : '-';

      const card = document.createElement('div');
      card.classList.add('subtest-card');
      if (isCompleted) card.classList.add('completed');

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
  }

  function checkAllSubtestsCompleted() {
    const allTryoutData = getSubtestProgress();
    const allCompleted = SUBTESTS.every(subtest =>
      allTryoutData[subtest.id]?.completed === true
    );

    const leaderboardBtn = document.getElementById('viewLeaderboardBtn');

    if (allCompleted) {
      downloadCertificateBtn.disabled = false;
      downloadCertificateBtn.style.backgroundColor = '#28a745';
      downloadMessage.textContent = 'Semua subtes selesai! Klik untuk mengunduh sertifikat.';
      viewPembahasanBtn.style.display = 'inline-block';
      leaderboardBtn.style.display = 'inline-block';
    } else {
      downloadCertificateBtn.disabled = true;
      downloadCertificateBtn.style.backgroundColor = '#ccc';
      downloadMessage.textContent = 'Selesaikan semua subtes untuk mengunduh sertifikat.';
      viewPembahasanBtn.style.display = 'none';
      leaderboardBtn.style.display = 'none';
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

  const urlParams = new URLSearchParams(window.location.search);
  const completedSubtestId = urlParams.get('subtestId');
  const finalScore = urlParams.get('score');
  const answerDetailsString = urlParams.get('answerDetails');
  let answerDetails = [];

  if (answerDetailsString) {
    try {
      answerDetails = JSON.parse(decodeURIComponent(answerDetailsString));
    } catch {}
  }

  if (completedSubtestId && finalScore) {
    saveSubtestProgress(completedSubtestId, parseInt(finalScore), answerDetails);
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  checkUserName();

  if (downloadCertificateBtn) {
    downloadCertificateBtn.addEventListener('click', () => {
      if (!downloadCertificateBtn.disabled) {
        window.location.href = 'sertifikat.html';
      }
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {
    const headerProfilePic = document.getElementById('headerProfilePic');
    const headerUserName = document.getElementById('headerUserName');
    const profileNav = document.getElementById('profileNav');

    function loadProfileHeader() {
        const userName = localStorage.getItem('snbtUserName') || 'Profil';
        const profilePicture = localStorage.getItem('snbtProfilePicture');
        headerUserName.textContent = userName;
        headerProfilePic.src = profilePicture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA5PEwhbsNXhz2W4XBW7nQNkoGq7jQwRe9ho3K05jZ4F9b93VdyqE-zPs&s=10";
    }

    loadProfileHeader();

    if (profileNav) {
        profileNav.addEventListener('click', () => {
            window.location.href = 'profil.html';
        });
    }
});
