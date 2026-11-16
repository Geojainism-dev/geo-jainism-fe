import { img, imgSm } from "./site";

/**
 * Upcoming shows.
 *
 * Only confirmed performances belong here. Add a show by appending an entry;
 * leave `time`/`doors` empty until they are announced.
 *
 * Fields
 *  - start:      ISO date (or date-time with offset); drives the date block and sorting.
 *  - time:       true when `start` carries a confirmed start time.
 *  - featured:   the first featured show is surfaced in the hero and the
 *                "Virasat on Stage" section.
 */
export const EVENTS = [
  {
    id: "neminath",
    title: "Neminath",
    subtitle: "Prem se Vairagya Tak",
    subtitleDeva: "प्रेम से वैराग्य तक",
    start: "2026-12-02T00:00:00+05:30",
    time: false,
    doors: "",
    venue: "Rajmal, Chhota Girnar",
    city: "UP",
    description: "",
    image: img("vs-gulbarga"),
    imageSm: imgSm("vs-gulbarga"),
    category: "Featured",
    featured: true,
  },
];

const dateFmt = (opts, locale = "en-IN") => new Intl.DateTimeFormat(locale, { timeZone: "Asia/Kolkata", ...opts });

/** Parts used by the editorial date block. `locale` follows the site language (see i18n.js). */
export function eventDate(event, locale = "en-IN") {
  const d = new Date(event.start);
  const f = (opts) => dateFmt(opts, locale).format(d);
  return {
    day: f({ day: "2-digit" }),
    month: f({ month: "short" }),
    year: f({ year: "numeric" }),
    weekday: f({ weekday: "long" }),
    // empty until a start time is announced (event.time === false)
    time: event.time === false ? "" : f({ hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase(),
    full: f({ weekday: "short", day: "numeric", month: "long", year: "numeric" }),
    long: f({ day: "numeric", month: "long", year: "numeric" }),
  };
}

export const upcomingEvents = () =>
  [...EVENTS].sort((a, b) => new Date(a.start) - new Date(b.start));

export const featuredEvent = () => upcomingEvents().find((e) => e.featured) ?? upcomingEvents()[0];
