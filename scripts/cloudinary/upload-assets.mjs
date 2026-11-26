#!/usr/bin/env node
/**
 * Cloudinary asset upload utility (frontend-only, standalone).
 *
 *   node scripts/cloudinary/upload-assets.mjs                 # DRY RUN (default) - uploads nothing
 *   node scripts/cloudinary/upload-assets.mjs --upload        # real upload
 *   node scripts/cloudinary/upload-assets.mjs --upload --only site/journey,virasat/video
 *
 * Reads credentials ONLY from <repo>/.env (CLOUDINARY_CLOUD_NAME / _API_KEY / _API_SECRET).
 * Never prints, logs or records credentials. Never overwrites existing Cloudinary assets.
 * Never modifies migration-manifest.json or any local asset. See README.md for details.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import dotenv from "dotenv";
import sharp from "sharp";
import cloudinaryPkg from "cloudinary";

const cloudinary = cloudinaryPkg.v2;

// ─── Paths (everything is anchored to the frontend repository root) ──────────
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const SCRIPT_DIR = path.join(ROOT, "scripts", "cloudinary");
const MANIFEST_PATH = path.join(SCRIPT_DIR, "migration-manifest.json");
const RESULTS_DIR = path.join(SCRIPT_DIR, "results");
const RESULTS_PATH = path.join(RESULTS_DIR, "upload-results.json");
const ENV_PATH = path.join(ROOT, ".env");

// ─── Constants ───────────────────────────────────────────────────────────────
const CLOUDINARY_ROOT = "geo-jainism";
const MAX_LONG_EDGE = 4096; // preprocessing target
const SAFE_MAX_PIXELS = 25_000_000; // conservative per-image pixel limit used as a safeguard
const JPEG_QUALITY = 90;
const LARGE_UPLOAD_THRESHOLD = 90 * 1024 * 1024; // use chunked upload above this
const UPLOAD_TIMEOUT_MS = 180_000;
const REQUIRED_ENV = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

sharp.cache(false); // avoid Windows file locks on temp files

// ─── Output helpers (with secret redaction) ──────────────────────────────────
const secretsToRedact = [];
const redact = (value) => {
  let s = String(value ?? "");
  for (const secret of secretsToRedact) if (secret && secret.length >= 4) s = s.split(secret).join("***");
  return s;
};
const out = (...a) => console.log(...a.map(redact));
const warnOut = (...a) => console.warn(...a.map(redact));
const mb = (b) => (b / 1048576).toFixed(2) + " MB";
const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const md5 = (buf) => crypto.createHash("md5").update(buf).digest("hex");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");

// ─── CLI ─────────────────────────────────────────────────────────────────────
const HELP = `
Usage: node scripts/cloudinary/upload-assets.mjs [options]

  (no options)          Dry run: validate everything, upload NOTHING.
  --upload              Perform real uploads (sequential/conservative concurrency).
  --only <list>         Comma-separated manifest ids or folder prefixes, e.g.
                        --only site/journey,virasat/video   (repeatable; a trailing * is allowed)
  --concurrency <1-4>   Parallel uploads (default 2).
  --retries <1-5>       Max attempts per transient failure (default 3).
  --no-asset-folder     Do not send asset_folder (use for fixed-folder-mode accounts).
  --offline             Dry run only: skip all Cloudinary network calls.
  --help                Show this help.
`;

function parseArgs(argv) {
  const o = { upload: false, only: [], concurrency: 2, retries: 3, assetFolder: true, offline: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const raw = argv[i];
    const eq = raw.startsWith("--") ? raw.indexOf("=") : -1;
    const key = eq > -1 ? raw.slice(0, eq) : raw;
    const inline = eq > -1 ? raw.slice(eq + 1) : undefined;
    const value = () => (inline !== undefined ? inline : argv[++i]);
    switch (key) {
      case "--upload": o.upload = true; break;
      case "--only": o.only.push(...String(value() ?? "").split(",").map((s) => s.trim()).filter(Boolean)); break;
      case "--concurrency": o.concurrency = Number(value()); break;
      case "--retries": o.retries = Number(value()); break;
      case "--no-asset-folder": o.assetFolder = false; break;
      case "--offline": o.offline = true; break;
      case "--help": case "-h": o.help = true; break;
      default: throw new Error(`Unknown argument: ${raw}\n${HELP}`);
    }
  }
  if (!Number.isInteger(o.concurrency) || o.concurrency < 1 || o.concurrency > 4) throw new Error("--concurrency must be an integer 1-4");
  if (!Number.isInteger(o.retries) || o.retries < 1 || o.retries > 5) throw new Error("--retries must be an integer 1-5");
  if (o.upload && o.offline) throw new Error("--offline cannot be combined with --upload");
  return o;
}

// ─── Environment & git-ignore checks ─────────────────────────────────────────
const ENV_TEMPLATE = `# geo-jainism-fe/.env  (git-ignored - never commit, never use a VITE_ prefix for these)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret`;

function gitState() {
  const run = (args) => {
    try { execFileSync("git", args, { cwd: ROOT, stdio: "ignore" }); return 0; } catch (e) { return typeof e.status === "number" ? e.status : -1; }
  };
  const ignoredEnv = run(["check-ignore", "-q", ".env"]);
  const ignoredProd = run(["check-ignore", "-q", ".env.production"]);
  const tracked = run(["ls-files", "--error-unmatch", ".env"]) === 0;
  return {
    envIgnored: ignoredEnv === 0 ? true : ignoredEnv === 1 ? false : null,
    envProductionIgnored: ignoredProd === 0 ? true : ignoredProd === 1 ? false : null,
    envTracked: tracked,
  };
}

function loadEnv(errors, notes) {
  if (!fs.existsSync(ENV_PATH)) {
    errors.push(`Missing ${rel(ENV_PATH)}. Create it with:\n${ENV_TEMPLATE.split("\n").map((l) => "      " + l).join("\n")}`);
    return null;
  }
  // processEnv:{} keeps process.env untouched, so credentials come exclusively from .env
  const { parsed, error } = dotenv.config({ path: ENV_PATH, processEnv: {}, quiet: true });
  if (error) { errors.push(`Could not parse .env: ${error.message}`); return null; }
  const env = parsed ?? {};
  const bad = Object.keys(env).filter((k) => /^VITE_/i.test(k) && /(SECRET|API_?KEY|API_?SECRET)/i.test(k));
  if (bad.length) errors.push(`.env contains credential-like variables with a VITE_ prefix (${bad.join(", ")}). VITE_* values are embedded in the public bundle - remove them.`);
  const missing = REQUIRED_ENV.filter((k) => !env[k] || !String(env[k]).trim());
  if (missing.length) { errors.push(`.env is missing or has empty values for: ${missing.join(", ")}`); return null; }
  const creds = { cloud_name: env.CLOUDINARY_CLOUD_NAME.trim(), api_key: env.CLOUDINARY_API_KEY.trim(), api_secret: env.CLOUDINARY_API_SECRET.trim() };
  secretsToRedact.push(creds.api_secret, creds.api_key);
  const c = creds.cloud_name;
  notes.push(`.env found; ${REQUIRED_ENV.length}/${REQUIRED_ENV.length} credential variables present (values hidden; cloud name shown masked as ${c.slice(0, 2)}${"*".repeat(Math.max(1, c.length - 2))})`);
  return creds;
}

// ─── Manifest ────────────────────────────────────────────────────────────────
function loadManifest(errors) {
  let raw;
  try { raw = fs.readFileSync(MANIFEST_PATH); } catch { errors.push(`Cannot read ${rel(MANIFEST_PATH)}`); return null; }
  let m;
  try { m = JSON.parse(raw.toString("utf8")); } catch (e) { errors.push(`Manifest is not valid JSON: ${e.message}`); return null; }
  m.__sha256 = sha256(raw);
  if (m.schemaVersion !== 1) errors.push(`Unsupported manifest schemaVersion ${m.schemaVersion}`);
  if (m.cloudinaryRoot !== CLOUDINARY_ROOT) errors.push(`Manifest cloudinaryRoot is "${m.cloudinaryRoot}", expected "${CLOUDINARY_ROOT}"`);
  if (!Array.isArray(m.assets) || !m.assets.length) { errors.push("Manifest has no assets"); return null; }

  const ids = new Set(), pids = new Set(), lowerPids = new Set(), paths = new Set();
  for (const a of m.assets) {
    const tag = `[${a.id ?? a.localPath ?? "?"}]`;
    for (const f of ["id", "localPath", "folder", "publicId", "resourceType", "bytes", "sha256"]) if (a[f] === undefined || a[f] === null || a[f] === "") errors.push(`${tag} missing field "${f}"`);
    if (!["image", "video"].includes(a.resourceType)) errors.push(`${tag} invalid resourceType "${a.resourceType}"`);
    if (typeof a.publicId === "string") {
      if (!a.publicId.startsWith(CLOUDINARY_ROOT + "/")) errors.push(`${tag} publicId is outside "${CLOUDINARY_ROOT}/"`);
      if (!a.publicId.split("/").every((s) => KEBAB.test(s))) errors.push(`${tag} publicId is not lowercase kebab-case: ${a.publicId}`);
      if (a.publicId !== `${a.folder}/${a.publicId.split("/").pop()}`) errors.push(`${tag} publicId does not live inside its folder`);
      if (a.id !== a.publicId.slice(CLOUDINARY_ROOT.length + 1)) errors.push(`${tag} id does not match publicId`);
      if (/^geo-jainism\/(blog-covers|blog-content|screening-images|passes)(\/|$)/.test(a.publicId)) errors.push(`${tag} publicId collides with a reserved existing folder`);
    }
    if (ids.has(a.id)) errors.push(`${tag} duplicate id`); ids.add(a.id);
    if (pids.has(a.publicId)) errors.push(`${tag} duplicate publicId`); pids.add(a.publicId);
    if (lowerPids.has(String(a.publicId).toLowerCase())) errors.push(`${tag} publicId collides case-insensitively with another asset`);
    lowerPids.add(String(a.publicId).toLowerCase());
    if (paths.has(a.localPath)) errors.push(`${tag} duplicate localPath`); paths.add(a.localPath);
    if (/-sm\.webp$/i.test(a.localPath ?? "")) errors.push(`${tag} is a derived "-sm.webp" variant and must not be uploaded`);
    const abs = path.resolve(ROOT, a.localPath ?? "");
    if (path.relative(ROOT, abs).startsWith("..") || path.isAbsolute(path.relative(ROOT, abs))) errors.push(`${tag} localPath escapes the frontend repository`);
  }
  const s = m.summary ?? {};
  if (s.totalAssets !== m.assets.length) errors.push(`Manifest summary.totalAssets (${s.totalAssets}) != assets.length (${m.assets.length})`);
  return m;
}

function selectAssets(assets, tokens, errors) {
  if (!tokens.length) return assets;
  const picked = new Set();
  for (const original of tokens) {
    let t = original.replace(/\\/g, "/").replace(/^\/+/, "").replace(new RegExp(`^${CLOUDINARY_ROOT}/`), "").replace(/\*$/, "").replace(/\/+$/, "");
    const hits = assets.filter((a) => a.id === t || a.id.startsWith(t + "/") || (original.endsWith("*") && a.id.startsWith(t)));
    if (!hits.length) errors.push(`--only "${original}" matched no manifest asset (use an id like site/journey/01-rock-sculpture or a folder prefix like site/journey)`);
    hits.forEach((a) => picked.add(a.id));
  }
  return assets.filter((a) => picked.has(a.id));
}

// ─── Local verification ──────────────────────────────────────────────────────
const FORMAT_ALIAS = { jpg: "jpeg", jpeg: "jpeg", png: "png", webp: "webp", mp4: "mp4" };

async function verifyLocal(asset, errors, warnings) {
  const tag = `[${asset.id}]`;
  const abs = path.resolve(ROOT, asset.localPath);
  const info = { abs, exists: false, ok: false };
  let buf;
  try { buf = fs.readFileSync(abs); info.exists = true; } catch { errors.push(`${tag} local file not found: ${asset.localPath}`); return info; }
  info.bytes = buf.length;
  info.sha256 = sha256(buf);
  info.md5 = md5(buf);
  let ok = true;
  if (buf.length !== asset.bytes) { errors.push(`${tag} size mismatch: manifest ${asset.bytes} B, disk ${buf.length} B`); ok = false; }
  if (info.sha256 !== asset.sha256) { errors.push(`${tag} SHA-256 mismatch (file changed since the manifest was generated)`); ok = false; }
  if (asset.resourceType === "image") {
    try {
      const meta = await sharp(buf).metadata();
      info.meta = meta;
      const wantFmt = FORMAT_ALIAS[asset.format];
      if (meta.format !== wantFmt) { errors.push(`${tag} real format "${meta.format}" != manifest "${asset.format}"`); ok = false; }
      if (meta.width !== asset.width || meta.height !== asset.height) { errors.push(`${tag} dimensions ${meta.width}x${meta.height} != manifest ${asset.width}x${asset.height}`); ok = false; }
    } catch (e) { errors.push(`${tag} unreadable image: ${e.message}`); ok = false; }
  } else {
    if (buf.subarray(4, 8).toString("latin1") !== "ftyp") { errors.push(`${tag} video does not look like an MP4 (no ftyp box)`); ok = false; }
  }
  info.ok = ok;
  return info;
}

// ─── Preprocessing (sharp) ───────────────────────────────────────────────────
function needsDownscale(asset) {
  return asset.resourceType === "image" && Array.isArray(asset.preprocess) && asset.preprocess.some((p) => String(p).startsWith("downscale"));
}

let tmpDir = null;
const getTmpDir = () => (tmpDir ??= fs.mkdtempSync(path.join(os.tmpdir(), "geoj-cloudinary-")));
function cleanupTmp() {
  if (tmpDir) { try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch { /* best effort */ } tmpDir = null; }
}

/** Resize a master into the temp dir. Never touches the original. Throws if verification fails. */
async function resizeMaster(asset, local) {
  const src = local.abs;
  const meta = local.meta;
  const swap = meta.orientation && meta.orientation >= 5;
  const w0 = swap ? meta.height : meta.width;
  const h0 = swap ? meta.width : meta.height;
  const ext = { jpeg: "jpg", png: "png", webp: "webp" }[meta.format];
  const dest = path.join(getTmpDir(), asset.id.replace(/\//g, "__") + "." + ext);
  if (path.resolve(dest) === path.resolve(src)) throw new Error("refusing to write over the original");

  let pipe = sharp(src).rotate().resize({ width: MAX_LONG_EDGE, height: MAX_LONG_EDGE, fit: "inside", withoutEnlargement: true });
  if (typeof pipe.keepIccProfile === "function") pipe = pipe.keepIccProfile();
  if (meta.format === "jpeg") pipe = pipe.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  else if (meta.format === "png") pipe = pipe.png({ compressionLevel: 9, adaptiveFiltering: true });
  else pipe = pipe.webp({ quality: JPEG_QUALITY, alphaQuality: 100 });
  await pipe.toFile(dest);

  const o = await sharp(dest).metadata();
  const problems = [];
  if (Math.max(o.width, o.height) > MAX_LONG_EDGE) problems.push(`long edge ${Math.max(o.width, o.height)} > ${MAX_LONG_EDGE}`);
  if (Math.max(w0, h0) > MAX_LONG_EDGE && Math.max(o.width, o.height) !== MAX_LONG_EDGE) problems.push("long edge is not exactly the target");
  if (Math.abs(o.width / o.height - w0 / h0) > 0.003) problems.push(`aspect ratio changed (${(w0 / h0).toFixed(4)} -> ${(o.width / o.height).toFixed(4)})`);
  if (o.width > w0 || o.height > h0) problems.push("image was upscaled");
  if (o.width * o.height > SAFE_MAX_PIXELS) problems.push(`still above ${SAFE_MAX_PIXELS / 1e6} MP`);
  if (Boolean(o.hasAlpha) !== Boolean(meta.hasAlpha)) problems.push("alpha channel not preserved");
  if (problems.length) { fs.rmSync(dest, { force: true }); throw new Error(`preprocessing verification failed: ${problems.join("; ")}`); }

  const buf = fs.readFileSync(dest);
  return { path: dest, bytes: buf.length, sha256: sha256(buf), md5: md5(buf), from: { width: w0, height: h0, bytes: local.bytes, sha256: local.sha256 }, to: { width: o.width, height: o.height }, tool: `sharp ${sharp.versions.sharp}`, maxLongEdge: MAX_LONG_EDGE, jpegQuality: meta.format === "jpeg" ? JPEG_QUALITY : undefined };
}

// ─── Cloudinary helpers ──────────────────────────────────────────────────────
const normErr = (e) => {
  const x = e?.error ?? e ?? {};
  return { message: redact(x.message ?? e?.message ?? String(e)), httpCode: x.http_code ?? e?.http_code ?? null, code: e?.code ?? x.code ?? null };
};
const TRANSIENT_CODES = new Set(["ECONNRESET", "ETIMEDOUT", "ECONNABORTED", "ENOTFOUND", "EAI_AGAIN", "EPIPE", "ECONNREFUSED", "UND_ERR_SOCKET"]);
function isTransient(e) {
  const n = normErr(e);
  if (n.httpCode && (n.httpCode === 420 || n.httpCode === 429 || n.httpCode === 499 || n.httpCode >= 500)) return true;
  if (n.code && TRANSIENT_CODES.has(n.code)) return true;
  return /timeout|timed out|socket hang up|network|ECONNRESET/i.test(n.message);
}
async function withRetry(fn, maxAttempts) {
  let attempt = 0;
  for (;;) {
    attempt++;
    try { return { value: await fn(), attempts: attempt }; }
    catch (e) {
      if (attempt >= maxAttempts || !isTransient(e)) { const n = normErr(e); const err = new Error(n.message); err.httpCode = n.httpCode; err.attempts = attempt; throw err; }
      await sleep(Math.min(15000, 1000 * 3 ** (attempt - 1)));
    }
  }
}

async function listRemote(selected, retries) {
  const groups = new Map();
  for (const a of selected) {
    const prefix = a.publicId.split("/").slice(0, 2).join("/") + "/";
    const key = `${a.resourceType}|${prefix}`;
    groups.set(key, { resourceType: a.resourceType, prefix });
  }
  const found = new Map();
  for (const { resourceType, prefix } of groups.values()) {
    let cursor;
    do {
      const { value } = await withRetry(() => cloudinary.api.resources({ type: "upload", resource_type: resourceType, prefix, max_results: 500, next_cursor: cursor }), retries);
      for (const r of value.resources ?? []) found.set(`${resourceType}|${r.public_id}`, r);
      cursor = value.next_cursor;
    } while (cursor);
  }
  return found;
}

function reportUsage(usage) {
  const lines = [];
  const pick = (o) => (o && typeof o === "object" ? o : {});
  if (usage.plan) lines.push(`plan: ${usage.plan}`);
  const credits = pick(usage.credits);
  if (credits.usage !== undefined) lines.push(`credits used: ${credits.usage}${credits.limit ? ` / ${credits.limit}` : ""}${credits.used_percent !== undefined ? ` (${credits.used_percent}%)` : ""}`);
  const num = (o) => (o && typeof o === "object" ? o.usage : o);
  if (usage.storage) lines.push(`storage used: ${mb(num(usage.storage) ?? 0)}`);
  if (usage.bandwidth) lines.push(`bandwidth used (this period): ${mb(num(usage.bandwidth) ?? 0)}`);
  if (usage.transformations) lines.push(`transformations used (this period): ${num(usage.transformations)}`);
  if (usage.resources !== undefined) lines.push(`stored resources: ${num(usage.resources)}`);
  const lim = pick(usage.media_limits);
  const limits = {};
  if (lim.image_max_size_bytes) limits.imageBytes = lim.image_max_size_bytes;
  if (lim.video_max_size_bytes) limits.videoBytes = lim.video_max_size_bytes;
  if (lim.image_max_px) limits.imagePx = lim.image_max_px;
  if (lim.asset_max_total_px) limits.assetTotalPx = lim.asset_max_total_px;
  if (limits.imageBytes) lines.push(`max image file size: ${mb(limits.imageBytes)}`);
  if (limits.videoBytes) lines.push(`max video file size: ${mb(limits.videoBytes)}`);
  if (limits.imagePx) lines.push(`max image pixels: ${(limits.imagePx / 1e6).toFixed(0)} MP`);
  if (limits.assetTotalPx) lines.push(`max total pixels (incl. transformed): ${(limits.assetTotalPx / 1e6).toFixed(0)} MP`);
  if (!lim.image_max_size_bytes) lines.push("media limits: not reported by the API - verify in the dashboard");
  return { lines, limits };
}

// ─── Results file ────────────────────────────────────────────────────────────
function loadResults(manifest) {
  const base = { schemaVersion: 1, manifestFile: rel(MANIFEST_PATH), manifestSha256: manifest.__sha256, createdAt: new Date().toISOString(), updatedAt: null, summary: {}, assets: [] };
  if (!fs.existsSync(RESULTS_PATH)) return { data: base, map: new Map() };
  try {
    const data = JSON.parse(fs.readFileSync(RESULTS_PATH, "utf8"));
    if (data.manifestSha256 !== manifest.__sha256) warnOut("WARNING: results file was created for a different manifest version; resume decisions use publicId only.");
    return { data: { ...base, ...data, manifestSha256: manifest.__sha256 }, map: new Map((data.assets ?? []).map((r) => [r.publicId, r])) };
  } catch (e) { throw new Error(`Existing results file is unreadable (${e.message}). Move it aside before continuing; refusing to overwrite.`); }
}
function saveResults(state, manifest) {
  const assets = manifest.assets.map((a) => state.map.get(a.publicId)).filter(Boolean);
  const count = (s) => assets.filter((r) => r.status === s).length;
  state.data.assets = assets;
  state.data.updatedAt = new Date().toISOString();
  state.data.summary = { recorded: assets.length, uploaded: count("uploaded"), exists: count("exists"), failed: count("failed"), manifestAssets: manifest.assets.length, remaining: manifest.assets.length - assets.filter((r) => r.status === "uploaded" || r.status === "exists").length };
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const tmp = RESULTS_PATH + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(state.data, null, 2) + "\n");
  fs.renameSync(tmp, RESULTS_PATH); // atomic replace
}

// ─── Upload one asset ────────────────────────────────────────────────────────
async function uploadOne(asset, local, remoteExisting, opts, stopFlag) {
  const rec = {
    id: asset.id, localPath: asset.localPath, publicId: asset.publicId, resourceType: asset.resourceType,
    status: "failed", secureUrl: null, version: null, remoteBytes: null,
    originalChecksum: { sha256: local.sha256, bytes: local.bytes },
    uploadedChecksum: null, preprocessed: null, uploadedAt: null, error: null, warnings: [],
  };
  let processed = null;
  try {
    const existing = remoteExisting.get(`${asset.resourceType}|${asset.publicId}`);
    if (existing) {
      rec.status = "exists";
      rec.secureUrl = existing.secure_url; rec.version = existing.version; rec.remoteBytes = existing.bytes;
      rec.warnings.push("Already present on Cloudinary - skipped, not replaced.");
      if (existing.bytes !== local.bytes && !needsDownscale(asset)) rec.warnings.push(`Remote size (${existing.bytes} B) differs from the local master (${local.bytes} B).`);
      return rec;
    }
    if (stopFlag.stop) { rec.status = "not-attempted"; return rec; }

    let uploadPath = local.abs, uploadBytes = local.bytes, uploadMd5 = local.md5, uploadSha = local.sha256;
    if (needsDownscale(asset)) {
      processed = await resizeMaster(asset, local);
      uploadPath = processed.path; uploadBytes = processed.bytes; uploadMd5 = processed.md5; uploadSha = processed.sha256;
      rec.preprocessed = { tool: processed.tool, from: processed.from, to: processed.to, maxLongEdge: MAX_LONG_EDGE, jpegQuality: processed.jpegQuality ?? null, bytes: processed.bytes, sha256: processed.sha256 };
    }

    const options = {
      public_id: asset.publicId,
      resource_type: asset.resourceType,
      type: "upload",
      overwrite: false,
      unique_filename: false,
      use_filename: false,
      invalidate: false,
      timeout: UPLOAD_TIMEOUT_MS,
      // deliberately NO transformation / eager / upload_preset: masters are stored untouched
    };
    if (opts.assetFolder) options.asset_folder = asset.folder;

    const big = uploadBytes > LARGE_UPLOAD_THRESHOLD;
    const { value: res, attempts } = await withRetry(
      () => (big ? cloudinary.uploader.upload_large(uploadPath, { ...options, chunk_size: 20_000_000 }) : cloudinary.uploader.upload(uploadPath, options)),
      opts.retries,
    );
    if (res.public_id !== asset.publicId) throw new Error(`Cloudinary returned public_id "${res.public_id}" but "${asset.publicId}" was requested`);
    if (res.resource_type !== asset.resourceType) throw new Error(`Cloudinary stored it as resource_type "${res.resource_type}"`);

    rec.secureUrl = res.secure_url; rec.version = res.version; rec.remoteBytes = res.bytes;
    rec.uploadedChecksum = { md5: uploadMd5, sha256: uploadSha, cloudinaryEtag: res.etag ?? null, etagMatchesMd5: res.etag ? res.etag === uploadMd5 : null, assetId: res.asset_id ?? null };
    if (res.existing === true) { rec.status = "exists"; rec.warnings.push("Cloudinary reported the asset already existed (overwrite:false) - not replaced."); }
    else { rec.status = "uploaded"; rec.uploadedAt = new Date().toISOString(); }
    if (attempts > 1) rec.warnings.push(`Succeeded after ${attempts} attempts.`);
    if (res.bytes !== undefined && res.bytes !== uploadBytes) rec.warnings.push(`Stored size ${res.bytes} B != uploaded ${uploadBytes} B - an account-level incoming transformation/preset may be altering masters.`);
    if (res.etag && res.etag !== uploadMd5) rec.warnings.push("Cloudinary etag differs from the local MD5 (stored bytes are not identical to what was sent).");
    if (opts.assetFolder && res.asset_folder === undefined) rec.warnings.push("Response had no asset_folder - the account may use fixed folder mode (asset_folder ignored).");
    return rec;
  } catch (e) {
    rec.status = "failed";
    rec.error = { message: redact(e.message), httpCode: e.httpCode ?? null, attempts: e.attempts ?? 1 };
    return rec;
  } finally {
    if (processed) fs.rmSync(processed.path, { force: true });
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) { out(HELP); return 0; }
  const mode = opts.upload ? "UPLOAD" : "DRY RUN (nothing will be uploaded)";
  out(`\nCloudinary asset utility - mode: ${mode}`);
  out(`Repository root: ${ROOT}\n`);

  if (!fs.existsSync(path.join(ROOT, "vite.config.js"))) throw new Error("Not running from the frontend repository (vite.config.js not found at the computed root).");

  const errors = [], warnings = [], notes = [];

  // 1. environment
  out("== 1. Environment");
  const git = gitState();
  const creds = loadEnv(errors, notes);
  if (git.envIgnored === false) errors.push(".env is NOT ignored by git - add it to .gitignore before continuing.");
  if (git.envTracked) errors.push(".env is tracked by git - untrack it (git rm --cached .env) and rotate the credentials.");
  if (git.envProductionIgnored === false) warnings.push(".env.production is not git-ignored.");
  if (git.envIgnored === null) warnings.push("Could not run git to verify .env is ignored.");
  notes.forEach((n) => out("  " + n));
  out(`  .env git-ignored: ${git.envIgnored}; .env.production git-ignored: ${git.envProductionIgnored}; .env tracked: ${git.envTracked}`);

  if (!creds && errors.some((e) => e.startsWith("Missing .env"))) {
    out("\nERROR: " + errors[0]);
    out("\nCreate the file, fill in the three values, then re-run. Stopping before any further work.");
    return 2;
  }

  // 2. manifest
  out("\n== 2. Manifest");
  const manifest = loadManifest(errors);
  if (!manifest) { errors.forEach((e) => out("  ERROR: " + e)); return 1; }
  const selected = selectAssets(manifest.assets, opts.only, errors);
  if (!selected.length && !errors.length) errors.push("No assets selected.");
  const totalBytes = (list) => list.reduce((s, a) => s + a.bytes, 0);
  out(`  manifest: ${rel(MANIFEST_PATH)} (sha256 ${manifest.__sha256.slice(0, 12)}...)`);
  out(`  in manifest: ${manifest.assets.length} assets (${manifest.assets.filter((a) => a.resourceType === "image").length} images, ${manifest.assets.filter((a) => a.resourceType === "video").length} video), ${mb(totalBytes(manifest.assets))}`);
  out(`  selected:    ${selected.length} assets (${selected.filter((a) => a.resourceType === "image").length} images, ${selected.filter((a) => a.resourceType === "video").length} video), ${mb(totalBytes(selected))}${opts.only.length ? `  [--only ${opts.only.join(",")}]` : ""}`);

  // 3. local files
  out("\n== 3. Local file verification (existence, size, SHA-256, format, dimensions)");
  const locals = new Map();
  for (const a of selected) locals.set(a.id, await verifyLocal(a, errors, warnings));
  const okCount = [...locals.values()].filter((l) => l.ok).length;
  out(`  ${okCount}/${selected.length} files verified OK`);

  // 4. preprocessing plan
  out("\n== 4. Preprocessing plan (sharp, long edge <= " + MAX_LONG_EDGE + " px, never upscale, originals untouched)");
  const toResize = selected.filter(needsDownscale);
  let trialOk = 0;
  for (const a of selected) {
    const l = locals.get(a.id);
    if (a.resourceType !== "image" || !l?.meta) continue;
    if (!needsDownscale(a) && a.width * a.height > SAFE_MAX_PIXELS) errors.push(`[${a.id}] ${a.width}x${a.height} exceeds ${SAFE_MAX_PIXELS / 1e6} MP but is not flagged for downscaling in the manifest`);
  }
  for (const a of toResize) {
    const l = locals.get(a.id);
    if (!l?.ok) { out(`  ${a.id}: skipped (local verification failed)`); continue; }
    try {
      const r = await resizeMaster(a, l); // trial run into the temp dir
      out(`  ${a.id}: ${a.width}x${a.height} (${(a.width * a.height / 1e6).toFixed(1)} MP, ${mb(a.bytes)}) -> ${r.to.width}x${r.to.height} (${(r.to.width * r.to.height / 1e6).toFixed(1)} MP, ${mb(r.bytes)})  verified`);
      a.__trial = r; trialOk++;
      fs.rmSync(r.path, { force: true });
    } catch (e) { errors.push(`[${a.id}] preprocessing failed: ${e.message}`); }
  }
  if (!toResize.length) out("  none of the selected assets need downscaling");
  cleanupTmp();
  if (toResize.length) out(`  ${trialOk}/${toResize.length} trial resizes verified; temporary files removed`);

  // 5. Cloudinary connectivity, limits, existing assets
  let limits = {}, remote = new Map();
  out("\n== 5. Cloudinary account");
  if (opts.offline) out("  skipped (--offline)");
  else if (!creds) out("  skipped (credentials unavailable)");
  else {
    cloudinary.config({ cloud_name: creds.cloud_name, api_key: creds.api_key, api_secret: creds.api_secret, secure: true });
    try {
      const { value: usage } = await withRetry(() => cloudinary.api.usage(), opts.retries);
      out("  credentials accepted by Cloudinary (read-only usage call)");
      const rep = reportUsage(usage);
      rep.lines.forEach((l) => out("  " + l));
      limits = rep.limits;
      for (const a of selected) {
        const l = locals.get(a.id); if (!l?.ok) continue;
        const size = a.__trial?.bytes ?? a.bytes;
        const cap = a.resourceType === "video" ? limits.videoBytes : limits.imageBytes;
        if (cap && size > cap) errors.push(`[${a.id}] ${mb(size)} exceeds the account's ${a.resourceType} size limit (${mb(cap)})`);
        const px = a.__trial ? a.__trial.to.width * a.__trial.to.height : a.width * a.height;
        if (a.resourceType === "image" && limits.imagePx && px > limits.imagePx) errors.push(`[${a.id}] ${(px / 1e6).toFixed(1)} MP exceeds the account's image pixel limit`);
      }
      for (const a of toResize) {
        const px = a.width * a.height;
        if (limits.imagePx && px <= limits.imagePx) notes.push(`${a.id}: account reports it would accept the original (${(px / 1e6).toFixed(1)} MP <= ${(limits.imagePx / 1e6).toFixed(0)} MP); downscaling is kept as a safeguard.`);
      }
    } catch (e) {
      errors.push(`Cloudinary rejected the request (${redact(e.message)}${e.httpCode ? `, HTTP ${e.httpCode}` : ""}). Check the three CLOUDINARY_* values.`);
    }
    if (!errors.some((e) => e.startsWith("Cloudinary rejected"))) {
      try {
        remote = await listRemote(selected, opts.retries);
        const hits = selected.filter((a) => remote.has(`${a.resourceType}|${a.publicId}`));
        out(`  existing assets under the target prefixes that collide with selected public IDs: ${hits.length}`);
        hits.slice(0, 20).forEach((a) => out(`    exists: ${a.publicId}`));
        if (hits.length > 20) out(`    ... and ${hits.length - 20} more`);
        if (hits.length) warnings.push(`${hits.length} selected public ID(s) already exist on Cloudinary; they will be reported as "exists" and NOT replaced.`);
      } catch (e) { errors.push(`Could not list existing Cloudinary assets: ${redact(e.message)}`); }
    }
  }

  // 6. resume state
  const state = loadResults(manifest);
  const done = selected.filter((a) => ["uploaded", "exists"].includes(state.map.get(a.publicId)?.status)).length;
  out("\n== 6. Resume state");
  out(`  results file: ${rel(RESULTS_PATH)} ${fs.existsSync(RESULTS_PATH) ? "(exists)" : "(not created yet)"}`);
  out(`  already recorded as uploaded/exists: ${done}/${selected.length}   to do: ${selected.length - done}`);

  // 7. proposed uploads
  out("\n== 7. Proposed uploads (publicId | type | size | action)");
  for (const a of selected) {
    const l = locals.get(a.id);
    const prior = state.map.get(a.publicId)?.status;
    let action = remote.has(`${a.resourceType}|${a.publicId}`) ? "EXISTS on Cloudinary - skip" : prior === "uploaded" || prior === "exists" ? `already recorded (${prior}) - skip` : "upload";
    if (needsDownscale(a) && action === "upload") action += ` (downscale ${a.width}x${a.height} -> ${a.__trial ? a.__trial.to.width + "x" + a.__trial.to.height : "<=" + MAX_LONG_EDGE})`;
    if (!l?.ok) action = "BLOCKED (verification failed)";
    out(`  ${a.publicId} | ${a.resourceType} | ${mb(a.bytes)} | ${action}`);
  }

  // 8. summary
  const byFolder = new Map();
  for (const a of selected) byFolder.set(a.folder, (byFolder.get(a.folder) ?? 0) + 1);
  out("\n== 8. Summary");
  out(`  assets: ${selected.length}  (images ${selected.filter((a) => a.resourceType === "image").length}, video ${selected.filter((a) => a.resourceType === "video").length})   size on disk: ${mb(totalBytes(selected))}`);
  out(`  to be downscaled: ${toResize.length}`);
  out(`  folders: ${[...byFolder].map(([f, n]) => `${f.replace(CLOUDINARY_ROOT + "/", "")} (${n})`).join(", ")}`);
  notes.filter((n) => !n.startsWith(".env found")).forEach((n) => out("  note: " + n));
  warnings.forEach((w) => out("  WARNING: " + w));
  if (errors.length) { out(`\n  ${errors.length} ERROR(S):`); errors.forEach((e) => out("   - " + e)); }

  if (!opts.upload) {
    out(errors.length ? "\nDRY RUN FAILED - fix the errors above. Nothing was uploaded." : "\nDRY RUN OK - nothing was uploaded. Re-run with --upload (optionally --only ...) to upload.");
    return errors.length ? 1 : 0;
  }
  if (errors.length) { out("\nABORTING: validation errors above. Nothing was uploaded."); return 1; }

  // ── real upload ──
  out(`\n== Uploading (concurrency ${opts.concurrency}, max ${opts.retries} attempts per transient failure)`);
  const queue = selected.filter((a) => !["uploaded", "exists"].includes(state.map.get(a.publicId)?.status));
  const stopFlag = { stop: false };
  const onSigint = () => { if (!stopFlag.stop) { stopFlag.stop = true; out("\nInterrupt received - finishing in-flight uploads, then stopping. Re-run the same command to resume."); } };
  process.on("SIGINT", onSigint); process.on("SIGTERM", onSigint);
  let n = 0, idx = 0;
  const tally = { uploaded: 0, exists: 0, failed: 0, "not-attempted": 0 };
  const worker = async () => {
    while (!stopFlag.stop) {
      const a = queue[idx++]; if (!a) return;
      const rec = await uploadOne(a, locals.get(a.id), remote, opts, stopFlag);
      n++;
      tally[rec.status] = (tally[rec.status] ?? 0) + 1;
      if (rec.status !== "not-attempted") { state.map.set(a.publicId, rec); saveResults(state, manifest); }
      out(`  [${n}/${queue.length}] ${rec.status.toUpperCase().padEnd(8)} ${a.publicId}${rec.status === "failed" ? "  -> " + rec.error.message + (rec.error.httpCode ? ` (HTTP ${rec.error.httpCode})` : "") : ""}${rec.warnings.length && rec.status !== "failed" ? "  ! " + rec.warnings.join(" ") : ""}`);
    }
  };
  await Promise.all(Array.from({ length: opts.concurrency }, worker));
  process.off("SIGINT", onSigint); process.off("SIGTERM", onSigint);
  cleanupTmp();
  saveResults(state, manifest);
  out(`\nDone: uploaded ${tally.uploaded}, existing/skipped ${tally.exists}, failed ${tally.failed}, already done earlier ${selected.length - queue.length}${stopFlag.stop ? ", interrupted" : ""}.`);
  out(`Results: ${rel(RESULTS_PATH)}`);
  return tally.failed || stopFlag.stop ? 1 : 0;
}

process.on("exit", cleanupTmp);
process.on("unhandledRejection", (e) => { warnOut("Unhandled error:", e?.message ?? e); cleanupTmp(); process.exit(1); });
main().then((code) => { process.exitCode = code; }).catch((e) => { warnOut("\nFATAL:", e?.message ?? e); cleanupTmp(); process.exitCode = 1; });
