import { setStatus } from '../utils/dom.js';

const form = document.querySelector('[data-enhancer-form]');
const input = document.querySelector('[data-image-input]');
const preview = document.querySelector('[data-preview]');
const status = document.querySelector('[data-status]');

input?.addEventListener('change', () => {
  const file = input.files?.[0];
  if (!file) return;
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;
  setStatus(status, 'Preview aktif. Mode demo tidak mengirim gambar ke server.');
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  setStatus(status, 'Enhancer production membutuhkan backend image-processing agar API key tidak terekspos.', 'info');
});
