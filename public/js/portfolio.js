document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.portfolio-filters .filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-grid .portfolio-item');
    const loadMoreBtn = document.getElementById('load-more');

    // Initialize portfolio items visibility
    if (portfolioItems.length > 0) {
        portfolioItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
            item.style.display = 'block';
        });
    }

    // No filtering - all portfolio items are always visible

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
