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

    // Form Submission (mock)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btn.style.opacity = '0.8';
            
            // Mock API call delay
            setTimeout(() => {
                alert('Thank you for contacting Shree Balaji Wood. We will get back to you shortly!');
                this.reset();
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
            }, 1500);
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
