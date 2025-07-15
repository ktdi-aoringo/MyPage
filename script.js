// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.research-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Add typing effect to hero title
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const nameText = '北代 絢大';
        const subtitleText = 'Ayato Kitadai';
        
        // Clear the content first and create structure
        heroTitle.innerHTML = '';
        heroTitle.style.opacity = '1';
        
        // Create name element
        const nameElement = document.createElement('span');
        heroTitle.appendChild(nameElement);
        
        // Create line break
        const lineBreak = document.createElement('br');
        heroTitle.appendChild(lineBreak);
        
        // Create subtitle element
        const subtitleElement = document.createElement('span');
        subtitleElement.className = 'hero-subtitle';
        heroTitle.appendChild(subtitleElement);
        
        let nameIndex = 0;
        let subtitleIndex = 0;
        
        const typeWriter = () => {
            if (nameIndex < nameText.length) {
                nameElement.textContent += nameText.charAt(nameIndex);
                nameIndex++;
                setTimeout(typeWriter, 50);
            } else if (subtitleIndex < subtitleText.length) {
                if (subtitleIndex === 0) {
                    // Small delay before starting subtitle
                    setTimeout(() => {
                        subtitleElement.textContent += subtitleText.charAt(subtitleIndex);
                        subtitleIndex++;
                        setTimeout(typeWriter, 50);
                    }, 200);
                } else {
                    subtitleElement.textContent += subtitleText.charAt(subtitleIndex);
                    subtitleIndex++;
                    setTimeout(typeWriter, 50);
                }
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effects to navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Mobile menu toggle (for future enhancement)
const createMobileMenu = () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    // This is a placeholder for mobile menu functionality
    // Can be enhanced later as needed
};

// Initialize mobile menu
document.addEventListener('DOMContentLoaded', createMobileMenu);