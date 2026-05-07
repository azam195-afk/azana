const CACHE_NAME = 'azana-v2'; // Ganti v1 ke v2 biar browser anggap ini file baru
const assets = [
  './',
  'index.html',
  'manifest.json',
  'offline.html',
  'components/navbar.html',
  'components/footer-main.html',
  'assets/img/globe.png', // Ikon utama aja
  'https://cdn.tailwindcss.com'
];

  'manifest.json'
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
