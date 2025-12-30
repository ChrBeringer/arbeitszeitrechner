const CACHE_NAME = 'worktime-v1';
const ASSETS = [
  'index.html',
  'style.css',
  'script.js',
  'favicon.svg',
  'manifest.json'
];

// Dateien beim Installieren in den Cache laden
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Anfragen aus dem Cache beantworten (Offline-Fähigkeit)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
