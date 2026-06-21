const CACHE_NAME = 'geo-jainism-assets-v1';

// List of all image assets to pre-cache in the Service Worker thread
const ASSETS_TO_CACHE = [
  '/',
  '/GEOJ BROCHURE.pdf',
  '/ground-documentation/BIHAR.jpg',
  '/ground-documentation/GULBARGA.JPG',
  '/ground-documentation/Lalitpur.jpg',
  '/ground-documentation/TAMIL NADU.JPG',
  '/hero-tirthankara.jpg',
  '/Inscription/Granth-3.jpg',
  '/Inscription/TAMIL-BRAHMI -1.jpg',
  '/Inscription/Vatteluttu-2.jpg',
  '/journey/01-rock-sculpture.jpg',
  '/journey/02-temple-hill.jpg',
  '/journey/03-team-group.jpg',
  '/journey/04-hillside.jpg',
  '/journey/05-rock-carvings.jpg',
  '/journey/06-sheep-site.jpg',
  '/journey/07-stone-carving.jpg',
  '/journey/08-community.jpg',
  '/journey/09-temple.jpg',
  '/journey/10-founder-research.jpg',
  '/journey-throught-time/1 stone beds.jpg',
  '/journey-throught-time/2 hills become monastries.jpg',
  '/journey-throught-time/3 shaping classic tamil culture.jpg',
  '/journey-throught-time/4 artistic brilliance.jpg',
  '/journey-throught-time/5 preservation through change.jpg',
  '/journey-throught-time/6- rediscovered .jpg',
  '/journey-throught-time/7 .jpg',
  '/Literature-and-legacy/ChennaBhairaDevi_5.jpg',
  '/Literature-and-legacy/Jeevak Chintamani_3.png',
  '/Literature-and-legacy/naladiyar_1.png',
  '/Literature-and-legacy/ratnakar_4.png',
  '/Literature-and-legacy/Shilapattikaram_2.png',
  '/logo.png',
  '/mahavira.png',
  '/Screening (1).png',
  '/Screening.png',
  '/tamiljain/birds-new.png',
  '/tamiljain/birds.png',
  '/tamiljain/dust.png',
  '/tamiljain/fog.png',
  '/tamiljain/mahavir.png',
  '/tamiljain/mandala.png',
  '/tamiljain/sky-bg.png',
  '/tamiljain/sky-new.png',
  '/tamiljain/temple-cinematic.mp4',
  '/tamiljain/temple.png',
  '/temple.png',
  '/TJ A journey through time/1 stone beds.jpg',
  '/TJ A journey through time/2 hills become monastries.jpg',
  '/TJ A journey through time/3 shaping classic tamil culture.jpg',
  '/TJ A journey through time/4 artistic brilliance.jpg',
  '/TJ A journey through time/5 preservation through change.jpg',
  '/TJ A journey through time/6- rediscovered .jpg',
  '/TJ A journey through time/7 .jpg',
  '/TJpageCarousel/Azhgarmalai.JPG',
  '/TJpageCarousel/Kalagumalai.JPG',
  '/TJpageCarousel/Samanar Malai.JPG',
  '/TJpageCarousel/THIRUNATHAR KUNDRU .JPG',
  '/TJpageCarousel/Vallimalai.jpg'
];

// Install Event: Pre-cache assets in background thread
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching assets in separate thread');
      // Use addAll to cache all files. If one fails, it still continues or we catch it.
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(url => 
          cache.add(url).catch(err => console.warn(`[Service Worker] Failed to pre-cache ${url}:`, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-First Strategy for Images, Network-First for others
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Intercept requests for images (either by file extension or request destination)
  const isImage = 
    event.request.destination === 'image' ||
    /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(requestUrl.pathname);

  if (isImage) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache immediately
          return cachedResponse;
        }

        // Fetch from network, cache a copy, and return
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        }).catch(() => {
          // Fallback if both cache and network fail
          return Response.error();
        });
      })
    );
  } else {
    // Network-first (or default browser behavior) for HTML, JS, CSS, etc.
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
