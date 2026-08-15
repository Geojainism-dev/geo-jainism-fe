import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const TAG_STYLE = {
  Active:     { border: "rgba(125,175,110,0.55)", color: "#8BC878" },
  Converted:  { border: "rgba(232,144,159,0.55)", color: "#E89098" },
  "Rock-Cut": { border: "rgba(244,165,53,0.55)",  color: "#F4A535" },
};

export default function TJTemples() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [filter, setFilter] = useState("All");
  const { t } = useTranslation();

  const FILTERS = [
    { key: "All", label: t("tamilJain.temples.filters.all", "All") },
    { key: "Active", label: t("tamilJain.temples.filters.active", "Active") },
    { key: "Converted", label: t("tamilJain.temples.filters.converted", "Converted") },
    { key: "Rock-Cut", label: t("tamilJain.temples.filters.rockCut", "Rock-Cut") },
  ];

  const TEMPLES = [
    { title: t("tamilJain.temples.list.0.title", "Samanakovil, Vijayamangalam"), tag: "Active",    period: t("tamilJain.temples.list.0.period", "10th CE"), img: "/journey/09-temple.jpg",         desc: t("tamilJain.temples.list.0.desc", "One of Tamil Nadu's great surviving Jain heritage centres, standing resilient through centuries.") },
    { title: t("tamilJain.temples.list.1.title", "Kalugumalai Rock-Cut Temple"), tag: "Rock-Cut",  period: t("tamilJain.temples.list.1.period", "8th CE"),  img: "/journey/01-rock-sculpture.jpg", desc: t("tamilJain.temples.list.1.desc", "Spectacular rock-cut Jain sculptures carved into the hillside — a Pallava-era masterpiece.") },
    { title: t("tamilJain.temples.list.2.title", "Chithral Jain Temple"),        tag: "Active",    period: t("tamilJain.temples.list.2.period", "7th CE"),  img: "/journey/02-temple-hill.jpg",    desc: t("tamilJain.temples.list.2.desc", "A remote hilltop temple accessible only by a steep forest climb, still worshipped today.") },
    { title: t("tamilJain.temples.list.3.title", "Tirupparankuram Cave"),        tag: "Converted", period: t("tamilJain.temples.list.3.period", "3rd BCE"), img: "/journey/05-rock-carvings.jpg",  desc: t("tamilJain.temples.list.3.desc", "An ancient Jain cave shrine whose Tirthankara images were later adapted to other traditions.") },
    { title: t("tamilJain.temples.list.4.title", "Madurai Hill Shelters"),       tag: "Rock-Cut",  period: t("tamilJain.temples.list.4.period", "3rd BCE"), img: "/journey/04-hillside.jpg",       desc: t("tamilJain.temples.list.4.desc", "Tamil Brahmi inscriptions prove Jain ascetics inhabited these hills over 2,300 years ago.") },
    { title: t("tamilJain.temples.list.5.title", "Tirthankar Temple, Vellore"),  tag: "Active",    period: t("tamilJain.temples.list.5.period", "12th CE"), img: "/journey/07-stone-carving.jpg",  desc: t("tamilJain.temples.list.5.desc", "An active Jain temple preserving original stone sculptures and medieval craftsmanship.") },
    { title: t("tamilJain.temples.list.6.title", "Sittanavasal Cave Temple"),    tag: "Converted", period: t("tamilJain.temples.list.6.period", "2nd CE"),  img: "/journey/09-temple.jpg",         desc: t("tamilJain.temples.list.6.desc", "Famed for its exquisite Jain fresco paintings, later adapted, yet still preserving Jain artistic legacy.") },
    { title: t("tamilJain.temples.list.7.title", "Anaimalai Rock Shelter"),      tag: "Rock-Cut",  period: t("tamilJain.temples.list.7.period", "3rd BCE"), img: "/journey/02-temple-hill.jpg",    desc: t("tamilJain.temples.list.7.desc", "Rock-cut beds and Tamil-Brahmi inscriptions attest to early Jain monastic activity in this region.") },
    { title: t("tamilJain.temples.list.8.title", "Mel Sithamur Jain Math"),      tag: "Converted", period: t("tamilJain.temples.list.8.period", "5th CE"),  img: "/journey/07-stone-carving.jpg",  desc: t("tamilJain.temples.list.8.desc", "An ancient Jain math that evolved over centuries, now a centre of spiritual learning and heritage.") },
  ];

  const visible = (filter === "All" ? TEMPLES : TEMPLES.filter(t => t.tag === filter)).slice(0, 3);

  return (
    <section ref={ref} className="tj-section tj-temples-section" id="temples">

      <div className="tj-temples-bg-word" aria-hidden="true">{t("tamilJain.temples.bgWord")}</div>

      <div className="tj-temples-inner">

        {/* Header */}
        <motion.div
          className="tj-section-center"
          initial={{ opacity: 0, y: 44 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          style={{ marginBottom: "56px" }}
        >
          <div className="tj-eyebrow-row" style={{ justifyContent: "center", marginBottom: "20px" }}>
            <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to right, transparent, var(--tulsi-deep))" }} />
            <span className="tj-eyebrow-label tj-eyebrow-label--light">{t("tamilJain.temples.eyebrow")}</span>
            <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to left, transparent, var(--tulsi-deep))" }} />
          </div>
          <h2 className="tj-temples-heading">
            {t("tamilJain.temples.title1")}<br /><em>{t("tamilJain.temples.title2")}</em>
          </h2>
          <p className="tj-temples-sub">
            {t("tamilJain.temples.sub")}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="tj-filter-row"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ marginBottom: "56px" }}
        >
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`tj-filter-btn${filter === f.key ? " active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* 3-card grid */}
        <motion.div layout className="tj-temples-grid">
          <AnimatePresence mode="popLayout">
            {visible.map((t, i) => {
              const ts = TAG_STYLE[t.tag] || TAG_STYLE.Active;
              return (
                <motion.article
                  key={t.title}
                  layout
                  initial={{ opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                  className="tj-temple-card"
                >
                  <div className="tj-temple-img-wrap">
                    <img src={t.img} alt={t.title} loading="lazy" />
                    <div className="tj-temple-img-overlay" />
                  </div>

                  <div className="tj-temple-top">
                    <span className="tj-temple-num">0{i + 1}</span>
                    <span className="tj-temple-tag" style={{ borderColor: ts.border, color: ts.color }}>
                      {t.tag}
                    </span>
                  </div>

                  <div className="tj-temple-body">
                    <p className="tj-temple-period">{t.period}</p>
                    <h3 className="tj-temple-name">{t.title}</h3>
                    <p className="tj-temple-desc">{t.desc}</p>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}

