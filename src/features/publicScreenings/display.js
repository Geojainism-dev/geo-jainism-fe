// The site's secondary palette (landing.css) — tulsi, marigold, lotus,
// terracotta — cycled across event cards/slides for visual variety. The
// Register/CTA action itself deliberately stays a fixed tulsi green
// everywhere (REGISTER_GRADIENT) so the one actionable color in the UI stays
// consistent no matter which accent a given card landed on.
export const ACCENTS = [
  { from: "#7DAF6E", to: "#4A7A3F", ring: "#C8DFC0", soft: "#EDF4E7", dot: "rgba(125,175,110,0.35)" },
  { from: "#E8A820", to: "#B9860E", ring: "#F7D580", soft: "#FBF3DE", dot: "rgba(232,168,32,0.35)" },
  { from: "#E8909F", to: "#C2677A", ring: "#F2C4CE", soft: "#FBEEF0", dot: "rgba(232,144,159,0.35)" },
  { from: "#C8785A", to: "#9C5540", ring: "#E8D5B0", soft: "#F6EEE3", dot: "rgba(200,120,90,0.35)" },
];
export const getAccent = (i) => ACCENTS[i % ACCENTS.length];
export const REGISTER_GRADIENT = "from-[#7DAF6E] to-[#4A7A3F]";

// screening.localDate arrives pre-formatted by the backend as "August 19, 2026"
// (already timezone-corrected) — pulled apart here instead of re-parsing the
// raw date, so the badge never disagrees with the text next to it.
export function dateBadge(localDate) {
  const match = /^([A-Za-z]+)\s+(\d{1,2}),/.exec(localDate || "");
  if (!match) return null;
  return { month: match[1].slice(0, 3).toUpperCase(), day: match[2] };
}

// A short, approximate "how soon" label — good enough for a bit of urgency
// flair on a card, not meant to be to-the-minute precise across timezones.
export function urgencyLabel(dateStr) {
  const now = new Date();
  const target = new Date(dateStr);
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(target) - startOfDay(now)) / 86400000);
  if (days < 0) return null;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `In ${days} days`;
  return null;
}
