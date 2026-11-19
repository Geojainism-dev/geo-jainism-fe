import { img, imgSm } from "./site";

/**
 * Gallery media. Order = display order within the masonry.
 *
 * Mostly Virasat event photography supplied by the client, plus two heritage
 * images (GEO Jainism field photography) where no event photo was supplied.
 *
 * Images live in /public/virasat/images as <key>.webp (≤1920px) and
 * <key>-sm.webp (≤900px). CC-licensed items are credited in CREDITS.json.
 *
 *  type:    "image" | "video"
 *  span:    "tall" | "wide" | "square" — controls the masonry tile shape
 *  video:   for type "video", the file played in the lightbox (poster = image)
 */
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

// Plate numbers follow the client's numbered photos (Drive folder, Nov 2026):
// photo N fills plate N. Numbers with no photo (07, 15) keep the earlier
// heritage images.
export const GALLERY = [
  photo("vs-event-01", "event", "Poetry and song before an epic backdrop on the Virasat stage", "wide"),
  photo("vs-event-02", "event", "Addressing a full hall at Virasat", "wide"),
  photo("vs-event-03", "event", "The Virasat ensemble", "tall"),
  photo("vs-event-04", "event", "A packed auditorium for Virasat", "tall"),
  photo("vs-event-05", "event", "Bharat and Bahubali — artwork from the Virasat stage", "tall"),
  photo("vs-event-06", "event", "A recitation with live music", "tall"),
  photo("vs-samanar-malai", "sites", "Samanar Malai, Madurai", "wide"),
  photo("vs-event-08", "event", "A royal court — artwork from the Virasat stage", "wide"),
  photo("vs-event-09", "event", "The Virasat team on stage at the finale", "wide"),
  photo("vs-event-10", "event", "A duet before the battlefield backdrop"),
  photo("vs-event-11", "event", "A recitation at Virasat"),
  photo("vs-event-12", "event", "A performer holds the stage at Virasat", "tall"),
  photo("vs-event-13", "event", "A screening during Virasat", "tall"),
  photo("vs-event-14", "event", "A battle scene — artwork from the Virasat stage", "wide"),
  photo("vs-vallimalai", "sites", "Vallimalai, Tamil Nadu", "wide"),
];

/** Attribution for any CC-licensed films added to the gallery. */
export const VIDEO_CREDITS = [];
