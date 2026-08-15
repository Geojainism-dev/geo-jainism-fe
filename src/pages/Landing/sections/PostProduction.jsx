import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./PostProduction.module.css";
import prose from "./Prose.module.css";

const PostProduction = () => {
  const { t } = useTranslation();
  return (
    <section className={`section ${styles.postSection}`}>
      <div className="reveal-left">
        <div className={prose.label}>{t("postProduction.label")}</div>
        <h2 className={prose.heading}>{t("postProduction.title1")}<br/><em>{t("postProduction.title2")}</em></h2>
        <p className={prose.body}>{t("postProduction.body1")}</p>
        <h4 className={prose.body} style={{ marginTop: 16 }}>{t("postProduction.whoForHeading")}</h4>
        <p className={prose.body} style={{ marginTop: 16 }}>{t("postProduction.whoForBody")}</p>
        <div className={styles.historyPills}>
          {["4 Months", "Research", "Exploration", "Heritage", "Literature", "Legends", "Storytelling"].map((p, idx) => (
            <span className={styles.pill} key={p}>{t(`postProduction.pills.${idx}`, p)}</span>
          ))}
        </div>
      </div>
      <div className={`${styles.postVisual} reveal-right`}>
        <div className={styles.epochCard}>
          <div className={styles.epochEra}>{t("postProduction.card1.era")}</div>
          <div className={styles.epochTitle}>{t("postProduction.card1.title")}</div>
          <div className={styles.epochBody}>{t("postProduction.card1.body")}</div>
        </div>
        <div className={styles.epochCard} style={{ borderLeftColor: "var(--lotus-deep)" }}>
          <div className={styles.epochEra} style={{ color: "var(--lotus-deep)" }}>{t("postProduction.card2.era")}</div>
          <div className={styles.epochTitle}>{t("postProduction.card2.title")}</div>
          <div className={styles.epochBody}>{t("postProduction.card2.body")}</div>
        </div>
        <div className={styles.epochCard} style={{ borderLeftColor: "var(--tulsi-deep)" }}>
          <div className={styles.epochEra} style={{ color: "var(--tulsi-deep)" }}>{t("postProduction.card3.era")}</div>
          <div className={styles.epochTitle}>{t("postProduction.card3.title")}</div>
          <div className={styles.epochBody}>{t("postProduction.card3.body")}</div>
        </div>
      </div>
    </section>
  );
};

export default PostProduction;

