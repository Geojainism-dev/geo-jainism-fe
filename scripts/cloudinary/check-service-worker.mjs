#!/usr/bin/env node
/**
 * Service-worker precache check (read-only, no dependencies).
 *
 *   node scripts/cloudinary/check-service-worker.mjs
 *
 * public/sw.js must not pre-cache local copies of media that is delivered from Cloudinary. Verifies:
 *   1. no precache path equals the local path of a successfully uploaded manifest asset (scripts/cloudinary/results/upload-results.json)
 *   2. the retained og:image (src/config/seo.js) is not pre-cached, but the local file still exists
 *   3. the essential entries are still pre-cached ("/", the logo, the brochure)
 *   4. every other precache path resolves to a file in public/
 *   5. no duplicate precache URLs
 *   6. no absolute / Cloudinary URLs in the precache
 *   7. OBSOLETE_MEDIA (the purge list for old caches) only names uploaded-manifest paths and includes the og:image (v1 pre-cached it)
 *   8. the worker does not intercept cross-origin or Range requests, and the cache version is no longer v1
 * Exit code 1 (with a description of each problem) on any failure. It never writes to the manifest, the results or the asset map.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const errors = [];
const fail = (m) => errors.push(m);

const sw = read("public/sw.js");
const results = JSON.parse(read("scripts/cloudinary/results/upload-results.json"));
const entries = Array.isArray(results) ? results : results.results || Object.values(results.assets || results);
const uploaded = new Map(entries.filter((e) => e.status === "uploaded" || e.status === "skipped-existing").map((e) => [e.localPath.replace(/^public/, ""), e.id]));
const manifestLocal = new Set(uploaded.keys()); // web paths such as /mahavira.png (src/ imports have no web path and never match)

const arrayOf = (name, open = "[") => {
  const i = sw.indexOf(`const ${name} =`);
  if (i < 0) { fail(`public/sw.js: \`${name}\` not found`); return []; }
  const start = sw.indexOf(open, i), end = sw.indexOf(open === "[" ? "]" : "]);", start);
  return [...sw.slice(start, end).matchAll(/'([^']+)'/g)].map((m) => m[1]);
};
const precache = arrayOf("ASSETS_TO_CACHE");
const obsolete = arrayOf("OBSOLETE_MEDIA", "[");

// 1
for (const u of precache) if (manifestLocal.has(u)) fail(`precache contains a migrated manifest asset: "${u}" (${uploaded.get(u)}); it is served from Cloudinary and must not be pre-cached`);
// 2
const seo = read("src/config/seo.js");
const og = /DEFAULT_OG_IMAGE\s*=\s*`\$\{SITE_URL\}(\/[^`]+)`/.exec(seo)?.[1];
if (!og) fail("src/config/seo.js: DEFAULT_OG_IMAGE not found");
else {
  if (precache.includes(og)) fail(`the og:image "${og}" must not be pre-cached`);
  if (!fs.existsSync(path.join(ROOT, "public", og))) fail(`the local og:image file public${og} is missing`);
  if (!obsolete.includes(og)) fail(`OBSOLETE_MEDIA must include the og:image "${og}" (version 1 pre-cached it)`);
}
// 3
for (const must of ["/", "/logo.png", "/GEOJ BROCHURE.pdf"]) if (!precache.includes(must)) fail(`essential precache entry missing: "${must}"`);
// 4
for (const u of precache) { if (u === "/") continue; if (!fs.existsSync(path.join(ROOT, "public", u))) fail(`precache path does not resolve to a file in public/: "${u}"`); }
// 5
const seen = new Set(); for (const u of precache) { if (seen.has(u)) fail(`duplicate precache URL: "${u}"`); seen.add(u); }
// 6
for (const u of precache) if (/^[a-z]+:\/\//i.test(u) || /cloudinary/i.test(u)) fail(`absolute or Cloudinary URL in the precache: "${u}"`);
// 7
for (const u of obsolete) if (!manifestLocal.has(u)) fail(`OBSOLETE_MEDIA names a path that is not an uploaded manifest asset: "${u}"`);
// 8
if (!/requestUrl\.origin\s*!==\s*self\.location\.origin/.test(sw)) fail("fetch handler: cross-origin requests (Cloudinary) must be passed through, not intercepted");
if (!/headers\.has\('range'\)/.test(sw)) fail("fetch handler: requests with a Range header must be passed through");
const ver = /const CACHE_NAME\s*=\s*CACHE_PREFIX\s*\+\s*'([^']+)'/.exec(sw)?.[1];
if (!ver) fail("CACHE_NAME is not `CACHE_PREFIX + '<version>'`"); else if (ver === "v1") fail("cache version is still v1; bump it so old caches are migrated");
if (/cache\.(put|add|addAll)\([^)]*cloudinary/i.test(sw)) fail("the worker caches Cloudinary URLs");

console.log(`public/sw.js: ${precache.length} precache entries (checked against ${manifestLocal.size} uploaded manifest assets); cache version ${ver}; OBSOLETE_MEDIA ${obsolete.length} paths.`);
if (errors.length) { console.error(`\nFAILED (${errors.length}):`); errors.forEach((e) => console.error("  - " + e)); process.exit(1); }
console.log("OK: no migrated media is pre-cached; og:image file present; shell entries intact; all precache paths resolve.");
