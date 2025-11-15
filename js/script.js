// Dark/Light Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
if (themeToggle) {
    themeToggle.onclick = () => {
        body.classList.toggle('dark');
        themeToggle.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
        localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
    };
    // Load theme from localStorage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark');
        themeToggle.textContent = '☀️';
    }
}

// Project modal data
const projects = [
    {
        title: "Portfolio Website",
        image: "images/project1.jpg",
        desc: "A modern portfolio website to showcase my work and skills. Built with HTML, CSS, and JavaScript. Features responsive design, dark/light mode, and project gallery.",
        link: "#"
    },
    {
        title: "Weather App",
        image: "images/project2.jpg",
        desc: "A simple weather app that fetches and displays current weather using a public API. Built with JavaScript and styled for mobile.",
        link: "#"
    },
    {
        title: "Task Manager",
        image: "images/project3.jpg",
        desc: "A productivity web app for managing daily tasks. Includes add/edit/delete functionality, local storage, and a clean UI.",
        link: "#"
    }
];

function openModal(idx) {
    const modal = document.getElementById('project-modal');
    const body = document.getElementById('modal-body');
    if (projects[idx]) {
        body.innerHTML = `
            <h3>${projects[idx].title}</h3>
            <img src="${projects[idx].image}" alt="${projects[idx].title}" style="width:100%;border-radius:8px;margin-bottom:12px;">
            <p>${projects[idx].desc}</p>
            ${projects[idx].link && projects[idx].link !== "#" ? `<a href="${projects[idx].link}" target="_blank">View Project</a>` : ""}
        `;
        modal.style.display = 'flex';
    }
}
function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.style.display = 'none';
}
window.onclick = function(event) {
    const modal = document.getElementById('project-modal');
    if (modal && event.target === modal) closeModal();
}

// Contact form (front-end only)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.onsubmit = function(e) {
        e.preventDefault();
        // Simulate AJAX send (replace with real email service if needed)
        document.getElementById('form-message').textContent =
            'Thank you for your message! I will respond soon.';
        contactForm.reset();
    };
}