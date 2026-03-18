document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        // Toggle Nav
        navLinks.classList.toggle('nav-active');

        // Animate Links
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Hamburger Animation
        hamburger.classList.toggle('toggle');
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                hamburger.classList.remove('toggle');
                links.forEach(l => { l.style.animation = ''; });
            }
        });
    });

    /**
     * Scroll Animation Observers
     */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        });
    }, observerOptions);

    // Elements to animate
    const fadeUpElements = document.querySelectorAll('.fade-in-up');
    const fadeLeftElements = document.querySelectorAll('.fade-in-left');
    const fadeRightElements = document.querySelectorAll('.fade-in-right');

    fadeUpElements.forEach(el => scrollObserver.observe(el));
    fadeLeftElements.forEach(el => scrollObserver.observe(el));
    fadeRightElements.forEach(el => scrollObserver.observe(el));

    /**
     * Counter Animation
     */
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Lower is faster

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    
                    const inc = target / speed;
                    
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));

    // Smooth Scrolling for anchor links (handled mostly by CSS, but fallback here)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Adjust scroll position for fixed navbar
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Form Submission (Real Integration)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            // 1. Prepare Data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            data.id = Date.now();
            data.date = new Date().toISOString().split('T')[0];
            data.status = 'New';

            // 2. UI Feedback
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            try {
                // 3. Save to LocalStorage for Admin Dashboard
                const messages = JSON.parse(localStorage.getItem('sbw_messages')) || [];
                messages.unshift(data);
                localStorage.setItem('sbw_messages', JSON.stringify(messages));

                // 4. Send to Formspree (if Form ID is provided, otherwise skip gracefully)
                // Note: Change 'YOUR_FORM_ID' to your actual Formspree ID
                const formId = 'mqakovge'; // Placeholder: Please update with your actual Formspree ID
                const response = await fetch(`https://formspree.io/f/${formId}`, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    alert('Thank you for contacting Shri Balaji Wood. Your message has been sent and saved!');
                } else {
                    alert('Message saved to our dashboard, but email delivery failed. We will still see your message!');
                }
                
                this.reset();
            } catch (error) {
                console.error('Submission error:', error);
                alert('We saved your message to our records, but encountered an error. We will get back to you!');
            } finally {
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
            }
        });
    }
});

// Add keyframes dynamically for mobile menu
const style = document.createElement('style');
style.innerHTML = `
    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);
