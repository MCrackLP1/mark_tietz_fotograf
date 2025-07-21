// Performance monitoring and Core Web Vitals tracking
(function() {
    'use strict';
    
    // Only run if browser supports the APIs
    if (!('PerformanceObserver' in window)) return;
    
    // Track Core Web Vitals
    function trackWebVital(name, value, id) {
        // You can send this data to analytics service
        // Performance metric: ${name}
        
        // Example: Send to Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', name, {
                custom_parameter_1: value,
                custom_parameter_2: id
            });
        }
    }
    
    // Largest Contentful Paint (LCP)
    function observeLCP() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            trackWebVital('LCP', Math.round(lastEntry.startTime), 'lcp');
        });
        
        try {
            observer.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
            // Fallback for older browsers
        }
    }
    
    // First Input Delay (FID)
    function observeFID() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                trackWebVital('FID', Math.round(entry.processingStart - entry.startTime), 'fid');
            });
        });
        
        try {
            observer.observe({ type: 'first-input', buffered: true });
        } catch (e) {
            // Fallback for older browsers
        }
    }
    
    // Cumulative Layout Shift (CLS)
    function observeCLS() {
        let clsValue = 0;
        let clsEntries = [];
        
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (!entry.hadRecentInput) {
                    clsEntries.push(entry);
                    clsValue += entry.value;
                }
            });
        });
        
        try {
            observer.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
            // Fallback for older browsers
        }
        
        // Send CLS on page unload
        window.addEventListener('beforeunload', () => {
            if (clsValue > 0) {
                trackWebVital('CLS', Math.round(clsValue * 1000) / 1000, 'cls');
            }
        });
    }
    
    // Image loading performance
    function trackImageLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        let loadedImages = 0;
        const startTime = performance.now();
        
        images.forEach((img) => {
            if (img.complete) {
                loadedImages++;
            } else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        const loadTime = performance.now() - startTime;
                        // All lazy images loaded
                    }
                });
            }
        });
    }
    
    // Initialize tracking
    document.addEventListener('DOMContentLoaded', function() {
        observeLCP();
        observeFID();
        observeCLS();
        trackImageLoading();
        
        // Track page load time
        window.addEventListener('load', function() {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                if (navigation) {
                            // Page performance metrics calculated
                }
            }, 0);
        });
    });
    
})(); 

// Image Loading Performance Optimizations
class ImageLoader {
    constructor() {
        this.initImageLoading();
        this.setupImageErrorHandling();
        this.implementProgressiveLoading();
    }

    initImageLoading() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {

                    })
                    .catch((registrationError) => {

                    });
            });
        }
    }

    setupImageErrorHandling() {
        // Add error handling for images
        document.addEventListener('DOMContentLoaded', () => {
            const images = document.querySelectorAll('img');
            
            images.forEach(img => {
                img.addEventListener('error', (e) => {

                    
                    // Add retry mechanism
                    if (!e.target.dataset.retried) {
                        e.target.dataset.retried = 'true';
                        setTimeout(() => {
                            e.target.src = e.target.src + '?retry=1';
                        }, 1000);
                    } else {
                        // Show placeholder if retry fails
                        e.target.style.background = '#f0f0f0';
                        e.target.style.display = 'flex';
                        e.target.style.alignItems = 'center';
                        e.target.style.justifyContent = 'center';
                        e.target.innerHTML = '<span style="color: #999;">Bild nicht verfügbar</span>';
                    }
                });

                // Add loading states
                img.addEventListener('load', (e) => {
                    e.target.classList.add('loaded');
                });
            });
        });
    }

    implementProgressiveLoading() {
        // Implement intersection observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe lazy images
            document.addEventListener('DOMContentLoaded', () => {
                const lazyImages = document.querySelectorAll('img[data-src]');
                lazyImages.forEach(img => {
                    imageObserver.observe(img);
                });
            });
        }
    }

    // Add connection-aware loading
    adaptToConnection() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            // Reduce image quality on slow connections
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                const images = document.querySelectorAll('img[src*="unsplash.com"]');
                images.forEach(img => {
                    // Reduce quality for slow connections
                    img.src = img.src.replace(/w=\d+/, 'w=400').replace(/q=\d+/, 'q=50');
                });
            }
        }
    }
}

// Initialize enhanced image loading
document.addEventListener('DOMContentLoaded', () => {
    new ImageLoader();
});

// Add CSS for loading states
const loadingStyles = `
    img {
        transition: opacity 0.3s ease;
    }
    
    img:not(.loaded) {
        opacity: 0.7;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }
    
    img.loaded {
        opacity: 1;
    }
    
    @keyframes loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
    
    .portfolio-item img:not(.loaded) {
        min-height: 300px;
    }
`;

// Inject loading styles
const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet); 
