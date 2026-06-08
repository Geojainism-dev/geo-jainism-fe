import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function TJRani() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="tj-section tj-rani-section">

      {/* Background decorative text */}
      <div className="tj-rani-bg-word" aria-hidden="true">QUEEN</div>

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
              <span className="tj-rani-century-num">10th</span>
              <span className="tj-rani-century-label">Century CE</span>
            </div>
          </div>

          {/* Stone inscription quote */}
          <div className="tj-rani-inscription">
            <span className="tj-rani-inscription-mark">"</span>
            <p className="tj-rani-inscription-text">
              Her name appears in copper-plate grants and stone inscriptions — silent witnesses to faith across centuries.
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
            <span className="tj-eyebrow-label">Tamil Jain Queens</span>
            <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to left, transparent, var(--saffron))" }} />
          </motion.div>

          <motion.h2
            className="tj-rani-content-heading"
            {...fade(0.35)}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            Rani <em>Aaiyabba<br />Devi</em>
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
            A fearless Jain queen whose devotion and royal patronage helped sustain
            Jain temples, scholars, and communities across Tamil Nadu. Her legacy
            resonates through the inscriptions and monuments she commissioned.
          </motion.p>

          <motion.p
            className="tj-rani-body"
            {...fade(0.7)}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            She governed with the Jain ideals of compassion, non-violence, and pursuit
            of knowledge — values that became woven into the cultural fabric of the region.
          </motion.p>

          {/* Stats row */}
          <motion.div
            className="tj-rani-stats"
            {...fade(0.85)}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            <div className="tj-rani-stat">
              <span className="tj-rani-stat-num">12+</span>
              <span className="tj-rani-stat-label">Temples Patronised</span>
            </div>
            <div className="tj-rani-stat-divider" />
            <div className="tj-rani-stat">
              <span className="tj-rani-stat-num">3</span>
              <span className="tj-rani-stat-label">Copper-plate Grants</span>
            </div>
            <div className="tj-rani-stat-divider" />
            <div className="tj-rani-stat">
              <span className="tj-rani-stat-num">10th C</span>
              <span className="tj-rani-stat-label">Era</span>
            </div>
          </motion.div>

          <motion.a
            href="#temples"
            className="tj-cta-ghost"
            {...fade(1)}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            Explore Her Story <span>→</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
