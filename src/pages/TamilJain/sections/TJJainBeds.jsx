import React, { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import imgShayanika from "@/assets/images/Shayanika/TJPage Shayanika.jpg";

const STATS = [
  { num: "2000+", label: "Years of Monastic History" },
  { num: "40+",   label: "Rock-Bed Sites Documented" },
  { num: "3rd BCE", label: "Earliest Recorded Evidence" },
];

export default function TJJainBeds() {
  const sectionRef = useRef(null);
  const imageRef   = useRef(null);
  const shouldReduce = useReducedMotion();
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(
    scrollYProgress, [0, 1],
    shouldReduce ? ["0%", "0%"] : ["-8%", "8%"]
  );

  return (
    <section ref={sectionRef} className="tj-beds-v3-section">

      {/* LEFT — full-bleed image */}
      <div className="tj-beds-v3-img-col" ref={imageRef}>
        <motion.img
          src={imgShayanika}
          alt="Jain rock-cut stone beds, Tamil Nadu"
          className="tj-beds-v3-img"
          style={{ y: imgY }}
        />
        {/* Subtle lotus-pink tint wash on image */}
        <div className="tj-beds-v3-img-tint" />
        {/* Right-edge dissolve into content bg */}
        <div className="tj-beds-v3-img-fade" />
      </div>

      {/* RIGHT — content panel */}
      <div className="tj-beds-v3-content">

        {/* Top accent bar — lotus → tulsi */}
        <div className="tj-beds-v3-accent-bar" aria-hidden="true" />

        {/* Eyebrow — lotus-deep */}
        <motion.div
          className="tj-beds-v3-eyebrow"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="tj-beds-v3-eyebrow-line" />
          <span>Ancient Shelters</span>
          <span className="tj-beds-v3-eyebrow-sep">/</span>
          <span>Monastic Traditions</span>
        </motion.div>

        {/* Title — Jain Shayanika */}
        <div className="tj-beds-v3-title-block">
          <h2 className="tj-beds-v3-title">
            {[
              { text: "Jain",      em: false },
              { text: "Shayanika", em: true  },
            ].map((l, i) => (
              <div key={i} className="tj-beds-v3-title-clip">
                <motion.span
                  className={`tj-beds-v3-title-line${l.em ? " tj-beds-v3-em" : ""}`}
                  initial={{ y: shouldReduce ? 0 : "108%" }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.18 + i * 0.11 }}
                >
                  {l.text}
                </motion.span>
              </div>
            ))}
          </h2>
          <motion.p
            className="tj-beds-v3-subtitle"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.42 }}
          >
            (Jain Stone Beds)
          </motion.p>
        </div>

        {/* Lotus divider */}
        <motion.div
          className="tj-beds-v3-divider"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.52 }}
        />

        {/* Body */}
        <motion.p
          className="tj-beds-v3-body"
          initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.58 }}
        >
          Jain beds are rock-cut stone platforms used by Jain monks for meditation and
          ascetic living. They are among the oldest archaeological evidences of Jainism
          in South India — offering firsthand insight into the monastic traditions and
          ancient Jain heritage of Tamil Nadu.
        </motion.p>

        {/* Quote — tulsi-tinted bg, lotus border */}
        <motion.blockquote
          className="tj-beds-v3-quote"
          initial={{ opacity: 0, x: shouldReduce ? 0 : -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.68 }}
        >
          "Where time stops and spirit awakens — carved eternally in the hills of Madurai."
        </motion.blockquote>

        {/* Stats */}
        <div className="tj-beds-v3-stats-wrap">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              className="tj-beds-v3-stat"
              initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.76 + i * 0.10 }}
            >
              <span className="tj-beds-v3-stat-num">{s.num}</span>
              <span className="tj-beds-v3-stat-lbl">{s.label}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
