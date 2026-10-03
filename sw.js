// Service Worker for HealthCare Portal PWA
const CACHE_NAME = 'healthcare-portal-v1.2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/design-system.css',
  './assets/js/app.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/icon.svg',
  './images/doctor 1.jpg',
  './images/doctor 2.jpg',
  './images/doctor 3.jpg',
  './images/doctor 4.jpg',
  './images/doctor 5.jpg',
  './images/doctor 6.jpg'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - clean up obsolete caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate & Cache Fallback
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET and cross-origin analytics/CDNs if necessary, or cache CDN fonts/Leaflet
  if (request.method !== 'GET') return;

  if (url.origin === location.origin) {
    // For local app shell requests: Cache first, fallback to network
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidate in background
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {
            // Offline - cached response is already returned
          });
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        }).catch(() => {
          // If offline and requesting navigation, return index.html
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Offline: Network unavailable', { status: 503, statusText: 'Offline' });
        });
      })
    );
  } else {
    // CDN or external resources (e.g. Leaflet, Lucide, Google Fonts)
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        }).catch(() => {
          return cachedResponse || new Response('Offline resource unavailable', { status: 503 });
        });
      })
    );
  }
});
