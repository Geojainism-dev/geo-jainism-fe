import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer>
      <div className="footer-logo">{t("footer.logo")}</div>
      <div className="footer-links">
        <a href="/about">{t("nav.about")}</a>
        <a href="/tamil-jain">{t("nav.tamilJain")}</a>
        <a href="https://instagram.com/geo_jainism" target="_blank" rel="noopener noreferrer">{t("nav.instagram", "Instagram")}</a>
        <a href="https://youtube.com/@geo_jainism" target="_blank" rel="noopener noreferrer">{t("nav.youtube", "YouTube")}</a>
        <a href="mailto:goldeneraofjainism@gmail.com">{t("nav.contact", "Contact")}</a>
        <a href="#support">{t("nav.donate", "Donate")}</a>

      </div>
      <div className="footer-copy">© 2026 {t("footer.logo")} · {t("footer.rights")}</div>
    </footer>
  );
};

export default Footer;

