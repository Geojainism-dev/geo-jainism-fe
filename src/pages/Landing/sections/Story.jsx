import React from "react";
import { useTranslation } from "react-i18next";

const Story = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="mandala-divider">
        <div className="mandala-line"></div>
        <div className="mandala-dot"></div>
        <div className="mandala-dot" style={{ width: 14, height: 14, background: "var(--marigold)" }}></div>
        <div className="mandala-dot"></div>
        <div className="mandala-line"></div>
      </div>

      <section id="story" className="section story-section">
        <div className="reveal-left">
          <div className="story-label">{t("story.beginning")}</div>
          <h2 className="story-heading">{t("story.title1")}<br/><em>{t("story.title2")}</em></h2>
          <p className="story-body">{t("story.body1")}</p>
          <p className="story-body">{t("story.body2")}</p>
          <p className="story-body">{t("story.body3")}</p>
          <p className="story-body">{t("story.body4")}</p>
        </div>
        <div className="story-visual reveal-right">
          <div className="stone-card">
            <div className="stone-icon">🪨</div>
            <p className="stone-quote">{t("story.stoneQuote")}</p>
            <span className="stone-attr">{t("story.stoneAttr")}</span>
          </div>
          <div className="story-stats-grid">
            <div className="story-stat-card story-stat-green">
              <div className="story-stat-num" style={{ color: "var(--tulsi-deep)" }}>200+</div>
              <div className="story-stat-label">{t("story.stat1Label")}</div>
            </div>
            <div className="story-stat-card story-stat-pink">
              <div className="story-stat-num" style={{ color: "var(--lotus-deep)" }}>100+</div>
              <div className="story-stat-label">{t("story.stat2Label")}</div>
            </div>
          </div>
        </div>
        <div className="om-decoration">ॐ</div>
      </section>
    </>
  );
};

export default Story;

