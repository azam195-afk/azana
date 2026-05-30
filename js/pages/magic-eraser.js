import { cleanupImage } from '../api/api-service.js';
import { setStatus } from '../utils/dom.js';

const input = document.querySelector('[data-image-input]');
const imageCanvas = document.querySelector('[data-image-canvas]');
const maskCanvas = document.querySelector('[data-mask-canvas]');
const status = document.querySelector('[data-status]');
const processButton = document.querySelector('[data-process]');
const download = document.querySelector('[data-download]');
const ctx = imageCanvas?.getContext('2d');
const maskCtx = maskCanvas?.getContext('2d');
let drawing = false;

function resizeCanvases(width, height) {
  [imageCanvas, maskCanvas].forEach((canvas) => { canvas.width = width; canvas.height = height; });
  maskCtx.lineCap = 'round';
  maskCtx.lineJoin = 'round';
  maskCtx.lineWidth = 34;
  maskCtx.strokeStyle = '#ffffff';
}

function pointerPosition(event) {
  const rect = maskCanvas.getBoundingClientRect();
  const point = event.touches?.[0] || event;
  return { x: (point.clientX - rect.left) * (maskCanvas.width / rect.width), y: (point.clientY - rect.top) * (maskCanvas.height / rect.height) };
}

input?.addEventListener('change', () => {
  const file = input.files?.[0];
  if (!file) return;
  const image = new Image();
  image.onload = () => {
    const scale = Math.min(960 / image.width, 960 / image.height, 1);
    resizeCanvases(Math.round(image.width * scale), Math.round(image.height * scale));
    ctx.drawImage(image, 0, 0, imageCanvas.width, imageCanvas.height);
    maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    setStatus(status, 'Tandai objek yang ingin dihapus, lalu klik proses.');
  };
  image.src = URL.createObjectURL(file);
});

maskCanvas?.addEventListener('pointerdown', (event) => { drawing = true; const pos = pointerPosition(event); maskCtx.beginPath(); maskCtx.moveTo(pos.x, pos.y); });
maskCanvas?.addEventListener('pointermove', (event) => { if (!drawing) return; const pos = pointerPosition(event); maskCtx.lineTo(pos.x, pos.y); maskCtx.stroke(); });
window.addEventListener('pointerup', () => { drawing = false; });

document.querySelector('[data-clear-mask]')?.addEventListener('click', () => {
  maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  setStatus(status, 'Mask dihapus.');
});

processButton?.addEventListener('click', async () => {
  processButton.disabled = true;
  setStatus(status, 'Memproses cleanup...');
  try {
    const imageBlob = await new Promise((resolve) => imageCanvas.toBlob(resolve, 'image/png'));
    const maskBlob = await new Promise((resolve) => maskCanvas.toBlob(resolve, 'image/png'));
    const resultBlob = await cleanupImage(imageBlob, maskBlob);
    const url = URL.createObjectURL(resultBlob);
    const resultImage = new Image();
    resultImage.onload = () => ctx.drawImage(resultImage, 0, 0, imageCanvas.width, imageCanvas.height);
    resultImage.src = url;
    download.href = url;
    download.hidden = false;
    setStatus(status, 'Selesai. Hasil dapat diunduh.', 'success');
  } catch (error) {
    setStatus(status, error.message, 'error');
  } finally {
    processButton.disabled = false;
  }
});
