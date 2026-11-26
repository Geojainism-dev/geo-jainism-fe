/**
 * Pure Cloudinary delivery-URL helpers (no imports, no side effects).
 *
 * Every function starts from an asset's EXACT delivery URL (the `secureUrl` recorded at upload time) and only
 * inserts transformation components after `/upload/`. The version segment (`v123...`), public ID and extension
 * are never rebuilt, so a URL can never drift away from what was actually uploaded.
 *
 * Transformation components are separate path segments joined with "/", e.g.
 *   https://res.cloudinary.com/<cloud>/image/upload/c_limit,w_1024/q_auto/f_auto/v123/<public-id>.jpg
 *
 * Public delivery URLs only - no credentials are used or needed here.
 */

const DELIVERY_RE = /^(https:\/\/res\.cloudinary\.com\/[a-z0-9_-]+\/(?:image|video)\/upload\/)(v\d+\/.+)$/i;
// One URL path segment of transformation parameters, e.g. "c_limit,w_1024", "q_auto", "q_auto:eco", "f_auto".
const COMPONENT_RE = /^[A-Za-z0-9_.:,-]+$/;
const MAX_WIDTH = 8192;

/**
 * Assets whose pixels are consumed by something other than a normal <img> (WebGL textures, ...) must keep their
 * exact bytes/format: no lossy `q_auto`, no format switching, no resizing unless the caller opts in with
 * `{ allowLossy: true }`.
 */
const PIXEL_SENSITIVE_STRATEGIES = new Set(["webgl-texture"]);
const PIXEL_SENSITIVE_CATEGORIES = new Set(["shop-3d-texture"]);

export const isPixelSensitive = (asset) =>
  PIXEL_SENSITIVE_STRATEGIES.has(asset?.strategy) || PIXEL_SENSITIVE_CATEGORIES.has(asset?.category);

/** Insert transformation components between `/upload/` and the version segment. Throws on anything malformed. */
export function insertTransformation(url, ...components) {
  const m = DELIVERY_RE.exec(String(url ?? ""));
  if (!m) throw new Error(`[cloudinary] not an untransformed Cloudinary delivery URL (expected .../upload/v<version>/...): ${url}`);
  if (!components.length) throw new Error("[cloudinary] insertTransformation needs at least one component");
  for (const c of components) {
    if (typeof c !== "string" || !COMPONENT_RE.test(c)) throw new Error(`[cloudinary] malformed transformation component: ${JSON.stringify(c)}`);
  }
  return `${m[1]}${components.join("/")}/${m[2]}`;
}

function assertAsset(asset, type) {
  if (!asset || typeof asset.url !== "string") throw new Error("[cloudinary] asset is missing its url");
  if (asset.resourceType !== type) throw new Error(`[cloudinary] ${asset.publicId} is a ${asset.resourceType}, not a ${type}`);
}

function assertWidth(width) {
  if (!Number.isInteger(width) || width < 1 || width > MAX_WIDTH) throw new Error(`[cloudinary] width must be an integer 1-${MAX_WIDTH}, got ${width}`);
}

/**
 * Optimised image URL: `c_limit,w_<n>` / `q_auto` / `f_auto`.
 *
 *  - `c_limit` only ever shrinks: it never upscales and never crops. The requested width is additionally capped at the
 *    asset's stored width so the URL itself states a width that can really be delivered.
 *  - `quality` / `format` default to "auto"; pass `false` to omit either component.
 *  - Pixel-sensitive assets (3D textures etc.) are returned untouched unless `allowLossy: true`.
 */
export function imageUrl(asset, { width, quality = "auto", format = "auto", allowLossy = false } = {}) {
  assertAsset(asset, "image");
  if (isPixelSensitive(asset) && !allowLossy) return asset.url;
  const parts = [];
  if (width !== undefined) {
    assertWidth(width);
    parts.push(`c_limit,w_${Math.min(width, asset.width || width)}`);
  }
  if (quality) parts.push(`q_${quality}`);
  if (format) parts.push(`f_${format}`);
  return parts.length ? insertTransformation(asset.url, ...parts) : asset.url;
}

/**
 * Widths to offer for an asset: each requested width, capped at the asset's native width, de-duplicated, ascending.
 * (A 679 px-wide source with the ladder [640, 1024, 1536] yields [640, 679] - never an upscaled candidate.)
 */
export function responsiveWidths(asset, widths) {
  if (!Array.isArray(widths) || !widths.length) throw new Error("[cloudinary] responsiveWidths needs a non-empty widths array");
  widths.forEach(assertWidth);
  const native = asset.width || Infinity;
  return [...new Set(widths.map((w) => Math.min(w, native)))].sort((a, b) => a - b);
}

/** `srcset` string ("<url> <w>w, ...") using {@link responsiveWidths}. */
export function imageSrcSet(asset, widths, opts = {}) {
  assertAsset(asset, "image");
  if (isPixelSensitive(asset) && !opts.allowLossy) return `${asset.url} ${asset.width}w`;
  return responsiveWidths(asset, widths)
    .map((w) => `${imageUrl(asset, { ...opts, width: w })} ${w}w`)
    .join(", ");
}

/**
 * Shared width ladders. Using the same few widths everywhere means different components reuse the same derived
 * images on Cloudinary instead of each creating its own. Candidates are always capped at an image's native width.
 *   small  - thumbnails, gallery tiles, narrow cards (rendered up to ~300 CSS px wide)
 *   medium - cards, portraits, half-width and full-bleed images
 *   thumb  - tiny strip thumbnails
 */
export const WIDTH_LADDERS = Object.freeze({
  thumb: Object.freeze([160, 320]),
  small: Object.freeze([320, 640, 960]),
  medium: Object.freeze([640, 1024, 1536, 2048]),
});

/**
 * CSS length for the rendered width of an `object-fit: cover` image: the image is scaled until it covers the box,
 * so its width is max(boxWidth, boxHeight x imageAspect) - NOT just the box width. A landscape photo in a tall,
 * narrow box is much wider than the box. `scale` accounts for a permanent zoom (e.g. 1.06 on an active slide).
 * `boxWidth` / `boxHeight` are CSS length expressions (e.g. "100vw", "clamp(180px, 22vw, 280px)").
 */
export function coverSize(boxWidth, boxHeight, aspect, scale = 1) {
  if (typeof boxWidth !== "string" || typeof boxHeight !== "string" || !boxWidth || !boxHeight) throw new Error("[cloudinary] coverSize needs CSS length strings");
  if (!Number.isFinite(aspect) || aspect <= 0) throw new Error(`[cloudinary] coverSize needs a positive aspect ratio, got ${aspect}`);
  const widest = `max(${boxWidth}, ${boxHeight} * ${aspect.toFixed(4)})`;
  return scale === 1 ? widest : `calc(${widest} * ${scale})`;
}

/** Compose a `sizes` attribute from [mediaQuery, size] pairs (first match wins) plus a default size. */
export function buildSizes(breakpoints, fallback) {
  if (typeof fallback !== "string" || !fallback) throw new Error("[cloudinary] buildSizes needs a fallback size");
  const parts = (breakpoints || []).map(([query, size]) => {
    if (typeof query !== "string" || !query.startsWith("(") || typeof size !== "string" || !size) throw new Error(`[cloudinary] bad sizes entry: ${JSON.stringify([query, size])}`);
    return `${query} ${size}`;
  });
  return [...parts, fallback].join(", ");
}

/**
 * Video delivery URL: `q_auto` / `f_auto`, keeping the version, public ID and `.mp4` extension.
 * Pass `{ quality: false, format: false }` to get the untouched master.
 */
export function videoUrl(asset, { quality = "auto", format = "auto" } = {}) {
  assertAsset(asset, "video");
  const parts = [];
  if (quality) parts.push(`q_${quality}`);
  if (format) parts.push(`f_${format}`);
  return parts.length ? insertTransformation(asset.url, ...parts) : asset.url;
}
