import { img, imgSm } from "./site";

/**
 * Gallery media. Order = display order within the masonry.
 *
 *  type:    "image" | "video"
 *  span:    "tall" | "wide" | "square" — controls the masonry tile shape
 *  video:   for type "video", the file played in the modal (poster = image)
 *
 * Temporary media is CC-licensed (see /public/virasat/images/CREDITS.json and
 * VIDEO_CREDITS below). Replace with Virasat's own event coverage.
 */
export const GALLERY_FILTERS = [
  { id: "all", label: "All" },
  { id: "performances", label: "Performances" },
  { id: "backstage", label: "Behind the Scenes" },
  { id: "videos", label: "Films" },
  { id: "highlights", label: "Past Highlights" },
];

const photo = (key, category, caption, span = "square") => ({
  id: key,
  type: "image",
  category,
  caption,
  span,
  src: img(key),
  thumb: imgSm(key),
});

export const GALLERY = [
  {
    id: "film-khajuraho-01",
    type: "video",
    category: "videos",
    caption: "Khajuraho Dance Festival — evening performances",
    span: "wide",
    src: img("dance-stage"),
    thumb: imgSm("dance-stage"),
    video: "/virasat/videos/khajuraho-festival-01.webm",
  },
  photo("kathak-portrait", "performances", "Kathak — the spin before the stillness", "tall"),
  photo("gotipua", "backstage", "Gotipua — lamp-lit preparation before entering the stage", "wide"),
  photo("ghoomar", "performances", "Ghoomar — a whirl of Rajasthani colour"),
  photo("kathak-tatkar", "backstage", "Ghungroo and tatkar — the footwork rehearsal", "wide"),
  photo("manganiyar-singers", "performances", "Manganiyar voices", "tall"),
  photo("kalbelia", "highlights", "Kalbelia in full flight", "wide"),
  photo("odissi-festival", "backstage", "Odissi — moments before curtain"),
  {
    id: "film-khajuraho-02",
    type: "video",
    category: "videos",
    caption: "Classical dance under the Khajuraho temples",
    span: "square",
    src: img("stage-night"),
    thumb: imgSm("stage-night"),
    video: "/virasat/videos/khajuraho-festival-02.webm",
  },
  photo("kathak-group", "performances", "Kathak ensemble", "wide"),
  photo("kalbelia-festival", "highlights", "Kalbelia at the Khajuraho festival", "tall"),
  photo("shehnai", "backstage", "Shehnai, sambal and harmonium tuning up", "wide"),
  photo("bharatanatyam-portrait", "performances", "Bharatanatyam — a line held in time", "tall"),
  photo("odissi-youth", "highlights", "Odissi trio on the festival stage", "wide"),
  photo("diyas", "highlights", "The lamps of Deepotsav", "square"),
  photo("sound-of-desert", "performances", "Sound of the desert — kamaicha and voice", "wide"),
  photo("tabla", "backstage", "Tabla — riyaaz before the concert", "square"),
  photo("bharatanatyam-group", "highlights", "Bharatanatyam trio", "wide"),
];

/** Attribution for the temporary films. */
export const VIDEO_CREDITS = [
  {
    title: "Khajuraho Dance Festival 2025 01.webm",
    author: "The open draft",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Khajuraho_Dance_Festival_2025_01.webm",
  },
  {
    title: "Khajuraho Dance Festival 2025 02.webm",
    author: "The open draft",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Khajuraho_Dance_Festival_2025_02.webm",
  },
];
