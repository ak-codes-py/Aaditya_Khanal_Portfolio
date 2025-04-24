// DOM Elements
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');
const fadeElements = document.querySelectorAll('.fade-in');

// Mobile menu toggle
mobileMenuButton.addEventListener('click', function() {
    mobileMenu.classList.toggle('hidden');
    if (!mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('show');
    } else {
        mobileMenu.classList.remove('show');
    }
});

// Close mobile menu when a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('show');
        }
    });
});

// Enhanced smooth scroll for anchor links with progress indicator
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        // Create or get scroll progress indicator
        let progressIndicator = document.getElementById('scroll-progress');
        if (!progressIndicator) {
            progressIndicator = document.createElement('div');
            progressIndicator.id = 'scroll-progress';
            progressIndicator.style.position = 'fixed';
            progressIndicator.style.top = '0';
            progressIndicator.style.left = '0';
            progressIndicator.style.height = '3px';
            progressIndicator.style.width = '0%';
            progressIndicator.style.backgroundColor = 'var(--accent)';
            progressIndicator.style.zIndex = '1000';
            progressIndicator.style.transition = 'width 0.1s linear';
            document.body.appendChild(progressIndicator);
        }
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Add a subtle flash effect to the target section
            const flashEffect = document.createElement('div');
            flashEffect.style.position = 'absolute';
            flashEffect.style.inset = '0';
            flashEffect.style.backgroundColor = 'rgba(var(--primary-rgb), 0.05)';
            flashEffect.style.opacity = '0';
            flashEffect.style.zIndex = '-1';
            flashEffect.style.borderRadius = 'inherit';
            targetElement.style.position = 'relative';
            targetElement.appendChild(flashEffect);
            
            // Smooth scroll with progress
            const headerOffset = 80;
            const startPosition = window.pageYOffset;
            const targetPosition = targetElement.getBoundingClientRect().top + startPosition - headerOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000; // ms
            let startTime = null;
            
            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Update progress indicator
                progressIndicator.style.width = `${progress * 100}%`;
                
                const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                const run = easeInOutCubic(progress) * distance + startPosition;
                
                window.scrollTo(0, run);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    // Scroll complete
                    progressIndicator.style.width = '100%';
                    
                    // Flash effect on arrival
                    flashEffect.style.opacity = '1';
                    flashEffect.style.transition = 'opacity 0.5s ease-out';
                    
                    setTimeout(() => {
                        progressIndicator.style.width = '0%';
                        flashEffect.style.opacity = '0';
                        setTimeout(() => {
                            targetElement.removeChild(flashEffect);
                        }, 500);
                    }, 300);
                }
            }
            
            requestAnimationFrame(animation);
        }
    });
});

// Enhanced project cards hover effect with mouse tracking
const projectCards = document.querySelectorAll('.card');

projectCards.forEach(card => {
    // Add 3D hover effect with mouse tracking
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top; // y position within the element
        
        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20; // Adjust divisor for intensity
        const rotateY = (centerX - x) / 20; // Adjust divisor for intensity
        
        // Apply transform
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateY(-10px)`;
        
        // Create a highlight effect based on mouse position
        const highlight = this.querySelector('.card-highlight') || document.createElement('div');
        if (!highlight.classList.contains('card-highlight')) {
            highlight.classList.add('card-highlight');
            highlight.style.position = 'absolute';
            highlight.style.inset = '0';
            highlight.style.pointerEvents = 'none';
            highlight.style.transition = 'opacity 0.1s ease';
            highlight.style.borderRadius = 'inherit';
            highlight.style.zIndex = '1';
            this.appendChild(highlight);
        }
        
        // Calculate radial gradient position based on mouse
        const percentX = Math.floor((x / rect.width) * 100);
        const percentY = Math.floor((y / rect.height) * 100);
        highlight.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)`;
        highlight.style.opacity = '1';
        
        // Icon effect
        const icon = this.querySelector('i');
        if (icon) {
            icon.classList.add('fa-beat');
            icon.style.color = 'var(--accent)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        // Reset transform
        this.style.transform = '';
        
        // Fade out highlight
        const highlight = this.querySelector('.card-highlight');
        if (highlight) {
            highlight.style.opacity = '0';
        }
        
        // Reset icon
        const icon = this.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-beat');
            icon.style.color = '';
        }
    });
    
    card.addEventListener('mouseenter', function() {
        // Add subtle border glow
        this.style.boxShadow = '0 20px 40px -15px rgba(0, 0, 0, 0.2), 0 0 15px rgba(var(--primary-rgb), 0.3)';
    });
});

// Intersection Observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all fade-in elements
fadeElements.forEach(element => {
    observer.observe(element);
});

// Add active class to current section in navigation
const sections = document.querySelectorAll('section[id]');

function highlightNavOnScroll() {
    const scrollPosition = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('text-primary');
        } else {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.remove('text-primary');
        }
    });
}

// Add scroll event listener
window.addEventListener('scroll', highlightNavOnScroll);

// Form submission with validation
const contactForm = document.querySelector('form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        let isValid = true;
        
        if (!nameInput.value.trim()) {
            highlightError(nameInput);
            isValid = false;
        } else {
            removeError(nameInput);
        }
        
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
            highlightError(emailInput);
            isValid = false;
        } else {
            removeError(emailInput);
        }
        
        if (!messageInput.value.trim()) {
            highlightError(messageInput);
            isValid = false;
        } else {
            removeError(messageInput);
        }
        
        if (isValid) {
            // Here you would normally send the form data to a server
            // For demo purposes, show success message
            const formSuccess = document.createElement('div');
            formSuccess.className = 'mt-4 p-3 bg-green-100 text-green-800 rounded-lg';
            formSuccess.textContent = 'Message sent successfully!';
            
            contactForm.appendChild(formSuccess);
            
            // Reset form
            contactForm.reset();
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                formSuccess.remove();
            }, 3000);
        }
    });
}

// Helper functions for form validation
function highlightError(inputElement) {
    inputElement.classList.add('border-red-500');
    inputElement.classList.add('bg-red-50');
    
    // Add error message if it doesn't exist
    if (!inputElement.nextElementSibling || !inputElement.nextElementSibling.classList.contains('error-message')) {
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message text-red-500 text-sm mt-1';
        errorMessage.textContent = inputElement.id === 'email' && inputElement.value.trim() 
            ? 'Please enter a valid email address.' 
            : 'This field is required.';
        
        inputElement.parentNode.insertBefore(errorMessage, inputElement.nextSibling);
    }
}

function removeError(inputElement) {
    inputElement.classList.remove('border-red-500');
    inputElement.classList.remove('bg-red-50');
    
    // Remove error message if it exists
    if (inputElement.nextElementSibling && inputElement.nextElementSibling.classList.contains('error-message')) {
        inputElement.nextElementSibling.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Optional: Add a back-to-top button
const createBackToTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'fixed bottom-6 right-6 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-50 opacity-0 transition-opacity duration-300 hover:bg-opacity-90';
    button.id = 'back-to-top';
    document.body.appendChild(button);
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.opacity = '1';
        } else {
            button.style.opacity = '0';
        }
    });
};

// Create the back-to-top button
createBackToTopButton();