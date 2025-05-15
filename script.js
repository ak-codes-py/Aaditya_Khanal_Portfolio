// DOM Elements
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const backToTopBtn = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');

// Animation Elements
const fadeElements = document.querySelectorAll('.fade-in');

// Update header on scroll
function updateHeader() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Toggle mobile menu
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('show');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('show');
    });
});

// Show/hide back to top button
function updateBackToTopButton() {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

// Smooth scroll to top
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Highlight active section in navigation
function highlightNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Intersection Observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
});

// Observe all fade elements
function initFadeAnimations() {
    document.querySelectorAll('.section-header, .about-content, .education-card, .timeline-item, .project-card, .skills-category, .contact-info, .contact-form').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Form validation and submission
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        let isValid = true;
        
        if (!nameInput.value.trim()) {
            highlightError(nameInput, 'Please enter your name');
            isValid = false;
        } else {
            removeError(nameInput);
        }
        
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
            highlightError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            removeError(emailInput);
        }
        
        if (!messageInput.value.trim()) {
            highlightError(messageInput, 'Please enter your message');
            isValid = false;
        } else {
            removeError(messageInput);
        }
        
        if (isValid) {
            // Show success message
            const formSuccess = document.createElement('div');
            formSuccess.className = 'form-success';
            formSuccess.innerHTML = `
                <div style="background: rgba(var(--primary-rgb), 0.1); border: 1px solid var(--primary); border-radius: 8px; padding: 1rem; margin-top: 1.5rem; color: var(--light);">
                    <i class="fas fa-check-circle" style="color: var(--primary); margin-right: 0.5rem;"></i>
                    Message sent successfully! I'll get back to you soon.
                </div>
            `;
            
            // Reset form and add success message
            contactForm.reset();
            contactForm.appendChild(formSuccess);
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                formSuccess.remove();
            }, 5000);
        }
    });
}

// Highlight form error
function highlightError(input, message) {
    input.style.borderColor = '#e53e3e';
    input.style.backgroundColor = 'rgba(229, 62, 62, 0.1)';
    
    // Remove existing error message if any
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.color = '#e53e3e';
    errorMessage.style.fontSize = '0.875rem';
    errorMessage.style.marginTop = '0.5rem';
    
    input.parentElement.appendChild(errorMessage);
}

// Remove form error
function removeError(input) {
    input.style.borderColor = '';
    input.style.backgroundColor = '';
    
    // Remove error message if any
    const errorMessage = input.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced interactive project cards
function enhanceProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add 3D hover effect with mouse tracking
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            
            // Apply transform
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            
            // Create a highlight effect based on mouse position
            const highlight = this.querySelector('.card-highlight') || document.createElement('div');
            if (!highlight.classList.contains('card-highlight')) {
                highlight.classList.add('card-highlight');
                highlight.style.position = 'absolute';
                highlight.style.inset = '0';
                highlight.style.pointerEvents = 'none';
                highlight.style.borderRadius = 'inherit';
                highlight.style.zIndex = '1';
                this.appendChild(highlight);
            }
            
            // Calculate radial gradient position based on mouse
            const percentX = Math.floor((x / rect.width) * 100);
            const percentY = Math.floor((y / rect.height) * 100);
            highlight.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(var(--primary-rgb), 0.15) 0%, transparent 50%)`;
            highlight.style.opacity = '1';
            
            // Animate icon if present
            const icon = this.querySelector('.project-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        // Reset card on mouse leave
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            
            // Reset highlight
            const highlight = this.querySelector('.card-highlight');
            if (highlight) {
                highlight.style.opacity = '0';
            }
            
            // Reset icon
            const icon = this.querySelector('.project-icon i');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });
}

// Enhanced skill items with random animations
function enhanceSkillItems() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        // Random animation delay for staggered effect
        const delay = Math.random() * 0.5;
        item.style.transitionDelay = `${delay}s`;
        
        // Random hover animation
        item.addEventListener('mouseenter', function() {
            const random = Math.floor(Math.random() * 4);
            
            switch(random) {
                case 0:
                    this.style.transform = 'translateY(-5px) scale(1.05)';
                    break;
                case 1:
                    this.style.transform = 'translateY(-8px) rotate(2deg)';
                    break;
                case 2:
                    this.style.transform = 'translateY(-5px) rotate(-2deg) scale(1.05)';
                    break;
                case 3:
                    this.style.transform = 'translateY(-7px) scale(1.1)';
                    break;
            }
        });
        
        // Reset on mouse leave
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const profileImage = document.querySelector('.profile-image');
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        if (scrollPosition < window.innerHeight) {
            const parallaxOffset = scrollPosition * 0.4;
            
            if (profileImage) {
                profileImage.style.transform = `translateY(${parallaxOffset * 0.2}px)`;
            }
            
            if (heroContent) {
                heroContent.style.transform = `translateY(${parallaxOffset * 0.1}px)`;
            }
        }
    });
}

// Interactive timeline
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        // Add sequential animation delay
        item.style.transitionDelay = `${index * 0.2}s`;
        
        // Add pulse effect to timeline dots
        const dot = item.querySelector('.timeline-dot');
        if (dot) {
            dot.style.animationDelay = `${index * 0.2}s`;
        }
    });
}

// Initialize all functions
function init() {
    // Scroll event listeners
    window.addEventListener('scroll', () => {
        updateHeader();
        updateBackToTopButton();
        highlightNavOnScroll();
    });
    
    // Initialize animations and effects
    initFadeAnimations();
    enhanceProjectCards();
    enhanceSkillItems();
    initSmoothScroll();
    initParallaxEffect();
    initTimelineAnimation();
    
    // Trigger scroll functions on page load
    updateHeader();
    updateBackToTopButton();
    highlightNavOnScroll();
}

// Run initialization on page load
document.addEventListener('DOMContentLoaded', init);