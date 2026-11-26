/**
 * Central content + asset references for the Virasat page.
 *
 * Every photo, video, contact detail and link the page uses is defined in
 * this folder (site.js, events.js, gallery.js). Swap the values
 * here to replace temporary assets — no component code needs to change.
 *
 * Temporary photography is CC-licensed work from Wikimedia Commons.
 * Attribution for each file lives in /public/virasat/images/CREDITS.json and
 * is shown in the footer's "Photo credits" dialog. Remove an entry there when
 * you replace a photo.
 *
 * Images and the hero film are served from Cloudinary through the shared
 * integration (@/lib/cloudinary). A key such as "vs-event-01" maps to the
 * asset-map key "virasat/images/vs-event-01"; an unknown key throws (there is
 * no local-file fallback). The local files in /public/virasat are untouched.
 */
import { buildSizes, coverSize, getAsset, getImageProps, getImageUrl, getVideoUrl, WIDTH_LADDERS } from "@/lib/cloudinary";

const assetId = (key) => `virasat/images/${key}`;

/** Full-size image URL: the Cloudinary master (≤1920px) with q_auto / f_auto, no resize. */
export const img = (key) => getImageUrl(assetId(key));
/** Small (900px wide) image URL for thumbnails and mobile (what the old "-sm" files were). */
export const imgSm = (key) => getImageUrl(assetId(key), { width: 900 });
/** `srcSet` string pairing the small and full-size images. */
export const srcSet = (key) => `${imgSm(key)} 900w, ${img(key)} ${getAsset(assetId(key)).width}w`;

/**
 * Candidate widths for responsive images: full-width photographs use the shared medium ladder (640 / 1024 / 1536 / 1920, capped at the
 * master), tiles and thumbnails the shared small ladder. `sizes` is always required; see each component for how it is derived.
 */
export const VIRASAT_WIDTHS = Object.freeze({ full: WIDTH_LADDERS.medium, small: WIDTH_LADDERS.small });
/**
 * `sizes` for an object-fit: cover box whose width follows the page layout. A cover image renders max(boxWidth, boxHeight x aspect) wide,
 * so the height matters: these photographs often sit in boxes much taller than they are wide.
 *   w  { sm, md, lg }  box width below 640px / 640-1023px / from 1024px (CSS length expressions)
 *   h  { sm, md, lg }  box height, as a multiple of the width (number) or a CSS length (string)
 * Returns a function of the image's aspect ratio, as getImageProps() accepts.
 */
export const coverBox = (w, h, scale = 1) => (aspect) => {
  const hOf = (k) => (typeof h[k] === "number" ? `calc(${w[k]} * ${h[k]})` : h[k]);
  return buildSizes(
    [
      ["(max-width: 639px)", coverSize(w.sm, hOf("sm"), aspect, scale)],
      ["(max-width: 1023px)", coverSize(w.md, hOf("md"), aspect, scale)],
    ],
    coverSize(w.lg, hOf("lg"), aspect, scale),
  );
};
/** Page container used by most sections: max 1600px, side padding 20px (32px from 640px, 48px from 1024px). */
export const PAGE = Object.freeze({ sm: "(100vw - 40px)", md: "(100vw - 64px)", lg: "(min(100vw, 1600px) - 96px)" });

/** `{ src, srcSet, sizes }` for an <img>, from a Virasat image key. */
export const imageProps = (key, { widths = VIRASAT_WIDTHS.full, sizes, srcWidth } = {}) => getImageProps(assetId(key), { widths, sizes, srcWidth });

export const BRAND = {
  name: "Virasat",
  nameDeva: "विरासत",
  presenter: "GEO Jainism",
  founder: "Kavi Sajal Jain",
  founderRole: "Founder, GEO Jainism",
  /** Footer wordmark line. */
  tagline: "The Grand Jain Cultural Live Show",
  /** Official event identity — "Kavi Sajal Jain's Virasat". */
  title: "Kavi Sajal Jain’s Virasat",
  subtitle: "The Grand Jain Cultural Live Show",
  taglineDeva: "जैनत्व का गौरव गान",
};

/**
 * Hero media. Temporary: a Jain temple film and a Tirthankara still from the
 * GEO Jainism archive. Swap for authentic Virasat stage media when available.
 */
export const HERO_MEDIA = {
  /** Plays inside the 3D portal, and full-screen on the non-3D fallback. Cloudinary delivery (q_auto, f_auto), version and public ID from the asset map. */
  video: getVideoUrl("virasat/video/virasat-hero"),
  poster: img("vs-tirthankara"),
  posterKey: "vs-tirthankara",
};

/** Section ids double as nav anchors (footer navigation). */
export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Virasat" },
  { id: "experience", label: "The Experience" },
  { id: "shows", label: "Upcoming Shows" },
  { id: "gallery", label: "Gallery" },
  { id: "founder", label: "Founder" },
  { id: "contact", label: "Book Virasat" },
];

/** Official Virasat contacts. */
export const CONTACT = {
  person: "Kavi Sajal Jain",
  role: "Founder & Visionary",
  email: "virasat.event@gmail.com",
  /** wa.me number (no "+"); use whatsappLink() to prefill a message. */
  whatsappNumber: "918955302069",
  whatsappDisplay: "+91 8955302069",
  whatsapp: "https://wa.me/918955302069",
  instagramHandle: "@virasat_live",
  /**
   * Booking enquiries are emailed via FormSubmit (formsubmit.co) — no backend
   * or account needed. The FIRST submission sends an activation email to the
   * address below; click "Activate Form" in it once, and every enquiry after
   * that arrives in this inbox as a table. After activating, FormSubmit also
   * gives you a random alias — put it in place of the email here to keep the
   * address out of the page source:  https://formsubmit.co/ajax/<alias>
   */
  formEndpoint: "https://formsubmit.co/ajax/virasat.event@gmail.com",
  socials: [
    { id: "instagram", label: "Instagram", handle: "@virasat_live", href: "https://instagram.com/virasat_live" },
    { id: "whatsapp", label: "WhatsApp", handle: "+91 8955302069", href: "https://wa.me/918955302069" },
  ],
};

/** WhatsApp chat link with an optional prefilled message. */
export const whatsappLink = (text = "") =>
  `https://wa.me/${CONTACT.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/** mailto: link with optional subject/body. */
export const mailLink = (subject = "", body = "") => {
  const q = [subject && `subject=${encodeURIComponent(subject)}`, body && `body=${encodeURIComponent(body)}`].filter(Boolean).join("&");
  return `mailto:${CONTACT.email}${q ? `?${q}` : ""}`;
};

/** Themes that scroll through the About marquee. */
export const ART_FORMS = ["Veer Ras", "Kavya", "Itihaas", "Sangeet", "Tirthankaras", "Bahubali", "Neminath & Rajul", "Mahotsav"];
/** Devanagari shown beside each marquee theme. */
export const ART_FORMS_DEVA = {
  "Veer Ras": "वीर रस",
  Kavya: "काव्य",
  Itihaas: "इतिहास",
  Sangeet: "संगीत",
  Tirthankaras: "तीर्थंकर",
  Bahubali: "बाहुबली",
  "Neminath & Rajul": "नेमिनाथ और राजुल",
  Mahotsav: "महोत्सव",
};
