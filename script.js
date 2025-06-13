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
