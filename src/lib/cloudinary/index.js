/**
 * Cloudinary delivery integration (public URLs only - never put API credentials in frontend code).
 *
 *   import { getImageProps, getImageUrl, getVideoUrl, coverSize, buildSizes, WIDTH_LADDERS } from "@/lib/cloudinary";
 *
 *   // <img>: src + srcSet + sizes from a stable asset key (the manifest id)
 *   <img {...getImageProps("site/journey/03-team-group", { widths: WIDTH_LADDERS.medium, sizes })} alt="..." />
 *   // CSS background / single URL
 *   style={{ backgroundImage: `url('${getImageUrl("site/journey/09-temple", { width: 1280 })}')` }}
 *
 * The data comes from asset-map.json, generated from the migration manifest + upload results:
 *   node scripts/cloudinary/generate-asset-map.mjs          (regenerate)
 *   node scripts/cloudinary/generate-asset-map.mjs --check  (validate / detect staleness)
 *   node scripts/cloudinary/check-asset-references.mjs      (every key used in src/ exists; remaining local references)
 *
 * An unknown key ALWAYS throws (development and production) and there is no local-file fallback.
 * See ./urls.js for the transformation rules and ./resolver.js for lookup behaviour.
 */
import assetMap from "./asset-map.json";
import { createAssetResolver } from "./resolver.js";

export * from "./urls.js";
export { createAssetResolver };

export const cloudinary = createAssetResolver(assetMap);

export const { hasAsset, getAsset, getAssetByPath, assetKeyFromPath, getAssetUrl, getImageUrl, getImageSrcSet, getImageProps, getVideoUrl } = cloudinary;
