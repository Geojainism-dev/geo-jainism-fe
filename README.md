# GEO Jainism — Frontend

This is the website (and admin panel) for **GEO Jainism** ("Golden Era of Jainism") — a documentary and cultural-heritage project that researches and shares Jain history across India, including the Tamil Jain and Pakistan Jain heritage stories.

It's a website that has two parts:
- **A public website** — visitors can read about the project, browse blog posts, see upcoming screenings/events, and register for them.
- **An admin panel** — a private, login-protected area where the team manages blog posts, screenings, registrations, and user accounts.

**Live site:** [geo-jainism-fe.netlify.app](https://geo-jainism-fe.netlify.app/)

This is only the **frontend** (what you see and click on in the browser). It talks to a separate **backend** (a different project, not in this folder) which handles logins, saving data, etc.

## What it's built with (in simple terms)

| What | Tool used | What it's for |
|---|---|---|
| Main framework | React 19 + Vite | Builds the actual website/app, and makes development fast |
| Page navigation | React Router | Lets you move between pages (Home, Blog, About...) without a full page reload |
| Styling / design | Tailwind CSS | Makes the site look nice, styled quickly |
| Ready-made UI pieces | shadcn/ui + Radix UI | Buttons, popups, dropdowns, etc. so we don't build every little thing from scratch |
| Talking to the backend | TanStack Query + Axios | Fetches and updates data (blog posts, screenings, etc.) from the server |
| Forms | React Hook Form + Zod | Handles forms (like registration) and checks the input is valid |
| Animations | Framer Motion, GSAP, Lenis, Three.js | Smooth scrolling, motion effects, and visual flair |
| Analytics | Firebase Analytics | Tracks visits/usage of the site |
| SEO helper | Puppeteer (a prerender script) | Generates ready-made HTML snapshots of pages so search engines and social media previews work well |
| Hosting | Netlify, AWS Amplify, or Docker | Different ways the site can be put online |

## How the code is organized

```
src/
├─ pages/           Each file here is basically one page of the site
│                    (Home, About, Blog, Screenings, Register, and all Admin pages)
├─ features/         Logic grouped by topic — auth (login), blog, screenings,
│                    categories, tags, users
├─ components/
│  ├─ layout/         Repeating pieces like Navbar, Footer, and the Admin layout
│  ├─ ui/              Small reusable UI building blocks (buttons, dialogs, etc.)
│  ├─ visuals/         Decorative background effects
│  └─ common/          Things shared across many pages (popups, SEO tags, etc.)
├─ hooks/            Small reusable bits of logic (smooth scroll, dark/light theme, etc.)
├─ lib/              Shared setup code (how we call the backend, timezones, etc.)
├─ styles/           All the CSS / design styling
└─ constants/        Fixed content/settings used across the app

scripts/prerender.mjs   Script that generates pre-built HTML pages for SEO, after the build
docker/nginx.conf       Server config used when running this via Docker
```

### Pages on the site

- **Public pages anyone can visit:** Home, Tamil Jain page, About, Blog, single Blog post, Events, single Event, Register
- **Admin login pages:** Login, Register, login callback, "pending approval" page
- **Admin panel (only for logged-in staff):** dashboard, profile, calendar, manage screenings, view registrations, manage blog posts/categories/tags, and a user-management area (only for the top-level "Super Admin" role)

## How to run it on your own computer

### What you need first
- Node.js version 20 or newer installed
- The backend API running somewhere (or a URL pointing to one)

### Steps

```bash
npm install
cp .env.example .env.local   # then open .env.local and fill in VITE_API_BASE_URL
npm run dev
```

After this, the site opens locally and refreshes automatically as you edit code. It talks directly to whatever backend URL you put in `.env.local`.

### Settings file (`.env.local`)

| Setting | What it means |
|---|---|
| `VITE_API_BASE_URL` | The web address of the backend server (e.g. `http://localhost:3000` while developing) |

Important: this value gets "baked into" the site permanently when you build it — you can't change it later without rebuilding. So make sure it's set correctly *before* building for production.

## Common commands

| Command | What it does |
|---|---|
| `npm run dev` | Starts the site locally for development, with live-reload |
| `npm run build` | Builds the final, production-ready version of the site, plus generates SEO-friendly page snapshots |
| `npm run build:spa` | Same build, but skips the SEO snapshot step (faster, simpler) |
| `npm run preview` | Lets you preview the production build locally, as a final check before deploying |

## Running it with Docker

There's a Dockerfile that packages the whole site into a container, which then serves it using nginx (a web server) on port `8080`.

```bash
docker build --build-arg VITE_API_BASE_URL=https://api.example.com -t geo-jainism-fe .
docker run -p 8080:8080 geo-jainism-fe
```

The `docker/nginx.conf` file controls how the server behaves, including a `/health` check used to confirm the container is running properly.

## Where it's deployed

- **Netlify** — the current live version is hosted here: [geo-jainism-fe.netlify.app](https://geo-jainism-fe.netlify.app/)
- **AWS Amplify** — an alternative hosting setup, configured in `amplify.yml`
- **Self-hosted** — you can also just build the Docker image above and run it on your own server
