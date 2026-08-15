import React from "react";
import { useTranslation } from "react-i18next";

const Stats = () => {
  const { t } = useTranslation();
  return (
    <div className="stats-strip">
      <div className="stat-card reveal"><div className="stat-num">10<span className="stat-unit">+</span></div><div className="stat-label">{t("stats.label1")}</div></div>
      <div className="stat-card reveal"><div className="stat-num">20M<span className="stat-unit">+</span></div><div className="stat-label">{t("stats.label2")}</div></div>
      <div className="stat-card reveal"><div className="stat-num">40<span className="stat-unit">+</span></div><div className="stat-label">{t("stats.label3")}</div></div>
      <div className="stat-card reveal"><div className="stat-num">54k<span className="stat-unit">+</span></div><div className="stat-label">{t("stats.label4")}</div></div>
    </div>
  );
};

export default Stats;

