# AZANA DESIGN

Website statis produksi untuk studio desain digital dan tools AI gambar.

## Struktur
- `assets/` menyimpan gambar, ikon, logo, video, audio, font, dan portfolio.
- `css/` berisi base, layout, component, page, dan theme stylesheet.
- `js/` berisi core app, API service, module halaman, dan utility.
- `components/` berisi navbar, footer, sidebar, card, modal, dan widget reusable.
- `pages/`, `data/`, `docs/`, dan `public/` disiapkan untuk konten, konfigurasi, dokumentasi, dan file publik.

## API key
Jangan commit API key ke repository. Untuk demo lokal, masukkan key melalui localStorage browser:

```js
localStorage.setItem('REMOVE_BG_API_KEY', '...');
localStorage.setItem('CLIPDROP_API_KEY', '...');
localStorage.setItem('GEMINI_API_KEY', '...');
```

Untuk production, gunakan backend/serverless proxy dengan environment variable.

## Production checklist
- Jalankan validasi link dan syntax sebelum deploy.
- Simpan secret API di backend/serverless proxy, bukan file statis.
- Aktifkan kompresi Brotli/Gzip di hosting.
- Gunakan cache header panjang untuk `assets/`, `css/`, dan `js/`.
