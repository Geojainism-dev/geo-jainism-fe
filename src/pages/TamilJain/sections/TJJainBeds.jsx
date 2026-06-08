import React, { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";

const STATS = [
  { num: "2000+", label: "Years of Monastic History" },
  { num: "40+",   label: "Rock-Bed Sites Documented" },
  { num: "3rd BCE", label: "Earliest Recorded Evidence" },
];

export default function TJJainBeds() {
  const sectionRef = useRef(null);
  const imageRef   = useRef(null);
  const shouldReduce = useReducedMotion();

  const isInView = useInView(sectionRef, { once: true, margin: "-12% 0px" });

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], shouldReduce ? ["0%", "0%"] : ["-6%", "6%"]);

  return (
    <section ref={sectionRef} className="tj-beds-v2-section">
      {/* Subtle grain texture */}
      <div className="tj-beds-v2-grain" />

      {/* Top rule */}
      <motion.div
        className="tj-beds-v2-top-rule"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="tj-beds-v2-wrap">
        <div className="tj-beds-v2-grid">

          {/* ── LEFT — Typography hero ── */}
          <div className="tj-beds-v2-left">

            {/* Eyebrow */}
            <motion.div
              className="tj-beds-v2-eyebrow"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Ancient Shelters &nbsp;/&nbsp; Monastic Traditions
            </motion.div>

            {/* Title — each line in its own clip container */}
            <h2 className="tj-beds-v2-title">
              {[
                { text: "The Silence", em: false },
                { text: "of Stone",   em: true  },
              ].map((line, i) => (
                <div key={i} className="tj-beds-v2-title-clip">
                  <motion.span
                    className={`tj-beds-v2-title-line${line.em ? " tj-beds-v2-em" : ""}`}
                    initial={{ y: shouldReduce ? 0 : "108%" }}
                    animate={isInView ? { y: 0 } : {}}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.18 + i * 0.11 }}
                  >
                    {line.text}
                  </motion.span>
                </div>
              ))}
            </h2>

            {/* Divider */}
            <motion.div
              className="tj-beds-v2-divider"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            />

            {/* Body */}
            <motion.p
              className="tj-beds-v2-body"
              initial={{ opacity: 0, y: shouldReduce ? 0 : 22 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.52 }}
            >
              Jain beds are rock-cut stone platforms used by Jain monks for meditation and
              ascetic living. They are among the oldest archaeological evidences of Jainism
              in South India — offering firsthand insight into the monastic traditions and
              ancient Jain heritage of Tamil Nadu.
            </motion.p>

            {/* Quote */}
            <motion.blockquote
              className="tj-beds-v2-quote"
              initial={{ opacity: 0, x: shouldReduce ? 0 : -24 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
            >
              "Where time stops and spirit awakens — carved eternally in the hills of Madurai."
            </motion.blockquote>

          </div>

          {/* ── RIGHT — Image + Stats ── */}
          <div className="tj-beds-v2-right">

            {/* Stats column */}
            <div className="tj-beds-v2-stats">
              {STATS.map((s, i) => (
                <motion.div
                  key={i}
                  className="tj-beds-v2-stat"
                  initial={{ opacity: 0, y: shouldReduce ? 0 : 28 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.32 + i * 0.1 }}
                >
                  <span className="tj-beds-v2-stat-num">{s.num}</span>
                  <span className="tj-beds-v2-stat-lbl">{s.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Image frame */}
            <motion.div
              ref={imageRef}
              className="tj-beds-v2-img-frame"
              initial={{ opacity: 0, x: shouldReduce ? 0 : 38 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
            >
              <div className="tj-beds-v2-img-inner">
                <motion.img
                  src="/journey/04-hillside.jpg"
                  alt="Jain Rock-Cut Beds"
                  className="tj-beds-v2-img"
                  style={{ y: imgY }}
                />
                <div className="tj-beds-v2-img-overlay" />
              </div>

              {/* Corner accents */}
              <div className="tj-beds-v2-corner tl" />
              <div className="tj-beds-v2-corner br" />

              {/* Floating chip */}
              <motion.div
                className="tj-beds-v2-chip"
                initial={{ opacity: 0, y: shouldReduce ? 0 : 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
              >
                <span className="tj-chip-script">Monastic Solitude</span>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
