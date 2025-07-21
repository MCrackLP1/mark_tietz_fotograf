// Enhanced Interactions for Mark Tietz Photography Website
// Performance-optimized animations and interactions

(function() {
    'use strict';
    
    let isInitialized = false;
    
    // Initialize enhanced interactions when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        if (isInitialized) return;
        isInitialized = true;
        
        initScrollRevealAnimations();
        initCustomCursor();
        initParallaxElements();
        initEnhancedHovers();
        initSmoothScrolling();
        initBackgroundPatterns();
        initImageLoadingStates();
        initMicroInteractions();
        

    });
    
    // Scroll reveal animations using Intersection Observer
    function initScrollRevealAnimations() {
        // Only run if user hasn't requested reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Add visible class with a small delay for smoother effect
                    requestAnimationFrame(() => {
                        element.classList.add('visible');
                    });
                    
                    // Handle staggered children
                    if (element.classList.contains('stagger-children')) {
                        const children = element.querySelectorAll('.animate-fade-up, .animate-slide-in-left, .animate-slide-in-right, .animate-scale-in');
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('visible');
                            }, index * 100);
                        });
                    }
                    
                    animationObserver.unobserve(element);
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.animate-fade-up, .animate-slide-in-left, .animate-slide-in-right, .animate-scale-in'
        );
        
        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }
    
    // Custom cursor for desktop - DISABLED
    function initCustomCursor() {
        // Custom cursor disabled per user request
        return;
    }
    
    // Subtle parallax effects
    function initParallaxElements() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;
        
        let ticking = false;
        
        function updateParallax() {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                el.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // Enhanced hover interactions
    function initEnhancedHovers() {
        // Service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.willChange = 'transform, box-shadow';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.willChange = 'auto';
            });
        });
        
        // Portfolio items
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.willChange = 'transform, box-shadow';
                
                // Add subtle tilt effect
                this.addEventListener('mousemove', handleTilt);
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.willChange = 'auto';
                this.style.transform = '';
                this.removeEventListener('mousemove', handleTilt);
            });
        });
        
        function handleTilt(e) {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        }
    }
    
    // Enhanced smooth scrolling with easing
    function initSmoothScrolling() {
        const anchors = document.querySelectorAll('a[href^="#"]');
        
        anchors.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#' || href === '#top') {
                    e.preventDefault();
                    smoothScrollTo(0, 800);
                    return;
                }
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    smoothScrollTo(targetPosition, 800);
                }
            });
        });
    }
    
    // Smooth scroll function with easing
    function smoothScrollTo(target, duration) {
        const start = window.pageYOffset;
        const distance = target - start;
        const startTime = performance.now();
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        function animation(currentTime) {
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, start, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    // Animated background patterns
    function initBackgroundPatterns() {
        // Add animated background to testimonials section
        const testimonialsSection = document.querySelector('.testimonials-section');
        if (testimonialsSection) {
            testimonialsSection.classList.add('animated-bg-pattern');
        }
        
        // Add floating elements to hero
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const existingParticles = heroSection.querySelectorAll('.particle');
            existingParticles.forEach(particle => {
                particle.classList.add('floating-element');
            });
        }
    }
    
    // Enhanced image loading states
    function initImageLoadingStates() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        images.forEach(img => {
            // Add skeleton loading while image loads
            if (!img.complete) {
                img.classList.add('image-skeleton');
                
                img.addEventListener('load', function() {
                    this.classList.remove('image-skeleton');
                    this.style.opacity = '0';
                    this.style.transition = 'opacity 0.5s ease';
                    
                    // Fade in effect
                    requestAnimationFrame(() => {
                        this.style.opacity = '1';
                    });
                }, { once: true });
                
                img.addEventListener('error', function() {

                    this.classList.remove('image-skeleton');
                    
                    // Show placeholder for failed images
                    this.style.backgroundColor = '#f0f0f0';
                    this.style.color = '#999';
                    this.style.display = 'flex';
                    this.style.alignItems = 'center';
                    this.style.justifyContent = 'center';
                    this.style.fontSize = '14px';
                    this.style.minHeight = '200px';
                    this.alt = 'Bild konnte nicht geladen werden';
                    
                    // Try alternative URL format for Unsplash
                    if (this.src.includes('unsplash.com') && !this.dataset.retried) {
                        this.dataset.retried = 'true';
                        const newUrl = this.src.replace('?w=800', '?w=800&fit=crop&crop=center');
                        setTimeout(() => {
                            this.src = newUrl;
                        }, 1000);
                    }
                }, { once: true });
            }
        });
        
        // Force load images that might be stuck
        setTimeout(() => {
            images.forEach(img => {
                if (!img.complete && img.src.includes('unsplash.com')) {
                    // Add referrerpolicy to help with CORS
                    img.referrerPolicy = 'no-referrer';
                    // Force reload
                    const src = img.src;
                    img.src = '';
                    img.src = src;
                }
            });
        }, 2000);
    }
    
    // Micro-interactions
    function initMicroInteractions() {
        // Button ripple effect on click
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: absolute;
                    top: ${y}px;
                    left: ${x}px;
                    width: ${size}px;
                    height: ${size}px;
                    background: rgba(255, 255, 255, 0.6);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
            });
        });
        
        // Add CSS for ripple animation
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Form focus enhancements
        const formInputs = document.querySelectorAll('input, textarea, select');
        
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                const label = this.parentNode.querySelector('label');
                if (label) {
                    label.style.transform = 'translateY(-2px)';
                    label.style.color = 'var(--color-accent)';
                }
            });
            
            input.addEventListener('blur', function() {
                const label = this.parentNode.querySelector('label');
                if (label && !this.value) {
                    label.style.transform = '';
                    label.style.color = '';
                }
            });
        });
        
        // Loading states for forms
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const submitBtn = this.querySelector('[type="submit"]');
                
                if (submitBtn && !submitBtn.disabled) {
                    // Add loading animation
                    submitBtn.style.position = 'relative';
                    submitBtn.style.overflow = 'hidden';
                    
                    const loader = document.createElement('div');
                    loader.className = 'form-submit-loader';
                    loader.style.cssText = `
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 20px;
                        height: 20px;
                        border: 2px solid rgba(255,255,255,0.3);
                        border-top: 2px solid rgba(255,255,255,0.8);
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    `;
                    
                    submitBtn.appendChild(loader);
                }
            });
        });
    }
    
    // Add stagger classes to appropriate elements
    document.addEventListener('DOMContentLoaded', function() {
        // Add stagger to service grid
        const serviceGrid = document.querySelector('.services-grid');
        if (serviceGrid) {
            serviceGrid.classList.add('stagger-children');
            const serviceCards = serviceGrid.querySelectorAll('.service-card');
            serviceCards.forEach(card => {
                card.classList.add('animate-scale-in');
            });
        }
        
        // Add stagger to portfolio grid
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (portfolioGrid) {
            portfolioGrid.classList.add('stagger-children');
            const portfolioItems = portfolioGrid.querySelectorAll('.portfolio-item');
            portfolioItems.forEach(item => {
                item.classList.add('animate-fade-up');
            });
        }
        
        // Add animation classes to other elements
        const aboutFeatures = document.querySelectorAll('.feature-item');
        aboutFeatures.forEach((feature, index) => {
            feature.classList.add(index % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right');
        });
        
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach(card => {
            card.classList.add('animate-scale-in');
        });
        
        // Add fade-up to section headers
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach(header => {
            header.classList.add('animate-fade-up');
        });
    });
    
    // Performance optimization: Clean up on page unload
    window.addEventListener('beforeunload', function() {
        // Clean up any remaining event listeners or intervals

    });
    
    // Resize handler for responsive behavior
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Custom cursor disabled - no resize handling needed for cursor

        }, 250);
    });
    
})(); 
