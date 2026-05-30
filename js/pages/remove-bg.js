import { removeBackground } from '../api/api-service.js';
import { createObjectUrl, setStatus } from '../utils/dom.js';

const form = document.querySelector('[data-remove-bg-form]');
const input = document.querySelector('[data-image-input]');
const preview = document.querySelector('[data-preview]');
const result = document.querySelector('[data-result]');
const download = document.querySelector('[data-download]');
const status = document.querySelector('[data-status]');

input?.addEventListener('change', () => {
  const file = input.files?.[0];
  if (!file) return;
  preview.src = createObjectUrl(file);
  preview.hidden = false;
  setStatus(status, 'Gambar siap diproses.');
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  setStatus(status, 'Menghapus background...');
  try {
    const blob = await removeBackground(input.files?.[0]);
    const url = createObjectUrl(blob);
    result.src = url;
    result.hidden = false;
    download.href = url;
    download.hidden = false;
    setStatus(status, 'Selesai. Unduh PNG transparan Anda.', 'success');
  } catch (error) {
    setStatus(status, error.message, 'error');
  } finally {
    button.disabled = false;
  }
});
