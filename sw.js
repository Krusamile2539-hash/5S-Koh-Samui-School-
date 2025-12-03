
// Define a cache name
// Updated to v27 for full schedule coverage
const CACHE_NAME = '5s-koh-samui-cache-v27';

// List of files to cache
const urlsToCache = [
  '/',
  '/index.html',
];

// Install event: fires when the service worker is first installed.
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

// Fetch event: fires for every network request.
self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For navigation requests (to html pages), use a network-first strategy
  // to ensure users always get the latest page, with a fallback to cache.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // For other requests (scripts, images from our origin), use a cache-first strategy.
  // This is good for performance.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network, and cache it for next time.
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              if (!networkResponse.url.includes('firestore')) { // Don't cache firestore requests
                 return networkResponse;
              }
            }

            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                // Don't cache Firestore API calls or external CDNs aggressively if not needed
                if (!event.request.url.includes('firestore.googleapis.com')) {
                   cache.put(event.request, responseToCache);
                }
              });

            return networkResponse;
          }
        );
      })
      .catch(() => {
          // If both cache and network fail
      })
  );
});

// Activate event: fires when the service worker is activated.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
