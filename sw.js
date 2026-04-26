const CACHE_NAME = 'azana-cache-v1';
const OFFLINE_URL = 'offline.html';

// Tahap Install: Simpan halaman game ke memori browser
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([OFFLINE_URL]);
    })
  );
});

// Tahap Fetch: Cek koneksi, jika gagal (offline), kasih halaman game
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
