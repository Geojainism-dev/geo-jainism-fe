# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────────────────────────────────────
# GEO Jainism frontend — Vite/React SPA, prerendered at build time
#
# Two stages:
#   1. builder  — installs deps, builds the static bundle (`vite build` +
#                  a Puppeteer-driven prerender pass over a few key routes),
#                  then discarded entirely.
#   2. runtime  — nginx serving only the resulting static files. No Node,
#                  no source, no node_modules, no Chromium in the final image.
#
# `npm run build` = `vite build && node scripts/prerender.mjs`. The prerender
# step spins up a headless Chrome (via Puppeteer) against the freshly built
# `dist/`, so the builder stage needs the same system libraries any headless
# Chrome needs on Debian — see amplify.yml for the equivalent CI step
# (`npx puppeteer browsers install chrome`), which this mirrors.
# ─────────────────────────────────────────────────────────────────────────────

FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Headless Chrome's runtime deps (Puppeteer's own documented list for Debian).
# Not present on the slim base image by default.
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates \
      fonts-liberation \
      libasound2 \
      libatk-bridge2.0-0 \
      libatk1.0-0 \
      libc6 \
      libcairo2 \
      libcups2 \
      libdbus-1-3 \
      libexpat1 \
      libfontconfig1 \
      libgbm1 \
      libglib2.0-0 \
      libgtk-3-0 \
      libnspr4 \
      libnss3 \
      libpango-1.0-0 \
      libpangocairo-1.0-0 \
      libstdc++6 \
      libx11-6 \
      libx11-xcb1 \
      libxcb1 \
      libxcomposite1 \
      libxcursor1 \
      libxdamage1 \
      libxext6 \
      libxfixes3 \
      libxi6 \
      libxrandr2 \
      libxrender1 \
      libxtst6 \
      wget \
      xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies in their own layer, before the rest of the source is
# copied in — this layer is only invalidated when package.json/lockfile
# actually change, not on every source edit.
COPY package.json package-lock.json ./
RUN npm ci

# Puppeteer's managed Chrome build used by scripts/prerender.mjs.
RUN npx puppeteer browsers install chrome

COPY . .

# Vite inlines VITE_* env vars into the bundle at build time — there is no
# runtime env for a static SPA, so this must be supplied as a build arg:
#   docker build --build-arg VITE_API_BASE_URL=https://api.example.com .
ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────

FROM nginx:1.27-alpine AS runtime

RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/app.conf
COPY --from=builder /app/dist /usr/share/nginx/html

# Run as the image's existing unprivileged `nginx` user (uid 101) rather than
# root. The worker processes need write access to nginx's cache dir and pid
# file; everything else (conf, html) only needs to be readable.
RUN chown -R nginx:nginx /var/cache/nginx /usr/share/nginx/html \
    && touch /run/nginx.pid \
    && chown nginx:nginx /run/nginx.pid
USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
