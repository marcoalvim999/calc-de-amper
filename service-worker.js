const CACHE_NAME = 'amperagem-cache-v1';
const urlsToCache = [
  '/calc-de-amper/',
  '/calc-de-amper/index.html',
  '/calc-de-amper/offline.html',
  '/calc-de-amper/icon-192.png',
  '/calc-de-amper/icon-512.png',
  '/calc-de-amper/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache aberto:', CACHE_NAME);
      return cache.addAll(urlsToCache).catch(error => {
        console.error('Erro ao adicionar arquivos ao cache:', error);
      });
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        return caches.match('/calc-de-amper/offline.html');
      });
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});