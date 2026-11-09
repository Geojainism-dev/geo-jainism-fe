import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Story.module.css";
import prose from "./Prose.module.css";

const Story = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.mandalaDivider}>
        <div className={styles.mandalaLine}></div>
        <div className={styles.mandalaDot}></div>
        <div className={styles.mandalaDot} style={{ width: 14, height: 14, background: "var(--marigold)" }}></div>
        <div className={styles.mandalaDot}></div>
        <div className={styles.mandalaLine}></div>
      </div>

      <section id="story" className={`section ${styles.storySection}`}>
        <div className="reveal-left">
          <div className={prose.label}>{t("story.beginning")}</div>
          <h2 className={prose.heading}>{t("story.title1")}<br/><em>{t("story.title2")}</em></h2>
          <p className={prose.body}>{t("story.body1")}</p>
          <p className={prose.body}>{t("story.body2")}</p>
          <p className={prose.body}>{t("story.body3")}</p>
          <p className={prose.body}>{t("story.body4")}</p>
        </div>
        <div className={`${styles.storyVisual} reveal-right`}>
          <div className={styles.stoneCard}>
            <div className={styles.stoneIcon}>🪨</div>
            <p className={styles.stoneQuote}>{t("story.stoneQuote")}</p>
            <span className={styles.stoneAttr}>{t("story.stoneAttr")}</span>
          </div>
          <div className={styles.storyStatsGrid}>
            <div className={`${styles.storyStatCard} ${styles.storyStatGreen}`}>
              <div className={styles.storyStatNum} style={{ color: "var(--tulsi-deep)" }}>200+</div>
              <div className={styles.storyStatLabel}>{t("story.stat1Label")}</div>
            </div>
            <div className={`${styles.storyStatCard} ${styles.storyStatPink}`}>
              <div className={styles.storyStatNum} style={{ color: "var(--lotus-deep)" }}>100+</div>
              <div className={styles.storyStatLabel}>{t("story.stat2Label")}</div>
            </div>
          </div>
        </div>
        <div className={styles.omDecoration}>ॐ</div>
      </section>
    </>
  );
};

export default Story;

