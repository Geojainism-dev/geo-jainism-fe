import { format } from "date-fns";

export const EVENT_COLORS = [
  {
    id: "rose",
    name: "Rose / Red",
    bg: "bg-rose-500/15 dark:bg-rose-500/25",
    border: "border-rose-400/50 dark:border-rose-500/50",
    text: "text-rose-800 dark:text-rose-200",
    badge: "bg-rose-500 text-white",
    dot: "bg-rose-500",
    gradient: "from-rose-500 to-pink-600",
    hoverBg: "hover:bg-rose-500/25",
    accent: "#f43f5e",
  },
  {
    id: "emerald",
    name: "Emerald / Green",
    bg: "bg-emerald-500/15 dark:bg-emerald-500/25",
    border: "border-emerald-400/50 dark:border-emerald-500/50",
    text: "text-emerald-800 dark:text-emerald-200",
    badge: "bg-emerald-500 text-white",
    dot: "bg-emerald-500",
    gradient: "from-emerald-500 to-teal-600",
    hoverBg: "hover:bg-emerald-500/25",
    accent: "#10b981",
  },
  {
    id: "indigo",
    name: "Indigo / Blue",
    bg: "bg-indigo-500/15 dark:bg-indigo-500/25",
    border: "border-indigo-400/50 dark:border-indigo-500/50",
    text: "text-indigo-800 dark:text-indigo-200",
    badge: "bg-indigo-500 text-white",
    dot: "bg-indigo-500",
    gradient: "from-indigo-500 to-purple-600",
    hoverBg: "hover:bg-indigo-500/25",
    accent: "#6366f1",
  },
  {
    id: "amber",
    name: "Amber / Gold",
    bg: "bg-amber-500/15 dark:bg-amber-500/25",
    border: "border-amber-400/50 dark:border-amber-500/50",
    text: "text-amber-800 dark:text-amber-200",
    badge: "bg-amber-500 text-white",
    dot: "bg-amber-500",
    gradient: "from-amber-500 to-orange-600",
    hoverBg: "hover:bg-amber-500/25",
    accent: "#f59e0b",
  },
  {
    id: "cyan",
    name: "Cyan / Sky",
    bg: "bg-cyan-500/15 dark:bg-cyan-500/25",
    border: "border-cyan-400/50 dark:border-cyan-500/50",
    text: "text-cyan-800 dark:text-cyan-200",
    badge: "bg-cyan-500 text-white",
    dot: "bg-cyan-500",
    gradient: "from-cyan-500 to-blue-600",
    hoverBg: "hover:bg-cyan-500/25",
    accent: "#06b6d4",
  },
  {
    id: "purple",
    name: "Purple / Violet",
    bg: "bg-purple-500/15 dark:bg-purple-500/25",
    border: "border-purple-400/50 dark:border-purple-500/50",
    text: "text-purple-800 dark:text-purple-200",
    badge: "bg-purple-500 text-white",
    dot: "bg-purple-500",
    gradient: "from-purple-500 to-fuchsia-600",
    hoverBg: "hover:bg-purple-500/25",
    accent: "#a855f7",
  },
  {
    id: "fuchsia",
    name: "Fuchsia / Pink",
    bg: "bg-fuchsia-500/15 dark:bg-fuchsia-500/25",
    border: "border-fuchsia-400/50 dark:border-fuchsia-500/50",
    text: "text-fuchsia-800 dark:text-fuchsia-200",
    badge: "bg-fuchsia-500 text-white",
    dot: "bg-fuchsia-500",
    gradient: "from-fuchsia-500 to-rose-600",
    hoverBg: "hover:bg-fuchsia-500/25",
    accent: "#d946ef",
  },
];

export const dayKey = (date) => {
  if (!date) return "";
  return format(new Date(date), "yyyy-MM-dd");
};

export const getEventColor = (event) => {
  if (!event) return EVENT_COLORS[0];
  const str = String(event.id || event.title || "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % EVENT_COLORS.length;
  return EVENT_COLORS[index];
};

export const getEventHour = (localTimeStr) => {
  if (!localTimeStr) return 10;
  const time = String(localTimeStr).trim().toLowerCase();

  const match24 = time.match(/^(\d{1,2}):(\d{2})/);
  if (match24) {
    let hour = parseInt(match24[1], 10);
    if (time.includes("pm") && hour < 12) hour += 12;
    if (time.includes("am") && hour === 12) hour = 0;
    return hour;
  }

  const match12 = time.match(/^(\d{1,2})\s*(am|pm)/i);
  if (match12) {
    let hour = parseInt(match12[1], 10);
    const ampm = match12[2].toLowerCase();
    if (ampm === "pm" && hour < 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;
    return hour;
  }

  return 10;
};

export const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 7 AM to 10 PM
