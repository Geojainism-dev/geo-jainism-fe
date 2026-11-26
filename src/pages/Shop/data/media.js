/**
 * Image helpers for the shop, backed by the shared Cloudinary integration (@/lib/cloudinary).
 *
 * The shop data still refers to images by short keys ("products/<slug>-1", "cat-books-literature", "hero-main").
 * `assetKey()` maps each of them to the exact asset-map key; an unmapped key THROWS (there is no local-file fallback).
 * The Cloudinary master is the old 1600px-class file (1280px wide); the old "-sm" 640px file is now a derived width.
 *
 *   img(key)        master delivery URL (q_auto, f_auto, no resize) - gallery main image, lightbox
 *   imgSm(key)      640px-wide derived URL (what "<key>-sm.webp" used to be)
 *   srcSet(key)     "<640 url> 640w, <master url> <master width>w"
 *   imageProps(...) { src, srcSet, sizes } for <img>, from the shared width ladders
 *   textureUrl(...) exact master URL, no transformations (3D textures are pixel-sensitive)
 */
import { getAsset, getAssetUrl, hasAsset, getImageProps, getImageUrl, WIDTH_LADDERS } from "@/lib/cloudinary";

/**
 * Shop image key -> asset-map key. Unmapped or mistyped keys throw (also if the asset map has no such entry).
 *   "products/<slug>-<n>" -> shop/products/<slug>-<n>     "cat-<name>" -> shop/categories/cat-<name>
 *   "hero-*" / "story-*"  -> shop/editorial/<key>
 * (scripts/cloudinary/check-asset-references.mjs validates every key in the shop data files against the asset map.)
 */
export const assetKey = (key) => {
  const folder = key.startsWith("cat-") ? "categories" : /^(hero|story)-/.test(key) ? "editorial" : null;
  const id = key.startsWith("products/") ? `shop/${key}` : folder ? `shop/${folder}/${key}` : null;
  if (!id || !hasAsset(id)) throw new Error(`[shop] image key "${key}" has no Cloudinary mapping`);
  return id;
};

export const img = (key) => getImageUrl(assetKey(key));
export const imgSm = (key) => getImageUrl(assetKey(key), { width: 640 });
export const srcSet = (key) => `${imgSm(key)} 640w, ${img(key)} ${getAsset(assetKey(key)).width}w`;

/** Width ladders: full-size images use the shared medium ladder (capped at the master width); `small` images never exceed 640px. */
export const SHOP_WIDTHS = Object.freeze({ full: WIDTH_LADDERS.medium, small: Object.freeze([320, 640]), thumb: WIDTH_LADDERS.thumb });

/** `{ src, srcSet, sizes }` for an <img>. `sizes` is required (a string) so a srcset never defaults to 100vw. */
export const imageProps = (key, { widths = SHOP_WIDTHS.full, sizes, srcWidth } = {}) => getImageProps(assetKey(key), { widths, sizes, srcWidth });

/**
 * `sizes` for <ProductCard> media (4:5 box, 4:5 image, so the rendered width is the card width), derived from the layouts:
 *   grid4   home grid and "related": 2 columns, 4 from 1024px; page padding 20/32/48px (<640 / <1024 / >=1024), container max 1440px,
 *           column gap 16px (24px from 640px)
 *   listing product listing: 2 columns; from 1024px a 250px filter column + 40px gap (56px from 1280px) and 2 (3 from 1280px) columns
 *   rail    horizontal rail: card widths 72vw / 44vw / 31vw / 23vw / 19vw at 0 / 640 / 768 / 1024 / 1280px
 */
export const CARD_SIZES = Object.freeze({
  grid4: "(min-width: 1024px) calc((min(100vw, 1440px) - 96px - 72px) / 4), (min-width: 640px) calc((100vw - 64px - 24px) / 2), calc((100vw - 40px - 16px) / 2)",
  listing:
    "(min-width: 1280px) calc((min(100vw, 1440px) - 96px - 250px - 56px - 48px) / 3), (min-width: 1024px) calc((100vw - 96px - 250px - 40px - 24px) / 2), (min-width: 640px) calc((100vw - 64px - 24px) / 2), calc((100vw - 40px - 16px) / 2)",
  rail: "(min-width: 1280px) 19vw, (min-width: 1024px) 23vw, (min-width: 768px) 31vw, (min-width: 640px) 44vw, 72vw",
});

/** 3D texture sources: exact recorded master URL, never transformed (see ProductStage3D). */
export const coverTextureUrl = (slug) => getAssetUrl(`shop/covers/${slug}`);
export const artTextureUrl = (slug) => getAssetUrl(`shop/art/${slug}`);

/** Editorial images used outside product cards. (`story-craft` exists locally but was not uploaded, so it has no key and is unused.) */
export const EDITORIAL = {
  hero: "hero-main",
  heroDetail: "hero-detail",
  storyA: "story-inscription",
  storyB: "story-hills",
};
