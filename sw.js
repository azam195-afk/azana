const CACHE_NAME = 'azana-cache-v1';

// Daftar semua file yang akan di-download otomatis saat pertama buka web
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
  'asset/img/globe.png',
  'manifest.json',
  'https://cdn.tailwindcss.com'
];

// Tahap Install: Download semua file di atas ke memori HP
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Sistem Azana: Sedang mendownload aset...');
      return cache.addAll(urlsToCache);
    })
  );
});

// Tahap Fetch: Ambil data dari memori kalau internet mati
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Tahap Activate: Bersihkan cache lama kalau ada versi baru
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
