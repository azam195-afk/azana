import { getConfig, getApiKey } from './config.js';
import { assertRateLimit } from './rate-limiter.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options = {}, retries = getConfig().limits.retryCount) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      const message = await response.text().catch(() => response.statusText);
      throw new Error(message || `HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt < retries) await wait(getConfig().limits.retryDelayMs * (attempt + 1));
    }
  }
  throw lastError;
}

function validateImage(file) {
  if (!file?.type?.startsWith('image/')) throw new Error('Pilih file gambar terlebih dahulu.');
  const maxBytes = getConfig().limits.maxImageSizeMb * 1024 * 1024;
  if (file.size > maxBytes) throw new Error(`Ukuran gambar maksimal ${getConfig().limits.maxImageSizeMb}MB.`);
}

export async function removeBackground(file) {
  validateImage(file);
  assertRateLimit('remove-bg', getConfig().limits.maxRequestsPerMinute);
  const apiKey = getApiKey('remove_bg');
  if (!apiKey) throw new Error('API key Remove.bg belum disetel. Simpan REMOVE_BG_API_KEY di localStorage atau meta tag server-side.');
  const formData = new FormData();
  formData.append('image_file', file);
  formData.append('size', 'auto');
  const response = await fetchWithRetry(getConfig().api.removeBgEndpoint, {
    method: 'POST',
    headers: { 'X-Api-Key': apiKey },
    body: formData
  });
  return response.blob();
}

export async function cleanupImage(imageBlob, maskBlob) {
  assertRateLimit('clipdrop-cleanup', getConfig().limits.maxRequestsPerMinute);
  const apiKey = getApiKey('clipdrop');
  if (!apiKey) throw new Error('API key Clipdrop belum disetel. Simpan CLIPDROP_API_KEY di localStorage atau meta tag server-side.');
  const formData = new FormData();
  formData.append('image_file', imageBlob);
  formData.append('mask_file', maskBlob);
  const response = await fetchWithRetry(getConfig().api.clipdropCleanupEndpoint, {
    method: 'POST',
    headers: { 'x-api-key': apiKey },
    body: formData
  });
  return response.blob();
}

export async function generateGeminiContent(prompt) {
  assertRateLimit('gemini', getConfig().limits.maxRequestsPerMinute);
  const apiKey = getApiKey('gemini');
  if (!apiKey) throw new Error('API key Gemini belum disetel. Gunakan backend proxy untuk production.');
  const response = await fetchWithRetry(`${getConfig().api.geminiEndpoint}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  return response.json();
}
