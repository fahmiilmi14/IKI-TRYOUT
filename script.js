// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Cek jika link mengarah ke halaman yang sama (misal: index.html#section)
        const targetId = this.getAttribute('href').split('#')[1];
        if (targetId && window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            e.preventDefault();
            document.querySelector('#' + targetId).scrollIntoView({
                behavior: 'smooth'
            });
        }
        // Jika link mengarah ke halaman lain, biarkan default behavior (navigasi)
    });
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


    window.addEventListener('pageshow', function (event) {
        if (event.persisted) { // Memeriksa apakah halaman dimuat dari cache (misal: tombol back browser)
            document.getElementById('headerUserName').textContent = localStorage.getItem('snbtUserName') || 'Profil';
            const profilePicture = localStorage.getItem('snbtProfilePicture');
            if (profilePicture) {
                document.getElementById('headerProfilePic').src = profilePicture;
            } else {
                document.getElementById('headerProfilePic').src = "https://via.placeholder.com/40";
            }
        }
    });

// Welcome Modal functionality
const welcomeModal = document.getElementById('welcomeModal');
const closeWelcomeButton = welcomeModal.querySelector('.close-button');

// Show welcome modal when the page loads
window.addEventListener('load', () => {
    // Optional: Only show modal once per session
    // if (!sessionStorage.getItem('welcomeModalShown')) {
        welcomeModal.style.display = 'flex';
    //     sessionStorage.setItem('welcomeModalShown', 'true');
    // }
});

function closeWelcomeModal() {
    welcomeModal.style.display = 'none';
}

closeWelcomeButton.addEventListener('click', closeWelcomeModal);

// Close welcome modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target == welcomeModal) {
        closeWelcomeModal();
    }
});


// Accordion for FAQ section
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        } 
    });
}
