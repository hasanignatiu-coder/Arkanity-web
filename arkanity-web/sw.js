const CACHE_NAME = 'arkanity-v2';  // ← Changed version to force cache update
const urlsToCache = [
    '/',
    '/css/tailwind.min.css',
    '/css/styles.css',
    // '/js/main.js',  ← REMOVED - We don't use this anymore
    '/js/translations.js',  // ← Keep this one
    '/og-image.png',
    '/manifest.json',
    '/favicon.ico',
    '/success.html'  // ← Added the success page
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())  // ← Force activation immediately
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())  // ← Take control immediately
    );
});
