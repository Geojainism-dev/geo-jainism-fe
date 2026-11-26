# Cloudinary migration – frontend static assets

This folder prepares the move of the frontend's static images and video to Cloudinary. It uses the **same Cloudinary account the backend already uses** for blog covers, blog content, screening images and registration passes.

| File | Purpose |
|---|---|
| `migration-manifest.json` | Every asset approved for upload, with its target public ID, metadata, usage and delivery strategy. |
| `upload-assets.mjs` | Standalone Node utility: validates, preprocesses and uploads the manifest's assets. |
| `results/upload-results.json` | Created by `--upload`: per-asset status, `secure_url` and checksums. |
| `README.md` | This document. |

## Migration status (updated 2026-11-23)

**The asset upload is complete. The code migration has not started.**

| Stage | Status |
|---|---|
| Manifest (172 assets, 171 images + 1 video, 61.37 MB) | Done; unchanged since generation (SHA-256 `8f815dc897eb...`) |
| Pilot upload (`site/journey`, `site/tamil-jain/shayanika`, `virasat/video`) | Done: 12 uploaded |
| Delivery smoke test (width/format/quality transformations, video playback and seeking, canvas CORS) | Passed. The temporary test page was removed afterwards |
| Full upload | Done: the remaining 160 uploaded; 0 skipped, 0 failed, 0 warnings. 172 of 172 recorded as `uploaded` in `results/upload-results.json` |
| Verification | Done: a read-only comparison with Cloudinary found exactly 172 assets under `geo-jainism/{site,shop,virasat}/` (no extras). Resource type, dimensions, byte size, `asset_folder` and `secure_url` match the manifest/results for every asset. The ETag of every upload equals the MD5 of the bytes sent, and the 6 oversized images were uploaded from the 4096 x 2732 resized copies |
| Frontend integration (helpers + generated asset map, all 172 assets) | Done (see section 13). Application code never imports the manifest, the results or any script here; it imports only the generated `src/lib/cloudinary/asset-map.json` |
| Frontend code switched to Cloudinary URLs | **In progress:** all 10 `site/journey` photographs (57 refs) and the rendered editorial/Tamil Jain content photographs (25 refs: `site/landing/literature`, `site/ground-documentation`, `site/tamil-jain/{century-wall,hills,inscriptions,shayanika}`) now go through `@/lib/cloudinary`. Also the whole static Shop (`/shop/*`: 72 product images, 8 category images, 4 editorial images, 8 3D textures) and Virasat (`/virasat`: 35 images + the hero film), and the remaining hero/decorative/background images (Landing hero, mandala, popup poster, login background, About hero, Tamil Jain temple/birds/sky). Still local on purpose: the logo (not in the manifest), the default og:image (`src/config/seo.js`), runtime JSON files and the files listed below; `public/sw.js` and `index.html` are unchanged |

Operational notes:
- The account uses **dynamic folder mode**; the uploader sends `asset_folder` together with the exact manifest `public_id`.
- Re-running `node scripts/cloudinary/upload-assets.mjs --upload` is safe: every asset is already recorded, so nothing is uploaded and nothing is overwritten.
- The usage API reports storage with a delay, so check the dashboard for the final storage figure.
- Do not delete the local assets until the references have been migrated and tested.

---

**Tooling:** the upload utility (`upload-assets.mjs`) is implemented. Its default mode is a dry run. The sections below describe how it works and how to re-run it.

---

## 1. Scope

- **172 master assets, 61.37 MB:** 171 images and 1 video.
- **Masters only.** The `-sm.webp` variants are not uploaded. Cloudinary generates the smaller sizes on request (see §5).
- `localPath` values are relative to `geo-jainism-fe/`.

| Category | Count | Size |
|---|---:|---:|
| `shop-product` | 72 | 10.45 MB |
| `virasat-image` | 35 | 5.68 MB |
| `tamil-jain-content` (century wall, hills, inscriptions, shayanika) | 16 | 11.76 MB |
| `content-photo` (journey, ground documentation) | 14 | 5.45 MB |
| `shop-category` | 8 | 1.93 MB |
| `shop-3d-texture` (book covers, frame art) | 8 | 1.44 MB |
| `landing-content` (literature) | 5 | 3.40 MB |
| `shop-editorial` | 4 | 0.91 MB |
| `landing-hero` (mahavira, mandala, hero-bg) | 3 | 4.27 MB |
| `tamil-jain-hero` (temple, birds, sky) | 3 | 0.91 MB |
| `page-hero` (about hero, login background) | 2 | 1.78 MB |
| `landing-popup` | 1 | 0.90 MB |
| `virasat-video` | 1 | 12.48 MB |

---

## 2. Folder organisation

Everything sits under the existing `geo-jainism/` root. The backend's folders stay exactly as they are; this migration adds sibling folders next to them.

```
geo-jainism/
├── blog-covers/            ← backend (multer upload, auto-generated IDs)    – DO NOT TOUCH
├── blog-content/           ← backend                                         – DO NOT TOUCH
├── screening-images/       ← backend                                         – DO NOT TOUCH
├── passes/                 ← backend (public_id = pass-<registrationCode>)   – DO NOT TOUCH
│
├── site/
│   ├── landing/                    mahavira, mandala, hero-bg, screening-popup
│   │   └── literature/             naladiyar, shilapattikaram, jeevak-chintamani, ratnakar, chenna-bhaira-devi
│   ├── ground-documentation/       bihar, gulbarga, lalitpur, tamil-nadu
│   ├── journey/                    01-rock-sculpture … 10-founder-research   (shared by /, /about, /tamil-jain)
│   ├── about/                      hero-tirthankara
│   ├── auth/                       login-bg
│   └── tamil-jain/                 shayanika
│       ├── hero/                   temple, birds, sky
│       ├── century-wall/           01-stone-beds … 07-continuous-history
│       ├── hills/                  samanar-malai, vallimalai, thirunathar-kundru, azhgarmalai, kalagumalai
│       └── inscriptions/           tamil-brahmi, vatteluttu, grantha
├── shop/
│   ├── products/                   <slug>-1 … <slug>-3   (24 slugs)
│   ├── categories/                 cat-<slug>            (8)
│   ├── editorial/                  hero-main, hero-detail, story-hills, story-inscription
│   ├── covers/                     <slug>                (3D book covers)
│   └── art/                        <slug>                (3D frame art)
└── virasat/
    ├── images/                     vs-event-NN, vs-moment-NN, vs-kavi-sajal-jain, vs-tirthankara, vs-gulbarga, vs-dilwara
    └── video/                      virasat-hero
```

---

## 3. Public ID conventions

1. **Full path.** `publicId` = `folder` + `/` + name, e.g. `geo-jainism/site/journey/01-rock-sculpture`.
2. **Lowercase kebab-case.** Each segment matches `[a-z0-9]+(-[a-z0-9]+)*`. That means no spaces, no uppercase, no underscores and no file extension. The generator asserts this rule.
3. **Shop and Virasat keys are kept as they are.** The existing helpers (`src/pages/Shop/data/media.js` and `src/pages/Virasat/data/site.js`) address images by key. Keeping each key as the final segment means switching the helpers only needs a folder prefix per key type:
   - `products/x` → `shop/products/x`
   - `cat-*` → `shop/categories/`
   - `hero-*` and `story-*` → `shop/editorial/`
   - `vs-*` → `virasat/images/`
4. **Ordering prefixes** (`01-…`) are kept where the sequence has meaning: the journey and century-wall eras.
5. **Irregular local names are normalised:**

| Local file | Public ID name | Why |
|---|---|---|
| `journey-throught-time/2 hills become monastries.jpg` | `02-hills-become-monasteries` | Spelling corrected; matches the on-page title |
| `journey-throught-time/3 shaping classic tamil culture.jpg` | `03-shaping-classical-tamil-culture` | Matches the on-page title |
| `journey-throught-time/6- rediscovered .jpg` | `06-rediscovered` | Stray dash and trailing space removed |
| `journey-throught-time/7 .jpg` | `07-continuous-history` | The file had no name; taken from the era title "2300+ Years of Continuous History" |
| `TJpageCarousel/THIRUNATHAR KUNDRU .JPG` | `thirunathar-kundru` | Case and trailing space |
| `src/assets/images/Inscription/Granth.jpg` | `grantha` | Matches the on-page title "Grantha" |
| `src/assets/images/Inscription/TAMIL-BRAHMI .jpg` | `tamil-brahmi` | Case and trailing space |
| `Literature-and-legacy/<Name>_<n>.png` | `<name>` | The ordering suffix lives in code (`landingData.js`), not in the asset |
| `tamiljain/birds-new.png`, `sky-new.png` | `birds`, `sky` | The `-new` suffix is meaningless once the old files are retired |
| `public/Screening.png` | `screening-popup` | Describes the role |
| `src/assets/images/landing/hero_bg.png` | `hero-bg` | Kebab-case |

**Collision check:** 0 collisions. All 172 public IDs are unique, including case-insensitively. None of them overlap the backend's four folders.

---

## 4. Manifest structure

```jsonc
{
  "schemaVersion": 1,
  "cloudinaryRoot": "geo-jainism",
  "uploadDefaults": { "image": {…}, "video": {…}, "notes": "…" },   // overwrite:false, unique_filename:false
  "transformationStrategies": { "<name>": { "delivery": "f_auto,q_auto,…", "srcsetWidths": [...] } },
  "summary": {
    "totalAssets", "images", "videos", "totalBytes",
    "byCategory", "byFolder",
    "needsPreprocessing",             // public IDs that must be downscaled before upload
    "publicIdCollisions",             // {} = none
    "duplicatesWithinManifest",       // byte-identical pairs that are both uploaded
    "duplicatesResolvedByExclusion"   // excluded local copies identical to a manifest asset
  },
  "assets": [
    {
      "id": "site/journey/01-rock-sculpture",           // publicId without the root
      "localPath": "public/journey/01-rock-sculpture.jpg",
      "folder": "geo-jainism/site/journey",
      "publicId": "geo-jainism/site/journey/01-rock-sculpture",
      "resourceType": "image",                          // "image" | "video"
      "format": "jpg",                                  // sniffed from file bytes, not the extension
      "bytes": 203625, "width": 679, "height": 1018,
      "hasAlpha": false,                                // PNG/WebP only
      "durationSeconds": 148.1, "codecs": [], "faststart": true,   // video only
      "sha256": "…",                                    // integrity / idempotency check
      "category": "content-photo",
      "loadingPriority": "lcp | above-fold | lazy",
      "usage": [{ "page": "/about", "component": "…", "file": "src/…" }],
      "transformationStrategy": "content-responsive",
      "preprocess": null | ["downscale: …"],
      "duplicateOf": null | "<publicId>",
      "notes": null | "…"
    }
  ]
}
```

---

## 5. Delivery strategies (summary)

All image strategies use `f_auto,q_auto,c_limit,w_<n>`, so the format is negotiated (AVIF/WebP/JPEG), quality is automatic, and images are never upscaled. The full definitions are in `transformationStrategies`.

| Strategy | Used for | Widths |
|---|---|---|
| `hero-lcp` / `hero-lcp-alpha` | LCP images (mahavira, TJ temple, shop hero) | 480–1600; eager, `fetchpriority=high` |
| `decorative-alpha` | mandala, birds | 480–1200, `q_auto:eco` |
| `css-background` | hero-bg, sky, about hero | 828 / 1280 / 1920 via inline style or CSS variable |
| `content-responsive` | journey, literature, inscriptions | 480–1600; lazy, async decode |
| `carousel-fullbleed` | century wall, hills | 768–2560 (caps the 8K sources) |
| `shop-product` / `shop-editorial` | Shop | 320–1600; replaces `-sm.webp` (640w) and full (1600w) |
| `virasat-responsive` | Virasat | 480–1920; replaces `-sm.webp` (900w) and full (1920w) |
| `webgl-texture` | Shop 3D covers and art | fixed `w_1024`; needs CORS |
| `video-background-and-player` | Virasat hero | 20 s muted loop + `so_2` poster + full film |

**Virasat video.** The 148 s file (720×400, H.264/AAC, faststart) is currently used three ways: as the autoplay background loop with `preload="auto"`, as the WebGL portal texture, and as the full film in a modal. The plan is one upload with three delivery forms:
- A short, silent, eagerly derived loop for the background and the WebGL texture.
- A poster frame image.
- The full film with sound for the modal.

`crossOrigin="anonymous"` must keep working for the WebGL texture.

---

## 6. Duplicates

**Uploaded twice, on purpose.** Three byte-identical pairs are kept as separate public IDs:

| Category ID | Same bytes as |
|---|---|
| `shop/categories/cat-spiritual-devotional` | `shop/products/brass-akhand-diya-1` |
| `shop/categories/cat-home-lifestyle` | `shop/products/pierced-brass-dhoop-box-1` |
| `shop/categories/cat-gifts-souvenirs` | `shop/products/heritage-postcard-set-1` |

A category tile and a product photo play different editorial roles. Sharing one ID would mean replacing either one silently changes both. The extra storage is about 0.4 MB. Each pair is marked with `duplicateOf` in the manifest.

**Resolved by exclusion.** 14 local files are byte-identical to a manifest asset and are **not** uploaded:
- `public/TJ A journey through time/*` (7 files)
- `public/Inscription/*` (3 files)
- `public/Screening (1).png`
- `public/temple.png`
- `public/tamiljain/birds.png`
- `public/virasat/images/vs-inscription.webp`

The full list is in `summary.duplicatesResolvedByExclusion`.

---

## 7. Excluded assets

| Group | Files | Reason |
|---|---|---|
| `-sm.webp` variants (Shop and Virasat) | 119 | Generated by Cloudinary width transforms |
| Unused candidates from the audit | 63 | No reference found. The list includes the 46 MB `src/assets/images/landing/Ground Documentation/*` originals, `tamiljain/temple-cinematic.mp4`, `tamiljain/{dust,fog,mahavir,mandala,sky-bg}.png`, 12 unused Virasat keys, `story-craft`, the cover/art `-sm` files, unimported `src/assets/images/landing/{hero,space,sphere,story,bar}.png`, and the repo-root screenshot. **Not deleted.** Deletion is a separate decision. |
| `public/logo.png` | 1 | Favicon, apple-touch-icon and PWA manifest icon. Stays on the same origin. |
| Blog covers, blog content, screening images, passes | n/a | Already uploaded to Cloudinary by the backend at runtime |
| YouTube thumbnails | n/a | External CDN |
| `public/GEOJ BROCHURE.pdf` | 1 | Not an image or video; needs an investigation of where it's linked |

**Optional higher-quality sources.** `public/ground-documentation/*` (2048 px, in the manifest) has higher-resolution originals in `src/assets/images/landing/Ground Documentation/` (3024–8192 px, 2.6–21.7 MB). Two of these exceed the 10 MB and 25 MP limits of common plans. If you want them as the masters, downscale them first and swap the `localPath`.

---

## 8. Preprocessing (sharp)

Six sources are 8192 x 5464 (44.8 MP). The account's per-image limit is 25 MP, so they would be rejected as they are. The utility downscales only the assets whose manifest entry has a `downscale` instruction:

| Asset | From | To |
|---|---|---|
| `site/tamil-jain/century-wall/01-stone-beds` | 8192x5464 | 4096x2732 |
| `site/tamil-jain/century-wall/03-shaping-classical-tamil-culture` | 8192x5464 | 4096x2732 |
| `site/tamil-jain/century-wall/05-preservation-through-change` | 8192x5464 | 4096x2732 |
| `site/tamil-jain/century-wall/07-continuous-history` | 8192x5464 | 4096x2732 |
| `site/tamil-jain/inscriptions/tamil-brahmi` | 8192x5464 | 4096x2732 |
| `site/tamil-jain/shayanika` | 8192x5464 | 4096x2732 |

Rules:
- Long edge at most 4096 px, aspect ratio kept, never upscaled (`fit: inside`, `withoutEnlargement`).
- EXIF orientation is applied to the pixels, the ICC profile is kept, and transparency is kept for PNG/WebP.
- JPEG output uses quality 90 (mozjpeg). Because the originals are heavily compressed, the resized files are larger on disk than the originals (about 0.7-2.0 MB each) but still far below the 10 MB limit.
- The processed copy goes to a dedicated OS temp directory (`geoj-cloudinary-*`) and never overwrites the original. After each upload the temporary file is deleted, and the directory is removed at the end of the run.
- Each processed file is verified before upload: long edge, aspect ratio, no upscaling, megapixels under the limit, and alpha preserved. If any check fails, that asset fails and nothing is uploaded for it.
- The dry run performs the same resize as a trial, reports the resulting dimensions and deletes the trial files. The account reports a 25 MP limit, so the safeguard is required, not optional.

Seven opaque photographic PNGs (`hero-bg`, `screening-popup`, `login-bg`, four literature images) could be converted to JPEG to save storage. This is not done here; `f_auto` already fixes delivery size.

---

## 9. Setup and credentials

### Install

`cloudinary`, `dotenv` and `sharp` are **devDependencies**. They are used only by this script and are not part of the React bundle.

```bash
npm install            # from geo-jainism-fe/ (installs the three devDependencies with the rest)
# or, when adding them to a fresh checkout:
npm install --save-dev cloudinary dotenv sharp
```

### Environment

Create `geo-jainism-fe/.env` (git-ignored by the `.env*` rule; `.env.production` is covered too):

```dotenv
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

- The script reads **only** `geo-jainism-fe/.env`, by explicit path, and does not touch `process.env`. It has no dependency on any other repository.
- **Never add a `VITE_` prefix to these variables.** Vite embeds `VITE_*` values in the public bundle. The script refuses to run if it finds a credential-like `VITE_` variable.
- It also refuses to run if `.env` is not git-ignored or is tracked by git.
- `.env.example` lists the three names with empty values. It must never contain real values.
- The only public value for browser delivery is `VITE_CLOUDINARY_CLOUD_NAME`. It is added later, when references are switched.

## 10. Running the utility

All commands run from `geo-jainism-fe/`.

**Dry run (default; uploads nothing):**
```bash
node scripts/cloudinary/upload-assets.mjs
```
It verifies, in order:
1. `.env` and the three variables (values never printed).
2. The manifest: schema, kebab-case IDs, no collisions with the reserved existing folders, no `-sm.webp` files.
3. Every selected local file: it exists, size and SHA-256 match the manifest, and the real format and dimensions match.
4. The preprocessing plan (trial resize of the six oversized images).
5. Credentials, with a read-only `usage` call: plan, credits, storage, limits.
6. Whether any selected public ID already exists on Cloudinary (a read-only listing of the `geo-jainism/site|shop|virasat/` prefixes).
7. The full list of proposed public IDs, sizes and actions.

**Upload everything:**
```bash
node scripts/cloudinary/upload-assets.mjs --upload
```

**Selective uploads.** `--only` takes manifest IDs (the public ID without `geo-jainism/`) or folder prefixes, comma-separated or repeated:
```bash
# one folder
node scripts/cloudinary/upload-assets.mjs --upload --only site/journey
# one asset
node scripts/cloudinary/upload-assets.mjs --upload --only site/journey/01-rock-sculpture
# several folders
node scripts/cloudinary/upload-assets.mjs --upload --only shop/categories,virasat/video
# dry run of a subset; a trailing * matches name prefixes
node scripts/cloudinary/upload-assets.mjs --only "shop/products/brass*"
```

**Other options:**

| Option | Meaning |
|---|---|
| `--concurrency N` | Parallel uploads, 1-4 (default 2) |
| `--retries N` | Max attempts for transient failures, 1-5 (default 3), with exponential backoff |
| `--no-asset-folder` | Do not send `asset_folder` (for fixed-folder-mode accounts) |
| `--offline` | Dry run without any Cloudinary calls |

### Behaviour guarantees

- **Never overwrites.** Uploads use `overwrite: false`, a unique explicit `public_id`, and no filename generation. Assets that already exist, whether found by the pre-check or reported back by Cloudinary, are recorded as `exists` and left alone.
- **Masters are stored untouched.** There are no incoming transformations, eager transforms or upload presets. After each upload the script compares the returned size and ETag with the local file and warns if the account altered the bytes.
- **No derived files.** The `-sm.webp` variants, the video loop and the video poster are all produced later by delivery transformations.
- **Video** is uploaded as `resource_type: video`, unchanged, as the single master.
- **Failures are never silent.** Each failure is logged, recorded with its error and attempt count, and makes the process exit non-zero. A failed asset does not stop the others.
- **Local files are only read.** The script never deletes, renames or modifies local assets or the manifest.

### Resuming

Results are saved atomically after every asset. If a run is interrupted by Ctrl+C, a network failure or a crash, run the **same command** again:
- Assets already recorded as `uploaded` or `exists` are skipped.
- `failed` assets are retried.
- Ctrl+C lets in-flight uploads finish and then stops cleanly.

### Results file

`results/upload-results.json` records, per asset:

| Field | Meaning |
|---|---|
| `id`, `localPath`, `publicId`, `resourceType` | Identity |
| `status` | `uploaded`, `exists`, or `failed` |
| `secureUrl`, `version`, `remoteBytes` | What Cloudinary returned |
| `originalChecksum` | SHA-256 and size of the local master |
| `uploadedChecksum` | MD5 and SHA-256 of the exact bytes sent, Cloudinary's ETag, and whether they match |
| `preprocessed` | For resized images: tool, original and new dimensions, new size and SHA-256 |
| `uploadedAt` | Timestamp (only for `uploaded`) |
| `error` | Message, HTTP code and attempts (only for `failed`) |
| `warnings` | Anything unexpected, e.g. a size mismatch |

The results file never contains the API key or secret. Error messages are redacted. It contains public delivery URLs only, so it is safe to commit if you want the mapping in version control.

### Security precautions

- Credentials come only from the git-ignored `.env`, never from source code, the manifest or the results.
- Run the script from a trusted machine, not from CI logs that capture environment variables.
- Do not paste `.env` contents into chats, tickets or commits. If a secret is exposed, rotate it in the Cloudinary dashboard.
- Uploading is a deliberate action: it only happens with an explicit `--upload`.

## 11. Things to verify in the Cloudinary dashboard before uploading

- **Plan and current usage:** the dry run reports these from the API. At the last check the account was on the Free plan with 0.17 of 25 credits used and these limits: 10 MB per image, 100 MB per video, 25 MP per image, 50 MP total including transformed output. Re-confirm in the dashboard.
- **Free-plan implications:** 25 credits a month cover storage, bandwidth and transformations together. The migration adds about 61 MB of storage, but delivery bandwidth and derived images (one per width and format) are what consume credits after the switch. The 50 MP total-pixel cap also applies to transformed output.
- **Folder mode** (Settings → Upload / Folders): fixed or dynamic. This decides whether `asset_folder` is passed (see `uploadDefaults.notes`).
- **No existing assets** under `geo-jainism/site/`, `geo-jainism/shop/` or `geo-jainism/virasat/` (Media Library search by prefix).
- **Security settings:** "Strict transformations" must be **off**, otherwise on-the-fly `w_`/`f_auto` URLs will fail unless every transformation is pre-allowed. Also check that no media types or delivery formats are restricted.
- **Default upload preset or incoming transformation** on the account. Masters should be stored unmodified.
- **CORS** for the WebGL textures and the video texture: confirm in testing that delivery responses carry `Access-Control-Allow-Origin`.

---

## 12. Regenerating

The manifest was generated from a scan of the actual files (dimensions read from file headers, SHA-256 for duplicate detection), combined with the reference map from the image audit. If assets are added or renamed before upload, regenerate it and re-check `summary.publicIdCollisions` and `summary.duplicatesWithinManifest`.

---

## 13. Frontend integration

### Files

| File | Role |
|---|---|
| `scripts/cloudinary/generate-asset-map.mjs` | Node-only. Joins the manifest and the upload results into `src/lib/cloudinary/asset-map.json`. Any missing, duplicate, failed or inconsistent entry is an error. |
| `src/lib/cloudinary/asset-map.json` | **Generated, do not edit.** 172 entries keyed by manifest id (`site/journey/03-team-group`), each with the exact `secureUrl`, public ID, resource type, version, format, dimensions, category, strategy and priority. `paths` maps every original local path to its key. About 90 KB (7 KB gzipped); it is only included in chunks that import `@/lib/cloudinary`. |
| `src/lib/cloudinary/urls.js` | Pure helpers: `insertTransformation`, `imageUrl`, `imageSrcSet`, `responsiveWidths`, `videoUrl`, `isPixelSensitive`. |
| `src/lib/cloudinary/resolver.js` | Lookup by key or local path, bound to a map (`createAssetResolver`). |
| `src/lib/cloudinary/index.js` | The app entry point: `import { getAsset, getImageUrl, getImageSrcSet, getVideoUrl } from "@/lib/cloudinary"`. |

```bash
node scripts/cloudinary/generate-asset-map.mjs           # regenerate after any upload
node scripts/cloudinary/generate-asset-map.mjs --check   # exit 1 if the map is stale or invalid
```

### URL rules

- Every URL starts from the asset's exact recorded `secureUrl`. Only transformation segments are inserted after `/upload/`, so the version, public ID and extension are never rebuilt. A URL that already contains transformations is rejected.
- Components are separate path segments: `.../upload/c_limit,w_1024/q_auto/f_auto/v<version>/<public-id>.jpg`.
- `c_limit` only shrinks (no upscaling, no cropping), and the requested width is also capped at the asset's native width. `responsiveWidths` never offers a candidate wider than the source, e.g. a 679 px image gets `[640, 679]`.
- **Pixel-sensitive assets** (strategy `webgl-texture`, category `shop-3d-texture`) are returned untouched, with no resize, `q_auto` or `f_auto`, unless the caller passes `{ allowLossy: true }`.
- Videos get `q_auto/f_auto` and keep the `.mp4` extension. Pass `{ quality: false, format: false }` for the master.
- Unknown keys or paths are never ignored and there is **no local-file fallback**: they throw in development and production. `node scripts/cloudinary/check-asset-references.mjs` catches a mistyped key before it can ship.
- Only public delivery URLs are used. No credentials are read by the frontend.

### Helpers added for the wider migration

- `getImageProps(key, { widths, sizes, srcWidth })` returns `{ src, srcSet, sizes }` to spread onto an `<img>`. `sizes` is mandatory (a string, or a function of the image's aspect ratio) so a `srcset` is never left to default to `100vw`.
- `coverSize(boxWidth, boxHeight, aspect, scale)` gives the real rendered width of an `object-fit: cover` image, `max(boxWidth, boxHeight x aspect) x scale`, and `buildSizes([[mediaQuery, size], ...], fallback)` composes the `sizes` attribute. Most images here are `cover` boxes, so `100vw` or the box width alone would under-deliver (soft images) or over-deliver.
- `WIDTH_LADDERS` (`thumb`, `small`, `medium`) are shared, so different components reuse the same derived images on Cloudinary.
- CSS backgrounds cannot use `srcset`; they take one `getImageUrl(key, { width })`, capped at the image's native width.

### Migrated so far: `site/journey` (all 10 photographs, 57 references)

| Where | Refs | Rendering | Mounted |
|---|---|---|---|
| `constants/landingData.js` (`JOURNEY_SLIDES`, `COURSES`, `BLOGS`) | 19 | data constants now hold `asset` keys, not paths | n/a |
| Landing `#journey` (`JourneyCarousel.jsx`) | 10 slides | full-bleed `<img>`, cover, active slide x1.06 | yes |
| Landing `#courses` (`Courses.jsx`) | 1 rendered (`COURSES[0]`); 5 unused entries | card `<img>` | yes |
| About (`About/index.jsx`) | 18 | 2 parallax CSS backgrounds (`CinematicBreak`), 1 CSS background (stats), 3 trio cards, 20 marquee tiles, founder portrait, film card | yes |
| Tamil Jain `TJSilence` | 4 | 2x2 image grid | yes |
| Tamil Jain `TJTemples` (9), `TJTimeline` (4), `TJRestored` (2), `TJRani` (1) | 16 | cards / frames | **no** (commented out or not imported) |
| Landing `Blogs.jsx`, `Trailer.jsx` | 3 + 10 slides | cards, 16:9 frame, 64x40 thumbnails | **no** |

### Migrated in step 9: editorial and Tamil Jain content (25 references, all rendered)

| Asset group | Refs | Where | Rendering |
|---|---|---|---|
| `site/landing/literature/*` | 5 | `landingData.js` `TIMELINE_ITEMS` -> `Heritage.jsx` (`/`) | 16:10 cover frame; width = row - 590px card - dot column |
| `site/ground-documentation/*` | 4 | `Challenges.jsx` (`/`) | 220px cover cards in an auto-fit grid (1-4 columns) |
| `site/tamil-jain/century-wall/*` | 7 | `TJCenturyWall.jsx` (`/tamil-jain`) | full-bleed cinematic panel, Ken Burns 1.07 |
| `site/tamil-jain/hills/*` | 5 | `TJThingalur.jsx` (`/tamil-jain`) | full-viewport background + 64x86 thumbnails (desktop only) |
| `site/tamil-jain/inscriptions/*` | 3 | `TJInscriptions.jsx` | 210px cover cards (were Vite imports) |
| `site/tamil-jain/shayanika` | 1 | `TJJainBeds.jsx` | parallax cover image; the only call using an extra 3072px rung |

### Migrated in step 10: Shop

The Shop refers to images by short keys (`products/<slug>-1`, `cat-<name>`, `hero-main`, ...). `src/pages/Shop/data/media.js` keeps its exports (`img`, `imgSm`, `srcSet`) and now maps each key to an asset-map key through `assetKey()` (unknown key = throw, no fallback). New there: `imageProps()`, `CARD_SIZES` (grid4 / listing / rail), `SHOP_WIDTHS`, `coverTextureUrl()` / `artTextureUrl()`.

- Master = the old 1600px-class file (1280px wide); the old `-sm` 640px file is now a derived `c_limit,w_640` URL. Candidate widths come from the shared ladders (full 640/1024/1280, small 320/640 = the old "-sm" cap, thumbnails 160/320).
- `ShopImage` (`components/common/ui.jsx`) is the single place that turns a key into `src`/`srcSet`/`sizes`; callers pass the real `sizes` (cards, cart, checkout, wishlist, search thumbnails, hero, categories, story, gift banner).
- Gallery: thumbnails use the thumbnail ladder; the main image uses the full ladder with `sizes` multiplied by the 1.9x hover zoom (Quick View passes its own `stageSizes`); the lightbox uses the optimised master.
- 3D textures (`shop/covers/*` for books, `shop/art/*` for framed prints; the diya has none) use the exact recorded master URL with no transformation (`getAssetUrl`). Only the texture the product's model needs is resolved. `ProductStage3D.jsx` is unchanged.
- `check-asset-references.mjs` validates every Shop data key (24 products x 3 images, categories, editorial, 3D textures per model) against the asset map.
- Not migrated: `story-craft` (not uploaded, unused), `shop-assets/CREDITS.json` (runtime JSON fetch, not an image), the local `-sm` derivatives, and `public/sw.js`.

### Migrated in step 11: Virasat

`src/pages/Virasat/data/site.js` keeps `img` / `imgSm` / `srcSet` and maps each short key ("vs-event-01") to the asset-map key `virasat/images/<key>`; unknown key = throw. New there: `imageProps()`, `coverBox()` / `PAGE` (a `sizes` builder for cover boxes), `VIRASAT_WIDTHS`. `HERO_MEDIA.video` is `getVideoUrl("virasat/video/virasat-hero")` (the exact mapped version and public ID, `q_auto` / `f_auto`).

- 35 images (all rendered): About 3, Experience 10 (the second photo of each act is hidden below 1024px), Founder, Contact background, upcoming-show card + modal, Gallery tiles (18), hero poster (reduced motion + preloader). The gallery lightbox keeps using the optimised master. Gallery/events data carry the key (`key`, `imageKey`).
- Many photographs sit in boxes much taller than they are wide, so cover makes a landscape photo about twice the box width: `sizes` is derived from the measured layout, not from the box width alone. The Contact background always needs more than its 1600px master, so it always gets the largest candidate.
- Hero film: the same `<video>` elements and attributes as before (muted loop autoplay playsInline preload="auto", no poster attribute; the film modal with controls). No `crossOrigin`: it is not drawn to a canvas.
- Not migrated: the unmounted 3D scene (`components/three/*`, imported nowhere; its `useVideoTexture` already sets `crossOrigin: "anonymous"`), 12 unreferenced local files that are not in the manifest (`diyas`, `vs-bihar`, ...), `CREDITS.json` (runtime fetch), `public/sw.js`.
- Checker: `check-asset-references.mjs` also validates every `vs-*` key used under `src/pages/Virasat`.

### Migrated in step 12: hero, decorative and background images (9 assets, 14 references)

| Asset | Where | Delivery |
|---|---|---|
| `site/landing/mahavira` (LCP) | `Landing/sections/Hero.jsx` `<img>` | srcset (shared medium ladder, capped at 2048) with `sizes` measured on the page; **the preload in `index.html` is generated at build time** |
| `site/landing/mandala` | `Hero.jsx`, `TamilJain/index.jsx` | srcset, `sizes` = the CSS width clamp |
| `site/landing/hero-bg` | `#hero` light-theme CSS background | inline custom property `--hero-bg-image` set by `Hero.jsx`; `landing.css` keeps size/position/repeat; the 1536px master |
| `site/landing/screening-popup` | `components/common/ScreeningPopup.jsx` | srcset; still only rendered once the popup opens |
| `site/about/hero-tirthankara` | About parallax background (inline style) | master |
| `site/auth/login-bg` | `features/auth/AuthShell.jsx` | master (it renders ~1470px wide) |
| `site/tamil-jain/hero/temple` (LCP) | `TJCinematicHero.jsx` | master (it renders at or above its native width); `loading="eager"` and `fetchpriority="high"` kept |
| `site/tamil-jain/hero/birds` | 4 `<img>` in `TJCinematicHero.jsx` | one shared 960px URL for all four, so the hidden pair never downloads a second variant |
| `site/tamil-jain/hero/sky` | `.tj-sky-full` background (inline style) | master |

Hero preload: `index.html` holds a `<!--HERO_PRELOAD-->` marker; `vite.config.js` (`heroImagePreload`) replaces it with a `<link rel="preload" as="image" fetchpriority="high">` whose `imagesrcset` / `imagesizes` come from `src/pages/Landing/heroMedia.js`, the same constants the hero `<img>` uses, resolved through the shared strict resolver (a missing key fails the build). The preload was and still is present on every route (it lives in the shared HTML shell).

Stays local on purpose:
- `src/config/seo.js` default `og:image` (`/hero-tirthankara.jpg`): the file is imported by plain Node in `scripts/prerender.mjs` (no `@` alias, no JSON import there) and social crawlers expect a stable same-origin absolute URL.
- `public/logo.png`: favicon, apple-touch icon, web manifest, navbar, JSON-LD and admin; it is not in the manifest.
- Runtime JSON (`shop-assets/CREDITS.json`, `virasat/images/CREDITS.json`), `GEOJ BROCHURE.pdf`.

Unreferenced local files (not migrated; several are not in the manifest): `public/temple.png`, `public/Screening (1).png`, `public/tamiljain/{fog,dust,mahavir,sky-bg,temple-cinematic.mp4,birds}.*`, `src/assets/images/landing/{bar,hero,space,sphere,story}.png`, the 12 unused `public/virasat/images/*` files, and `src/pages/TamilJain/century-wall/century-wall.ts` (not imported).

Remaining local references to manifest assets (repo-wide audit after step 12): 37 assets, all in `public/sw.js`'s precache list (36 of them only there) plus the og:image above. Step 13 removed them from the precache; the only remaining reference to a manifest asset's local path (outside the worker's purge list) is the og:image.

### Service worker (step 13)

`public/sw.js` no longer pre-caches local copies of migrated media. Cache version `geo-jainism-assets-v1` -> `v2`.

- Precache: 59 -> 22 entries (`/`, `GEOJ BROCHURE.pdf`, `logo.png` and 19 local media files that no page references and that are not in the manifest). Media in the precache: 57 files / 46,544,157 bytes (44.4 MiB) -> 20 files (the 19 plus the logo) / 24,072,329 bytes (22.96 MiB); with the brochure (9,276,633 bytes) the precache goes from about 55.8 MB to about 33.3 MB. The 37 removed entries (22,471,828 bytes, 21.4 MiB) are exactly the manifest assets that were pre-cached, including the og:image's `hero-tirthankara.jpg` (the file itself stays in `public/`, and `og:image` metadata is unchanged).
- `OBSOLETE_MEDIA` in the worker lists those 37 paths. On activate the worker copies every entry of an older `geo-jainism-assets-*` cache into the current cache, except those 37 and old runtime copies of the migrated Shop/Virasat images (`/shop-assets/*`, `/virasat/images/*`), then deletes the old cache. Caches without the prefix are never touched. `skipWaiting()` / `clients.claim()` are as before.
- Fetch: cross-origin requests (Cloudinary images and video, fonts, APIs) and any request with a `Range` header are no longer intercepted: Cloudinary's own `Cache-Control` / CORS / `Vary` apply, nothing from the CDN is stored in Cache Storage, and video keeps streaming and seeking (206). Same-origin images are still served cache-first, other same-origin requests network-first, as before.
- Offline: unchanged in kind. Only the document `/` (the prerendered HTML), the logo, the brochure and the other precached files are available offline; the JS/CSS bundles were never cached, so the app does not boot offline (before or after this step). **Media that the browser's HTTP cache has not retained is not guaranteed to be available offline.**
- Check: `node scripts/cloudinary/check-service-worker.mjs` (no migrated asset in the precache, og:image file present and not pre-cached, essential entries present, every precache path resolves, no duplicates, no Cloudinary URLs, purge list valid, cross-origin / Range pass-through, version bumped).
- Follow-up candidate (not done: outside this step): the 19 remaining unreferenced media files are 22.6 MB, 12.2 MB of it `tamiljain/temple-cinematic.mp4`; the brochure is 9.3 MB. They are still pre-cached for every visitor.

Left local on purpose (outside this scope): `mahavira`, `mandala`, `hero-bg`, `screening-popup`, `login-bg`, `about/hero-tirthankara`, the Tamil Jain `temple`/`birds`/`sky`, and the Virasat/Shop assets. No content reference to an unmapped asset exists.

Not migrated on purpose:
- `public/sw.js` still lists the local files in its precache list, so first-time visitors still download them. Updating the service worker is a separate task.
- The local originals (`public/journey/`, `public/ground-documentation/`, `public/Literature-and-legacy/`, `public/journey-throught-time/`, `public/TJpageCarousel/`, `src/assets/images/Inscription/`, `src/assets/images/Shayanika/`) are untouched.
- `TIMELINE_ITEMS` contains no Journey photographs (it uses `/Literature-and-legacy/*`, a different asset group).

Each component derives its own `sizes` from its CSS (breakpoints, grid columns, paddings, box heights). If a layout's CSS changes, update the matching `sizes` constants next to the component.

### Checking the migration

```bash
node scripts/cloudinary/generate-asset-map.mjs --check                       # map valid and up to date
node scripts/cloudinary/check-asset-references.mjs                           # every key used in src/ exists; remaining local refs by group
node scripts/cloudinary/check-asset-references.mjs --forbid-local site/journey   # fails if a Journey photo is referenced locally again (repeatable, e.g. also site/tamil-jain/hills)
```

### Rolling back

Revert the migrated component files and `landingData.js` (git); the local files in `public/journey/` were not touched.
