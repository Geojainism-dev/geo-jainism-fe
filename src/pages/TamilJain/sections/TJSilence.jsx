import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const IMGS = [
  "/journey/03-team-group.jpg",
  "/journey/09-temple.jpg",
  "/journey/08-community.jpg",
  "/journey/04-hillside.jpg",
];

const STATS = [
  { num: "25K–35K", label: "Tamil Jains Remain" },
  { num: "450+",    label: "Jain Sites in Tamil Nadu" },
  { num: "2,300+",  label: "Years of Heritage" },
  { num: "111",     label: "Sites Documented" },
];

export default function TJSilence() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

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
            <span className="tj-eyebrow-label">The Untold Story</span>
          </div>

          <h2 className="tj-silence-heading">
            The Tamil Jains —{" "}
            <em>2300+ Years</em>
            {" "}of Silence
          </h2>

          <p className="tj-silence-body">
            Only 25,000–35,000 Tamil Jains remain. This ancient community — once the architects
            of Tamil literature, sponsors of cave temples, and patrons of the arts — has reached
            near-endangered status.
          </p>
          <p className="tj-silence-body">
            Most people — in India and abroad — are completely unaware that Jainism had a deep
            and foundational presence in Tamil Nadu. A civilisation teetering on the edge of
            extinction, invisible to the world.
          </p>

          <a href="#notify" className="tj-btn-primary" style={{ marginTop: "12px" }}>
            View Story →
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
