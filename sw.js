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
});// Versão 3.0 - Cache Robusto com Bibliotecas Externas
const CACHE_NAME = 'solarflow-v3-robust';

// Lista de tudo que o app precisa para funcionar offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  // Bibliotecas Externas (CDN) - Essencial para o gráfico funcionar offline
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  // Fontes da web (opcional, mas bom prevenir)
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2'
];

// 1. INSTALAÇÃO: Baixa tudo para a memória do celular
self.addEventListener('install', event => {
  self.skipWaiting(); // Força atualização imediata se houver nova versão
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Abrindo cache e salvando recursos...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Erro ao criar cache:', err))
  );
});

// 2. ATIVAÇÃO: Limpa caches antigos (V1, V2...) para não encher a memória
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. INTERCEPTAÇÃO (FETCH): A Estratégia "Cache First"
// Primeiro tenta pegar do celular (rápido/offline). Se não tiver, vai na internet.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se achou no cache, retorna de lá
        if (response) {
          return response;
        }
        // Se não, busca na rede
        return fetch(event.request).catch(() => {
            // Se falhar na rede (offline total) e não tiver no cache,
            // não faz nada (ou poderia retornar uma página de erro customizada)
        });
      })
  );
});