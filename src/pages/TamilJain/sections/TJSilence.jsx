import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";

const IMGS = [
  "/journey/03-team-group.jpg",
  "/journey/09-temple.jpg",
  "/journey/08-community.jpg",
  "/journey/04-hillside.jpg",
];

export default function TJSilence() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useTranslation();

  const STATS = [
    { num: t("tamilJain.silence.stats.0.num", "25K–35K"), label: t("tamilJain.silence.stats.0.label", "Tamil Jains Remain") },
    { num: t("tamilJain.silence.stats.1.num", "450+"),    label: t("tamilJain.silence.stats.1.label", "Jain Sites in Tamil Nadu") },
    { num: t("tamilJain.silence.stats.2.num", "2,300+"),  label: t("tamilJain.silence.stats.2.label", "Years of Heritage") },
    { num: t("tamilJain.silence.stats.3.num", "462+"),     label: t("tamilJain.silence.stats.3.label", "Sites Documented") },
  ];

  return (
    <section ref={ref} className="tj-section tj-silence-section">
      <div className="tj-silence-glow" />

      <div className="tj-silence-inner">

        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <div className="tj-eyebrow-row" style={{ marginBottom: "20px" }}>
            <div className="tj-eyebrow-line" />
            <span className="tj-eyebrow-label">{t("tamilJain.silence.eyebrow")}</span>
          </div>

          <h2 className="tj-silence-heading">
            {t("tamilJain.silence.title1")}
            <em>{t("tamilJain.silence.title2")}</em>
            {t("tamilJain.silence.title3")}
          </h2>

          <p className="tj-silence-body">
            {t("tamilJain.silence.body1")}
          </p>
          <p className="tj-silence-body">
            {t("tamilJain.silence.body2")}
          </p>

          <a href="#notify" className="tj-btn-primary" style={{ marginTop: "12px" }}>
            {t("tamilJain.silence.cta")}
          </a>
        </motion.div>

        {/* Right — image grid + stats */}
        <div>
          <div className="tj-silence-grid">
            {IMGS.map((src, i) => (
              <motion.div
                key={i}
                className="tj-silence-img-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
              >
                <img src={src} alt="" loading="lazy" />
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="tj-stat-grid" style={{ marginTop: "20px" }}>
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                className="tj-stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
              >
                <div className="tj-stat-num">{s.num}</div>
                <div className="tj-stat-label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

