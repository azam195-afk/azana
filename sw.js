const CACHE_NAME = 'azana-cache-v4'; // Versi v4 agar browser update otomatis
const ASSETS_TO_CACHE = [
  'offline.html',
  'index.html',
  '41955.png' // Pastikan file logo.png ada di folder yang sama
];

// Tahap Install: Simpan logo dan file utama ke memori browser
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Azana Cache: Menyimpan aset...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Tahap Aktivasi: Hapus versi cache lama (v1, v2, v3)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Tahap Fetch: Mengambil data dari internet, jika gagal ambil dari Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        // Jika file diminta ada di cache (seperti logo.png), tampilkan
        if (response) {
          return response;
        }
        // Jika navigasi halaman gagal (offline), berikan game tetris
        if (event.request.mode === 'navigate') {
          return caches.match('offline.html');
        }
      });
    })
  );
});
