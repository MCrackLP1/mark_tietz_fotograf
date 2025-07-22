/**
 * Portfolio Masonry Layout Enhancement
 * Erkennt Bildformate automatisch und optimiert das Layout
 */

class PortfolioMasonry {
  constructor() {
    this.portfolioGrid = document.querySelector('.portfolio-grid');
    this.portfolioItems = document.querySelectorAll('.portfolio-item');
    this.imagesLoaded = 0;
    this.totalImages = 0;
    
    if (!this.portfolioGrid) return;
    
    this.init();
  }
  
  init() {
    this.countImages();
    this.setupImageLoading();
    this.detectImageFormats();
    this.setupResizeHandler();
    this.addMasonryEnhancement();
  }
  
  countImages() {
    this.totalImages = this.portfolioItems.length;
  }
  
  setupImageLoading() {
    this.portfolioItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (!img) return;
      
      // Add loading class initially
      img.classList.add('loading');
      
      if (img.complete) {
        this.handleImageLoad(img, item, index);
      } else {
        img.addEventListener('load', () => {
          this.handleImageLoad(img, item, index);
        });
        
        img.addEventListener('error', () => {
          console.warn('Image failed to load:', img.src);
          this.handleImageLoad(img, item, index);
        });
      }
    });
  }
  
  handleImageLoad(img, item, index) {
    this.imagesLoaded++;
    
    // Remove loading state
    img.classList.remove('loading');
    img.classList.add('loaded');
    
    // Detect and apply format class
    this.detectSingleImageFormat(img, item);
    
    // Trigger layout update
    this.updateLayout();
    
    // Show item with animation
    setTimeout(() => {
      item.classList.add('masonry-visible');
      item.classList.remove('masonry-hidden');
    }, index * 100); // Staggered animation
    
    // Check if all images are loaded
    if (this.imagesLoaded === this.totalImages) {
      this.onAllImagesLoaded();
    }
  }
  
  detectSingleImageFormat(img, item) {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    
    // Remove existing format classes
    item.classList.remove('portrait', 'landscape', 'square');
    
    // Classify based on aspect ratio
    if (aspectRatio < 0.8) {
      // Hochformat
      item.classList.add('portrait');
      item.setAttribute('data-aspect-ratio', `portrait-${aspectRatio.toFixed(2)}`);
    } else if (aspectRatio > 1.3) {
      // Querformat
      item.classList.add('landscape');
      item.setAttribute('data-aspect-ratio', `landscape-${aspectRatio.toFixed(2)}`);
    } else {
      // Quadratisch oder nahezu quadratisch
      item.classList.add('square');
      item.setAttribute('data-aspect-ratio', `square-${aspectRatio.toFixed(2)}`);
    }
    
    // Additional size classifications for more variety
    const imageArea = img.naturalWidth * img.naturalHeight;
    const megapixels = imageArea / 1000000;
    
    if (megapixels > 8) {
      item.classList.add('size-xlarge');
    } else if (megapixels > 4) {
      item.classList.add('size-large');
    } else if (megapixels > 2) {
      item.classList.add('size-medium');
    } else {
      item.classList.add('size-small');
    }
  }
  
  detectImageFormats() {
    // Initially hide all items for smooth reveal
    this.portfolioItems.forEach(item => {
      item.classList.add('masonry-hidden');
    });
  }
  
  updateLayout() {
    // Force browser to recalculate layout
    if (this.portfolioGrid) {
      this.portfolioGrid.style.display = 'none';
      this.portfolioGrid.offsetHeight; // Trigger reflow
      this.portfolioGrid.style.display = '';
    }
  }
  
  onAllImagesLoaded() {
    console.log('All portfolio images loaded');
    this.portfolioGrid.classList.add('js-masonry-loaded');
    
    // Final layout optimization
    this.optimizeLayout();
  }
  
  optimizeLayout() {
    // Calculate optimal grid row spans based on actual image dimensions
    this.portfolioItems.forEach(item => {
      const img = item.querySelector('img');
      if (!img || !img.complete) return;
      
      const imageHeight = img.naturalHeight;
      const imageWidth = img.naturalWidth;
      const aspectRatio = imageWidth / imageHeight;
      
      // Calculate grid rows needed based on natural image ratio
      const containerWidth = 280; // Updated! Base width from CSS
      const naturalDisplayHeight = containerWidth / aspectRatio;
      const gridRowHeight = 15; // Updated! From CSS grid-auto-rows
      const padding = 15; // Updated! Gap from CSS
      
      const rowSpan = Math.ceil((naturalDisplayHeight + padding) / gridRowHeight);
      
      // Apply calculated span - PROFESSIONAL COMPACT VALUES!
      item.style.gridRowEnd = `span ${Math.max(10, Math.min(22, rowSpan))}`;
    });
  }
  
  setupResizeHandler() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.updateLayout();
        this.optimizeLayout();
      }, 250);
    });
  }
  
  addMasonryEnhancement() {
    // Check for native CSS Grid Masonry support
    if (CSS.supports('grid-template-rows', 'masonry')) {
      console.log('Native CSS Grid Masonry supported');
      this.portfolioGrid.classList.add('native-masonry');
      return;
    }
    
    // Check for CSS Grid support
    if (CSS.supports('display', 'grid')) {
      console.log('Using CSS Grid masonry simulation');
      this.portfolioGrid.classList.add('grid-masonry');
    } else {
      // Fallback to CSS columns
      console.log('Falling back to CSS columns');
      this.portfolioGrid.classList.add('masonry-columns');
    }
  }
  
  // Public method to refresh layout (useful for dynamic content)
  refresh() {
    this.imagesLoaded = 0;
    this.portfolioItems = document.querySelectorAll('.portfolio-item');
    this.totalImages = this.portfolioItems.length;
    this.setupImageLoading();
    this.detectImageFormats();
  }
  
  // Method to add new portfolio items dynamically
  addItems(newItems) {
    newItems.forEach(item => {
      this.portfolioGrid.appendChild(item);
    });
    this.refresh();
  }
}

// Utility functions for image analysis
const ImageAnalyzer = {
  getAspectRatio(img) {
    return img.naturalWidth / img.naturalHeight;
  },
  
  isPortrait(img) {
    return this.getAspectRatio(img) < 0.8;
  },
  
  isLandscape(img) {
    return this.getAspectRatio(img) > 1.3;
  },
  
  isSquare(img) {
    const ratio = this.getAspectRatio(img);
    return ratio >= 0.8 && ratio <= 1.3;
  },
  
  getImageSize(img) {
    const area = img.naturalWidth * img.naturalHeight;
    const megapixels = area / 1000000;
    
    if (megapixels > 8) return 'xlarge';
    if (megapixels > 4) return 'large';
    if (megapixels > 2) return 'medium';
    return 'small';
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for images to start loading
  setTimeout(() => {
    window.portfolioMasonry = new PortfolioMasonry();
  }, 100);
});

// Also initialize if script loads after DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      window.portfolioMasonry = new PortfolioMasonry();
    }, 100);
  });
} else {
  // DOM is already ready
  setTimeout(() => {
    window.portfolioMasonry = new PortfolioMasonry();
  }, 100);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioMasonry, ImageAnalyzer };
} 