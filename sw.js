// Service Worker for HealthCare Portal PWA
const CACHE_NAME = 'healthcare-portal-v2.0';
const APP_SHELL = [
  './',
  './index.html',
  './patient.html',
  './doctor.html',
  './admin.html',
  './login.html',
  './signup.html',
  './manifest.webmanifest',
  './assets/css/design-system.css',
  './assets/js/core-data.js',
  './assets/js/public-app.js',
  './assets/js/patient-app.js',
  './assets/js/doctor-app.js',
  './assets/js/admin-app.js',
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

// Activate Event
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

// Fetch Event
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        }).catch(() => {
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Offline: Network unavailable', { status: 503, statusText: 'Offline' });
        });
      })
    );
  } else {
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
