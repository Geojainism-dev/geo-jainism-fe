# Cloudinary production migration runbook

Run this **after the Cloudinary migration PR is merged**. No production upload has been done yet.

## A. Purpose and prerequisites

Development uploaded the 172 assets in `scripts/cloudinary/migration-manifest.json` (171 images, 1 video) to a **development** Cloudinary account. The app reads their URLs only from `src/lib/cloudinary/asset-map.json`, which is generated from `scripts/cloudinary/results/upload-results.json`. Production uses a **different account**, so:

- all 172 assets must be uploaded again, with the same public IDs;
- the asset map must be regenerated;
- the site must be rebuilt.

No application code changes. Only those two generated files are committed. Local media files stay as they are.

**You need:**

- Git.
- Node.js **20.9 or newer** (required by `sharp`; the deployment configs use Node 20).
- npm.
- The production Cloudinary cloud name, API key and API secret.
- Access to the production Cloudinary dashboard.

**Credentials** go only in `geo-jainism-fe/.env`. The uploader reads that file and nothing else; it ignores `process.env`. Rules:

- Never use a `VITE_` prefix: Vite embeds `VITE_*` values in the public bundle.
- Never add Cloudinary credentials to the deployment or CI environment.

The frontend needs no Cloudinary variable at all.

All commands are bash (Git Bash on Windows) and run from `geo-jainism-fe/`.

## B. Procedure

**1. Get the merged code and record the development cloud name.**

```bash
git clone <frontend repo URL> geo-jainism-fe-prod && cd geo-jainism-fe-prod   # or: git checkout main && git pull
git status --short                       # must print nothing
git rev-parse HEAD                       # restore point
node scripts/cloudinary/generate-asset-map.mjs --check
node -e 'const m=require("./src/lib/cloudinary/asset-map.json");console.log(m.meta.count,[...new Set(Object.values(m.assets).map(a=>a.url.split("/")[3]))])'
DEV_CLOUD=<the cloud name printed above>   # ebyrkgbk at the time of writing
```

Stop unless the check prints `OK ... 172 assets` and exactly one cloud name.

**2. Install dependencies.** No lockfile is committed, so `npm ci` won't work.

```bash
node --version    # >= 20.9.0
npm install
```

If the prerender later reports that Chrome is missing, run `npx puppeteer browsers install chrome`.

**3. Back up the development results and map, outside the repository.**

```bash
BACKUP_DIR="../cloudinary-backup-$(date +%Y%m%d-%H%M%S)" && mkdir -p "$BACKUP_DIR"
cp scripts/cloudinary/results/upload-results.json "$BACKUP_DIR/upload-results.dev.json"
cp src/lib/cloudinary/asset-map.json "$BACKUP_DIR/asset-map.dev.json"
```

**4. Move the development results out of the uploader's path.** This step is essential. The uploader resumes by **public ID, not by account**. The development file records all 172 as `uploaded`, so leaving it in place makes the production upload skip everything.

```bash
rm scripts/cloudinary/results/upload-results.json   # still in git: git restore <path> brings it back
```

Until step 8 has finished, do not run `generate-asset-map.mjs`; it errors while this file is absent.

**5. Create the production `.env` and confirm git ignores it.**

```dotenv
CLOUDINARY_CLOUD_NAME=<production cloud name>
CLOUDINARY_API_KEY=<production API key>
CLOUDINARY_API_SECRET=<production API secret>
```

```bash
git check-ignore -v .env    # must print a .gitignore rule
git ls-files .env           # must print nothing
```

The uploader also refuses to run if `.env` is not ignored, is tracked, or contains a `VITE_` credential.

**6. Run the dry runs.** Neither uploads anything. The first makes no network calls; the second makes read-only calls to the account.

```bash
node scripts/cloudinary/upload-assets.mjs --offline
node scripts/cloudinary/upload-assets.mjs
```

The run is good when it ends with `DRY RUN OK` and shows:

- manifest `sha256 8f815dc897eb...`
- `172 assets (171 images, 1 video)`
- `172/172 files verified OK`
- `6/6 trial resizes verified`
- `credentials accepted by Cloudinary`, with plan, usage and limits matching the **production** dashboard. The cloud name is masked here, so compare the `.env` value with the dashboard yourself.
- `collide with selected public IDs: 0`
- `already recorded ... 0/172   to do: 172`

**Stop if:**

- any file fails verification. Never edit the manifest to make it pass.
- `to do` is not 172. Go back to step 4.
- collisions are greater than 0. See section F.
- an asset exceeds the account's limits.
- Cloudinary rejects the credentials.

**7. Upload one pilot asset.** Check the folder mode first (section C). On a fixed-folder account, add `--no-asset-folder` to **every** upload command in steps 7 and 8.

```bash
node scripts/cloudinary/upload-assets.mjs --upload --only site/journey/01-rock-sculpture
node -e 'const r=require("./scripts/cloudinary/results/upload-results.json").assets[0];console.log(r.status,r.publicId,r.secureUrl,r.uploadedChecksum&&r.uploadedChecksum.etagMatchesMd5,r.warnings)'
```

The pilot is good when:

- the status is `uploaded`;
- the public ID is `geo-jainism/site/journey/01-rock-sculpture`;
- the URL contains the **production** cloud name, not `$DEV_CLOUD`;
- the checksum check prints `true`;
- the warnings list is `[]`.

**Stop if:**

- the cloud name is wrong;
- the checksum is not `true`, or a warning mentions a size change. A preset or incoming transformation is altering masters.
- a warning says `no asset_folder`. Confirm the folder mode and use `--no-asset-folder` from here on.

Also confirm in the Media Library that the asset is at `geo-jainism/site/journey/01-rock-sculpture`.

**8. Upload the remaining 171 assets.**

```bash
node scripts/cloudinary/upload-assets.mjs --upload    # [--no-asset-folder]  [--concurrency 1-4] [--retries 1-5]
```

The upload is good when it prints `Done: uploaded 171, existing/skipped 0, failed 0, already done earlier 1.` and exits 0.

If it is interrupted (network, Ctrl+C, crash), re-run the **same command**. Results are saved after every asset: recorded ones are skipped and failed ones are retried. Never delete or restore the results file while a run is unfinished.

**9. Verify all 172 results.**

```bash
node -e 'const a=require("./scripts/cloudinary/results/upload-results.json").assets;const c=s=>a.filter(x=>x.status===s).length;console.log({recorded:a.length,uploaded:c("uploaded"),exists:c("exists"),failed:c("failed"),etagNotMatching:a.filter(x=>x.status==="uploaded"&&x.uploadedChecksum?.etagMatchesMd5!==true).length,withWarnings:a.filter(x=>x.warnings?.length).length,resized:a.filter(x=>x.preprocessed).length,cloudNames:[...new Set(a.map(x=>String(x.secureUrl).split("/")[3]))]})'
```

It must print:

- `recorded: 172, uploaded: 172, exists: 0, failed: 0`
- `etagNotMatching: 0, withWarnings: 0, resized: 6`
- `cloudNames: [ '<production cloud>' ]`

Stop if `exists` is greater than 0: a pre-existing production asset was kept instead of uploaded (section F).

In the Media Library, `geo-jainism/site/`, `geo-jainism/shop/` and `geo-jainism/virasat/` together hold 171 images and the video `geo-jainism/virasat/video/virasat-hero`.

**10. Regenerate and verify the asset map.**

```bash
node scripts/cloudinary/generate-asset-map.mjs
node scripts/cloudinary/generate-asset-map.mjs --check
node -e 'const m=require("./src/lib/cloudinary/asset-map.json");console.log(m.meta.count,[...new Set(Object.values(m.assets).map(a=>a.url.split("/")[3]))])'
grep -c "res.cloudinary.com/$DEV_CLOUD/" src/lib/cloudinary/asset-map.json
node -e 'const a=require(process.argv[1]),b=require("./src/lib/cloudinary/asset-map.json");const strip=m=>JSON.stringify({p:m.paths,s:m.meta.manifestSha256,a:Object.fromEntries(Object.entries(m.assets).map(([k,v])=>{const{url,version,...r}=v;return[k,r]}))});console.log(strip(a)===strip(b)?"OK: only url/version changed":"DIFFERENT: inspect the diff")' "$BACKUP_DIR/asset-map.dev.json"
```

The map is good when:

- the check prints `OK`;
- the cloud-name command prints `172 [ '<production cloud>' ]`;
- `grep -c` prints `0`;
- the comparison prints `OK: only url/version changed`.

The generator writes nothing and fails if any asset is missing or failed, or if the results mix two cloud names. Stop on any error, or on `DIFFERENT`.

**11. Run the reference and service-worker checks.** Their output is the same as before the switch.

```bash
node scripts/cloudinary/check-asset-references.mjs --forbid-local site/landing --forbid-local site/ground-documentation --forbid-local site/journey --forbid-local site/auth --forbid-local site/tamil-jain --forbid-local shop --forbid-local virasat
node scripts/cloudinary/check-service-worker.mjs
```

Both must end with `OK`. The first reports exactly one remaining local reference, `site/about`: the og:image in `src/config/seo.js`, which stays local on purpose. Do not add `--forbid-local site/about`. The second reports 22 precache entries, cache `v2` and 37 obsolete paths.

**12. Build, then verify the build output.**

```bash
npm run build
grep -o '<link rel="preload" as="image"[^>]*>' dist/index.html
grep -rl "res.cloudinary.com/$DEV_CLOUD/" dist ; echo "exit $?"
node --input-type=module -e 'import fs from "node:fs";import path from "node:path";import dotenv from "dotenv";const dir=process.argv[1]||"dist";const env=dotenv.parse(fs.readFileSync(".env"));const keys=["CLOUDINARY_API_KEY","CLOUDINARY_API_SECRET"];const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);let hits=0;for(const f of walk(dir)){const t=fs.readFileSync(f,"latin1");for(const k of keys){const v=(env[k]||"").trim();if(v.length>=4&&t.includes(v)){hits++;console.log("FOUND",k,"in",f);}}if(/CLOUDINARY_API_(KEY|SECRET)/.test(t))console.log("variable name appears in",f);}console.log(hits?"FAIL: credentials found":"OK: no credential values in "+dir);process.exitCode=hits?1:0' dist
node --input-type=module -e 'import fs from "node:fs";const m=JSON.parse(fs.readFileSync("src/lib/cloudinary/asset-map.json","utf8"));const bad=[];let ok=0;for(const [k,a] of Object.entries(m.assets)){const r=await fetch(a.url,{method:"HEAD"});if(r.ok)ok++;else bad.push(r.status+" "+k);}console.log("reachable:",ok,"failed:",bad.length);bad.forEach(b=>console.log("  "+b));process.exitCode=bad.length?1:0'
curl -sI "$(grep -o 'imagesrcset="[^ ]*' dist/index.html | head -1 | sed 's/imagesrcset="//')" | head -3
```

The build is good when:

- the build exits 0 and prints 5 `[prerender]` lines (`/`, `/tamil-jain`, `/about`, `/virasat`, `/shop`);
- the preload tag's URLs (`w_640` to `w_2048`, `mahavira`) are all on the production cloud;
- the dev-cloud `grep` lists no files (`exit 1`);
- the credential scan prints `OK: no credential values in dist`;
- the reachability check prints `reachable: 172 failed: 0`;
- the transformed hero URL returns HTTP `200`.

The credential scan reads the key and secret from `.env` and never prints them. If it finds a hit, do not deploy, and rotate the secret.

**13. Browser smoke test.** Run `npm run preview` (port 4173) in a fresh profile or private window, then do the browser checks in section D.

**14. Review and commit only the two generated files.**

```bash
git status --short    # exactly: M scripts/cloudinary/results/upload-results.json, M src/lib/cloudinary/asset-map.json
git checkout -b chore/cloudinary-production-urls
git add scripts/cloudinary/results/upload-results.json src/lib/cloudinary/asset-map.json
git commit -m "Point the Cloudinary asset map at the production account"
```

Stop if anything else appears in `git status`: `.env`, media files or source files.

**15. Deploy through the normal production pipeline**, from a commit that contains the new map. The URLs and the hero preload are baked in at build time. Then repeat the section D browser checks on the live site. Afterwards, delete the local `.env` or store it securely.

## C. Production account checklist (dashboard, before step 6)

Do not assume production matches development. Check:

- **Account.** The cloud name in `.env` equals the production dashboard's, and differs from `$DEV_CLOUD`.
- **Folder mode** (Settings, Upload / Folders):
  - Dynamic: use `node scripts/cloudinary/upload-assets.mjs --upload` (sends `asset_folder`).
  - Fixed: use `node scripts/cloudinary/upload-assets.mjs --upload --no-asset-folder`.
  - Public IDs are exact either way: the uploader checks the returned `public_id` and fails on a mismatch.
- **Masters stored untouched.** No default upload preset or incoming transformation. The pilot's ETag/MD5 check confirms this.
- **Delivery allowed.** "Strict transformations" is **off**, and image and video `upload` delivery is not restricted. Otherwise the app's `c_limit,w_N/q_auto/f_auto` URLs fail.
- **Plan limits.** At least 11.2 MP and about 10 MB per image, and 12.48 MB per video. The six 8192 x 5464 images are downscaled to 4096 x 2732 during upload, and the originals are never modified. The dry run checks the limits too.

## D. Validation checklist

**Automated** (steps 9–12): all must pass.

- **Results:** 172 uploaded, 0 exists, 0 failed, 0 ETag mismatches, 6 resized, one production cloud.
- **Map:** `--check` OK, no `$DEV_CLOUD`, only URL/version changed.
- **References and service worker:** reference check OK (one og:image local ref); service-worker check OK.
- **Build:** build and 5 prerendered routes OK, hero preload on production, no dev URLs or credentials in `dist/`.
- **Delivery:** 172/172 URLs reachable; a transformed URL returns 200.

**Browser**, at desktop (~1440 px) and mobile (~390 px). In DevTools Network, filter on `cloudinary`.

- **All pages:**
  - every Cloudinary request goes to the production cloud;
  - no console `[cloudinary] unknown asset key` errors;
  - no failed media requests.
- **Landing `/`:**
  - the `mahavira` hero downloads **once**: the preload is reused, with no second width;
  - the mandala and hero background load;
  - the Journey, Heritage and Challenges sections render;
  - the screening popup poster loads.
- **About and Tamil Jain:**
  - About: hero background, journey photos, founder portrait;
  - Tamil Jain: temple, birds and sky hero, Century Wall, hills, inscriptions and Shayanika;
  - `currentSrc` uses `c_limit,w_N/q_auto/f_auto`.
- **Shop:**
  - cards, categories and editorial images;
  - the product gallery: thumbnails, main image, zoom and lightbox;
  - the 3D view on a **book** (`shop/covers/`) and a **framed print** (`shop/art/`):
    - the texture shows on the model;
    - the texture request is the **untransformed** `.../image/upload/v<n>/...` URL;
    - the response has `access-control-allow-origin`;
    - there are no WebGL or CORS errors.
- **Virasat:**
  - the images render (Experience's second photos appear only at 1024 px and wider);
  - the hero video (`.../video/upload/q_auto/f_auto/...`) autoplays muted and loops;
  - in the film modal, play it and **seek to about 90 s**: the responses are `206` and playback continues. The first request may be slow while Cloudinary derives the format.
- **Login:** the `site/auth/login-bg` background loads.
- **Service worker** (DevTools, Application):
  - only `geo-jainism-assets-v2` exists;
  - it has no `res.cloudinary.com` entries;
  - after a reload, an old `geo-jainism-assets-v1` cache is gone;
  - Cloudinary requests are not served "(ServiceWorker)".
- **Social:** the deployed HTML has `og:image` = `https://geojainism.com/hero-tirthankara.jpg`, and that URL returns 200.

## E. Recovery

- **Partial upload:** re-run the same upload command (step 8). Do not delete or restore the in-progress results file.
- **Failed asset:**
  - read its `error` in `scripts/cloudinary/results/upload-results.json`;
  - fix the cause (limits, restricted type, credentials);
  - re-run. Only failed assets are retried. `--only <id>` isolates one, for example `--only virasat/video/virasat-hero`.
- **Restore the development results and map:**
  - `git restore scripts/cloudinary/results/upload-results.json src/lib/cloudinary/asset-map.json`, or copy them back from `$BACKUP_DIR`;
  - first save the production results with `cp scripts/cloudinary/results/upload-results.json "$BACKUP_DIR/upload-results.prod.json"`; it is the only record of the production upload.
- **Broken map or build:**
  - don't commit or deploy;
  - an `unknown asset key` error means the map is incomplete, so finish the upload and regenerate;
  - a prerender failure is usually Chrome: run `npx puppeteer browsers install chrome`.
- **Bad deployment:** `git revert <map commit>` and redeploy, or redeploy the previous build. Development URLs work only while the development account still serves those assets.
- **Exposed secret:** rotate it in the production Cloudinary dashboard immediately. Rebuild and redeploy if it reached `dist/`.

Local media and Cloudinary assets are never deleted by any of these steps.

## F. Caveats

- **Move the development results file out first** (step 4). Otherwise the production upload skips everything.
- **The `exists` status is not fully supported by the current tooling.**
  - `check-service-worker.mjs` counts only `uploaded`/`skipped-existing` records, so assets recorded as `exists` make it fail.
  - For the six resized images, an `exists` record has no resize data, so the map gets 8192 x 5464 instead of 4096 x 2732.
  - If the dry run reports any public-ID collision, **stop**. Have the account owner remove or rename the conflicting assets in the dashboard, then re-run the dry run until it reports `0`. Do not upload over or alongside them.
- **URLs are compiled into the build.** The frontend uses the absolute URLs in `asset-map.json`; there is no Cloudinary environment variable. A production build must happen **after** the map is regenerated and committed. An older build keeps serving development URLs.
- **Production host unknown.** The repository contains Amplify, Docker/nginx, Firebase and Vercel configurations, and it isn't clear which serves production. Check that the live host serves `/sw.js` with revalidation (for example `Cache-Control: no-cache`, as `docker/nginx.conf` does), not a long-lived cache.
