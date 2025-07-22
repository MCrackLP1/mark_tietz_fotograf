document.addEventListener('DOMContentLoaded', function() {
    const portfolioTiles = document.querySelectorAll('.portfolio-grid-minimal .portfolio-tile');

    // Initialize portfolio tiles visibility
    if (portfolioTiles.length > 0) {
        portfolioTiles.forEach(tile => {
            tile.style.opacity = '1';
            tile.style.transform = 'scale(1)';
            tile.style.display = 'block';
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

    // Image loading enhancement
    const portfolioImages = document.querySelectorAll('.portfolio-tile img');
    portfolioImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
});
