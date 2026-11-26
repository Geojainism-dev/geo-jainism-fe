#!/usr/bin/env node
/**
 * Static reference check for the Cloudinary migration (Node-only, read-only).
 *
 *   node scripts/cloudinary/check-asset-references.mjs                       # report
 *   node scripts/cloudinary/check-asset-references.mjs --forbid-local site/journey
 *
 * 1. UNKNOWN KEYS (always an error): every string literal in src/ that looks like an asset key
 *    ("site/...", "shop/...", "virasat/...") must exist in src/lib/cloudinary/asset-map.json.
 *    A typo therefore fails here instead of shipping (the runtime also throws on unknown keys).
 * 2. REMAINING LOCAL REFERENCES (reported): application source that still points at a local file whose asset has been
 *    uploaded (e.g. "/journey/01-rock-sculpture.jpg"). With --forbid-local <id-prefix> these become errors for that
 *    prefix. public/sw.js is listed separately (it is the service worker's precache list, not rendering code).
 *
 * --forbid-local can be repeated. Exit code 1 on any error.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const map = JSON.parse(fs.readFileSync(path.join(ROOT, "src/lib/cloudinary/asset-map.json"), "utf8"));
const args = process.argv.slice(2);
const forbid = []; // --forbid-local may be repeated
args.forEach((a, i) => { if (a === "--forbid-local") { const v = args[i + 1]; if (!v || v.startsWith("--")) { console.error("--forbid-local needs an id prefix, e.g. site/journey"); process.exit(2); } forbid.push(v); } });

const CODE = /\.(jsx?|tsx?|mjs)$/;
const TEXT = /\.(jsx?|tsx?|mjs|css|scss|html)$/;
const files = (dir, test) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return ["node_modules", "dist"].includes(e.name) ? [] : files(p, test);
  return test.test(e.name) && e.name !== "asset-map.json" ? [p] : [];
});
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");
const lineOf = (text, idx) => text.slice(0, idx).split("\n").length;

const errors = [];

// 1 ── asset keys used in src/
const KEY_RE = /(["'`])((?:site|shop|virasat)\/[a-z0-9][a-z0-9/-]*)\1/g;
const used = new Map();
for (const f of files(path.join(ROOT, "src"), CODE)) {
  const text = fs.readFileSync(f, "utf8");
  for (const m of text.matchAll(KEY_RE)) {
    const key = m[2];
    used.set(key, (used.get(key) ?? 0) + 1);
    if (!Object.prototype.hasOwnProperty.call(map.assets, key)) errors.push(`${rel(f)}:${lineOf(text, m.index)}  unknown asset key "${key}"`);
  }
}
console.log(`Asset keys referenced in src/: ${used.size} distinct (${[...used.values()].reduce((a, b) => a + b, 0)} uses); map has ${Object.keys(map.assets).length}.`);

// 2 ── remaining local references to uploaded files
const web = Object.entries(map.paths).map(([localPath, id]) => ({ id, p: localPath.replace(/^public/, ""), vite: localPath.startsWith("src/") ? localPath.replace(/^src\//, "") : null }));
const remaining = new Map(); // id -> [{file,line}]
const scan = [...files(path.join(ROOT, "src"), TEXT), path.join(ROOT, "index.html")];
for (const f of scan) {
  const text = fs.readFileSync(f, "utf8");
  for (const { id, p, vite } of web) {
    for (const needle of [p, vite].filter(Boolean)) {
      let i = -1;
      while ((i = text.indexOf(needle, i + 1)) !== -1) {
        // a public path must be a whole path ("/journey/x.jpg"), not a suffix of another ("/x/journey/x.jpg")
        if (needle === p && i > 0 && /[A-Za-z0-9_.-]/.test(text[i - 1])) continue;
        (remaining.get(id) ?? remaining.set(id, []).get(id)).push({ file: rel(f), line: lineOf(text, i) });
      }
    }
  }
}
const byGroup = new Map();
for (const [id, refs] of remaining) { const g = id.split("/").slice(0, 2).join("/"); byGroup.set(g, (byGroup.get(g) ?? 0) + refs.length); }
console.log(`\nRemaining LOCAL references to already-uploaded files in src/ + index.html: ${[...remaining.values()].reduce((a, r) => a + r.length, 0)}`);
for (const [g, n] of [...byGroup].sort()) console.log(`  ${g.padEnd(28)} ${n}`);
if (forbid.length) {
  for (const [id, refs] of remaining) { const hit = forbid.find((f) => id.startsWith(f)); if (hit) for (const r of refs) errors.push(`${r.file}:${r.line}  local reference to ${id} (forbidden: ${hit})`); }
}

// 3 ── shop data keys (the shop refers to images by short keys; src/pages/Shop/data/media.js maps them to asset-map keys)
{
  const read = (f) => fs.readFileSync(path.join(ROOT, "src/pages/Shop/data", f), "utf8");
  const need = (key, where) => { if (!Object.prototype.hasOwnProperty.call(map.assets, key)) errors.push(`src/pages/Shop/data/${where}: no asset-map entry "${key}"`); };
  const products = read("products.js");
  const slugs = [...products.matchAll(/slug:\s*"([a-z0-9-]+)"[\s\S]*?(?=slug:\s*"|$)/g)].map((m) => ({ slug: m[1], model: /model:\s*"(book|frame|diya)"/.exec(m[0])?.[1] ?? null }));
  for (const { slug, model } of slugs) {
    for (let n = 1; n <= 3; n++) need(`shop/products/${slug}-${n}`, "products.js");
    if (model === "book") need(`shop/covers/${slug}`, "products.js (3D cover texture)");
    if (model === "frame") need(`shop/art/${slug}`, "products.js (3D art texture)");
  }
  for (const m of read("categories.js").matchAll(/image:\s*"([a-z0-9-]+)"/g)) need(`shop/categories/${m[1]}`, "categories.js");
  for (const m of read("media.js").matchAll(/^\s+(?:hero|heroDetail|storyA|storyB|storyC):\s*"([a-z0-9-]+)"/gm)) need(`shop/editorial/${m[1]}`, "media.js (EDITORIAL)");
  console.log(`
Shop data keys checked: ${slugs.length} products (3 images each + 3D textures), categories, editorial images.`);
}

// 4 ── Virasat image keys ("vs-event-01", ... in src/pages/Virasat; data/site.js maps them to virasat/images/<key>)
{
  const seen = new Set();
  for (const f of files(path.join(ROOT, "src/pages/Virasat"), CODE)) {
    const text = fs.readFileSync(f, "utf8");
    for (const m of text.matchAll(/["'](vs-[a-z0-9-]+)["']/g)) {
      seen.add(m[1]);
      if (!Object.prototype.hasOwnProperty.call(map.assets, `virasat/images/${m[1]}`)) errors.push(`${rel(f)}:${lineOf(text, m.index)}  no asset-map entry "virasat/images/${m[1]}"`);
    }
  }
  console.log(`Virasat image keys checked: ${seen.size} distinct.`);
}

// service worker (informational)
const sw = path.join(ROOT, "public/sw.js");
if (fs.existsSync(sw)) {
  const text = fs.readFileSync(sw, "utf8");
  const n = web.filter(({ p }) => text.includes(p)).length;
  console.log(`\npublic/sw.js (service-worker precache list, not scanned as rendering code) lists ${n} uploaded file(s).`);
}

if (errors.length) {
  console.error(`\nFAILED (${errors.length}):`);
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log("\nOK");
