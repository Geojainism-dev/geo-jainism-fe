import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const DOCS = [
  { title: "Ancient Rock-Cut Tirthankaras", chapter: "Chapter 01 · Research",  duration: "24 min", img: "/journey/01-rock-sculpture.jpg", isNew: true  },
  { title: "Forgotten Hill Temples",         chapter: "Chapter 02 · Heritage",  duration: "31 min", img: "/journey/02-temple-hill.jpg",    isNew: false },
  { title: "23 Days in the Field",           chapter: "Chapter 03 · The Team",  duration: "18 min", img: "/journey/03-team-group.jpg",     isNew: false },
  { title: "Fifty Hills. One Mission",       chapter: "Chapter 04 · Journey",   duration: "28 min", img: "/journey/04-hillside.jpg",       isNew: false },
  { title: "Stone Carvings of the Masters",  chapter: "Chapter 07 · Artistry",  duration: "22 min", img: "/journey/07-stone-carving.jpg",  isNew: true  },
  { title: "The Elders Who Remember",        chapter: "Chapter 08 · Community", duration: "35 min", img: "/journey/08-community.jpg",      isNew: false },
];

export default function TJDocumentary() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="tj-section tj-documentary-section">
      <div className="tj-documentary-inner">

        {/* Header */}
        <motion.div
          className="tj-section-center"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          style={{ marginBottom: "56px" }}
        >
          <div className="tj-eyebrow-row" style={{ justifyContent: "center", marginBottom: "14px" }}>
            <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to right, transparent, var(--saffron))" }} />
            <span className="tj-eyebrow-label">Cinematic Heritage</span>
            <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to left, transparent, var(--saffron))" }} />
          </div>
          <h2 className="tj-section-heading" style={{ fontSize: "clamp(36px,5.5vw,60px)", marginBottom: "14px" }}>
            Watch This <span style={{ fontStyle: "italic", color: "var(--saffron)" }}>Documentary</span>
          </h2>
          <p className="tj-section-desc" style={{ maxWidth: "460px", margin: "0 auto" }}>
            A 4K cinematic journey through 2,300 years of Tamil Jain history — 10 chapters, 111 sites.
          </p>
        </motion.div>

        <div className="tj-doc-grid">
          {DOCS.map((d, i) => (
            <motion.div
              key={i}
              className="tj-doc-card"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.09 }}
            >
              <div className="tj-doc-thumb">
                <img src={d.img} alt={d.title} loading="lazy" />
                <div className="tj-doc-thumb-overlay">
                  <div className="tj-play-btn">
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="white">
                      <path d="M0 0L14 8L0 16V0Z" />
                    </svg>
                  </div>
                </div>
                {d.isNew && <div className="tj-doc-new">NEW</div>}
                <div className="tj-doc-duration">{d.duration}</div>
              </div>
              <div className="tj-doc-meta">
                <p className="tj-doc-chapter">{d.chapter}</p>
                <h3 className="tj-doc-title">{d.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
