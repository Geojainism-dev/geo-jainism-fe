import { img, imgSm } from "./site";

/**
 * Upcoming shows.
 *
 * SAMPLE DATA — every show below is a placeholder. Replace titles, dates,
 * venues and copy with the confirmed programme before going live.
 *
 * Fields
 *  - start:      ISO date-time with offset; drives the date block and sorting.
 *  - ticketUrl:  optional external box-office link. When empty, "Book Tickets"
 *                opens the built-in request form, which emails CONTACT.email.
 *  - featured:   the first featured show is surfaced in the hero.
 */
export const EVENTS = [
  {
    id: "raag-darbar",
    title: "Raag Darbar",
    subtitle: "A night of Hindustani classical music",
    start: "2026-12-19T19:00:00+05:30",
    doors: "18:15",
    venue: "Courtyard Amphitheatre",
    city: "Jodhpur, Rajasthan",
    description:
      "Under the ramparts of a lit fort, a sarangi, a shehnai and a tabla trace one raag from the stillness of its alaap to a thunderous drut finale.",
    image: img("mehrangarh-night"),
    imageSm: imgSm("mehrangarh-night"),
    category: "Music",
    ticketUrl: "",
    featured: true,
  },
  {
    id: "nritya-sandhya",
    title: "Nritya Sandhya",
    subtitle: "Four classical dance traditions, one stage",
    start: "2027-01-16T18:30:00+05:30",
    doors: "17:45",
    venue: "Temple Lawns Open-Air Stage",
    city: "Khajuraho, Madhya Pradesh",
    description:
      "Kathak, Bharatanatyam, Odissi and Kuchipudi in conversation — each form opens alone, then all four meet for a closing composition set to live percussion.",
    image: img("kathak-festival"),
    imageSm: imgSm("kathak-festival"),
    category: "Dance",
    ticketUrl: "",
  },
  {
    id: "registan-ki-awaaz",
    title: "Registan ki Awaaz",
    subtitle: "Folk voices of the Thar",
    start: "2027-02-06T19:30:00+05:30",
    doors: "18:30",
    venue: "Dune Camp Arena",
    city: "Jaisalmer, Rajasthan",
    description:
      "Manganiyar singers and Kalbelia dancers carry the desert's oldest songs into the night, around a fire, with the fort glowing on the horizon.",
    image: img("kalbelia"),
    imageSm: imgSm("kalbelia"),
    category: "Folk",
    ticketUrl: "",
  },
  {
    id: "deepotsav",
    title: "Deepotsav",
    subtitle: "A festival of lamps, music and movement",
    start: "2027-03-13T18:00:00+05:30",
    doors: "17:00",
    venue: "Stepwell Pavilion",
    city: "Abhaneri, Rajasthan",
    description:
      "Three thousand diyas line the steps of an ancient baori as musicians and dancers perform on every level — a celebration designed to be walked through.",
    image: img("chand-baori"),
    imageSm: imgSm("chand-baori"),
    category: "Celebration",
    ticketUrl: "",
  },
];

/** Seating options offered in the booking form. Placeholder — set to the real ticket tiers. */
export const SEAT_TIERS = [
  { id: "rasika", label: "Rasika", note: "General seating" },
  { id: "darbar", label: "Darbar", note: "Reserved front enclosure" },
  { id: "patron", label: "Patron", note: "Premium seats & lounge" },
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
    time: f({ hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase(),
    full: f({ weekday: "short", day: "numeric", month: "long", year: "numeric" }),
  };
}

export const upcomingEvents = () =>
  [...EVENTS].sort((a, b) => new Date(a.start) - new Date(b.start));

export const featuredEvent = () => upcomingEvents().find((e) => e.featured) ?? upcomingEvents()[0];
