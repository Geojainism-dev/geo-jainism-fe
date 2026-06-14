import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";

// Ancient Brahmi + Tamil chars for the scramble effect
const ANCIENT = '𑀤𑀩𑀦𑀓𑀘𑀪𑀰𑀅𑀖𑀢வடலசோழர்ன𑀬𑀭𑀯';

function useTextScramble(target, active, duration = 1050) {
  const [text, setText] = useState(target);
  const raf = useRef(null);

  useEffect(() => {
    if (!active) return;
    cancelAnimationFrame(raf.current);
    let start = null;

    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const revealed = Math.floor(target.length * Math.pow(p, 0.5));

      setText(
        Array.from(target).map((ch, i) => {
          if (/[\s\+\–\-\/]/.test(ch)) return ch;
          if (i < revealed) return ch;
          return ANCIENT[Math.floor(Math.random() * ANCIENT.length)];
        }).join('')
      );

      if (p < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, duration]);

  return text;
}

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
      const current = Math.floor(eased * num);
      setVal(p >= 1 ? target : String(current));
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
    subtitle: "Early Origins",
    era: "3rd BCE – 3rd CE",
    text: "Early inscriptions found in rock shelters and Jain beds, often recording donations made to Jain ascetics. These are the earliest written records of the Tamil language, marking the dawn of Jain literary culture.",
    image: "/journey/07-stone-carving.jpg",
    palette: "cream",
    stat: "600+",
    statLabel: "Known inscriptions identified",
    glyphs: [
      { char: "𑀤", top: "12%", left: "70%" },
      { char: "𑀩", top: "62%", left: "78%" },
      { char: "𑀦", top: "80%", left: "62%" }
    ]
  },
  {
    id: "vatteluttu",
    title: "Vatteluttu",
    subtitle: "Sacred Records",
    era: "Early Medieval",
    text: "Records of grants, charitable donations, Jain monasteries (pallis), and religious activities. This cursive script reflects the administrative flourishing and the deep community integration of Jain centers.",
    image: "/journey/01-rock-sculpture.jpg",
    palette: "alt",
    stat: "82",
    statLabel: "Documented pallis & monasteries",
    glyphs: [
      { char: "வ", top: "16%", left: "8%" },
      { char: "ட", top: "62%", left: "12%" },
      { char: "ல", top: "40%", left: "4%" }
    ]
  },
  {
    id: "grantha",
    title: "Chola–Pandya",
    subtitle: "Golden Era",
    era: "Classical Period",
    text: "Documenting temple endowments, land grants, image installations, and tax exemptions. They highlight the significant socio-economic role of Jain communities during this majestic period of South Indian history.",
    image: "/journey/06-sheep-site.jpg",
    palette: "tulsi",
    stat: "200+",
    statLabel: "Royal temple endowments recorded",
    glyphs: [
      { char: "சோ", top: "14%", left: "74%" },
      { char: "ழர்", top: "68%", left: "66%" },
      { char: "ன", top: "42%", left: "82%" }
    ]
  }
];

export default function TJInscriptions() {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const typesRef = useRef(null);
  const isIntroInView = useInView(introRef, { once: true, margin: "-5% 0px" });
  const isTypesInView = useInView(typesRef, { once: true, margin: "-8% 0px" });
  const shouldReduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const introImgY = useTransform(scrollYProgress, [0, 0.5], shouldReduce ? ["0%", "0%"] : ["0%", "18%"]);

  return (
    <section ref={sectionRef} className="tj-insc-section">
      <div className="tj-beds-stone-texture" style={{ opacity: 0.07 }} />
      <div className="tj-beds-dust-overlay" style={{ opacity: 0.2 }} />

      {/* ── INTRO PANEL ── */}
      <div ref={introRef} className="tj-insc-intro">
        <div className="tj-insc-wrap">
          <div className="tj-insc-intro-grid">

            <motion.div
              className="tj-insc-intro-text"
              initial={{ opacity: 0, x: shouldReduce ? 0 : -52 }}
              animate={isIntroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="tj-eyebrow-row">
                <div className="tj-eyebrow-line" />
                <span className="tj-eyebrow-label">Historical Epigraphy</span>
              </div>

              <h2 className="tj-insc-heading">
                Sacred <br /><em>Inscriptions</em>
              </h2>

              <p className="tj-insc-intro-body">
                Jain inscriptions in Tamil Nadu are among the most valuable historical sources
                for understanding the spread, patronage, and development of Jainism in South India.
                They provide firsthand evidence about Jain monks, donors, religious institutions,
                and local rulers, helping reconstruct over two millennia of Tamil Jain heritage.
              </p>

              <div className="tj-beds-rough-divider" />

              <motion.div
                className="tj-insc-scroll-cue"
                initial={{ opacity: 0, y: 12 }}
                animate={isIntroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.85 }}
              >
                <div className="tj-insc-cue-line" />
                <span>Three Inscription Traditions</span>
                <div className="tj-insc-cue-line" />
              </motion.div>
            </motion.div>

            <motion.div
              className="tj-insc-intro-visual"
              initial={{ opacity: 0, x: shouldReduce ? 0 : 52, scale: shouldReduce ? 1 : 0.97 }}
              animate={isIntroInView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            >
              <div className="tj-insc-intro-frame">
                <div className="tj-corner-ornament tl" />
                <div className="tj-corner-ornament br" />
                <div className="tj-insc-frame-inner">
                  <motion.img
                    src="/journey/05-rock-carvings.jpg"
                    alt="Ancient Inscriptions"
                    className="tj-insc-intro-img"
                    style={{ y: introImgY }}
                  />
                  <div className="tj-insc-intro-overlay">
                    <blockquote className="tj-insc-intro-quote">
                      "Firsthand evidence carved in stone — monks, donors, and rulers speak across millennia."
                    </blockquote>
                  </div>
                </div>

                <motion.div
                  className="tj-insc-badge"
                  initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }}
                  animate={isIntroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.65 }}
                >
                  2300+ Years of Heritage
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── ORNAMENTAL DIVIDER ── */}
      <motion.div
        className="tj-insc-ornament-divider"
        initial={{ opacity: 0, scaleX: shouldReduce ? 1 : 0 }}
        animate={isIntroInView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      >
        <div className="tj-insc-div-line" />
        <div className="tj-insc-div-center">
          <span className="tj-insc-div-glyph">𑀤</span>
          <span className="tj-insc-div-label">Three Traditions of Stone</span>
          <span className="tj-insc-div-glyph">𑀦</span>
        </div>
        <div className="tj-insc-div-line" />
      </motion.div>

      {/* ── THREE TYPES ── */}
      <div ref={typesRef} className="tj-insc-types">
        <div className="tj-insc-wrap">
          <div className="tj-insc-cards-grid">
            {inscriptionsData.map((item, index) => (
              <InscriptionCard
                key={item.id}
                item={item}
                index={index}
                isParentInView={isTypesInView}
                shouldReduce={shouldReduce}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

function InscriptionCard({ item, index, isParentInView, shouldReduce }) {
  const outerRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const isResting = tilt.rx === 0 && tilt.ry === 0;

  const isInView = useInView(outerRef, { once: true, margin: "-10% 0px" });

  // Effect 1: era badge scrambles through ancient Brahmi chars
  const displayEra = useTextScramble(item.era, isInView && !shouldReduce, 1100);
  // Effect 2 (bonus): stat number counts up from 0
  const displayStat = useCountUp(item.stat, isInView, 1400);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start end", "end start"]
  });
  const imgY = useTransform(scrollYProgress, [0, 1], shouldReduce ? ["0%", "0%"] : ["8%", "-8%"]);

  // Effect 3: 3D perspective tilt on mouse move (like holding a stone tablet)
  const handleMouseMove = useCallback((e) => {
    if (shouldReduce || !outerRef.current) return;
    const r = outerRef.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: ny * -9, ry: nx * 13 });
  }, [shouldReduce]);

  const handleMouseLeave = useCallback(() => setTilt({ rx: 0, ry: 0 }), []);

  return (
    <div
      ref={outerRef}
      className="tj-insc-card-perspective"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={shouldReduce ? {} : {
        transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: isResting
          ? 'transform 0.65s cubic-bezier(0.16,1,0.3,1)'
          : 'transform 0.07s linear',
      }}
    >
      <motion.div
        className={`tj-insc-card${isInView ? ' tj-insc-card--lit' : ''}`}
        data-palette={item.palette}
        initial={{ opacity: 0, y: shouldReduce ? 0 : 64 }}
        animate={isParentInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.18 }}
      >
        {/* Image panel */}
        <div className="tj-insc-card-visual">
          <div className="tj-insc-card-frame">
            <motion.img
              src={item.image}
              alt={item.title}
              className="tj-insc-card-img"
              style={{ y: imgY }}
            />
            <div className="tj-insc-card-img-vignette" />
          </div>

          {/* Era scramble lives here */}
          <div className="tj-insc-card-era-badge">{displayEra}</div>

          <div className="tj-insc-card-index">0{index + 1}</div>

          {/* Glyphs move opposite to tilt — creating depth illusion */}
          <div className="tj-insc-card-glyphs">
            {item.glyphs.map((g, i) => (
              <span
                key={i}
                className="tj-glyph-char"
                style={{
                  top: g.top,
                  left: g.left,
                  animationDelay: `${i * 2.2}s`,
                  ...(shouldReduce ? {} : {
                    transform: `translate(${tilt.ry * 2.2}px, ${tilt.rx * 2.2}px)`,
                    transition: isResting ? 'transform 0.65s ease' : 'transform 0.07s linear',
                  }),
                }}
              >
                {g.char}
              </span>
            ))}
          </div>
        </div>

        {/* Content panel */}
        <div className="tj-insc-card-body">
          <div className="tj-insc-card-header">
            <h3 className="tj-insc-card-title">{item.title}</h3>
            <span className="tj-insc-card-subtitle">{item.subtitle}</span>
          </div>

          <div className="tj-insc-card-rule" />

          <p className="tj-insc-card-text">{item.text}</p>

          <div className="tj-insc-card-stat">
            <span className="tj-insc-stat-num">{displayStat}</span>
            <div className="tj-c-meta-div" />
            <span className="tj-insc-stat-label">{item.statLabel}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
