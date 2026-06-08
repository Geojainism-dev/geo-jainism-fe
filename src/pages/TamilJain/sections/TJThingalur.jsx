import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const SLIDES = [
  { src: "/journey/02-temple-hill.jpg",   label: "Hilltop Shrines",      num: "01" },
  { src: "/journey/04-hillside.jpg",       label: "Sacred Hillsides",     num: "02" },
  { src: "/journey/05-rock-carvings.jpg",  label: "Ancient Carvings",     num: "03" },
  { src: "/journey/01-rock-sculpture.jpg", label: "Rock-Cut Sculptures",  num: "04" },
  { src: "/journey/07-stone-carving.jpg",  label: "Stone Inscriptions",   num: "05" },
];

export default function TJThingalur() {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true, margin: "-100px" });
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIdx(i => (i + 1) % SLIDES.length);

  return (
    <section ref={ref} className="tj-section tj-thingalur-section">

      {/* Full bleed background from current slide */}
      <div className="tj-thingalur-bg">
        <AnimatePresence mode="wait">
          <motion.img
            key={SLIDES[idx].src}
            src={SLIDES[idx].src}
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            style={{ width: "100%", height: "100%", objectFit: "cover",
              filter: "brightness(0.82) saturate(1.0) sepia(0.10)" }}
          />
        </AnimatePresence>
        {/* Left half — clear image with cream wash */}
        <div className="tj-bg-half-clear" />
        {/* Right half — frosted blur */}
        <div className="tj-bg-half-blur" />
      </div>

      {/* Content grid */}
      <div className="tj-thingalur-inner">

        {/* Left — title + controls */}
        <motion.div
          className="tj-thingalur-left"
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <div className="tj-eyebrow-row" style={{ marginBottom: "20px" }}>
            <div className="tj-eyebrow-line" />
            <span className="tj-eyebrow-label">Sacred Landscapes</span>
          </div>

          <h2 className="tj-thingalur-title">
            Thingalur<br /><em style={{ fontStyle: "italic", color: "var(--saffron)" }}>Hills</em>
          </h2>

          <p className="tj-thingalur-desc">
            Sacred hilltops across Tamil Nadu — from Madurai to the distant heights of
            Chithral and Kalugumalai — stood as strongholds of Jain faith for two millennia.
            50+ hills documented in 4K.
          </p>

          {/* Navigation */}
          <div className="tj-thingalur-nav">
            <button className="tj-thingalur-nav-btn" onClick={prev} aria-label="Previous">←</button>
            <button className="tj-thingalur-nav-btn" onClick={next} aria-label="Next">→</button>
            <span className="tj-thingalur-num" style={{ marginLeft: "8px" }}>
              {String(idx + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
          </div>
        </motion.div>

        {/* Right — thumbnail stack */}
        <motion.div
          className="tj-thingalur-right"
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {SLIDES.map((s, i) => (
            <div
              key={i}
              className={`tj-thumb-card${i === idx ? " active" : ""}`}
              onClick={() => setIdx(i)}
            >
              <img src={s.src} alt={s.label} loading="lazy" />
              <div className="tj-thumb-overlay">
                <span className="tj-thumb-label">{s.label}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Large number */}
      <div className="tj-thingalur-index">{SLIDES[idx].num}</div>
    </section>
  );
}
