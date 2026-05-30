# Audit Report AZANA DESIGN

## Struktur lama
- Root berisi semua HTML, komponen, service worker, manifest, robots, sitemap, APK, dan folder `asset/` serta `portfolio/`.
- CSS dan JavaScript banyak berada inline di setiap halaman.
- API key pihak ketiga tersimpan dalam `asset/js/api-config.js`.

## Temuan utama
- Struktur folder belum modular.
- Ada dependency runtime CDN Tailwind untuk produksi.
- Ada hardcoded secret/API key di JavaScript publik.
- Ada pola `innerHTML` untuk komponen dan error yang berisiko jika sumber tidak tepercaya.
- Halaman Contact dan Disclaimer belum tersedia.
- Path asset lama tidak konsisten (`asset/img`, `portfolio`, `apks`).
- Service worker masih melakukan precache path lama.
- Beberapa gambar belum lazy-loaded dan belum memakai dimensi eksplisit.
- Inline CSS/JS berulang di banyak halaman.

## Perbaikan
- Refactor ke folder `assets`, `css`, `js`, `components`, `pages`, `data`, `docs`, dan `public`.
- Tambah halaman Contact dan Disclaimer.
- Pisahkan API service, config, prompt manager, rate limiter, dan script per halaman.
- Hapus file legacy dengan API key hardcoded.
- Update sitemap, robots, manifest, dan service worker.
- Hilangkan Tailwind CDN dari halaman dan gunakan CSS lokal modular.
