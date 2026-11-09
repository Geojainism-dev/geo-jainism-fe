import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Stats.module.css";

const Stats = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.statsStrip}>
      <div className={`${styles.statCard} reveal`}><div className={styles.statNum}>10<span className={styles.statUnit}>+</span></div><div className={styles.statLabel}>{t("stats.label1")}</div></div>
      <div className={`${styles.statCard} reveal`}><div className={styles.statNum}>20M<span className={styles.statUnit}>+</span></div><div className={styles.statLabel}>{t("stats.label2")}</div></div>
      <div className={`${styles.statCard} reveal`}><div className={styles.statNum}>40<span className={styles.statUnit}>+</span></div><div className={styles.statLabel}>{t("stats.label3")}</div></div>
      <div className={`${styles.statCard} reveal`}><div className={styles.statNum}>54k<span className={styles.statUnit}>+</span></div><div className={styles.statLabel}>{t("stats.label4")}</div></div>
    </div>
  );
};

export default Stats;

