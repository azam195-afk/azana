const CACHE_NAME = 'azana-cache-v1';
const ASSETS_TO_CACHE = [
  'offline.html',
  'index.html',
  '41955.png' // Ganti sesuai nama file logo kamu, atau hapus baris ini kalau gak ada
];

// Tahap Install: Simpan semua aset ke memori
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Kita pakai .addAll untuk borongan simpan filenya
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Tahap Fetch tetap sama seperti sebelumnya
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('offline.html');
      })
    );
  }
});
