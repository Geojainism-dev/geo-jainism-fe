import { Helmet } from "react-helmet-async";
import {
  SITE_NAME,
  SITE_TAGLINE,
  DEFAULT_OG_IMAGE,
  ORGANIZATION,
  absoluteUrl,
  getSeoForPath,
} from "@/config/seo";

function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    email: ORGANIZATION.email,
    founder: {
      "@type": "Person",
      name: ORGANIZATION.founder,
    },
    sameAs: ORGANIZATION.sameAs,
    description:
      "Research-based documentary initiative preserving and sharing the heritage of Jainism, with a focus on Tamil Jain history.",
  };
}

function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    url: ORGANIZATION.url,
    description:
      "Cinematic documentary films on Tamil Jain heritage — 2,300+ years, 111 ancient sites, 50+ hills.",
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION.logo,
      },
    },
  };
}

function buildVideoSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Tamil Jains — Minority Within a Minority",
    description:
      "A cinematic documentary unearthing 2,300+ years of hidden Tamil Jain heritage across Tamil Nadu.",
    thumbnailUrl: DEFAULT_OG_IMAGE,
    uploadDate: "2026-01-01",
    contentUrl: "https://www.youtube.com/@geo_jainism",
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION.logo,
      },
    },
  };
}

function buildBreadcrumbSchema(path, title) {
  const items = [{ name: "Home", path: "/" }];
  if (path !== "/") {
    items.push({ name: title.split("|")[0].trim(), path });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function buildWebPageSchema(path, title, description) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: ORGANIZATION.url,
    },
  };
}

function buildPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: ORGANIZATION.founder,
    jobTitle: "Founder",
    worksFor: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
    url: absoluteUrl("/about"),
  };
}

function buildJsonLd(pathname) {
  const seo = getSeoForPath(pathname);
  const schemas = [];

  if (seo.jsonLd.includes("organization")) {
    schemas.push(buildOrganizationSchema());
  }
  if (seo.jsonLd.includes("website")) {
    schemas.push(buildWebsiteSchema());
  }
  if (seo.jsonLd.includes("video")) {
    schemas.push(buildVideoSchema());
  }
  if (seo.jsonLd.includes("breadcrumb")) {
    schemas.push(buildBreadcrumbSchema(seo.path, seo.title));
  }
  if (seo.jsonLd.includes("webpage")) {
    schemas.push(buildWebPageSchema(seo.path, seo.title, seo.description));
  }
  if (seo.jsonLd.includes("person")) {
    schemas.push(buildPersonSchema());
  }

  return schemas;
}

export default function SEO({ pathname = "/" }) {
  const seo = getSeoForPath(pathname);
  const canonical = absoluteUrl(seo.path);
  const ogImage = DEFAULT_OG_IMAGE;
  const jsonLd = buildJsonLd(pathname);

  return (
    <Helmet>
      <html lang="en" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={seo.ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={`${SITE_NAME} — ${SITE_TAGLINE}`} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} — ${SITE_TAGLINE}`} />

      {jsonLd.map((schema, index) => (
        <script key={`ld-json-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
