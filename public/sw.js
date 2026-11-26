// Bump the version when the precache list changes. Older caches with this prefix are migrated on activate (see below);
// caches with any other name belong to something else and are never touched.
const CACHE_PREFIX = 'geo-jainism-assets-';
const CACHE_NAME = CACHE_PREFIX + 'v2';

// Pre-cached in the Service Worker thread: the document shell, the brochure and the logo, plus a few local media files that no page
// references (kept as they were; they are not part of the Cloudinary migration manifest).
// Migrated images and video are served from Cloudinary and are deliberately NOT here (see OBSOLETE_MEDIA).
const ASSETS_TO_CACHE = [
  '/',
  '/GEOJ BROCHURE.pdf',
  '/Inscription/Granth-3.jpg',
  '/Inscription/TAMIL-BRAHMI -1.jpg',
  '/Inscription/Vatteluttu-2.jpg',
  '/logo.png',
  '/Screening (1).png',
  '/tamiljain/birds.png',
  '/tamiljain/dust.png',
  '/tamiljain/fog.png',
  '/tamiljain/mahavir.png',
  '/tamiljain/mandala.png',
  '/tamiljain/sky-bg.png',
  '/tamiljain/temple-cinematic.mp4',
  '/temple.png',
  '/TJ A journey through time/1 stone beds.jpg',
  '/TJ A journey through time/2 hills become monastries.jpg',
  '/TJ A journey through time/3 shaping classic tamil culture.jpg',
  '/TJ A journey through time/4 artistic brilliance.jpg',
  '/TJ A journey through time/5 preservation through change.jpg',
  '/TJ A journey through time/6- rediscovered .jpg',
  '/TJ A journey through time/7 .jpg'
];

// Local copies of media that now come from Cloudinary (scripts/cloudinary/migration-manifest.json). They used to be pre-cached by v1
// of this worker; they must never be pre-cached again, and any copy a previous version stored is dropped when this version activates.
// scripts/cloudinary/check-service-worker.mjs verifies this list against the manifest.
const OBSOLETE_MEDIA = new Set([
  '/ground-documentation/BIHAR.jpg',
  '/ground-documentation/GULBARGA.JPG',
  '/ground-documentation/Lalitpur.jpg',
  '/ground-documentation/TAMIL NADU.JPG',
  '/hero-tirthankara.jpg',
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
  '/mahavira.png',
  '/Screening.png',
  '/tamiljain/birds-new.png',
  '/tamiljain/sky-new.png',
  '/tamiljain/temple.png',
  '/TJpageCarousel/Azhgarmalai.JPG',
  '/TJpageCarousel/Kalagumalai.JPG',
  '/TJpageCarousel/Samanar Malai.JPG',
  '/TJpageCarousel/THIRUNATHAR KUNDRU .JPG',
  '/TJpageCarousel/Vallimalai.jpg'
]);
// Old runtime copies of the migrated Shop and Virasat images (the v1 image handler cached every same-origin image it served).
const OBSOLETE_MEDIA_PREFIXES = ['/shop-assets/', '/virasat/images/'];

function isObsoleteMedia(url) {
  let path = new URL(url).pathname;
  try { path = decodeURIComponent(path); } catch (e) { /* keep the raw path */ }
  return OBSOLETE_MEDIA.has(path) || OBSOLETE_MEDIA_PREFIXES.some((p) => path.startsWith(p) && /\.(png|jpe?g|webp|gif|svg)$/i.test(path));
}

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

// Activate Event: migrate and clean up older caches owned by this worker.
// Entries of an older "geo-jainism-assets-*" cache are carried over to the current cache, except local copies of migrated media;
// then the old cache is deleted. Caches that do not carry the prefix are left alone.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const current = await caches.open(CACHE_NAME);
      const names = await caches.keys();
      for (const name of names) {
        if (name === CACHE_NAME || !name.startsWith(CACHE_PREFIX)) continue;
        const old = await caches.open(name);
        for (const request of await old.keys()) {
          if (isObsoleteMedia(request.url)) continue;
          if (await current.match(request)) continue;
          const response = await old.match(request);
          if (response) await current.put(request, response);
        }
        console.log('[Service Worker] Migrated and deleted old cache:', name);
        await caches.delete(name);
      }
      // Defensive: nothing obsolete should be in the current cache either.
      for (const request of await current.keys()) {
        if (isObsoleteMedia(request.url)) await current.delete(request);
      }
      await self.clients.claim();
    })()
  );
});

// Fetch Event: Cache-First Strategy for same-origin images, Network-First for other same-origin requests.
// Cross-origin requests (Cloudinary images and video, fonts, APIs) and Range requests are NOT intercepted: the browser's own HTTP cache
// applies the CDN's headers, video keeps streaming and seeking (206), and nothing from the CDN is duplicated in Cache Storage.
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin || event.request.headers.has('range')) return;
  
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
