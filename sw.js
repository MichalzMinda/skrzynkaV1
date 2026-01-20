const CACHE_NAME = 'gymsy-v' + Date.now(); // Dynamiczna nazwa przy każdej zmianie

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './skrzynka3.mp4',
        './qr-code.svg'
      ]);
    })
  );
  self.skipWaiting(); // Wymuś natychmiastową aktualizację
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Usuń wszystkie stare śmieci
          }
        })
      );
    })
  );
  return self.clients.claim(); // Przejmij kontrolę nad stroną natychmiast
});

// STRATEGIA: NETWORK FIRST
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Jeśli mamy internet, zaktualizuj cache i zwróć odpowiedź
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, resClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request)) // Jeśli brak netu, daj z cache
  );
});