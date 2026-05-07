const CACHE_NAME = 'azana-cache-v1';
// Daftar file yang mau disimpan biar pas offline tetep muncul
const urlsToCache = [
  '/',
  '/index.html',
  '/blogs.html',
  '/offline.html',
  '/penjernih.html',
  '/eraser.html',
  '/removebg.html',
  '/privacy-policy.html',
  '/terms.html',
  '/about.html',
  '/artikel1.html',
  '/artikel2.html',
  '/artikel3.html',
  '/components/navbar.html',
  '/components/footer-main.html',
  '/assets/img/41955.png',
  'https://cdn.tailwindcss.com',
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ambil data dari Cache pas Offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Balikin file dari cache kalau ada, kalau nggak ambil dari internet
        return response || fetch(event.request);
      })
  );
});

// Update Service Worker kalau ada perubahan
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
