import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import fs from "node:fs";
import { createAssetResolver } from "./src/lib/cloudinary/resolver.js";
import { HERO_IMAGE } from "./src/pages/Landing/heroMedia.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Replaces the <!--HERO_PRELOAD--> marker in index.html with the hero image's <link rel="preload">, built from the Cloudinary asset map
 * through the same resolver the app uses (strict: a missing key fails the build). The imagesrcset / imagesizes are identical to the hero
 * <img>'s (src/pages/Landing/heroMedia.js), so the preload is used rather than duplicated.
 */
function heroImagePreload() {
  return {
    name: "geo-hero-image-preload",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const map = JSON.parse(fs.readFileSync(path.resolve(__dirname, "src/lib/cloudinary/asset-map.json"), "utf8"));
        const { src, srcSet, sizes } = createAssetResolver(map).getImageProps(HERO_IMAGE.key, { widths: HERO_IMAGE.widths, sizes: HERO_IMAGE.sizes });
        const link = `<link rel="preload" as="image" href="${src}" imagesrcset="${srcSet}" imagesizes="${sizes}" fetchpriority="high" />`;
        return html.replace("<!--HERO_PRELOAD-->", link);
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), heroImagePreload()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    sourcemap: false,
  },
});
