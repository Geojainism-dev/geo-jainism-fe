import React from "react";
import { useTranslation } from "react-i18next";

const Shooting = () => {
  const { t } = useTranslation();
  return (
    <section className="section shooting-section">
      <div className="section-header reveal">
        <div className="section-sub">{t("shooting.sub")}</div>
        <h2 className="section-title">{t("shooting.title1")}<br/>{t("shooting.title2")}<br/>{t("shooting.title3")}</h2>
        <p className="section-desc">{t("shooting.desc")}</p>
      </div>
      <div className="features-grid">
        <div className="feature-card reveal">
          <span className="feature-icon">🏔️</span>
          <div className="feature-title">{t("shooting.feature1.title")}</div>
          <div className="feature-body">{t("shooting.feature1.body")}</div>
        </div>
        <div className="feature-card reveal">
          <span className="feature-icon">🎙️</span>
          <div className="feature-title">{t("shooting.feature2.title")}</div>
          <div className="feature-body">{t("shooting.feature2.body")}</div>
        </div>
        <div className="feature-card reveal">
          <span className="feature-icon">🏛️</span>
          <div className="feature-title">{t("shooting.feature3.title")}</div>
          <div className="feature-body">{t("shooting.feature3.body")}</div>
        </div>
      </div>
    </section>
  );
};

export default Shooting;

