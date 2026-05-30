const CACHE_NAME = 'azana-v15';
const PRECACHE_ASSETS = [
  './',
  'index.html',
  'blogs.html',
  'about.html',
  'contact.html',
  'privacy-policy.html',
  'terms.html',
  'disclaimer.html',
  'removebg.html',
  'eraser.html',
  'penjernih.html',
  'offline.html',
  'css/main.css',
  'css/themes/tokens.css',
  'css/base/reset.css',
  'css/layouts/site.css',
  'css/components/ui.css',
  'css/pages/home.css',
  'css/pages/tools.css',
  'js/core/app.js',
  'js/api/config.js',
  'js/api/api-service.js',
  'js/api/rate-limiter.js',
  'js/api/prompt-manager.js',
  'js/utils/dom.js',
  'components/navbar/navbar.html',
  'components/footer/footer.html',
  'assets/images/globe.png',
  'assets/images/removebg.png',
  'assets/images/penjernih.png',
  'assets/images/eraser.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))).then(() => self.clients.claim()));
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    return (await cache.match(request)) || caches.match('offline.html');
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const fresh = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);
  return cached || fresh;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(event.request.mode === 'navigate' ? networkFirst(event.request) : staleWhileRevalidate(event.request));
});
