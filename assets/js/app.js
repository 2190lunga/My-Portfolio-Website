// Dark/Light Theme Toggle
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark');
            themeToggle.textContent = '☀️';
        }

        // Toggle theme
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark');
            const isDark = body.classList.contains('dark');
            themeToggle.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}

// Back to Top Button
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Project Data
const projects = [
    {
        title: "Customer Segmentation Analysis",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        desc: "A comprehensive data analysis project that segments customers based on purchasing behavior using K-means clustering. The project includes data cleaning, feature engineering, and visualization of customer segments to help businesses target their marketing efforts more effectively.",
        link: "#",
        category: "data",
        technologies: ["Python", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn", "K-means"]
    },
    {
        title: "Portfolio Website",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        desc: "A modern, responsive portfolio website built with HTML, CSS, and JavaScript. Features dark/light mode, project filtering, animated skill bars, and a contact form. Fully optimized for mobile devices and SEO.",
        link: "#",
        category: "web",
        technologies: ["HTML", "CSS", "JavaScript", "Responsive Design", "Git"]
    },
    {
        title: "Sales Forecasting Model",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        desc: "A machine learning model that predicts future sales based on historical data. Utilizes time series analysis and regression algorithms to provide accurate forecasts for business planning and inventory management.",
        link: "#",
        category: "data",
        technologies: ["Python", "Pandas", "Scikit-learn", "ARIMA", "Prophet", "Time Series"]
    },
    {
        title: "Weather Dashboard",
        image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        desc: "An interactive weather application that displays current conditions and forecasts using data from a public API. Features a clean UI with responsive design for all devices and real-time weather updates.",
        link: "#",
        category: "web",
        technologies: ["JavaScript", "API Integration", "CSS", "HTML", "Async/Await"]
    },
    {
        title: "Sentiment Analysis Tool",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        desc: "A natural language processing application that analyzes text sentiment using machine learning. Can classify text as positive, negative, or neutral with high accuracy for social media monitoring and customer feedback analysis.",
        link: "#",
        category: "data",
        technologies: ["Python", "NLTK", "TextBlob", "Scikit-learn", "NLP"]
    },
    {
        title: "Task Management App",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        desc: "A productivity application for managing daily tasks with features like adding, editing, deleting, and categorizing tasks. Includes local storage for data persistence and a clean, intuitive user interface.",
        link: "#",
        category: "web",
        technologies: ["JavaScript", "Local Storage", "CSS", "HTML", "DOM Manipulation"]
    }
];

// Projects Management
function initProjects() {
    const projectsContainer = document.querySelector('.projects-gallery');
    if (!projectsContainer) return;

    renderProjects('all');
    initProjectFilters();
    initProjectModal();
}

function renderProjects(category) {
    const projectsContainer = document.querySelector('.projects-gallery');
    if (!projectsContainer) return;

    // Clear container
    projectsContainer.innerHTML = '';

    // Filter projects based on category
    const filteredProjects = category === 'all' 
        ? projects 
        : projects.filter(project => project.category === category);

    // Add projects to container
    filteredProjects.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        projectsContainer.appendChild(projectCard);
    });

    // If no projects found, show message
    if (filteredProjects.length === 0) {
        projectsContainer.innerHTML = `
            <div class="no-projects">
                <p>No projects found in this category.</p>
            </div>
        `;
    }
}

function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', project.category);
    
    card.innerHTML = `
        <img src="${project.image}" alt="${project.title}" 
             onerror="this.src='https://via.placeholder.com/400x250/4361ee/ffffff?text=Project+Image'">
        <h3>${project.title}</h3>
        <p>${project.desc.substring(0, 100)}...</p>
        <div class="tech-tags">
            ${project.technologies.slice(0, 3).map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('')}
            ${project.technologies.length > 3 ? 
                `<span class="tech-tag">+${project.technologies.length - 3}</span>` : ''}
        </div>
    `;

    // Add click event
    card.addEventListener('click', () => openModal(index));
    
    return card;
}

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter category
            const filter = this.getAttribute('data-filter');
            
            // Render filtered projects
            renderProjects(filter);
        });
    });
}

// Project Modal
function initProjectModal() {
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('project-modal');
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(index) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody || !projects[index]) return;

    const project = projects[index];
    
    modalBody.innerHTML = `
        <h3>${project.title}</h3>
        <img src="${project.image}" alt="${project.title}" 
             onerror="this.src='https://via.placeholder.com/600x300/4361ee/ffffff?text=Project+Image'">
        <p>${project.desc}</p>
        <div class="modal-tech-tags">
            ${project.technologies.map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('')}
        </div>
        ${project.link && project.link !== "#" ? 
            `<a href="${project.link}" target="_blank" class="project-link">View Project</a>` : 
            '<p class="coming-soon">Project link coming soon!</p>'}
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Skills Animation
function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-bar');
    if (skillBars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.querySelector('.progress');
                const width = progress.getAttribute('data-width') + '%';
                
                // Reset to 0 first for animation
                progress.style.width = '0%';
                
                // Animate after a small delay
                setTimeout(() => {
                    progress.style.width = width;
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => observer.observe(bar));
}

// Stats Counter
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50; // Adjust speed here
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Contact form handling (for future implementation)
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simulate AJAX send (replace with real email service if needed)
            const messageElement = document.getElementById('form-message');
            if (messageElement) {
                messageElement.textContent = 'Thank you for your message! I will respond soon.';
                messageElement.style.color = 'var(--success-color)';
            }
            contactForm.reset();
        });
    }
}

// Main Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio initialized successfully!');
    
    // Initialize all features
    initTheme();
    initBackToTop();
    initProjects();
    initSkillsAnimation();
    initStatsCounter();
    initSmoothScrolling();
    initContactForm();
    
    // Close modal with close button
    const closeBtn = document.querySelector('.modal .close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
});

// Make functions globally available for HTML onclick attributes
window.openModal = openModal;
window.closeModal = closeModal;