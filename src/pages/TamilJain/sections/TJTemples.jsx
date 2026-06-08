import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const FILTERS = ["All", "Active", "Converted", "Rock-Cut"];

const TEMPLES = [
  { title: "Samanakovil, Vijayamangalam", tag: "Active",    period: "10th CE", img: "/journey/09-temple.jpg",         desc: "One of Tamil Nadu's great surviving Jain heritage centres, standing resilient through centuries." },
  { title: "Kalugumalai Rock-Cut Temple", tag: "Rock-Cut",  period: "8th CE",  img: "/journey/01-rock-sculpture.jpg", desc: "Spectacular rock-cut Jain sculptures carved into the hillside — a Pallava-era masterpiece." },
  { title: "Chithral Jain Temple",        tag: "Active",    period: "7th CE",  img: "/journey/02-temple-hill.jpg",    desc: "A remote hilltop temple accessible only by a steep forest climb, still worshipped today." },
  { title: "Tirupparankuram Cave",        tag: "Converted", period: "3rd BCE", img: "/journey/05-rock-carvings.jpg",  desc: "An ancient Jain cave shrine whose Tirthankara images were later adapted to other traditions." },
  { title: "Madurai Hill Shelters",       tag: "Rock-Cut",  period: "3rd BCE", img: "/journey/04-hillside.jpg",       desc: "Tamil Brahmi inscriptions prove Jain ascetics inhabited these hills over 2,300 years ago." },
  { title: "Tirthankar Temple, Vellore",  tag: "Active",    period: "12th CE", img: "/journey/07-stone-carving.jpg",  desc: "An active Jain temple preserving original stone sculptures and medieval craftsmanship." },
];

const TAG_STYLE = {
  Active:     { border: "rgba(125,175,110,0.55)", color: "#8BC878" },
  Converted:  { border: "rgba(232,144,159,0.55)", color: "#E89098" },
  "Rock-Cut": { border: "rgba(244,165,53,0.55)",  color: "#F4A535" },
};

export default function TJTemples() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [filter, setFilter] = useState("All");

  const visible = filter === "All" ? TEMPLES : TEMPLES.filter(t => t.tag === filter);

  return (
    <section ref={ref} className="tj-section tj-temples-section" id="temples">

      {/* Ghost background word */}
      <div className="tj-temples-bg-word" aria-hidden="true">TEMPLE</div>

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
            <span className="tj-eyebrow-label tj-eyebrow-label--light">Sacred Architecture</span>
            <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to left, transparent, var(--tulsi-deep))" }} />
          </div>
          <h2 className="tj-temples-heading">
            Temples of<br /><em>Tamil Jainism</em>
          </h2>
          <p className="tj-temples-sub">
            From cave shrines to grand gopurams — 2,300 years of stone, devotion &amp; living tradition.
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
              key={f}
              className={`tj-filter-btn${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Poster grid */}
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
                  {/* Full-bleed image */}
                  <div className="tj-temple-img-wrap">
                    <img src={t.img} alt={t.title} loading="lazy" />
                    <div className="tj-temple-img-overlay" />
                  </div>

                  {/* Top bar: number + tag */}
                  <div className="tj-temple-top">
                    <span className="tj-temple-num">0{i + 1}</span>
                    <span
                      className="tj-temple-tag"
                      style={{ borderColor: ts.border, color: ts.color }}
                    >
                      {t.tag}
                    </span>
                  </div>

                  {/* Bottom text — always visible, desc reveals on hover */}
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
