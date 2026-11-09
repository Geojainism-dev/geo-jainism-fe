import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import ta from "./locales/ta.json";
import kn from "./locales/kn.json";
import mr from "./locales/mr.json";

const savedLng = localStorage.getItem("i18nextLng") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ta: { translation: ta },
      kn: { translation: kn },
      mr: { translation: mr }
    },
    lng: savedLng,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("i18nextLng", lng);
});

export default i18n;
