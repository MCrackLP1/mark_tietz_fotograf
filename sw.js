const CACHE_NAME = 'mark-tietz-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/js/main.js',
  '/js/portfolio.js',
  '/js/performance.js',
  '/js/enhanced-interactions.js',
  '/css/visibility-improvements.css',
  '/css/enhanced-animations.css',
  '/assets/img/photographer-hero.webp',
  '/assets/img/author-mark.webp',
  '/assets/img/og-image.svg',
  '/assets/img/twitter-card.svg'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {

        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Fetch and cache new resources
        return fetch(event.request).then(function(response) {
          // Don't cache if not a successful response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          var responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(function(cache) {
              // Cache images and static assets
              if (event.request.url.match(/\.(png|jpg|jpeg|webp|svg|css|js)$/)) {
                cache.put(event.request, responseToCache);
              }
            });
          
          return response;
        });
      }
    )
  );
}); 
