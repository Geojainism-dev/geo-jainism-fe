import { img, imgSm } from "./site";

/**
 * Gallery media. Order = display order within the masonry.
 *
 * Virasat event photography supplied by the client.
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

// The client's unnumbered photos (Drive folder, Nov 2026). Their numbered
// photos run through the About and Experience sections instead.
export const GALLERY = [
  photo("vs-moment-01", "event", "The Virasat ensemble beneath the Virasat banner", "wide"),
  photo("vs-moment-02", "event", "Nemi ka Nirnay — artwork from Neminath", "wide"),
  photo("vs-moment-03", "event", "Addressing the hall at Virasat", "wide"),
  photo("vs-kavi-sajal-jain", "event", "Kavi Sajal Jain on the Virasat stage", "tall"),
  photo("vs-moment-05", "event", "The team behind Virasat", "wide"),
  photo("vs-moment-06", "event", "A song with live music", "tall"),
  photo("vs-moment-07", "event", "Rath ko Modna — artwork from Neminath", "wide"),
  photo("vs-moment-08", "event", "Poetry before an image of the Tirthankara", "wide"),
  photo("vs-moment-09", "event", "Veer ras at full voice", "wide"),
  photo("vs-moment-10", "event", "A performer in the empty hall before the show", "tall"),
  photo("vs-moment-11", "event", "A recitation at Virasat", "wide"),
  photo("vs-moment-12", "event", "Friends of Virasat", "wide"),
  photo("vs-moment-13", "event", "A duet before the battlefield backdrop", "wide"),
  photo("vs-moment-14", "event", "The performers on stage", "tall"),
  photo("vs-moment-15", "event", "A call to the audience", "wide"),
  photo("vs-moment-16", "event", "A quiet moment on stage", "tall"),
  photo("vs-moment-17", "event", "Rehearsal in the hall", "tall"),
  photo("vs-moment-18", "event", "A young admirer backstage", "tall"),
  photo("vs-moment-19", "event", "A recitation beneath the Virasat banner", "wide"),
];

/** Attribution for any CC-licensed films added to the gallery. */
export const VIDEO_CREDITS = [];
