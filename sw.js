const CACHE_NAME = 'azana-cache-v8'; // Gue naikin ke v8 biar fresh

// Daftar semua file (Tanpa Tailwind dan Folder sudah 'asset')
const urlsToCache = [
  './',
  'index.html',
  'blogs.html',
  'offline.html',
  'penjernih.html',
  'eraser.html',
  'removebg.html',
  'privacy-policy.html',
  'terms.html',
  'about.html',
  'artikel1.html',
  'artikel2.html',
  'artikel3.html',
  'components/navbar.html',
  'components/footer-main.html',
  'asset/img/41955.png', 
  'asset/img/globe.png',
  'manifest.json'
];

// Tahap Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Sistem Azana: Sedang mendownload aset...');
      return cache.addAll(urlsToCache);
    })
  );
});

// Tahap Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Tahap Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Menghapus cache lama...');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
