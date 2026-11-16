import { img, imgSm } from "./site";

/**
 * Gallery media. Order = display order within the masonry.
 *
 * NO VIRASAT EVENT PHOTOS OR FILMS EXIST IN THE PROJECT YET. Until they do,
 * the gallery shows genuine Jain heritage imagery — mostly GEO Jainism's own
 * field photography — captioned as heritage, never as Virasat performances.
 * When event coverage arrives, add it with photo()/film() and, if useful,
 * performance categories to GALLERY_FILTERS (e.g. "Live Performances").
 *
 * Images live in /public/virasat/images as <key>.webp (≤1920px) and
 * <key>-sm.webp (≤900px). CC-licensed items are credited in CREDITS.json.
 *
 *  type:    "image" | "video"
 *  span:    "tall" | "wide" | "square" — controls the masonry tile shape
 *  video:   for type "video", the file played in the lightbox (poster = image)
 */
export const GALLERY_FILTERS = [
  { id: "all", label: "All Moments" },
  { id: "tirthankaras", label: "Tirthankaras" },
  { id: "sites", label: "Sacred Sites" },
  { id: "manuscripts", label: "Manuscripts & Inscriptions" },
  { id: "field", label: "Behind The Scenes" },
];

export const photo = (key, category, caption, span = "square") => ({
  id: key,
  type: "image",
  category,
  caption,
  span,
  src: img(key),
  thumb: imgSm(key),
});

export const film = (key, category, caption, video, span = "wide") => ({
  ...photo(key, category, caption, span),
  type: "video",
  video,
});

// order chosen so the dense grid packs without gaps at 4 and 2 columns
export const GALLERY = [
  photo("vs-dilwara", "sites", "The carved marble dome of the Dilwara Jain temples", "wide"),
  photo("vs-tirthankara", "tirthankaras", "A Tirthankara idol in a temple shrine", "wide"),
  photo("vs-kalpasutra", "manuscripts", "A Kalpasutra folio, c. 1465", "tall"),
  photo("vs-rock-jina", "tirthankaras", "A rock-cut Tirthankara, Tamil Nadu", "tall"),
  photo("vs-lalitpur", "tirthankaras", "A standing Tirthankara — Lalitpur, Uttar Pradesh", "tall"),
  photo("vs-founder", "field", "Kavi Sajal Jain during on-field documentation", "tall"),
  photo("vs-samanar-malai", "sites", "Samanar Malai, Madurai", "wide"),
  photo("vs-kalugumalai", "sites", "Rock-cut reliefs at Kalugumalai, Tamil Nadu", "wide"),
  photo("vs-stone-carving", "tirthankaras", "Rock-shelter carvings of Tirthankaras, Tamil Nadu", "wide"),
  photo("vs-gulbarga", "tirthankaras", "A Tirthankara in a stone niche — Gulbarga"),
  photo("vs-inscription", "manuscripts", "A Tamil-Brahmi cave inscription"),
  photo("vs-bihar", "sites", "Bihar — the birthplace of Bhagwan Mahavir", "tall"),
  photo("vs-vijayamangalam", "sites", "Samanakovil, Vijayamangalam", "tall"),
  photo("vs-team", "field", "The GEO Jainism team in the field", "wide"),
  photo("vs-vallimalai", "sites", "Vallimalai, Tamil Nadu", "wide"),
];

/** Attribution for any CC-licensed films added to the gallery. */
export const VIDEO_CREDITS = [];
