import React, { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ERAS = [
  {
    icon: "🏺",
    period: "3rd Century BCE",
    shortPeriod: "3rd BCE",
    imageSrc: "/journey/01-rock-sculpture.jpg",
    title: "Stone Beds & Tamil-Brahmi Inscriptions",
    desc: "Stone beds and Tamil-Brahmi inscriptions mark the beginning of a remarkable journey — Jain monks finding refuge in the granite hills of Tamil Nadu, leaving their stories etched in ancient script.",
  },
  {
    icon: "⛰️",
    period: "2nd Century BCE – 3rd Century CE",
    shortPeriod: "2nd–3rd CE",
    imageSrc: "/journey/05-rock-carvings.jpg",
    title: "Hills Become Monasteries",
    desc: "Jainism spreads across the Tamil landscape. Natural caves are carved into monasteries; hilltops are consecrated. A network of sacred sites stretches from the Kaveri delta to the far south.",
  },
  {
    icon: "📚",
    period: "4th – 8th Century CE",
    shortPeriod: "4–8th CE",
    imageSrc: "/journey/09-temple.jpg",
    title: "Shaping Classical Tamil Culture",
    desc: "Tamil Jain scholars contribute profoundly to the Sangam literary tradition. Works like Tirukkural, Silappatikaram, and Manimekalai emerge from a world deeply influenced by Jain ethics and philosophy.",
  },
  {
    icon: "🛕",
    period: "9th – 13th Century CE",
    shortPeriod: "9–13th CE",
    imageSrc: "/journey/01-rock-sculpture.jpg",
    title: "Artistic Brilliance",
    desc: "A period of artistic brilliance — rock-cut temples, monolithic sculptures, and intricate bas-reliefs flourish. Kalagumalai, Vallimalai, and Sittanavasal stand as masterpieces of this era.",
  },
  {
    icon: "🍂",
    period: "14th – 18th Century CE",
    shortPeriod: "14–18th CE",
    imageSrc: "/journey/05-rock-carvings.jpg",
    title: "Preservation Through Change",
    desc: "Political and religious transformations reshape the region. Jain communities adapt, many sites pass into other traditions, yet the monuments endure — silent witnesses to centuries of devotion.",
  },
  {
    icon: "🔍",
    period: "19th – 20th Century CE",
    shortPeriod: "19–20th CE",
    imageSrc: "/journey/09-temple.jpg",
    title: "A Forgotten Chapter Rediscovered",
    desc: "Ancient caves, sculptures, and inscriptions are rediscovered by epigraphers and archaeologists. A forgotten chapter of Tamil history begins to resurface, reclaiming its rightful place in the story of India.",
  },
  {
    icon: "🌿",
    period: "Today",
    shortPeriod: "Today",
    imageSrc: "/journey/01-rock-sculpture.jpg",
    title: "2,000+ Years of Continuous History",
    desc: "A living tradition that endures — communities, scholars, and pilgrims keeping the flame alive. Tamil Jainism's 2,000-year journey is not just history. It is heritage, still breathing.",
  },
];

const bgVariants = {
  enter:  { opacity: 0 },
  center: { opacity: 1 },
  exit:   { opacity: 0 },
};

const textVariants = {
  enter:  (dir) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
  center:            { x: 0, opacity: 1 },
  exit:   (dir) => ({ x: dir > 0 ? -30 : 30, opacity: 0 }),
};

export default function TJCenturyWall() {
  const [activeIdx, setActiveIdx] = useState(0);
  const dirRef = useRef(0);

  const goTo = useCallback((idx) => {
    dirRef.current = idx > activeIdx ? 1 : -1;
    setActiveIdx(idx);
  }, [activeIdx]);

  const onKeyDown = (ev) => {
    if (ev.key === "ArrowLeft")  { ev.preventDefault(); goTo(Math.max(0, activeIdx - 1)); }
    if (ev.key === "ArrowRight") { ev.preventDefault(); goTo(Math.min(ERAS.length - 1, activeIdx + 1)); }
  };

  const era = ERAS[activeIdx];
  const progressPct = (activeIdx / (ERAS.length - 1)) * 100;

  return (
    <section id="century-story" className="cw-section">
      <div className="cw-inner">

        {/* Header */}
        <div className="cw-header">
          <div className="tj-eyebrow-row" style={{ justifyContent: "center", marginBottom: "14px" }}>
            <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to right, transparent, var(--saffron))" }} />
            <span className="tj-eyebrow-label">Historical Journey</span>
            <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to left, transparent, var(--saffron))" }} />
          </div>
          <h2 className="cw-title">Tamil Nadu Jainism: A Journey Through Time</h2>
        </div>

        {/* Cinematic panel */}
        <div className="cw-panel-wrap">

          {/* Layer 1: Full-bleed background — crossfades on era change */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${activeIdx}`}
              className="cw-cinema-bg"
              variants={bgVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.65 }}
            >
              <img
                className="cw-cinema-img"
                src={era.imageSrc}
                alt=""
                aria-hidden="true"
              />
              <div className="cw-cinema-overlay" aria-hidden="true" />
            </motion.div>
          </AnimatePresence>

          {/* Layer 2: Text content — slides directionally on era change */}
          <AnimatePresence mode="wait" custom={dirRef.current}>
            <motion.div
              key={`text-${activeIdx}`}
              className="cw-cinema-content"
              custom={dirRef.current}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="cw-ghost-num" aria-hidden="true">
                {String(activeIdx + 1).padStart(2, "0")}
              </span>

              <div className="cw-cinema-text">
                <span className="cw-era-icon" aria-hidden="true">{era.icon}</span>
                <span className="cw-era-period">{era.period}</span>
                <div className="cw-era-divider" aria-hidden="true" />
                <h3 className="cw-era-title">{era.title}</h3>
                <p className="cw-era-desc">{era.desc}</p>
              </div>

              <div className="cw-panel-footer">
                <span className="cw-panel-counter" aria-label={`Era ${activeIdx + 1} of ${ERAS.length}`}>
                  {String(activeIdx + 1).padStart(2, "0")}
                  <span className="cw-panel-counter-sep"> / </span>
                  {String(ERAS.length).padStart(2, "0")}
                </span>
                <div className="cw-panel-arrows">
                  <button
                    type="button"
                    className="cw-panel-arrow"
                    onClick={() => goTo(Math.max(0, activeIdx - 1))}
                    disabled={activeIdx === 0}
                    aria-label="Previous era"
                  >←</button>
                  <button
                    type="button"
                    className="cw-panel-arrow"
                    onClick={() => goTo(Math.min(ERAS.length - 1, activeIdx + 1))}
                    disabled={activeIdx === ERAS.length - 1}
                    aria-label="Next era"
                  >→</button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Horizontal era selector bar */}
        <nav
          className="cw-hbar"
          aria-label="Era navigation"
          onKeyDown={onKeyDown}
          tabIndex={0}
        >
          <div className="cw-hbar-track" aria-hidden="true">
            <div className="cw-hbar-spine" />
            <div className="cw-hbar-fill" style={{ width: `${progressPct}%` }} />
          </div>
          {ERAS.map((e, i) => (
            <button
              key={i}
              type="button"
              className={`cw-hbar-node${i === activeIdx ? " cw-hbar-node--active" : ""}`}
              onClick={() => goTo(i)}
              aria-current={i === activeIdx ? "step" : undefined}
              aria-label={e.period}
            >
              <span className="cw-hbar-icon" aria-hidden="true">{e.icon}</span>
              <span className="cw-hbar-dot" aria-hidden="true" />
              <span className="cw-hbar-label">{e.shortPeriod}</span>
            </button>
          ))}
        </nav>

      </div>
    </section>
  );
}
