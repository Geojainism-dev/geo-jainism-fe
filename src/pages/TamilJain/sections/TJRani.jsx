import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function TJRani() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();

  return (
    <section ref={ref} className="tj-section tj-rani-section">

      {/* Background decorative text */}
      <div className="tj-rani-bg-word" aria-hidden="true">{t("tamilJain.rani.bgWord")}</div>

      <div className="tj-rani-inner">

        {/* ── IMAGE COLUMN ── */}
        <motion.div
          className="tj-rani-img-col"
          initial={{ opacity: 0, x: -60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="tj-rani-img-wrap">
            <img
              className="tj-rani-img"
              src="/journey/08-community.jpg"
              alt="Rani Aaiyabba Devi"
              loading="lazy"
            />
            <div className="tj-rani-img-vignette" />
            <div className="tj-rani-img-overlay" />

            {/* Century stamp */}
            <div className="tj-rani-century">
              <span className="tj-rani-century-num">{t("tamilJain.rani.centuryNum")}</span>
              <span className="tj-rani-century-label">{t("tamilJain.rani.centuryLabel")}</span>
            </div>
          </div>

          {/* Stone inscription quote */}
          <div className="tj-rani-inscription">
            <span className="tj-rani-inscription-mark">"</span>
            <p className="tj-rani-inscription-text">
              {t("tamilJain.rani.inscriptionQuote")}
            </p>
          </div>
        </motion.div>

        {/* ── CONTENT COLUMN ── */}
        <div className="tj-rani-content-col">

          <motion.div
            className="tj-eyebrow-row"
            style={{ marginBottom: "24px" }}
            {...fade(0.2)}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to right, transparent, var(--saffron))" }} />
            <span className="tj-eyebrow-label">{t("tamilJain.rani.eyebrow")}</span>
            <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to left, transparent, var(--saffron))" }} />
          </motion.div>

          <motion.h2
            className="tj-rani-content-heading"
            {...fade(0.35)}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            {t("tamilJain.rani.title1")}<em>{t("tamilJain.rani.title2")}</em>
          </motion.h2>

          <motion.div
            className="tj-rani-divider"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={inView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.p
            className="tj-rani-body"
            {...fade(0.55)}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            {t("tamilJain.rani.body1")}
          </motion.p>

          <motion.p
            className="tj-rani-body"
            {...fade(0.7)}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            {t("tamilJain.rani.body2")}
          </motion.p>

          {/* Stats row */}
          <motion.div
            className="tj-rani-stats"
            {...fade(0.85)}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            <div className="tj-rani-stat">
              <span className="tj-rani-stat-num">{t("tamilJain.rani.stats.0.num", "12+")}</span>
              <span className="tj-rani-stat-label">{t("tamilJain.rani.stats.0.label", "Temples Patronised")}</span>
            </div>
            <div className="tj-rani-stat-divider" />
            <div className="tj-rani-stat">
              <span className="tj-rani-stat-num">{t("tamilJain.rani.stats.1.num", "3")}</span>
              <span className="tj-rani-stat-label">{t("tamilJain.rani.stats.1.label", "Copper-plate Grants")}</span>
            </div>
            <div className="tj-rani-stat-divider" />
            <div className="tj-rani-stat">
              <span className="tj-rani-stat-num">{t("tamilJain.rani.stats.2.num", "10th C")}</span>
              <span className="tj-rani-stat-label">{t("tamilJain.rani.stats.2.label", "Era")}</span>
            </div>
          </motion.div>

          <motion.a
            href="#temples"
            className="tj-cta-ghost"
            {...fade(1)}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            {t("tamilJain.rani.cta")} <span>→</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

