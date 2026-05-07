const CACHE_NAME = 'azana-v6';
const assets = [
  './',
  'index.html',
  'manifest.json',
  'components/navbar.html',
  'components/footer-ai.html',
  'components/footer-main.html',
  'asset/img/globe.png',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Teknik map ini biar kalau satu file gagal download, 
      // proses install PWA-nya tetep lanjut jalan
      return Promise.all(
        assets.map(url => {
          return cache.add(url).catch(err => console.log('Aset skip (error/404):', url));
        })
      );
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
