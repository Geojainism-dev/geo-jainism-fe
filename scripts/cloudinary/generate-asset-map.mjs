#!/usr/bin/env node
/**
 * Builds src/lib/cloudinary/asset-map.json from the two authoritative records:
 *   - scripts/cloudinary/migration-manifest.json        (what was approved)
 *   - scripts/cloudinary/results/upload-results.json    (exact secure URLs of what was uploaded)
 *
 *   node scripts/cloudinary/generate-asset-map.mjs           # (re)generate the map
 *   node scripts/cloudinary/generate-asset-map.mjs --check   # fail if the committed map is stale or invalid
 *
 * Node-only. The React app imports only the generated JSON (never this script).
 * Public IDs and URLs are taken verbatim from the results file - nothing is reconstructed from file names.
 * Any missing, duplicate, failed or inconsistent entry is an ERROR (exit code 1); nothing is silently skipped.
 * No credentials are read or written.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MANIFEST = path.join(ROOT, "scripts/cloudinary/migration-manifest.json");
const RESULTS = path.join(ROOT, "scripts/cloudinary/results/upload-results.json");
const OUT = path.join(ROOT, "src/lib/cloudinary/asset-map.json");
const check = process.argv.includes("--check");

const errors = [];
const fail = (msg) => errors.push(msg);
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

const manifestText = fs.readFileSync(MANIFEST, "utf8");
const manifest = JSON.parse(manifestText);
const results = read(RESULTS);

if (!Array.isArray(manifest.assets) || !manifest.assets.length) fail("manifest has no assets");
if (!Array.isArray(results.assets)) fail("results file has no assets array");
if (errors.length) { report(); }

// ── index the results, detecting duplicates ──────────────────────────────────
const resultsById = new Map();
for (const r of results.assets) {
  if (resultsById.has(r.publicId)) fail(`results: duplicate record for ${r.publicId}`);
  resultsById.set(r.publicId, r);
}

// ── join manifest -> results ─────────────────────────────────────────────────
const URL_RE = /^https:\/\/res\.cloudinary\.com\/([a-z0-9_-]+)\/(image|video)\/upload\/v(\d+)\/(.+)\.([a-z0-9]+)$/i;
const assets = {};
const paths = {};
const seenIds = new Set();
const seenPaths = new Set();
const seenPublicIds = new Set();
const seenUrls = new Set();
const clouds = new Set();

for (const a of manifest.assets) {
  const tag = `[${a.id}]`;
  if (seenIds.has(a.id)) fail(`${tag} duplicate manifest id`);
  if (seenPaths.has(a.localPath)) fail(`${tag} duplicate localPath ${a.localPath}`);
  if (seenPublicIds.has(a.publicId)) fail(`${tag} duplicate publicId`);
  seenIds.add(a.id); seenPaths.add(a.localPath); seenPublicIds.add(a.publicId);

  const r = resultsById.get(a.publicId);
  if (!r) { fail(`${tag} has no upload result`); continue; }
  if (r.status !== "uploaded" && r.status !== "exists") { fail(`${tag} upload status is "${r.status}"`); continue; }
  if (r.resourceType !== a.resourceType) fail(`${tag} resourceType differs (manifest ${a.resourceType}, results ${r.resourceType})`);
  if (r.localPath !== a.localPath) fail(`${tag} localPath differs between manifest and results`);
  if (r.id !== a.id) fail(`${tag} id differs between manifest and results`);

  const m = URL_RE.exec(r.secureUrl ?? "");
  if (!m) { fail(`${tag} secureUrl is not a well-formed Cloudinary delivery URL: ${r.secureUrl}`); continue; }
  const [, cloud, type, version, urlPublicId, ext] = m;
  clouds.add(cloud);
  if (type !== a.resourceType) fail(`${tag} URL resource type "${type}" != "${a.resourceType}"`);
  if (urlPublicId !== a.publicId) fail(`${tag} URL public ID "${urlPublicId}" != manifest "${a.publicId}"`);
  if (Number(version) !== Number(r.version)) fail(`${tag} URL version v${version} != recorded version ${r.version}`);
  if (seenUrls.has(r.secureUrl)) fail(`${tag} duplicate secureUrl`);
  seenUrls.add(r.secureUrl);
  if (!Number.isInteger(a.width) || !Number.isInteger(a.height) || a.width <= 0 || a.height <= 0) fail(`${tag} missing/invalid dimensions`);

  const entry = {
    url: r.secureUrl,
    publicId: a.publicId,
    resourceType: a.resourceType,
    version: Number(version),
    format: a.format,
    width: a.width,
    height: a.height,
  };
  if (a.hasAlpha) entry.hasAlpha = true;
  if (a.resourceType === "video") entry.durationSeconds = a.durationSeconds;
  entry.category = a.category;
  entry.strategy = a.transformationStrategy;
  entry.priority = a.loadingPriority;
  if (a.duplicateOf) entry.duplicateOf = a.duplicateOf.replace(/^geo-jainism\//, "");
  // Upload-time resize (oversized masters): record what Cloudinary actually holds.
  if (r.preprocessed?.to) { entry.width = r.preprocessed.to.width; entry.height = r.preprocessed.to.height; entry.resizedFrom = `${a.width}x${a.height}`; }

  assets[a.id] = entry;
  paths[a.localPath] = a.id;
}
for (const id of resultsById.keys()) if (!seenPublicIds.has(id)) fail(`results: record ${id} is not in the manifest`);
if (clouds.size !== 1) fail(`URLs reference ${clouds.size} different cloud names (expected exactly 1)`);
if (Object.keys(assets).length !== manifest.assets.length && !errors.length) fail("internal: entry count mismatch");
if (manifest.summary?.totalAssets !== manifest.assets.length) fail("manifest summary.totalAssets does not match assets.length");

// ── build output (deterministic: manifest order, no timestamps) ──────────────
const fingerprint = sha256(JSON.stringify(Object.values(assets).map((e) => [e.publicId, e.url, e.version])));
const output = {
  meta: {
    note: "GENERATED FILE - do not edit. Regenerate with: node scripts/cloudinary/generate-asset-map.mjs",
    manifestSha256: sha256(manifestText),
    urlsSha256: fingerprint,
    count: Object.keys(assets).length,
    images: Object.values(assets).filter((e) => e.resourceType === "image").length,
    videos: Object.values(assets).filter((e) => e.resourceType === "video").length,
  },
  assets,
  paths,
};
const text = JSON.stringify(output, null, 1) + "\n";

if (errors.length) report();

if (check) {
  let current = "";
  try { current = fs.readFileSync(OUT, "utf8"); } catch { /* handled below */ }
  if (current !== text) { fail("src/lib/cloudinary/asset-map.json is missing or out of date - run: node scripts/cloudinary/generate-asset-map.mjs"); report(); }
  console.log(`OK: asset map is up to date and valid (${output.meta.count} assets: ${output.meta.images} images, ${output.meta.videos} video).`);
} else {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, text);
  console.log(`Wrote ${path.relative(ROOT, OUT)}: ${output.meta.count} assets (${output.meta.images} images, ${output.meta.videos} video), ${(text.length / 1024).toFixed(1)} KB.`);
}

function report() {
  console.error(`\nAsset map validation FAILED (${errors.length} error(s)):`);
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
