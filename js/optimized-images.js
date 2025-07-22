/**
 * Optimized Images JavaScript
 * Erweiterte Funktionalität für optimierte Bilder
 */

class OptimizedImageLoader {
  constructor() {
    this.imageObserver = null;
    this.prefetchedImages = new Set();
    this.init();
  }

  init() {
    // Warte bis DOM geladen ist
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupImageLoading());
    } else {
      this.setupImageLoading();
    }
  }

  setupImageLoading() {
    this.setupIntersectionObserver();
    this.setupLazyLoading();
    this.preloadCriticalImages();
    this.setupImageErrorHandling();
    this.setupHoverPrefetch();
  }

  setupIntersectionObserver() {
    // Moderner Intersection Observer für Lazy Loading
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px', // Lade Bilder 50px bevor sie sichtbar werden
        threshold: 0.01
      });
    }
  }

  setupLazyLoading() {
    // Alle lazy loading Bilder finden und beobachten
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if (this.imageObserver) {
      lazyImages.forEach(img => {
        this.imageObserver.observe(img);
      });
    } else {
      // Fallback für ältere Browser
      lazyImages.forEach(img => this.loadImage(img));
    }
  }

  loadImage(img) {
    if (img.complete || img.classList.contains('loaded')) return;

    img.addEventListener('load', () => {
      img.classList.add('loaded');
      this.fadeInImage(img);
    }, { once: true });

    img.addEventListener('error', () => {
      this.handleImageError(img);
    }, { once: true });

    // Trigger das Laden
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  }

  fadeInImage(img) {
    img.style.transition = 'opacity 0.3s ease-in-out';
    img.style.opacity = '1';
  }

  preloadCriticalImages() {
    // Hero-Bilder und above-the-fold Bilder preloaden
    const criticalImages = [
      'assets/img/portfolio/photographer-hero-desktop.webp',
      'assets/img/portfolio/photographer-hero-large.webp'
    ];

    criticalImages.forEach(src => this.preloadImage(src));
  }

  preloadImage(src) {
    if (this.prefetchedImages.has(src)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
    
    this.prefetchedImages.add(src);
  }

  setupImageErrorHandling() {
    // Globaler Error Handler für Bilder
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG') {
        this.handleImageError(e.target);
      }
    }, true);
  }

  handleImageError(img) {
    console.warn(`Bild konnte nicht geladen werden: ${img.src}`);
    
    // Versuche WebP fallback wenn AVIF fehlschlägt
    if (img.src.includes('.avif')) {
      const webpSrc = img.src.replace('.avif', '.webp');
      img.src = webpSrc;
      return;
    }
    
    // Zeige Placeholder
    img.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)';
    img.style.minHeight = '200px';
    img.alt = 'Bild nicht verfügbar';
  }

  setupHoverPrefetch() {
    // Prefetch Bilder bei Hover über Portfolio-Items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const img = item.querySelector('img');
        if (img && img.src) {
          // Preload die große Version für Lightbox
          const largeSrc = img.src.replace('-medium.webp', '-large.webp');
          this.preloadImage(largeSrc);
        }
      });
    });
  }

  // Utility: Check if browser supports format
  supportsFormat(format) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    switch (format) {
      case 'webp':
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      case 'avif':
        return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
      default:
        return false;
    }
  }

  // Performance monitoring
  getImagePerformanceStats() {
    if (!window.performance || !window.performance.getEntriesByType) return null;

    const imageEntries = performance.getEntriesByType('resource')
      .filter(entry => entry.initiatorType === 'img');

    const stats = {
      totalImages: imageEntries.length,
      totalSize: imageEntries.reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
      averageLoadTime: imageEntries.reduce((sum, entry) => sum + entry.duration, 0) / imageEntries.length,
      slowestImage: imageEntries.reduce((slowest, entry) => 
        entry.duration > (slowest?.duration || 0) ? entry : slowest, null)
    };

    return stats;
  }
}

// Utility Funktionen
const ImageUtils = {
  // Berechne optimale Bildgröße basierend auf Container
  getOptimalImageSize(container) {
    const containerWidth = container.offsetWidth;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    if (containerWidth * devicePixelRatio <= 400) return 'small';
    if (containerWidth * devicePixelRatio <= 800) return 'medium';
    return 'large';
  },

  // Format-Detection für Browser
  getSupportedFormats() {
    const formats = ['avif', 'webp', 'jpg'];
    const supported = [];
    
    formats.forEach(format => {
      if (this.supportsFormat(format)) {
        supported.push(format);
      }
    });
    
    return supported;
  },

  // Responsive Image URL Generator
  generateResponsiveUrl(basePath, size = 'medium', format = 'webp') {
    const pathParts = basePath.split('.');
    const extension = pathParts.pop();
    const baseUrl = pathParts.join('.');
    
    return `${baseUrl}-${size}.${format}`;
  }
};

// Progressive Web App Features
if ('serviceWorker' in navigator) {
  // Cache optimierte Bilder
  navigator.serviceWorker.ready.then(registration => {
    if (registration.active) {
      // Sende Liste der kritischen Bilder an Service Worker
      registration.active.postMessage({
        type: 'CACHE_CRITICAL_IMAGES',
        images: [
          'assets/img/portfolio/photographer-hero-medium.webp',
          'assets/img/author-mark-medium.webp'
        ]
      });
    }
  });
}

// Initialize when DOM is ready
const optimizedImageLoader = new OptimizedImageLoader();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OptimizedImageLoader, ImageUtils };
}

// Debug-Funktionen für Development
if (window.location.hostname === 'localhost') {
  window.imageStats = () => optimizedImageLoader.getImagePerformanceStats();
  window.imageFormats = () => ImageUtils.getSupportedFormats();
  
  console.log('🖼️ Optimized Images System geladen');
  console.log('📊 Nutze imageStats() für Performance-Daten');
  console.log('🎨 Nutze imageFormats() für unterstützte Formate');
} 