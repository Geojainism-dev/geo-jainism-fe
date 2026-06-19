import React, { useRef, useState, useCallback } from "react";
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";

const HILLS = [
  {
    src: "/TJpageCarousel/Samanar Malai.JPG",
    name: "Samanar Malai",
    region: "Madurai",
    num: "01",
    desc: "A magnificent Jain cave complex near Madurai, featuring ancient rock-cut beds, Tamil-Brahmi inscriptions, and exquisite stone sculptures carved over two millennia ago.",
  },
  {
    src: "/TJpageCarousel/Vallimalai.jpg",
    name: "Vallimalai",
    region: "Vellore",
    num: "02",
    desc: "A sacred Jain hillock in the Vellore district, home to ancient cave shrines, rock-cut beds, and a revered Mahavira temple that continues to draw pilgrims today.",
  },
  {
    src: "/TJpageCarousel/THIRUNATHAR KUNDRU .JPG",
    name: "Thirunathar Kundru",
    region: "Ariyalur",
    num: "03",
    desc: "An ancient Jain sacred hill bearing rock-cut monastic shelters and inscriptions that speak of a thriving Jain community that once called this hill home.",
  },
  {
    src: "/TJpageCarousel/Azhgarmalai.JPG",
    name: "Azhgarmalai",
    region: "Karur",
    num: "04",
    desc: "A revered Jain hill site in the Karur region, featuring ancient caves, natural rock-cut beds, and monolithic sculptures that stand witness to centuries of devotion.",
  },
  {
    src: "/TJpageCarousel/Kalagumalai.JPG",
    name: "Kalagumalai",
    region: "Thoothukudi",
    num: "05",
    desc: "Home to the iconic unfinished Jain rock sculpture and exquisite bas-reliefs, Kalagumalai stands as one of the finest examples of Jain artistic heritage in Tamil Nadu.",
  },
];

const bgVariants = {
  enter:  { opacity: 0 },
  center: { opacity: 1 },
  exit:   { opacity: 0 },
};

const contentVariants = {
  enter:  (dir) => ({ x: dir > 0 ? 24 : -24, opacity: 0 }),
  center:            { x: 0, opacity: 1 },
  exit:   (dir) => ({ x: dir > 0 ? -24 : 24, opacity: 0 }),
};

export default function TJThingalur() {
  const sectionRef  = useRef(null);
  const dirRef      = useRef(0);
  const pointerX    = useRef(null);
  const inView      = useInView(sectionRef, { once: true, margin: "-100px" });
  const shouldReduce = useReducedMotion();

  const [idx, setIdx] = useState(0);

  const goTo = useCallback((i) => {
    dirRef.current = i > idx ? 1 : -1;
    setIdx(i);
  }, [idx]);

  const prev = () => goTo((idx - 1 + HILLS.length) % HILLS.length);
  const next = () => goTo((idx + 1) % HILLS.length);

  const onPointerDown = (e) => { pointerX.current = e.clientX; };
  const onPointerUp   = (e) => {
    if (pointerX.current === null) return;
    const delta = e.clientX - pointerX.current;
    if (Math.abs(delta) > 50) delta < 0 ? next() : prev();
    pointerX.current = null;
  };

  const hill = HILLS[idx];
  const progressPct = (idx / (HILLS.length - 1)) * 100;

  return (
    <section
      ref={sectionRef}
      className="tj-thingalur-section"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >

      {/* LAYER 0 — Full-bleed background image with Ken Burns */}
      <div className="tj-tng-bg" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${idx}`}
            className="tj-tng-bg-layer"
            variants={bgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <img className="tj-tng-bg-img" src={hill.src} alt="" aria-hidden="true" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* LAYER 1 — Vignette */}
      <div className="tj-tng-vignette" aria-hidden="true" />

      {/* LAYER 2 — Bottom content panel */}
      <motion.div
        className="tj-tng-panel"
        initial={shouldReduce ? false : { y: 40, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        {/* Ghost number watermark */}
        <span className="tj-tng-ghost-num" aria-hidden="true">{hill.num}</span>

        {/* Left: region + title + desc */}
        <AnimatePresence mode="wait" custom={dirRef.current}>
          <motion.div
            key={`content-${idx}`}
            className="tj-tng-content"
            custom={dirRef.current}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="tj-tng-region">{hill.region}</span>

            <h2 className="tj-tng-title">
              {(() => {
                const words = hill.name.split(" ");
                if (words.length === 1) return <em>{hill.name}</em>;
                return (
                  <>
                    {words.slice(0, -1).join(" ")}<br />
                    <em>{words[words.length - 1]}</em>
                  </>
                );
              })()}
            </h2>

            <p className="tj-tng-desc">{hill.desc}</p>
          </motion.div>
        </AnimatePresence>

        {/* Right: counter + arrows + dots */}
        <div className="tj-tng-nav-col">
          <div className="tj-tng-nav">
            <button className="tj-tng-arrow" onClick={prev} aria-label="Previous site">←</button>
            <span className="tj-tng-counter" aria-label={`Site ${idx + 1} of ${HILLS.length}`}>
              <span className="tj-tng-counter-cur">{String(idx + 1).padStart(2, "0")}</span>
              <span className="tj-tng-counter-sep"> / </span>
              <span className="tj-tng-counter-tot">{String(HILLS.length).padStart(2, "0")}</span>
            </span>
            <button className="tj-tng-arrow" onClick={next} aria-label="Next site">→</button>
          </div>

          <div className="tj-tng-dots" role="tablist" aria-label="Sites">
            {HILLS.map((_, i) => (
              <button
                key={i}
                className={`tj-tng-dot${i === idx ? " active" : ""}`}
                onClick={() => goTo(i)}
                aria-selected={i === idx}
                aria-label={HILLS[i].name}
                role="tab"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* LAYER 3 — Right-edge thumbnail strip (desktop only) */}
      <motion.div
        className="tj-tng-thumbs"
        aria-label="Site previews"
        initial={shouldReduce ? false : { x: 80, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        {HILLS.map((h, i) => (
          <motion.button
            key={i}
            className={`tj-tng-thumb${i === idx ? " active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={h.name}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3 }}
          >
            <img src={h.src} alt={h.name} loading="lazy" />
            <div className="tj-tng-thumb-overlay">
              <span className="tj-tng-thumb-label">{h.name}</span>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* LAYER 4 — Progress bar */}
      <div className="tj-tng-progress-track" aria-hidden="true">
        <motion.div
          className="tj-tng-progress-fill"
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

    </section>
  );
}
