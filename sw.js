self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open('gymsy-store').then((cache) => cache.addAll([
        './',
        './index.html',
        './skrzynka3.mp4',
        './qr-code.svg'
      ])),
    );
  });
  
  self.addEventListener('fetch', (e) => {
    e.respondWith(
      caches.match(e.request).then((response) => response || fetch(e.request)),
    );
  });