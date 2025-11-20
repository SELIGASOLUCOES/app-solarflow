const CACHE_NAME = 'solarflow-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instalar e salvar arquivos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Arquivos em cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Usar o cache quando offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna do cache se existir
        }
        return fetch(event.request); // Busca na internet se não tiver
      })
  );
});