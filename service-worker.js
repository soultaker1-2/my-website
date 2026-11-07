const CACHE_NAME = 'soul-program-offline-v1';
const CORE_FILES = [
  'index.html',
  'portfolio.html',
  'educatio.html',
  'video.html',
  'contact.html',
  'game.html',
  'assets/css/style1.css?v=4',
  'assets/css/style-modern.css?v=3',
  'assets/js/jss.js?v=5',
  'assets/css/game.css',
  'assets/js/game.js',
  'assets/images/logo.png',
  'assets/images/taker.jpg',
  'assets/images/edu.jpg',
  'assets/images/diagrams/html-structure.svg',
  'assets/images/diagrams/css-rule.svg',
  'assets/images/diagrams/javascript-flow.svg'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        const files = CORE_FILES.map(function (file) {
          return new URL(file, self.registration.scope).href;
        });
        return cache.addAll(files);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (cacheNames) {
        return Promise.all(cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('soul-program-offline-')) {
            return caches.delete(cacheName);
          }
          return Promise.resolve(false);
        }));
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', function (event) {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request, { ignoreSearch: true })
      .then(function (cachedResponse) {
        if (cachedResponse && request.mode !== 'navigate') return cachedResponse;

        return fetch(request)
          .then(function (networkResponse) {
            if (networkResponse.ok) {
              const responseCopy = networkResponse.clone();
              caches.open(CACHE_NAME).then(function (cache) {
                cache.put(request, responseCopy);
              });
            }
            return networkResponse;
          })
          .catch(function () {
            if (cachedResponse) return cachedResponse;
            if (request.mode === 'navigate') {
              return caches.match(new URL('game.html', self.registration.scope).href);
            }
            return Response.error();
          });
      })
  );
});
