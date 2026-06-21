import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import imgTamilBrahmi from "@/assets/images/Inscription/TAMIL-BRAHMI .jpg";
import imgVatteluttu from "@/assets/images/Inscription/Vatteluttu.jpg";
import imgGrantha from "@/assets/images/Inscription/Granth.jpg";

function useCountUp(target, active, duration = 1350) {
  const num = parseInt(target.replace(/\D/g, ''), 10);
  const [val, setVal] = useState('0');
  const raf = useRef(null);

  useEffect(() => {
    if (!active || isNaN(num)) return;
    cancelAnimationFrame(raf.current);
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(p >= 1 ? target : String(Math.floor(eased * num)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, num, target, duration]);

  return val;
}

const inscriptionsData = [
  {
    id: "brahmi",
    title: "Tamil-Brahmi",
    era: "3rd BCE – 3rd CE",
    text: "Early inscriptions found in rock shelters and Jain beds, often recording donations made to Jain ascetics. These are the earliest written records of the Tamil language.",
    stat: "600+",
    statLabel: "Known inscriptions identified",
    image: imgTamilBrahmi,
  },
  {
    id: "vatteluttu",
    title: "Vatteluttu",
    era: "Early Medieval Period",
    text: "Records of grants, charitable donations, Jain monasteries (pallis), and religious activities — reflecting the administrative flourishing of Jain centers.",
    stat: "82",
    statLabel: "Documented pallis & monasteries",
    image: imgVatteluttu,
  },
  {
    id: "grantha",
    title: "Grantha",
    era: "Classical Period",
    text: "Inscriptions documenting temple endowments, land grants, image installations, tax exemptions, and the socio-economic role of Jain communities during the golden era of South Indian Jain history.",
    stat: "200+",
    statLabel: "Royal temple endowments recorded",
    image: imgGrantha,
  },
];

/* Root at TOP (y=18), trunk grows DOWN to junction (y=90),
   branches curve further DOWN to card tops (y=196) */
const BRANCHES = [
  { d: "M 500 90 C 460 130, 260 165, 160 196", x: 160 },
  { d: "M 500 90 C 500 120, 500 160, 500 196",  x: 500 },
  { d: "M 500 90 C 540 130, 740 165, 840 196",  x: 840 },
];

function TreeCard({ data: d, index: i, inView }) {
  const statVal = useCountUp(d.stat, inView, 1400);

  return (
    <motion.div
      className="tj-insc-card-3d"
      initial={{ opacity: 0, rotateY: 28, y: 44 }}
      animate={inView ? { opacity: 1, rotateY: 0, y: 0 } : {}}
      transition={{ duration: 0.88, delay: 0.9 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ rotateY: -7, scale: 1.03, transition: { duration: 0.32 } }}
      style={{ transformPerspective: 1100, transformStyle: "preserve-3d" }}
    >
      {/* Clear image — top half */}
      <div className="tj-insc-card-img-wrap">
        <img
          className="tj-insc-card-img"
          src={d.image}
          alt={d.title}
          loading="lazy"
        />
      </div>

      {/* Saffron divider bar */}
      <div className="tj-insc-card-bar" />

      {/* Text panel — bottom half */}
      <div className="tj-insc-card-body">
        <span className="tj-insc-era-pill">{d.era}</span>
        <h3 className="tj-insc-card-title">{d.title}</h3>
        <div className="tj-insc-card-divider" />
        <p className="tj-insc-card-desc">{d.text}</p>
        <div className="tj-insc-card-stat">
          <span className="tj-insc-stat-num">{inView ? statVal : "0"}</span>
          <span className="tj-insc-stat-label">{d.statLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TJInscriptions() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="tj-insc-section">

      {/* Header — this IS the root of the tree visually */}
      <div className="tj-insc-header">
        <div className="tj-eyebrow-row" style={{ marginBottom: "14px", justifyContent: "center" }}>
          <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to right, transparent, var(--saffron))" }} />
          <span className="tj-eyebrow-label">Historical Epigraphy</span>
          <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to left, transparent, var(--saffron))" }} />
        </div>
        <h2 className="tj-insc-cinema-title">Sacred <em>Inscriptions</em></h2>
        <p className="tj-insc-intro-para">
          Jain inscriptions in Tamil Nadu are among the most valuable historical sources
          for understanding the spread, patronage, and development of Jainism in South India.
          They provide firsthand evidence about Jain monks, donors, religious institutions,
          and local rulers, helping reconstruct over two millennia of Tamil Jain heritage.
        </p>
      </div>

      {/* SVG tree: root at top → trunk → 3 branches curving DOWN to cards */}
      <div className="tj-insc-tree-wrap" aria-hidden="true">
        <svg
          className="tj-insc-tree-svg"
          viewBox="0 0 1000 210"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Root emblem — outer glow ring */}
          <motion.circle
            cx="500" cy="18" r="16"
            className="tj-tree-root-ring"
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          />
          {/* Root emblem — inner halo */}
          <motion.circle
            cx="500" cy="18" r="9"
            className="tj-tree-root-halo"
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.35, delay: 0.15 }}
          />
          {/* Root emblem — solid core */}
          <motion.circle
            cx="500" cy="18" r="5"
            className="tj-tree-root-core"
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.28, delay: 0.26 }}
          />

          {/* Trunk: grows downward from root to junction */}
          <motion.line
            x1="500" y1="34" x2="500" y2="90"
            className="tj-tree-trunk"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 0.42, delay: 0.38, ease: "easeOut" }}
          />

          {/* 3 organic branches curving downward to card tops */}
          {BRANCHES.map((b, i) => (
            <motion.path
              key={i}
              d={b.d}
              className="tj-tree-branch"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.85, delay: 0.75 + i * 0.10, ease: [0.4, 0, 0.2, 1] }}
            />
          ))}

          {/* Glowing dots at branch tips — where branches meet card tops */}
          {BRANCHES.map((b, i) => (
            <motion.circle
              key={i}
              cx={b.x} cy="196" r="7"
              className="tj-tree-tip-dot"
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.38, delay: 1.45 + i * 0.10 }}
            />
          ))}
        </svg>
      </div>

      {/* 3 split image+text cards hang below the branches */}
      <div className="tj-insc-cards-grid">
        {inscriptionsData.map((d, i) => (
          <TreeCard key={d.id} data={d} index={i} inView={inView} />
        ))}
      </div>

    </section>
  );
}
