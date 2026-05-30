const DEFAULT_CONFIG = Object.freeze({
  siteUrl: 'https://azana.my.id',
  api: {
    removeBgEndpoint: 'https://api.remove.bg/v1.0/removebg',
    clipdropCleanupEndpoint: 'https://clipdrop-api.co/cleanup/v1',
    geminiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
  },
  limits: {
    maxImageSizeMb: 10,
    maxRequestsPerMinute: 4,
    retryCount: 2,
    retryDelayMs: 900
  }
});

export function getConfig() {
  return DEFAULT_CONFIG;
}

export function getApiKey(provider) {
  const key = `${provider.toUpperCase()}_API_KEY`;
  const metaValue = document.querySelector(`meta[name="${key.toLowerCase().replaceAll('_', '-')}"]`)?.content?.trim();
  const localValue = window.localStorage?.getItem(key)?.trim();
  return metaValue || localValue || '';
}
