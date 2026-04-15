// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link and mark active nav item
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        
        // Remove active class from all links
        document.querySelectorAll('.nav-menu a').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked link
        link.classList.add('active');
    });
});

// Set active navigation link based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    const header = document.querySelector('.navbar');
    const headerHeight = header ? header.offsetHeight : 120;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Adjust for header height
        if (window.scrollY >= (sectionTop - headerHeight - 50)) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Course Tab Functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const courseCards = document.querySelectorAll('.course-card');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        tabBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Filter courses based on tab (for demonstration)
        // In a real application, you would filter the actual content
        courseCards.forEach(card => {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease forwards';
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Get the header height
            const header = document.querySelector('.navbar');
            const headerHeight = header ? header.offsetHeight + 20 : 120; // 20px extra padding
            
            // Calculate position to scroll to
            const targetPosition = target.offsetTop - headerHeight;
            
            // Smooth scroll to position
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Counter Animation for Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = counter.textContent; // Keep original text (with + or %)
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 20);
    });
}

// Trigger counter animation when stats section is in view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    observer.observe(statsSection);
}

// Hero Navigation Arrows
const prevBtn = document.querySelector('.nav-prev');
const nextBtn = document.querySelector('.nav-next');

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        // Slide to previous hero content (for demo purposes)
        console.log('Previous slide');
    });
    
    nextBtn.addEventListener('click', () => {
        // Slide to next hero content (for demo purposes)
        console.log('Next slide');
    });
}

// Form Submission
const contactForm = document.querySelector('.contact-form');
console.log('Contact form found:', contactForm); // Debug log

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted!'); // Debug log
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const mobile = formData.get('mobile');
        const email = formData.get('email');
        
        console.log('Form data:', { name, mobile, email }); // Debug log
        
        // Simple validation
        if (!name || !mobile || !email) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Phone validation (basic)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(mobile.replace(/\s/g, ''))) {
            alert('Please enter a valid mobile number');
            return;
        }
        
        // Disable submit button during submission
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        try {
            console.log('Sending request to server...'); // Debug log
            
            // Submit to server
            const response = await fetch('/api/submit-inquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    mobile: mobile,
                    email: email
                })
            });
            
            console.log('Response received:', response); // Debug log
            
            const result = await response.json();
            console.log('Result:', result); // Debug log
            
            if (result.success) {
                alert(result.message);
                contactForm.reset();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Network error. Please try again later.');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroCircle = document.querySelector('.hero-circle');
    const heroPerson = document.querySelector('.hero-person');
    
    if (heroCircle && heroPerson) {
        heroCircle.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.3}px)`;
        heroPerson.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.2}px)`;
    }
});

// Add floating animation to course cards
const courseCardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'float 3s ease-in-out infinite';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.course-card').forEach(card => {
    courseCardObserver.observe(card);
});

// Add CSS for floating animation
const floatStyles = `
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.course-card:nth-child(even) {
    animation-delay: 1s;
}

.course-card:nth-child(3n) {
    animation-delay: 2s;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = floatStyles;
document.head.appendChild(styleSheet);

// WhatsApp button functionality
const whatsappIcon = document.querySelector('.whatsapp-icon');
if (whatsappIcon) {
    whatsappIcon.addEventListener('click', () => {
        const phoneNumber = '1234567890'; // Replace with actual WhatsApp number
        const message = 'Hi! I am interested in your courses.';
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    });
}

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Add interactive hover effects
document.querySelectorAll('.course-card, .testimonial-card, .job-role-card, .alumni-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Lazy loading for course images (placeholder effect)
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const placeholder = entry.target;
            placeholder.style.opacity = '0';
            
            setTimeout(() => {
                placeholder.style.opacity = '1';
                placeholder.style.transform = 'scale(1.1)';
                
                setTimeout(() => {
                    placeholder.style.transform = 'scale(1)';
                }, 300);
            }, 200);
            
            imageObserver.unobserve(placeholder);
        }
    });
});

document.querySelectorAll('.course-placeholder, .work-placeholder, .avatar-placeholder').forEach(placeholder => {
    imageObserver.observe(placeholder);
});

// Add scroll progress indicator
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #ff9500, #ffb347);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
};

createScrollProgress();

// Add dynamic year to footer
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-bottom p');
if (footerText) {
    footerText.textContent = `© ${currentYear} Learnnomine. All rights reserved.`;
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScroll = debounce(() => {
    // Any scroll-based animations can go here
}, 10);

window.addEventListener('scroll', debouncedScroll);
