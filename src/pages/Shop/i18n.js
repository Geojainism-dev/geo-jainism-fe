import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

/**
 * Shop translations use the site-wide i18next instance (src/i18n.js) and the
 * language picker in the shared Navbar. Keys live under "shop" in
 * src/locales/*.json; the English text is passed inline as the default, so
 * English needs no locale entries and any missing key falls back to it.
 */
const LOCALE = { en: "en-IN", hi: "hi-IN", mr: "mr-IN", ta: "ta-IN", kn: "kn-IN" };

/** Non-hook translate, for stores/services (e.g. toasts). */
export const st = (key, def, opts) => i18n.t(`shop.${key}`, { defaultValue: def, ...opts });

export function useShopT() {
  const { t, i18n: inst } = useTranslation();
  const s = (key, def, opts) => t(`shop.${key}`, { defaultValue: def, ...opts });
  /** Category with translated name / short / blurb. */
  const cat = (c) =>
    c && {
      ...c,
      name: s(`cat.${c.slug}.name`, c.name),
      short: s(`cat.${c.slug}.short`, c.short),
      blurb: s(`cat.${c.slug}.blurb`, c.blurb),
    };
  return { s, cat, lang: inst.language, locale: LOCALE[inst.language] ?? "en-IN" };
}
