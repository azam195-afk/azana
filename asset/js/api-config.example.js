// Salin file ini menjadi api-config.js saat deploy jika frontend masih perlu memanggil API pihak ketiga.
// Jangan commit file api-config.js yang berisi key asli. Solusi produksi yang paling aman tetap memakai backend/serverless proxy.
// Alternatif lokal: simpan key di localStorage dengan nama AZANA_REMOVE_BG_API_KEY dan AZANA_CLIPDROP_API_KEY.
window.AZANA_API_KEYS = {
  REMOVE_BG: '',
  CLIPDROP: ''
};
