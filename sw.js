const CACHE_NAME = 'azana-v11'; // Ganti v11 biar bener-bener reset
const assets = [
  './',
  'index.html',
  'manifest.json',
  'offline.html',
  'asset/img/41955.png',
  'asset/img/globe.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
