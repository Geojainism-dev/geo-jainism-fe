import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const CARDS = [
  {
    title: "Converted",
    subtitle: "Restored & Reclaimed",
    desc: "Jain temples converted to worship other deities are being systematically documented — their original Tirthankara images, inscriptions, and architectural features preserved through 4K photography before further erasure.",
    img: "/journey/05-rock-carvings.jpg",
    tag: "Converted",
    tagColor: "#C85A6A",
    stat: "10+", statLabel: "Sites Reclaimed",
  },
  {
    title: "Ancient Inscriptions",
    subtitle: "Decoded & Preserved",
    desc: "Tamil Brahmi and Grantha script inscriptions found across cave walls are being professionally photographed and translated — many for the first time in recorded history.",
    img: "/journey/01-rock-sculpture.jpg",
    tag: "Documentation",
    tagColor: "#C8881A",
    stat: "450+", statLabel: "Inscriptions Captured",
  },
];

export default function TJRestored() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="tj-section tj-restored-section">
      <div className="tj-restored-inner">

        {/* Header */}
        <motion.div
          className="tj-section-center"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          style={{ marginBottom: "60px" }}
        >
          <div className="tj-eyebrow-row" style={{ justifyContent: "center", marginBottom: "14px" }}>
            <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to right, transparent, var(--saffron))" }} />
            <span className="tj-eyebrow-label">Heritage Preservation</span>
            <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to left, transparent, var(--saffron))" }} />
          </div>
          <h2 className="tj-section-heading" style={{ fontSize: "clamp(32px,5.5vw,58px)", lineHeight: 1.1 }}>
            Converted, Restored{" "}
            <span style={{ fontStyle: "italic", color: "var(--saffron)" }}>
              &amp; Reclaimed Heritage
            </span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="tj-restored-grid">
          {CARDS.map((c, i) => (
            <motion.div
              key={i}
              className="tj-restored-card"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.18 }}
            >
              <div className="tj-restored-img-wrap">
                <img src={c.img} alt={c.title} loading="lazy" />
                <div className="tj-restored-img-overlay" />
                <span style={{
                  position: "absolute", top: "14px", left: "14px",
                  fontFamily: "'Cinzel', serif", fontSize: "9px", letterSpacing: "2.5px",
                  padding: "5px 13px", borderRadius: "20px",
                  background: "rgba(10,4,1,0.52)", backdropFilter: "blur(8px)",
                  color: c.tagColor, border: `1px solid ${c.tagColor}44`,
                  textTransform: "uppercase",
                }}>
                  {c.tag}
                </span>
                <div className="tj-restored-img-stat">
                  <div className="tj-restored-stat-num">{c.stat}</div>
                  <div className="tj-restored-stat-label">{c.statLabel}</div>
                </div>
              </div>
              <div className="tj-restored-body">
                <h3 className="tj-restored-title">{c.title}</h3>
                <p className="tj-restored-subtitle">{c.subtitle}</p>
                <p className="tj-restored-desc">{c.desc}</p>
                <div style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  marginTop: "18px",
                  fontFamily: "'Cinzel', serif", fontSize: "9.5px",
                  letterSpacing: "2.5px", color: "var(--saffron)", textTransform: "uppercase",
                }}>
                  Learn More <span>→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "32px" }}>
          {CARDS.map((_, i) => (
            <div key={i} style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: i === 0 ? "var(--saffron)" : "rgba(244,165,53,0.25)",
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}
