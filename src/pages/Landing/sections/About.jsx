import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./About.module.css";
import prose from "./Prose.module.css";

const About = () => {
  const { t } = useTranslation();
  return (
    <section className={`section ${styles.aboutSection}`}>
      <div className="reveal-left">
        <span className={styles.aboutTag}>{t("landingAbout.tag")}</span>
        <h2 className={prose.heading} dangerouslySetInnerHTML={{ __html: t("landingAbout.title") }}></h2>
        <p className={prose.body}>{t("landingAbout.body1")}</p>
        <p className={prose.body} style={{ marginTop: 16 }}>{t("landingAbout.body2")}</p>
        <div className={styles.aboutFounder}>
          <div className={styles.founderAvatar}>KJ</div>
          <div>
            <div className={styles.founderName}>Kavi Sajal Jain</div>
            <div className={styles.founderRole}>{t("landingAbout.founderRole")}</div>
            <p style={{ fontSize: 12, color: "var(--ink)", opacity: 0.6, marginTop: 6, lineHeight: 1.6 }}>{t("landingAbout.founderQuote")}</p>
          </div>
        </div>
      </div>
      <div className={`${styles.coverageGrid} reveal-right`}>
        <div className={styles.coverageItem}><span className={styles.coverageIcon}>🎬</span><div className={styles.coverageTitle}>{t("landingAbout.coverage.0.title")}</div><div className={styles.coverageBody}>{t("landingAbout.coverage.0.body")}</div></div>
        <div className={styles.coverageItem}><span className={styles.coverageIcon}>📜</span><div className={styles.coverageTitle}>{t("landingAbout.coverage.1.title")}</div><div className={styles.coverageBody}>{t("landingAbout.coverage.1.body")}</div></div>
        <div className={styles.coverageItem}><span className={styles.coverageIcon}>🗺️</span><div className={styles.coverageTitle}>{t("landingAbout.coverage.2.title")}</div><div className={styles.coverageBody}>{t("landingAbout.coverage.2.body")}</div></div>
        <div className={styles.coverageItem}><span className={styles.coverageIcon}>📱</span><div className={styles.coverageTitle}>{t("landingAbout.coverage.3.title")}</div><div className={styles.coverageBody}>{t("landingAbout.coverage.3.body")}</div></div>
        <div className={styles.coverageItem}><span className={styles.coverageIcon}>🏛️</span><div className={styles.coverageTitle}>{t("landingAbout.coverage.4.title")}</div><div className={styles.coverageBody}>{t("landingAbout.coverage.4.body")}</div></div>
        <div className={styles.coverageItem}><span className={styles.coverageIcon}>⛰️</span><div className={styles.coverageTitle}>{t("landingAbout.coverage.5.title")}</div><div className={styles.coverageBody}>{t("landingAbout.coverage.5.body")}</div></div>
      </div>
    </section>
  );
};

export default About;

