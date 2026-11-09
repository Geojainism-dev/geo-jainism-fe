import { useTranslation } from "react-i18next";

/**
 * Virasat translations use the site-wide i18next instance and the language
 * picker in the shared Navbar. Keys live under "virasat" in
 * src/locales/*.json; English is passed inline as the default, so it needs no
 * locale entries and any missing key falls back to it.
 */
const LOCALE = { en: "en-IN", hi: "hi-IN", mr: "mr-IN", ta: "ta-IN", kn: "kn-IN" };

export function useVT() {
  const { t, i18n } = useTranslation();
  const v = (key, def, opts) => t(`virasat.${key}`, { defaultValue: def, ...opts });
  /** Event with translated copy (title, subtitle, venue, city, description, category). */
  const tev = (e) =>
    e && {
      ...e,
      title: v(`ev.${e.id}.title`, e.title),
      subtitle: v(`ev.${e.id}.subtitle`, e.subtitle),
      venue: v(`ev.${e.id}.venue`, e.venue),
      city: v(`ev.${e.id}.city`, e.city),
      description: v(`ev.${e.id}.description`, e.description),
      category: v(`ev.${e.id}.category`, e.category),
    };
  return { v, tev, lang: i18n.language, locale: LOCALE[i18n.language] ?? "en-IN" };
}
