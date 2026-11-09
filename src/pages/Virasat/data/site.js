/**
 * Central content + asset references for the Virasat page.
 *
 * Every photo, video, contact detail and link the page uses is defined in
 * this folder (site.js, events.js, gallery.js, sponsors.js). Swap the values
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
  tagline: "Where Heritage Comes Alive.",
  presenter: "GEO Jainism",
  founder: "Kavi Sajal Jain",
  founderRole: "Founder, GEO Jainism",
};

export const HERO_MEDIA = {
  /** Plays inside the 3D portal, and full-screen on the non-3D fallback. */
  video: "/tamiljain/temple-cinematic.mp4",
  poster: img("dance-stage"),
  posterKey: "dance-stage",
};

/** Section ids double as nav anchors. */
export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "shows", label: "Shows" },
  { id: "gallery", label: "Gallery" },
  { id: "partners", label: "Partners" },
  { id: "contact", label: "Contact" },
];

/** Replace with the Virasat box office / enquiry contacts. */
export const CONTACT = {
  email: "goldeneraofjainism@gmail.com",
  enquiryHours: "Mon – Sat, 10:00 – 19:00 IST",
  whatsapp: "https://chat.whatsapp.com/EnHCodUJre9AlzFO9LRx5j",
  socials: [
    { id: "instagram", label: "Instagram", href: "https://instagram.com/geo_jainism" },
    { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@geo_jainism" },
    { id: "x", label: "X", href: "https://x.com/geo_jainism" },
  ],
};

/** Art forms that scroll through the About marquee. */
export const ART_FORMS = [
  "Kathak",
  "Bharatanatyam",
  "Odissi",
  "Kuchipudi",
  "Hindustani Raag",
  "Carnatic Kriti",
  "Kalbelia",
  "Ghoomar",
  "Manganiyar",
  "Gotipua",
  "Shehnai",
  "Tabla Taal",
];
