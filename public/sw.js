const CACHE_NAME = 'skor-badminton-v1';
const ASSETS = [
  '/',
  '/index.html',
];

// Install: cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first with cache fallback (harden: same-origin & GET requests only)
self.addEventListener('fetch', (event) => {
  // Hanya proses request method GET
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // Abaikan non-http/https (chrome-extension, file, dll.) dan cross-origin non-asset
  if (!requestUrl.protocol.startsWith('http')) return;
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Hanya cache respons 200 OK same-origin
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
