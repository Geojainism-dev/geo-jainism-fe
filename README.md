# GEO Jainism — Frontend

The public website and admin console for **GEO Jainism** ("Golden Era of Jainism"), a documentary and cultural-heritage project unearthing and documenting Jain history across India — including the Tamil Jain and Pakistan Jain heritage strands. Built as a React SPA with a prerendered marketing site and a full admin CMS for managing screenings, blog content, and registrations.

**Live site:** [geo-jainism-fe.netlify.app](https://geo-jainism-fe.netlify.app/)

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite 6 |
| Routing | React Router 7 |
| Styling | Tailwind CSS + hand-written CSS modules per page/section |
| UI primitives | shadcn/ui on top of Radix UI |
| Data fetching | TanStack Query + Axios |
| Forms & validation | React Hook Form + Zod |
| Animation / motion | Framer Motion, GSAP, Lenis (smooth scroll), Three.js |
| Analytics | Firebase Analytics |
| Prerendering | Puppeteer (`scripts/prerender.mjs`), run after `vite build` |
| Deployment | Netlify / AWS Amplify (`amplify.yml`), or self-hosted via Docker + nginx |

The app talks to a separate backend API (not in this repo) for auth, screenings, blog, and registrations — configured via `VITE_API_BASE_URL`.

## Project structure

```
src/
├─ pages/            Route-level pages (Landing, TamilJain, About, Blog,
│                     Screenings, Register, Admin/*)
├─ features/          Domain logic — auth, blog, screenings, categories,
│                     tags, users — each with its own hooks/queries
├─ components/
│  ├─ layout/          Navbar, Footer, AdminLayout, AdminSidebar, AdminHeader
│  ├─ ui/               shadcn/ui-based primitives (button, dialog, combobox…)
│  ├─ visuals/          Background scenes / decorative visual effects
│  └─ common/           Shared cross-page components (popups, SEO, etc.)
├─ hooks/             Reusable hooks (Lenis smooth scroll, theme, scroll reveal…)
├─ lib/               Axios instance, React Query client, timezone helpers
├─ styles/            Global + per-page CSS (Tailwind base + custom design system)
└─ constants/         Static content/config

scripts/prerender.mjs   Headless-Chrome prerender pass over key routes post-build
docker/nginx.conf       nginx config used by the production Docker image
```

### Routes at a glance

- **Public:** `/`, `/tamil-jain`, `/about`, `/blog`, `/blog/:slug`, `/events`, `/events/:id`, `/register`
- **Admin auth:** `/admin/login`, `/admin/register`, `/admin/login/callback`, `/admin/pending`
- **Admin console** (behind `ProtectedRoute`, role-gated): dashboard, profile, calendar, screenings CRUD, registrations, blog CRUD (posts/categories/tags), and a `SUPER_ADMIN`-only user management area

## Getting started

### Prerequisites

- Node.js 20+
- A running instance of the backend API (or a reachable URL for one)

### Setup

```bash
npm install
cp .env.example .env.local   # then fill in VITE_API_BASE_URL
npm run dev
```

The dev server runs on Vite's default port and proxies nothing — the frontend talks directly to `VITE_API_BASE_URL`.

### Environment variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API (e.g. `http://localhost:3000` in development) |

Vite inlines all `VITE_*` variables into the bundle **at build time** — there is no runtime configuration for the static build, so production values must be supplied when building, not just when serving.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build: `vite build`, then a Puppeteer-driven prerender pass over key routes for SEO/social previews |
| `npm run build:spa` | Plain `vite build` without the prerender step |
| `npm run preview` | Serve the built `dist/` locally to sanity-check a production build |

## Docker

A two-stage Dockerfile builds the static bundle (including the Puppeteer prerender step) and serves it via nginx, running as an unprivileged user on port `8080`.

```bash
docker build --build-arg VITE_API_BASE_URL=https://api.example.com -t geo-jainism-fe .
docker run -p 8080:8080 geo-jainism-fe
```

`docker/nginx.conf` defines the serving config, including the `/health` endpoint used by the image's `HEALTHCHECK`.

## Deployment

- **Netlify** — currently deployed at [geo-jainism-fe.netlify.app](https://geo-jainism-fe.netlify.app/).
- **AWS Amplify** — `amplify.yml` installs dependencies, installs a Puppeteer-managed Chrome build, runs `yarn build`, and publishes `dist/`.
- **Self-hosted** — build the Docker image above and run it behind any reverse proxy/load balancer.
