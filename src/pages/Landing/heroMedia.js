/**
 * Landing hero photograph (the Mahavira figure, the page's LCP image).
 *
 * Plain data, no imports from the app, so that BOTH the hero <img> (sections/Hero.jsx) and the build-time <link rel="preload"> that
 * vite.config.js injects into index.html derive from the same key, widths and `sizes`. The preload's imagesrcset / imagesizes must equal
 * the <img>'s srcset / sizes, otherwise the browser would download the picture twice.
 *
 * `sizes`, measured on the page: the figure is 310-375px wide up to 480px, 401-473px up to 640px, 473px (or 52.5vh, to at most 600px)
 * up to 1100px, 730px up to 1600px and 900px beyond.
 */
export const HERO_IMAGE = Object.freeze({
  key: "site/landing/mahavira",
  widths: Object.freeze([640, 1024, 1536, 2048]), // the shared "medium" ladder (urls.js WIDTH_LADDERS.medium)
  sizes: "(max-width: 480px) min(90vw, 380px), (max-width: 640px) 473px, (max-width: 1100px) min(600px, 52.5vh), (max-width: 1600px) 730px, 900px",
});
