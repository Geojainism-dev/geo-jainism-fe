import React from "react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
    <section className="section about-section">
      <div className="reveal-left">
        <span className="about-tag">{t("landingAbout.tag")}</span>
        <h2 className="story-heading" dangerouslySetInnerHTML={{ __html: t("landingAbout.title") }}></h2>
        <p className="story-body">{t("landingAbout.body1")}</p>
        <p className="story-body" style={{ marginTop: 16 }}>{t("landingAbout.body2")}</p>
        <div className="about-founder">
          <div className="founder-avatar">KJ</div>
          <div>
            <div className="founder-name">Kavi Sajal Jain</div>
            <div className="founder-role">{t("landingAbout.founderRole")}</div>
            <p style={{ fontSize: 12, color: "var(--ink)", opacity: 0.6, marginTop: 6, lineHeight: 1.6 }}>{t("landingAbout.founderQuote")}</p>
          </div>
        </div>
      </div>
      <div className="coverage-grid reveal-right">
        <div className="coverage-item"><span className="coverage-icon">🎬</span><div className="coverage-title">{t("landingAbout.coverage.0.title")}</div><div className="coverage-body">{t("landingAbout.coverage.0.body")}</div></div>
        <div className="coverage-item"><span className="coverage-icon">📜</span><div className="coverage-title">{t("landingAbout.coverage.1.title")}</div><div className="coverage-body">{t("landingAbout.coverage.1.body")}</div></div>
        <div className="coverage-item"><span className="coverage-icon">🗺️</span><div className="coverage-title">{t("landingAbout.coverage.2.title")}</div><div className="coverage-body">{t("landingAbout.coverage.2.body")}</div></div>
        <div className="coverage-item"><span className="coverage-icon">📱</span><div className="coverage-title">{t("landingAbout.coverage.3.title")}</div><div className="coverage-body">{t("landingAbout.coverage.3.body")}</div></div>
        <div className="coverage-item"><span className="coverage-icon">🏛️</span><div className="coverage-title">{t("landingAbout.coverage.4.title")}</div><div className="coverage-body">{t("landingAbout.coverage.4.body")}</div></div>
        <div className="coverage-item"><span className="coverage-icon">⛰️</span><div className="coverage-title">{t("landingAbout.coverage.5.title")}</div><div className="coverage-body">{t("landingAbout.coverage.5.body")}</div></div>
      </div>
    </section>
  );
};

export default About;

