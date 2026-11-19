/**
 * Central content + asset references for the Virasat page.
 *
 * Every photo, video, contact detail and link the page uses is defined in
 * this folder (site.js, events.js, gallery.js). Swap the values
 * here to replace temporary assets — no component code needs to change.
 *
 * Temporary photography is CC-licensed work from Wikimedia Commons, stored
 * in /public/virasat/images. Attribution for each file lives in
 * /public/virasat/images/CREDITS.json and is shown in the footer's
 * "Photo credits" dialog. Remove an entry there when you replace a photo.
 */

const IMG_BASE = "/virasat/images";

/** Full-size (≤1920px) image URL. */
export const img = (key) => `${IMG_BASE}/${key}.webp`;
/** Small (≤900px) image URL for thumbnails and mobile. */
export const imgSm = (key) => `${IMG_BASE}/${key}-sm.webp`;
/** `srcSet` string pairing the small and full-size files. */
export const srcSet = (key) => `${imgSm(key)} 900w, ${img(key)} 1920w`;

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
  /** Plays inside the 3D portal, and full-screen on the non-3D fallback. */
  video: "/virasat/videos/virasat-hero.mp4",
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
