import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { getSeoForPath, absoluteUrl } from "../src/config/seo.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, "..", "dist");
const ROUTES = ["/", "/tamil-jain", "/about"];
const PORT = 4173;

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  if (filePath.endsWith(".xml")) return "application/xml; charset=utf-8";
  if (filePath.endsWith(".txt")) return "text/plain; charset=utf-8";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".webp")) return "image/webp";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".mp4")) return "video/mp4";
  if (filePath.endsWith(".ico")) return "image/x-icon";
  return "application/octet-stream";
}

function createStaticServer(spaShell) {
  return http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const safePath = urlPath === "/" ? "/index.html" : urlPath;
    let filePath = path.join(DIST_DIR, safePath);

    if (!filePath.startsWith(DIST_DIR)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(spaShell);
      return;
    }

    if (filePath.endsWith(".html")) {
      res.writeHead(200, { "Content-Type": contentType(filePath) });
      res.end(spaShell);
      return;
    }

    res.writeHead(200, { "Content-Type": contentType(filePath) });
    fs.createReadStream(filePath).pipe(res);
  });
}

function routeOutputPath(route) {
  if (route === "/") return path.join(DIST_DIR, "index.html");
  const dir = path.join(DIST_DIR, route.slice(1));
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "index.html");
}

async function prerender() {
  const spaShellPath = path.join(DIST_DIR, "index.html");
  const spaShell = fs.readFileSync(spaShellPath, "utf8");
  const server = createStaticServer(spaShell);
  await new Promise((resolve) => server.listen(PORT, resolve));
  const baseUrl = `http://127.0.0.1:${PORT}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const route of ROUTES) {
      const expectedTitle = getSeoForPath(route).title;
      const expectedCanonical = absoluteUrl(getSeoForPath(route).path);
      const page = await browser.newPage();
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle0", timeout: 60000 });
      await page.waitForFunction(() => document.getElementById("root")?.childElementCount > 0, {
        timeout: 30000,
      });
      await page.waitForFunction(
        (title) => document.title === title,
        { timeout: 30000 },
        expectedTitle,
      );
      await page.waitForFunction(
        (canonical) => {
          const target = canonical.replace(/\/$/, "");
          return [...document.querySelectorAll('link[rel="canonical"]')].some((link) => {
            const href = link.href.replace(/\/$/, "");
            return href === target || href === `${target}/`;
          });
        },
        { timeout: 60000 },
        expectedCanonical,
      );
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
      const html = await page.content();
      fs.writeFileSync(routeOutputPath(route), html, "utf8");
      await page.close();
      console.log(`[prerender] ${route}`);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

prerender().catch((error) => {
  console.error("[prerender] failed:", error);
  process.exit(1);
});
