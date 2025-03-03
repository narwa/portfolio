document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            body.classList.toggle('menu-open'); // Prevent scrolling when menu is open
        });
    }

    // Close mobile menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Smooth scrolling for navigation links with improved easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Highlight active nav item
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active-link');
                });
                this.classList.add('active-link');
                
                // Smooth scroll with custom timing
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect with enhanced transparency
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active navigation based on scroll position
        updateActiveNavOnScroll();
    });
    
    // Update active navigation item based on scroll position
    function updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active-link');
            }
        });
    }

    // Enhanced form submission with validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Add input focus effects
        const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
        formInputs.forEach(input => {
            // Add focus class when input is focused
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            // Remove focus class when input loses focus
            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Check if input has value on load
            if (input.value !== '') {
                input.parentElement.classList.add('focused');
            }
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            let isValid = true;
            const formInputs = contactForm.querySelectorAll('input, textarea');
            
            formInputs.forEach(input => {
                if (input.value.trim() === '') {
                    isValid = false;
                    input.classList.add('error');
                    setTimeout(() => {
                        input.classList.remove('error');
                    }, 3000);
                }
            });
            
            if (!isValid) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Show loading notification
            showNotification('Sending your message...', 'info');
            
            // Send the form data to the server
            fetch('/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, subject, message })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message with custom notification
                    showNotification('Thank you for your message! I will get back to you soon.', 'success');
                    
                    // Reset form
                    contactForm.reset();
                    formInputs.forEach(input => {
                        input.parentElement.classList.remove('focused');
                    });
                } else {
                    showNotification('There was a problem sending your message. Please try again later.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('There was a problem sending your message. Please try again later.', 'error');
            });
        });
    }
    
    // Custom notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Enhanced animation on scroll with staggered effects
    function animateOnScroll() {
        const elements = document.querySelectorAll('.timeline-item, .skill-category, .about-content > div, .contact-content > div');
        
        elements.forEach((element, index) => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                // Add staggered delay based on index
                setTimeout(() => {
                    element.classList.add('animate');
                }, index * 100); // 100ms delay between each element
            }
        });
        
        // Animate skill progress bars when in view
        const skillBars = document.querySelectorAll('.skill-progress .progress');
        skillBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            if (barPosition < window.innerHeight) {
                // Get the original width directly from the style attribute
                let originalWidth = '';
                
                // Check if the element has a style attribute
                if (bar.hasAttribute('style')) {
                    const styleAttr = bar.getAttribute('style');
                    const widthMatch = styleAttr.match(/width:\s*(\d+)%/);
                    if (widthMatch && widthMatch[1]) {
                        originalWidth = widthMatch[1] + '%';
                    }
                }
                
                // If we couldn't extract the width, get it from computed style
                if (!originalWidth) {
                    const computedStyle = window.getComputedStyle(bar);
                    originalWidth = computedStyle.width;
                }
                
                // Store the original width as a data attribute
                bar.setAttribute('data-original-width', originalWidth);
                
                // Reset the width to 0
                bar.style.width = '0';
                
                // Animate to the target width
                setTimeout(() => {
                    bar.style.transition = 'width 1.2s ease-in-out';
                    bar.style.width = bar.getAttribute('data-original-width');
                }, 300);
            }
        });
    }

    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        });
    }
    
    // Add cursor effect
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });
    
    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.classList.add('cursor-active');
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.classList.remove('cursor-active');
        });
        
        // Make sure links are clickable with custom cursor
        if (element.tagName.toLowerCase() === 'a') {
            element.style.position = 'relative';
            element.style.zIndex = '2';
            
            // Add click event listener to ensure links work
            element.addEventListener('click', function(e) {
                // If it's not a smooth scroll link (doesn't start with #), let it navigate normally
                if (!this.getAttribute('href').startsWith('#')) {
                    // The default action will happen naturally
                    return true;
                }
            });
        }
    });

    // Add animation class to elements
    window.addEventListener('scroll', animateOnScroll);
    
    // Initialize skill bars on page load with a delay
    const initSkillBars = () => {
        const skillBars = document.querySelectorAll('.skill-progress .progress');
        skillBars.forEach(bar => {
            // Get the width from the style attribute
            const styleAttr = bar.getAttribute('style');
            if (styleAttr && styleAttr.includes('width')) {
                const widthValue = styleAttr.match(/width:\s*(\d+)%/);
                if (widthValue && widthValue[1]) {
                    // Store original width
                    const originalWidth = widthValue[1] + '%';
                    bar.setAttribute('data-original-width', originalWidth);
                    
                    // Start with zero width
                    bar.style.width = '0';
                    
                    // Animate to full width after a delay
                    setTimeout(() => {
                        bar.style.width = originalWidth;
                    }, 1000); // Delay animation start
                }
            }
        });
    };
    
    // Initial check on page load
    animateOnScroll();
    
    // Initialize on page load
    updateActiveNavOnScroll();
    
    // Initialize skill bars after a short delay
    setTimeout(initSkillBars, 500);
});
