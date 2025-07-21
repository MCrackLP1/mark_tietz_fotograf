document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.portfolio-filters .filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-grid .portfolio-item');
    const loadMoreBtn = document.getElementById('load-more');

    // Enhanced filtering with loading states
    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Add loading state to button
                button.disabled = true;
                button.innerHTML = 'Laden...';
                
                // Deactivate all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Activate clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                portfolioItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    // Add fade out effect
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';

                    setTimeout(() => {
                        if (filterValue === 'all' || itemCategory === filterValue) {
                            item.style.display = 'block';
                            // Trigger reflow
                            item.offsetHeight;
                            // Fade in
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        } else {
                            item.style.display = 'none';
                        }
                    }, 200);
                });

                // Reset button after animation
                setTimeout(() => {
                    button.disabled = false;
                    button.innerHTML = button.getAttribute('data-original-text') || button.textContent;
                }, 400);
            });
        });

        // Store original button text
        filterButtons.forEach(btn => {
            btn.setAttribute('data-original-text', btn.textContent);
        });
    }

    // Enhanced lightbox with preloading
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxCurrent = document.querySelector('.lightbox-current');
    const lightboxTotal = document.querySelector('.lightbox-total');

    let currentIndex = 0;
    let lightboxImages = [];

    if (lightboxTriggers.length > 0) {
        // Collect all lightbox images
        lightboxImages = Array.from(lightboxTriggers).map(trigger => ({
            src: trigger.href,
            title: trigger.getAttribute('data-title'),
            description: trigger.getAttribute('data-description')
        }));

        // Update total count
        if (lightboxTotal) {
            lightboxTotal.textContent = lightboxImages.length;
        }

        // Add click handlers
        lightboxTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        // Navigation handlers
        lightboxClose?.addEventListener('click', closeLightbox);
        lightboxPrev?.addEventListener('click', () => showPrevImage());
        lightboxNext?.addEventListener('click', () => showNextImage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightboxModal?.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        closeLightbox();
                        break;
                    case 'ArrowLeft':
                        showPrevImage();
                        break;
                    case 'ArrowRight':
                        showNextImage();
                        break;
                }
            }
        });

        // Close on overlay click
        lightboxModal?.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    function openLightbox(index) {
        currentIndex = index;
        const imageData = lightboxImages[currentIndex];
        
        // Show modal
        lightboxModal?.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Show loading state
        if (lightboxImage) {
            lightboxImage.style.opacity = '0.5';
            lightboxImage.src = '';
        }
        
        // Preload image
        const img = new Image();
        img.onload = () => {
            if (lightboxImage) {
                lightboxImage.src = imageData.src;
                lightboxImage.alt = imageData.title;
                lightboxImage.style.opacity = '1';
            }
        };
        img.onerror = () => {

            if (lightboxImage) {
                lightboxImage.style.opacity = '1';
                lightboxImage.alt = 'Bild konnte nicht geladen werden';
            }
        };
        img.src = imageData.src;

        // Update content
        if (lightboxTitle) lightboxTitle.textContent = imageData.title;
        if (lightboxDescription) lightboxDescription.textContent = imageData.description;
        if (lightboxCurrent) lightboxCurrent.textContent = currentIndex + 1;
        
        // Preload adjacent images
        preloadAdjacentImages();
    }

    function closeLightbox() {
        lightboxModal?.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + lightboxImages.length) % lightboxImages.length;
        openLightbox(currentIndex);
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % lightboxImages.length;
        openLightbox(currentIndex);
    }

    function preloadAdjacentImages() {
        const prevIndex = (currentIndex - 1 + lightboxImages.length) % lightboxImages.length;
        const nextIndex = (currentIndex + 1) % lightboxImages.length;
        
        // Preload previous and next images
        [prevIndex, nextIndex].forEach(index => {
            const img = new Image();
            img.src = lightboxImages[index].src;
        });
    }

    // Load more functionality (if needed)
    loadMoreBtn?.addEventListener('click', function() {
        this.innerHTML = 'Laden...';
        this.disabled = true;
        
        // Simulate loading more content
        setTimeout(() => {
            this.innerHTML = 'Mehr laden';
            this.disabled = false;
        }, 1500);
    });

    // Add smooth scrolling to portfolio anchors
    const portfolioAnchors = document.querySelectorAll('a[href^="#"]');
    portfolioAnchors.forEach(anchor => {
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
});
