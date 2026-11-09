import React from "react";
import { useTranslation } from "react-i18next";

const Release = () => {
  const { t } = useTranslation();
  return (
    <section id="release" className="release-section">
      <div className="release-label">{t("release.label")}</div>
      <h2 className="release-title">{t("release.title1")}<br/><span>{t("release.title2")}</span></h2>
      <p className="release-body">{t("release.body")}</p>
      <div className="release-pills">
        <div className="release-pill" dangerouslySetInnerHTML={{ __html: t("release.pill1") }}></div>
        <div className="release-pill" dangerouslySetInnerHTML={{ __html: t("release.pill2") }}></div>
        <div className="release-pill" dangerouslySetInnerHTML={{ __html: t("release.pill3") }}></div>
      </div>
      <div className="cta-group">
        <a href="#support" className="btn-primary">{t("release.btnPrimary")}</a>
        <a href="https://www.youtube.com/@geo_jainism" className="btn-secondary" target="_blank" rel="noreferrer">{t("release.btnSecondary")}</a>
      </div>
    </section>
  );
};

export default Release;

