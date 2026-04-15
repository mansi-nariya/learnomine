// Animations and general functionality
function initAnimations() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
}

// Form validation
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation example
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const mobile = document.getElementById('mobile');
            
            let isValid = true;
            
            // Clear previous error messages
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.remove());
            
            // Name validation
            if (name.value.trim() === '') {
                isValid = false;
                showError(name, 'Name is required');
            }
            
            // Email validation
            if (email.value.trim() === '') {
                isValid = false;
                showError(email, 'Email is required');
            } else if (!isValidEmail(email.value)) {
                isValid = false;
                showError(email, 'Please enter a valid email');
            }
            
            // Mobile validation
            if (mobile.value.trim() === '') {
                isValid = false;
                showError(mobile, 'Mobile number is required');
            } else if (!isValidMobile(mobile.value)) {
                isValid = false;
                showError(mobile, 'Please enter a valid mobile number');
            }
            
            if (isValid) {
                // Form submission logic would go here
                alert('Form submitted successfully!');
                contactForm.reset();
            }
        });
    }
}

// Utility functions for form validation
function showError(input, message) {
    input.classList.add('error');
    const errorMessage = document.createElement('span');
    errorMessage.classList.add('error-message');
    errorMessage.innerText = message;
    input.parentNode.appendChild(errorMessage);
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isValidMobile(mobile) {
    const re = /^[0-9]{10}$/;
    return re.test(mobile);
}
