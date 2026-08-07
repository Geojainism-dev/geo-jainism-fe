export const CATEGORIES = [
  { id: "active", name: "Active Events", color: "#2563eb", bgClass: "bg-blue-600", textClass: "text-blue-600", iconColor: "text-blue-500" },
  { id: "inactive", name: "Draft / Inactive", color: "#f59e0b", bgClass: "bg-amber-500", textClass: "text-amber-600", iconColor: "text-amber-500" },
  { id: "chennai", name: "Chennai Events", color: "#9333ea", bgClass: "bg-purple-600", textClass: "text-purple-600", iconColor: "text-purple-500" },
  { id: "regional", name: "Regional Screenings", color: "#10b981", bgClass: "bg-emerald-500", textClass: "text-emerald-600", iconColor: "text-emerald-500" },
];

const COLOR_PALETTE = [
  { id: "blue", bgClass: "bg-blue-600", color: "#2563eb" },
  { id: "emerald", bgClass: "bg-emerald-500", color: "#10b981" },
  { id: "purple", bgClass: "bg-purple-600", color: "#9333ea" },
  { id: "rose", bgClass: "bg-rose-500", color: "#f43f5e" },
  { id: "amber", bgClass: "bg-amber-500", color: "#f59e0b" },
  { id: "cyan", bgClass: "bg-cyan-500", color: "#06b6d4" },
];

export const getScreeningCategory = (screening, index = 0) => {
  if (!screening) return CATEGORIES[0];
  if (!screening.isActive) {
    return {
      id: "inactive",
      name: "Draft / Inactive",
      color: "#f59e0b",
      bgClass: "bg-amber-500",
      textClass: "text-amber-600",
      iconColor: "text-amber-500",
    };
  }

  const str = String(screening.city || screening.venue || screening.title || index);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorObj = COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];

  return {
    id: "active",
    name: "Active Event",
    color: colorObj.color,
    bgClass: colorObj.bgClass,
    textClass: "text-blue-600",
    iconColor: "text-blue-500",
  };
};

export const getInitialEvents = () => [];
