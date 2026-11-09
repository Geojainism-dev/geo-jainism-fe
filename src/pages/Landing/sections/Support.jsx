import React from "react";
import { useTranslation } from "react-i18next";

const Support = () => {
  const { t } = useTranslation();
  return (
    <section id="support" className="donate-section">
      <h2 className="donate-title reveal">{t("support.title")}</h2>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontStyle: "italic", fontSize: "20px", lineHeight: "32px", letterSpacing: 0, color: "var(--saffron)", marginBottom: 16 }} className="reveal">{t("support.essential")}</p>
      <p className="donate-body reveal">{t("support.body")}</p>

      <div className="donate-cards reveal">
        <div className="donate-card">
          <span className="donate-card-icon">🏦</span>
          <div className="donate-card-title">{t("support.card1.title")}</div>
          <div className="donate-card-val">
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "17px", lineHeight: "27.2px", letterSpacing: 0, display: "block" }}>{t("support.card1.name")}</span>
            <span style={{ fontFamily: "'Lato',sans-serif", fontWeight: 300, fontSize: "13px", lineHeight: "22.1px", letterSpacing: 0, display: "block" }}>{t("support.card1.ac")}</span>
            <span style={{ fontFamily: "'Lato',sans-serif", fontWeight: 300, fontSize: "13px", lineHeight: "22.1px", letterSpacing: 0, display: "block" }}>{t("support.card1.ifsc")}</span>
          </div>
        </div>
        <div className="donate-card">
          <span className="donate-card-icon">📱</span>
          <div className="donate-card-title">{t("support.card2.title")}</div>
          <div className="donate-card-val">
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "17px", lineHeight: "27.2px", letterSpacing: 0, color: "var(--saffron)", display: "block" }}>geojainism@sbi</span>
          </div>
        </div>
        <div className="donate-card">
          <span className="donate-card-icon">📧</span>
          <div className="donate-card-title">{t("support.card3.title")}</div>
          <div className="donate-card-val">
            <span style={{ fontFamily: "'Lato',sans-serif", fontWeight: 300, fontSize: "13px", lineHeight: "22.1px", letterSpacing: 0, color: "var(--saffron)", display: "block" }}>goldeneraofjainism@gmail.com</span>
            <span style={{ fontFamily: "'Lato',sans-serif", fontWeight: 300, fontSize: "13px", lineHeight: "22.1px", letterSpacing: 0, color: "var(--deep-brown)", display: "block" }}>+91-6261820815</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;

