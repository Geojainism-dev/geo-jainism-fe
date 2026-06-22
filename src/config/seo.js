export const SITE_URL = "https://geojainism.com";
export const SITE_NAME = "GEO Jainism";
export const SITE_TAGLINE = "Golden Era of Jainism";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/hero-tirthankara.jpg`;

export const ORGANIZATION = {
  name: SITE_NAME,
  legalName: "GEO Jainism",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  email: "goldeneraofjainism@gmail.com",
  founder: "Kavi Sajal Jain",
  sameAs: [
    "https://instagram.com/geo_jainism",
    "https://www.youtube.com/@geo_jainism",
  ],
};

export const SEO_ROUTES = {
  "/": {
    title: "GEO Jainism | Tamil Jain — Minority Within a Minority",
    description:
      "A cinematic documentary unearthing 2,300+ years of hidden Tamil Jain heritage across Tamil Nadu — 111 ancient sites, 50+ hills, one mission.",
    path: "/",
    ogType: "website",
    jsonLd: ["organization", "website", "video"],
  },
  "/tamil-jain": {
    title: "Tamil Jain Heritage | GEO Jainism",
    description:
      "Explore 2,300+ years of Tamil Jain history — ancient inscriptions, rock-cut stone beds, hill monasteries, and temples across 111 sites in Tamil Nadu.",
    path: "/tamil-jain",
    ogType: "website",
    jsonLd: ["organization", "breadcrumb", "webpage"],
  },
  "/about": {
    title: "About GEO Jainism | Our Mission & Founder",
    description:
      "GEO Jainism creates research-based documentary films to bring neglected Jain heritage into the mainstream. Meet founder Kavi Sajal Jain and our preservation mission.",
    path: "/about",
    ogType: "website",
    jsonLd: ["organization", "breadcrumb", "webpage", "person"],
  },
};

export function getSeoForPath(pathname) {
  return SEO_ROUTES[pathname] ?? SEO_ROUTES["/"];
}

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
