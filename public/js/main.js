// Performance Optimizations & Polyfills
(function() {
    'use strict';
    
    // Critical performance optimizations
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const script = document.createElement('script');
        script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
        document.head.appendChild(script);
    }

    // Enhanced image loading with error handling
    function setupImageErrorHandling() {
        document.addEventListener('error', function(e) {
            if (e.target.tagName === 'IMG') {

                
                // Add error handling class
                e.target.classList.add('image-error');
                
                // Retry mechanism for external images
                if (!e.target.dataset.retried && e.target.src.includes('unsplash.com')) {
                    e.target.dataset.retried = 'true';
                    setTimeout(() => {
                        // Add cache-busting parameter
                        const url = new URL(e.target.src);
                        url.searchParams.set('retry', Date.now());
                        e.target.src = url.toString();
                    }, 1500);
                }
            }
        }, true);
    }
    
    setupImageErrorHandling();
})();

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components

    initializeHeader();
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeHeroAnimations();
    initializePortfolioFilters();
    initializeTestimonialsSlider();
    initializeContactForm();
    initializeNewsletterForm();
    initializeBackToTop();
    initializeCookieBanner();
    initializeCounterAnimations();
    initializeLightbox();
    initializePerformanceOptimizations();
    

});

// Loading Screen


// Enhanced Header with Scroll Effects
function initializeHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let ticking = false;
    let lastScrollY = 0;
    
    function updateHeader() {
        const scrollY = window.pageYOffset;
        const scrollDelta = scrollY - lastScrollY;
        
        // Add/remove scrolled class
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollY > 100) {
            if (scrollDelta > 0 && scrollY > 200) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
}

// Enhanced Mobile Menu
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    // Create mobile overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 49;
    `;
    document.body.appendChild(overlay);
    
    // Create mobile menu container
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.style.cssText = `
        position: fixed;
        top: 0;
        right: -100%;
        width: 280px;
        height: 100%;
        background: var(--color-surface);
        box-shadow: var(--shadow-2xl);
        transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 50;
        padding: var(--spacing-20) var(--spacing-6) var(--spacing-6);
        overflow-y: auto;
    `;
    
    // Clone nav menu items
    const mobileNavList = navMenu.cloneNode(true);
    mobileNavList.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
        list-style: none;
        margin: 0;
        padding: 0;
    `;
    
    // Style mobile menu links
    const mobileLinks = mobileNavList.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.style.cssText = `
            display: block;
            padding: var(--spacing-4);
            color: var(--color-text-primary);
            text-decoration: none;
            border-radius: var(--radius-lg);
            transition: all 0.3s ease;
            font-weight: 500;
        `;
        
        link.addEventListener('mouseenter', () => {
            link.style.background = 'var(--color-background-light)';
            link.style.transform = 'translateX(4px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.background = 'transparent';
            link.style.transform = 'translateX(0)';
        });
    });
    
    mobileMenu.appendChild(mobileNavList);
    document.body.appendChild(mobileMenu);
    
    // Toggle functionality
    function toggleMenu() {
        const isOpen = hamburger.classList.contains('active');
        
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', !isOpen);
        
        if (!isOpen) {
            // Open menu
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            mobileMenu.style.right = '0';
            document.body.style.overflow = 'hidden';
        } else {
            // Close menu
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            mobileMenu.style.right = '-100%';
            document.body.style.overflow = '';
        }
    }
    
    function closeMenu() {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        mobileMenu.style.right = '-100%';
        document.body.style.overflow = '';
    }
    
    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamburger.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close when clicking mobile menu links
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// Enhanced Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#top') {
                window.scrollTo({ 
                    top: 0, 
                    behavior: 'smooth' 
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Advanced Animation System
function initializeAnimations() {
    // Enhanced Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger effect for child elements
                const children = entry.target.querySelectorAll('[data-aos]');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('aos-animate');
                    }, index * 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in, .slide-up, [data-aos]').forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const speed = 0.5;
            
            heroSection.style.transform = `translateY(${scrolled * speed}px)`;
            ticking = false;
        }
        
        function onScrollParallax() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', onScrollParallax, { passive: true });
    }
}

// Hero Section Enhanced Animations
function initializeHeroAnimations() {
    const particles = document.querySelectorAll('.particle');
    
    // Enhanced particle animations
    particles.forEach((particle, index) => {
        const animationDuration = 6 + Math.random() * 4;
        const delay = index * 0.8;
        
        particle.style.animation = `float ${animationDuration}s ease-in-out ${delay}s infinite`;
    });
    
    // Typing animation for hero title
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        
        let index = 0;
        function typeWriter() {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
    
    // Dynamic background color shift
    const heroBackground = document.querySelector('.hero-overlay');
    if (heroBackground) {
        let hue = 0;
        
        setInterval(() => {
            hue = (hue + 1) % 360;
            const saturation = 50 + Math.sin(Date.now() * 0.001) * 10;
            const lightness = 15 + Math.sin(Date.now() * 0.0008) * 5;
            
            heroBackground.style.background = `
                linear-gradient(
                    135deg,
                    hsla(${hue}, ${saturation}%, ${lightness}%, 0.8) 0%,
                    hsla(${(hue + 60) % 360}, ${saturation}%, ${lightness}%, 0.6) 50%,
                    hsla(${(hue + 120) % 360}, ${saturation}%, ${lightness}%, 0.8) 100%
                )
            `;
        }, 100);
    }
}

// Enhanced Portfolio Filters
function initializePortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length === 0 || portfolioItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            portfolioItems.forEach((item, index) => {
                const itemCategory = item.getAttribute('data-category') || item.classList[1];
                const shouldShow = filterValue === '*' || 
                                 filterValue === itemCategory || 
                                 item.classList.contains(filterValue?.replace('.', ''));
                
                if (shouldShow) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px) scale(0.9)';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px) scale(0.9)';
                    
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Add nice feedback
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Advanced Testimonials Slider
function initializeTestimonialsSlider() {
    const slider = document.querySelector('.testimonial-slides');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (!slider || slides.length === 0) return;
    
    let currentSlide = 0;
    const slideCount = slides.length;
    let autoplayInterval;
    let isTransitioning = false;
    
    // Create dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Initialize slider
    function initSlider() {
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
        });
        updateControls();
        startAutoplay();
    }
    
    function goToSlide(index) {
        if (isTransitioning || index === currentSlide) return;
        
        isTransitioning = true;
        currentSlide = (index + slideCount) % slideCount;
        
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
        });
        
        updateControls();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    function updateControls() {
        // Update dots
        const dots = dotsContainer?.querySelectorAll('.dot');
        dots?.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update button states
        if (prevBtn) prevBtn.disabled = false;
        if (nextBtn) nextBtn.disabled = false;
    }
    
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoplay();
        startAutoplay();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoplay();
        startAutoplay();
    });
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoplay();
    }, { passive: true });
    
    slider.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    }, { passive: true });
    
    slider.addEventListener('touchend', () => {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoplay();
    }, { passive: true });
    
    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    
    initSlider();
}

// Advanced Contact Form with Validation
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const submitBtn = form.querySelector('.btn-submit');
    const successMsg = document.getElementById('form-success');
    
    // Real-time validation
    const fields = {
        name: {
            element: form.querySelector('#name'),
            validate: (value) => value.length >= 2 ? null : 'Name muss mindestens 2 Zeichen haben'
        },
        email: {
            element: form.querySelector('#email'),
            validate: (value) => {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(value) ? null : 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
            }
        },
        message: {
            element: form.querySelector('#message'),
            validate: (value) => value.length >= 10 ? null : 'Nachricht muss mindestens 10 Zeichen haben'
        },
        privacy: {
            element: form.querySelector('#privacy'),
            validate: (value) => value ? null : 'Bitte stimmen Sie der Datenschutzerklärung zu'
        }
    };
    
    // Add real-time validation
    Object.entries(fields).forEach(([key, field]) => {
        if (!field.element) return;
        
        const errorElement = document.getElementById(`${key}-error`);
        
        function validateField() {
            const value = field.element.type === 'checkbox' ? 
                         field.element.checked : 
                         field.element.value.trim();
            
            const error = field.validate(value);
            
            if (error) {
                field.element.classList.add('error');
                if (errorElement) errorElement.textContent = error;
            } else {
                field.element.classList.remove('error');
                if (errorElement) errorElement.textContent = '';
            }
            
            return !error;
        }
        
        field.element.addEventListener('blur', validateField);
        field.element.addEventListener('input', debounce(validateField, 300));
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const validations = Object.values(fields).map(field => {
            if (!field.element) return true;
            
            const value = field.element.type === 'checkbox' ? 
                         field.element.checked : 
                         field.element.value.trim();
            return !field.validate(value);
        });
        
        const isValid = validations.every(Boolean);
        
        if (!isValid) {
            showNotification('Bitte korrigieren Sie die Fehler im Formular', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual endpoint)
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success
            form.style.display = 'none';
            if (successMsg) {
                successMsg.classList.add('show');
            }
            showNotification('Vielen Dank! Ihre Nachricht wurde erfolgreich versendet.', 'success');
            
        } catch (error) {
            showNotification('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// Newsletter Form
function initializeNewsletterForm() {
    const forms = document.querySelectorAll('#newsletter-form, .newsletter-form');
    
    forms.forEach(form => {
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const submitBtn = form.querySelector('button[type="submit"]');
            
            if (!emailInput || !submitBtn) return;
            
            const email = emailInput.value.trim();
            
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein', 'error');
                return;
            }
            
            // Show loading state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Wird angemeldet...';
            submitBtn.disabled = true;
            
            try {
                // Simulate newsletter signup
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                emailInput.value = '';
                showNotification('Vielen Dank! Sie wurden erfolgreich für den Newsletter angemeldet.', 'success');
                
            } catch (error) {
                showNotification('Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    });
}

// Enhanced Back to Top Button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    let ticking = false;
    
    function updateButton() {
        const scrolled = window.pageYOffset;
        const threshold = window.innerHeight * 0.5;
        
        if (scrolled > threshold) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
        
        // Add progress indicator
        const progress = Math.min(scrolled / (document.body.scrollHeight - window.innerHeight), 1);
        backToTopBtn.style.background = `conic-gradient(var(--color-accent) ${progress * 360}deg, rgba(255,255,255,0.2) 0deg)`;
        
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateButton);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Add click animation
        backToTopBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            backToTopBtn.style.transform = 'scale(1)';
        }, 150);
    });
}

// Enhanced Cookie Banner
function initializeCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const essentialBtn = document.getElementById('essential-cookies');
    
    if (!banner) return;
    
    // Check if consent already given
    const cookieConsent = localStorage.getItem('cookieConsent');
    const consentTime = localStorage.getItem('cookieConsentTime');
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    // Show banner if no consent or consent is older than 30 days
    if (!cookieConsent || (consentTime && parseInt(consentTime) < thirtyDaysAgo)) {
        setTimeout(() => {
            banner.style.display = 'block';
            banner.style.animation = 'slideInUp 0.5s ease-out forwards';
        }, 2000);
    }
    
    function setCookieConsent(level) {
        localStorage.setItem('cookieConsent', level);
        localStorage.setItem('cookieConsentTime', Date.now().toString());
        
        banner.style.animation = 'slideInUp 0.3s ease-in reverse forwards';
        setTimeout(() => {
            banner.style.display = 'none';
        }, 300);
        
        showNotification(`Cookie-Einstellungen gespeichert: ${level}`, 'success');
        
        // Initialize analytics if full consent given
        if (level === 'all') {
            initializeAnalytics();
        }
    }
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => setCookieConsent('all'));
    }
    
    if (essentialBtn) {
        essentialBtn.addEventListener('click', () => setCookieConsent('essential'));
    }
}

// Counter Animations for Stats
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const start = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function
                    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(easeOutCubic * target);
                    
                    counter.textContent = current.toLocaleString('de-DE');
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString('de-DE');
                    }
                }
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Lightbox System
function initializeLightbox() {
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    const lightboxCurrent = document.querySelector('.lightbox-current');
    const lightboxTotal = document.querySelector('.lightbox-total');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    
    if (!lightboxModal || lightboxTriggers.length === 0) return;
    
    let currentIndex = 0;
    let lightboxItems = Array.from(lightboxTriggers);
    
    // Initialize lightbox
    function openLightbox(index) {
        currentIndex = index;
        const item = lightboxItems[currentIndex];
        
        if (!item) return;
        
        const imageSrc = item.getAttribute('href');
        const title = item.getAttribute('data-title') || '';
        const description = item.getAttribute('data-description') || '';
        
        // Set content
        lightboxImage.src = imageSrc;
        lightboxImage.alt = title;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDescription) lightboxDescription.textContent = description;
        if (lightboxCurrent) lightboxCurrent.textContent = currentIndex + 1;
        if (lightboxTotal) lightboxTotal.textContent = lightboxItems.length;
        
        // Show modal
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        lightboxClose.focus();
    }
    
    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to the trigger that opened the lightbox
        if (lightboxItems[currentIndex]) {
            lightboxItems[currentIndex].focus();
        }
    }
    
    function nextImage() {
        currentIndex = (currentIndex + 1) % lightboxItems.length;
        openLightbox(currentIndex);
    }
    
    function prevImage() {
        currentIndex = (currentIndex - 1 + lightboxItems.length) % lightboxItems.length;
        openLightbox(currentIndex);
    }
    
    // Event listeners
    lightboxTriggers.forEach((trigger, index) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevImage);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextImage);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextImage();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevImage();
                break;
        }
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightboxModal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    lightboxModal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - next image
                nextImage();
            } else {
                // Swiped right - previous image
                prevImage();
            }
        }
    }
    
    // Preload adjacent images for smooth navigation
    function preloadImage(index) {
        if (lightboxItems[index]) {
            const img = new Image();
            img.src = lightboxItems[index].getAttribute('href');
        }
    }
    
    // Enhanced image loading with error handling
    lightboxImage.addEventListener('load', () => {
        // Preload next and previous images
        preloadImage((currentIndex + 1) % lightboxItems.length);
        preloadImage((currentIndex - 1 + lightboxItems.length) % lightboxItems.length);
    });
    
    lightboxImage.addEventListener('error', () => {
        if (lightboxTitle) lightboxTitle.textContent = 'Fehler beim Laden des Bildes';
        if (lightboxDescription) lightboxDescription.textContent = 'Das Bild konnte nicht geladen werden.';
    });
}

// Performance Optimizations
function initializePerformanceOptimizations() {
    // Lazy load images with fade-in effect
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.src = img.dataset.src;
                img.onload = () => {
                    img.style.opacity = '1';
                    img.style.transition = 'opacity 0.3s ease';
                };
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    const criticalResources = [
        '/assets/img/header-1200.webp',
        '/assets/img/author-mark.webp'
    ];
    
    criticalResources.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    // Service Worker registration for caching
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
                    .then(() => {
            // Service Worker registered successfully
        })
        .catch(err => {
            // Service Worker registration failed
        });
    }
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: var(--spacing-4) var(--spacing-6);
        background: ${type === 'success' ? 'var(--color-success)' : 
                   type === 'error' ? 'var(--color-error)' : 
                   'var(--color-primary)'};
        color: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function initializeAnalytics() {
    // Google Analytics or other analytics initialization

    
    // Track page view
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
}

// Performance monitoring
(function() {
    // Monitor performance metrics
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {

                }
                if (entry.entryType === 'first-input') {

                }
            }
        });
        
        observer.observe({entryTypes: ['largest-contentful-paint', 'first-input']});
    }
    
    // Track Core Web Vitals
    window.addEventListener('load', () => {
        setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];

        }, 0);
    });
})();

// Export for external use
window.MarkTietzPhotography = {
    showNotification,
    debounce,
    throttle
}; 
