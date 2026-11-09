/**
 * Image helpers for the shop. Every image key maps to two WebP files in
 * /public/shop-assets/: `<key>.webp` (≤1600px) and `<key>-sm.webp` (≤640px).
 * Swap a file on disk (same name) to replace an image everywhere.
 */
const BASE = "/shop-assets";

export const img = (key) => `${BASE}/${key}.webp`;
export const imgSm = (key) => `${BASE}/${key}-sm.webp`;
export const srcSet = (key) => `${imgSm(key)} 640w, ${img(key)} 1600w`;

/** Editorial images used outside product cards. */
export const EDITORIAL = {
  hero: "hero-main",
  heroDetail: "hero-detail",
  storyA: "story-inscription",
  storyB: "story-hills",
  storyC: "story-craft",
};
