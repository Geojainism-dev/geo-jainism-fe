import React from "react";
import { useTranslation } from "react-i18next";

const PostProduction = () => {
  const { t } = useTranslation();
  return (
    <section className="section post-section">
      <div className="reveal-left">
        <div className="story-label">{t("postProduction.label")}</div>
        <h2 className="story-heading">{t("postProduction.title1")}<br/><em>{t("postProduction.title2")}</em></h2>
        <p className="story-body">{t("postProduction.body1")}</p>
        <h4 className="story-body" style={{ marginTop: 16 }}>{t("postProduction.whoForHeading")}</h4>
        <p className="story-body" style={{ marginTop: 16 }}>{t("postProduction.whoForBody")}</p>
        <div className="history-pills">
          {["4 Months", "Research", "Exploration", "Heritage", "Literature", "Legends", "Storytelling"].map((p, idx) => (
            <span className="pill" key={p}>{t(`postProduction.pills.${idx}`, p)}</span>
          ))}
        </div>
      </div>
      <div className="post-visual reveal-right">
        <div className="epoch-card">
          <div className="epoch-era">{t("postProduction.card1.era")}</div>
          <div className="epoch-title">{t("postProduction.card1.title")}</div>
          <div className="epoch-body">{t("postProduction.card1.body")}</div>
        </div>
        <div className="epoch-card" style={{ borderLeftColor: "var(--lotus-deep)" }}>
          <div className="epoch-era" style={{ color: "var(--lotus-deep)" }}>{t("postProduction.card2.era")}</div>
          <div className="epoch-title">{t("postProduction.card2.title")}</div>
          <div className="epoch-body">{t("postProduction.card2.body")}</div>
        </div>
        <div className="epoch-card" style={{ borderLeftColor: "var(--tulsi-deep)" }}>
          <div className="epoch-era" style={{ color: "var(--tulsi-deep)" }}>{t("postProduction.card3.era")}</div>
          <div className="epoch-title">{t("postProduction.card3.title")}</div>
          <div className="epoch-body">{t("postProduction.card3.body")}</div>
        </div>
      </div>
    </section>
  );
};

export default PostProduction;

