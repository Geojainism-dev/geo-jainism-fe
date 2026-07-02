import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import {
  ChevronDown, Film, MapPin, BookOpen, Globe, Users,
  Phone, Mail, Instagram, Youtube, Twitter, MessageCircle,
  Sun, Moon,
} from "lucide-react";
import { useLenis, useTheme } from "@/hooks";
import { useTranslation } from "react-i18next";
import { Navbar, Footer } from "@/components/layout";

import { ErrorBoundary } from "@/components/common";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import "@/styles/about.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Reveal wrapper (Framer Motion) ── */
const fadeV = {
  up:    { hidden: { opacity: 0, y: 48, filter: "blur(8px)" },    visible: { opacity: 1, y: 0, filter: "blur(0px)" } },
  left:  { hidden: { opacity: 0, x: -44, filter: "blur(6px)" },   visible: { opacity: 1, x: 0, filter: "blur(0px)" } },
  right: { hidden: { opacity: 0, x: 44,  filter: "blur(6px)" },   visible: { opacity: 1, x: 0, filter: "blur(0px)" } },
  scale: { hidden: { opacity: 0, scale: 0.9, filter: "blur(8px)" }, visible: { opacity: 1, scale: 1, filter: "blur(0px)" } },
};
const R = ({ children, dir = "up", delay = 0, style = {}, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  return (
    <motion.div
      ref={ref}
      variants={fadeV[dir]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94], delay: delay / 1000 }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ── Count-up ── */
const useCountUp = (target, active, duration = 2000) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf, t0;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 4)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return val;
};

/* ── Three.js lotus particle canvas ── */
function ThreeCanvas({ isDark }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(w, h, false);
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 6;
    const palette = [
      new THREE.Color("#F2C4CE"), new THREE.Color("#C8DFC0"),
      new THREE.Color("#F4A535"), new THREE.Color("#D8EEF5"),
      new THREE.Color("#E8909F"), new THREE.Color("#7DAF6E"),
      new THREE.Color("#F7D580"),
    ];
    const count = window.innerWidth < 768 ? 70 : 200;
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      const c = palette[i % palette.length];
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 0.75, sizeAttenuation: true });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    const vels = Array.from({ length: count }, () => ({ x: (Math.random() - 0.5) * 0.003, y: Math.random() * 0.004 + 0.001 }));
    let mx = 0, my = 0;
    const onMouse = (e) => { mx = (e.clientX / window.innerWidth - 0.5) * 0.5; my = -(e.clientY / window.innerHeight - 0.5) * 0.3; };
    window.addEventListener("mousemove", onMouse);
    let raf, t = 0;
    const pos = geo.attributes.position.array;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.004;
      for (let i = 0; i < count; i++) {
        pos[i * 3]     += vels[i].x + Math.sin(t + i * 0.5) * 0.0008;
        pos[i * 3 + 1] += vels[i].y;
        if (pos[i * 3 + 1] > 6)  { pos[i * 3 + 1] = -6; pos[i * 3] = (Math.random() - 0.5) * 18; }
        if (pos[i * 3]     >  9) pos[i * 3] = -9;
        if (pos[i * 3]     < -9) pos[i * 3] =  9;
      }
      geo.attributes.position.needsUpdate = true;
      pts.rotation.x += (my * 0.1 - pts.rotation.x) * 0.02;
      pts.rotation.y += (mx * 0.1 - pts.rotation.y) * 0.02;
      renderer.render(scene, camera);
    };
    tick();
    const onResize = () => {
      const nw = canvas.clientWidth || window.innerWidth;
      const nh = canvas.clientHeight || window.innerHeight;
      renderer.setSize(nw, nh, false);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose(); geo.dispose(); mat.dispose();
    };
  }, [isDark]);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }} />;
}

/* ── Full-page scroll progress bar ── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="abt-scroll-bar" style={{ scaleX: scrollYProgress }} />;
}

/* ── Dark / Light mode floating toggle ── */
function DarkModeFAB({ isDark, onToggle }) {
  return (
    <button
      className="abt-theme-fab"
      onClick={onToggle}
      style={{
        background: isDark
          ? "rgba(250,240,217,0.10)"
          : "rgba(6,13,8,0.84)",
        border: `1px solid ${isDark ? "rgba(244,165,53,0.38)" : "rgba(253,248,240,0.22)"}`,
        boxShadow: isDark
          ? "0 4px 24px rgba(244,165,53,0.16), inset 0 1px 0 rgba(244,165,53,0.08)"
          : "0 4px 28px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        className="abt-theme-fab-icon"
        style={{ display: "flex", transform: isDark ? "rotate(0deg)" : "rotate(-30deg)" }}
      >
        {isDark
          ? <Sun  size={17} style={{ color: "#F4A535" }} />
          : <Moon size={17} style={{ color: "#FAF0D9" }} />
        }
      </span>
    </button>
  );
}

/* ── Cinematic full-bleed parallax break ── */
function CinematicBreak({ src, quote, sub }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"]);
  return (
    <section ref={ref} style={{ position: "relative", height: "clamp(380px,55vh,680px)", overflow: "hidden" }}>
      <motion.div
        style={{
          position: "absolute", inset: "-22%",
          backgroundImage: `url('${src}')`,
          backgroundSize: "cover", backgroundPosition: "center",
          y: bgY,
        }}
      />
      {/* Dark cinematic overlay */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.58) 0%,rgba(0,0,0,0.30) 50%,rgba(0,0,0,0.62) 100%)" }} />
      {/* Vignette */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)" }} />
      {/* Content */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 clamp(24px,10vw,140px)", textAlign: "center" }}>
        {sub && (
          <R dir="up">
            <p style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(7px,0.85vw,9px)", letterSpacing: "8px", color: "rgba(253,248,240,0.50)", textTransform: "uppercase", marginBottom: "28px" }}>{sub}</p>
          </R>
        )}
        <R dir="up" delay={120}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(26px,5.5vw,72px)", fontWeight: 300, fontStyle: "italic", color: "#FAF0D9", lineHeight: 1.25, letterSpacing: "-0.5px", textShadow: "0 4px 60px rgba(0,0,0,0.55)", maxWidth: "860px" }}
            dangerouslySetInnerHTML={{ __html: quote }}
          />
        </R>
      </div>
      {/* Bottom fade */}
      <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)", pointerEvents: "none" }} />
    </section>
  );
}

/* ── Static data ── */
const PILLARS = [
  { Icon: Film,     label: "Documentary Filmmaking", body: "Among the first dedicated initiatives creating in-depth, research-based films on the vast and rich history of Jainism.",                    accent: "#E8909F" },
  { Icon: MapPin,   label: "Field Research",         body: "Ancient Jain temples, remote cave sites, and neglected historical locations documented through rigorous on-ground work.",                    accent: "#7DAF6E" },
  { Icon: BookOpen, label: "Rare Literature",        body: "First-ever video coverage of Naldiyar, Silappadikaram, Ratnakar and other rare Jain texts and oral traditions.",                            accent: "#F4A535" },
  { Icon: Globe,    label: "Regional Coverage",      body: "Jain history across Pakistan, Andhra Pradesh, Kerala, Telangana, Tamil Nadu, Karnataka, Goa, Bihar and Lalitpur.",                          accent: "#7DAF6E" },
  { Icon: Users,    label: "Inspiring Ancestors",    body: "Documentaries on Chennabhairadevi, Rani Abbakka and other extraordinary Jain figures that history nearly forgot.",                          accent: "#E8909F" },
];
const REGIONS = ["Tamil Nadu","Karnataka","Andhra Pradesh","Kerala","Telangana","Goa","Bihar","Lalitpur","Pakistan"];
const FUTURE  = [
  "Pan-India site mapping & geographical visual archive of Jainism's spread",
  "Long-format documentary storytelling for global audiences",
  "Deeper field research into unexplored Jain cave sites & remote temples",
];
const SOCIALS = [
  { label:"Instagram", handle:"@geo_jainism", href:"https://instagram.com/geo_jainism",                  Icon:Instagram,     accent:"#E8909F" },
  { label:"YouTube",   handle:"@geo_jainism", href:"https://www.youtube.com/@geo_jainism",               Icon:Youtube,       accent:"#F4A535" },
  { label:"Twitter/X", handle:"@geo_jainism", href:"https://x.com/geo_jainism",                          Icon:Twitter,       accent:"#D8EEF5" },
  { label:"WhatsApp",  handle:"Join Group",   href:"https://chat.whatsapp.com/EnHCodUJre9AlzFO9LRx5j",  Icon:MessageCircle, accent:"#7DAF6E" },
];

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function AboutPage() {
  const { theme, toggleTheme } = useTheme();
  useLenis();
  const isDark = theme === "dark";

  /* Scroll to top on mount — so navigating here always starts from section 1 */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  /* Force hamburger visible */
  useEffect(() => {
    const show = () => {
      const btn = document.querySelector("#navbar .mobile-toggle");
      if (!btn || window.innerWidth > 1024) return;
      btn.style.setProperty("display", "flex", "important");
      btn.style.setProperty("align-items", "center", "important");
      btn.style.setProperty("justify-content", "center", "important");
      const spans = btn.querySelectorAll(".hamburger span");
      spans.forEach(s => s.style.setProperty("background-color", isDark ? "#EAD9B8" : "#2A1A0E", "important"));
    };
    show();
    const t = setTimeout(show, 80);
    window.addEventListener("resize", show);
    return () => { clearTimeout(t); window.removeEventListener("resize", show); };
  }, [isDark]);

  const C = {
    bg:       isDark ? "linear-gradient(150deg,#060D08 0%,#0E0804 52%,#070C05 100%)"
                     : "linear-gradient(150deg,#FDF8F0 0%,#F5EBD8 52%,#EDF4E8 100%)",
    title:    isDark ? "#FAF0D9"                    : "#1E1208",
    body:     isDark ? "rgba(200,223,192,0.68)"     : "rgba(30,18,8,0.72)",
    faint:    isDark ? "rgba(200,223,192,0.40)"     : "rgba(30,18,8,0.45)",
    quote:    isDark ? "rgba(240,223,180,0.88)"     : "rgba(30,18,8,0.85)",
    border:   isDark ? "rgba(244,165,53,0.18)"      : "rgba(232,144,159,0.30)",
    divider:  isDark ? "rgba(200,223,192,0.09)"     : "rgba(30,18,8,0.09)",
    cardBg:   isDark ? "rgba(125,175,110,0.05)"     : "rgba(255,255,255,0.78)",
    cardBdr:  isDark ? "rgba(125,175,110,0.14)"     : "rgba(232,144,159,0.24)",
    altBg:    isDark ? "rgba(0,0,0,0.28)"           : "rgba(216,238,245,0.35)",
    tagBg:    isDark ? "rgba(244,165,53,0.07)"      : "rgba(242,196,206,0.20)",
    tagBdr:   isDark ? "rgba(244,165,53,0.28)"      : "rgba(232,144,159,0.50)",
    tagTxt:   isDark ? "rgba(247,213,128,0.88)"     : "#7A2840",
    greenTag: isDark ? "rgba(125,175,110,0.10)"     : "rgba(200,223,192,0.30)",
    greenBdr: isDark ? "rgba(125,175,110,0.30)"     : "rgba(125,175,110,0.55)",
    greenTxt: isDark ? "#7DAF6E"                    : "#2E6822",
    rose: "#E8909F", gold: "#F4A535", sage: "#7DAF6E",
  };

  const SP   = { padding: "clamp(72px,9vw,112px) clamp(24px,8vw,100px)", position: "relative" };
  const MW   = { maxWidth: "1000px", margin: "0 auto" };
  const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='7'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

  return (
    <ErrorBoundary>
      <div className="about-page-root" data-theme={theme} style={{ background: C.bg, minHeight: "100vh", transition: "background 0.5s ease" }}>
        <ScrollProgress />
        <DarkModeFAB isDark={isDark} onToggle={toggleTheme} />
        <Navbar />
        <main style={{ paddingTop: "72px" }}>

          <HeroSection      isDark={isDark} grain={grain} />

          <ManifestoSection isDark={isDark} C={C} SP={SP} MW={MW} grain={grain} />

          <StatsSection     isDark={isDark} C={C} SP={SP} MW={MW} />

          <WorkSection      isDark={isDark} C={C} SP={SP} MW={MW} />

          {/* Cinematic break — ancient rock carvings */}
          <CinematicBreak
            src="/journey/06-sheep-site.jpg"
            sub="Documentary · Heritage · Field Research"
            quote="Ancient stone speaks — if only someone<br/>is willing to <em style='font-style:italic;color:#F4A535'>listen.</em>"
            isDark={isDark}
          />

          <GalleryStrip isDark={isDark} C={C} />

          <RegionsSection   isDark={isDark} C={C} SP={SP} MW={MW} />

          {/* Cinematic break — the hillside */}
          <CinematicBreak
            src="/journey/04-hillside.jpg"
            sub="111 Ancient Sites · South India"
            quote="Every hilltop holds a temple.<br/>Every temple holds a <em style='font-style:italic;color:#E8909F'>story.</em>"
            isDark={isDark}
          />

          <FounderSection   isDark={isDark} C={C} SP={SP} grain={grain} />

          <UpcomingSection  isDark={isDark} C={C} SP={SP} MW={MW} />

          <ConnectSection   isDark={isDark} C={C} SP={SP} MW={MW} />

        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

/* ─────────────────────────────────────────
   HERO — full-viewport cinematic
───────────────────────────────────────── */
function HeroSection({ isDark, grain }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY     = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.12]);
  const textY   = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const textO   = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const { t } = useTranslation();

  return (
    <section
      ref={heroRef}
      style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "flex-end", justifyContent: "center", textAlign: "center", overflow: "hidden", paddingBottom: "0" }}
    >
      {/* Parallax BG — face pushed to top so text overlaps body, not face */}
      <motion.div style={{ position: "absolute", inset: "-12%", backgroundImage: "url('/hero-tirthankara.jpg')", backgroundSize: "cover", backgroundPosition: "center 15%", y: bgY, scale: bgScale, zIndex: 0 }} />

      {/* Overlay — lighter than before */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.12) 0%,rgba(0,0,0,0.08) 42%,rgba(0,0,0,0.28) 100%)", zIndex: 1 }} />

      {/* Vignette edges */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0.28) 100%)", zIndex: 1 }} />

      {/* Film grain */}
      <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: grain, backgroundSize: "200px", pointerEvents: "none", zIndex: 1 }} />

      {/* Three.js canvas */}
      <ThreeCanvas isDark={isDark} />

      {/* Watermark */}
      <div aria-hidden style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: "clamp(140px,28vw,480px)", fontWeight: 700, lineHeight: 1, color: "rgba(244,165,53,0.055)", userSelect: "none", pointerEvents: "none", zIndex: 1, letterSpacing: "-12px" }}>GEO</div>

      {/* Content */}
      <motion.div style={{ position: "relative", zIndex: 3, maxWidth: "900px", width: "100%", padding: "0 clamp(24px,6vw,60px)", y: textY, opacity: textO }}>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "18px", marginBottom: "44px" }}
        >
          <div style={{ width: "48px", height: "1px", background: "linear-gradient(to right,transparent,rgba(244,165,53,0.7))" }} />
          <span className="abt-hero-eyebrow" style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(7.5px,0.95vw,10px)", letterSpacing: "8px", color: "rgba(253,248,240,1)", textTransform: "uppercase" }}>{t("about.hero.eyebrow")}</span>
          <div style={{ width: "48px", height: "1px", background: "linear-gradient(to left,transparent,rgba(244,165,53,0.7))" }} />
        </motion.div>

        {/* Title */}
        <h1 style={{ margin: "0 0 8px", lineHeight: 0.88 }}>
          <motion.div
            initial={{ opacity: 0, y: 56, filter: "blur(16px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
            className="abt-hero-title-ls"
            style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(72px,16vw,200px)", fontWeight: 300, color: "#FAF0D9", letterSpacing: "-5px", textShadow: "0 4px 80px rgba(0,0,0,0.50)" }}
          >
            {t("about.hero.title1")}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 56, filter: "blur(16px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.40 }}
            className="abt-hero-title-ls"
            style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(72px,16vw,200px)", fontWeight: 700, background: "linear-gradient(118deg,#F4A535 0%,#F7D580 40%,#E8A820 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "-5px" }}
          >
            {t("about.hero.title2")}
          </motion.div>
        </h1>

        {/* Divider + italic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", margin: "38px 0 0" }}
        >
          <div style={{ flex: "0 1 80px", height: "1px", background: "linear-gradient(to right,transparent,rgba(232,144,159,0.70))" }} />
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(16px,2.4vw,24px)", fontStyle: "italic", fontWeight: 300, color: "rgba(253,248,240,0.90)", lineHeight: 1.6, margin: 0, maxWidth: "560px", textShadow: "0 2px 24px rgba(0,0,0,0.45)" }} dangerouslySetInnerHTML={{ __html: t("about.hero.quote") }}>
          </p>
          <div style={{ flex: "0 1 80px", height: "1px", background: "linear-gradient(to left,transparent,rgba(232,144,159,0.70))" }} />
        </motion.div>

        {/* Sub-label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.88 }}
          className="abt-hero-sublabel"
          style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(7.5px,0.9vw,10px)", letterSpacing: "6px", color: "rgba(253,248,240,0.45)", marginTop: "22px", textTransform: "uppercase" }}
        >
          {t("about.hero.sublabel")}
        </motion.p>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="abt-scroll-cue"
          style={{ marginTop: "72px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
        >
          <span style={{ fontFamily: "'Cinzel',serif", fontSize: "6.5px", letterSpacing: "5px", color: "rgba(253,248,240,0.35)", textTransform: "uppercase" }}>{t("about.hero.scrollCue")}</span>
          <ChevronDown size={15} style={{ color: "#F4A535", animation: "abtBounce 2.2s ease-in-out infinite" }} />
        </motion.div>

      </motion.div>

      {/* Bottom film strip edge */}
      <div aria-hidden className="abt-filmstrip-bottom" />
    </section>
  );
}

/* ─────────────────────────────────────────
   MANIFESTO — full-width centered dramatic
───────────────────────────────────────── */
function ManifestoSection({ isDark, C, SP, MW, grain }) {
  const quoteRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!quoteRef.current) return;
    const words = quoteRef.current.querySelectorAll(".mf-word");
    gsap.set(words, { opacity: 0, y: 26, filter: "blur(8px)" });
    const st = ScrollTrigger.create({
      trigger: quoteRef.current,
      start: "top 72%",
      once: true,
      onEnter: () => {
        gsap.to(words, {
          opacity: 1, y: 0, filter: "blur(0px)",
          stagger: 0.052, duration: 0.78, ease: "power3.out",
        });
      },
    });
    return () => st.kill();
  }, []);

  const quoteWords = t("about.manifesto.quote", "We don't just talk about history — we travel to ancient places, document hidden temples, and bring lost stories back to life.").split(" ");

  /* Chapter label */
  const ChapterLabel = ({ n, text }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "36px" }}>
      <span style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8px,1vw,10px)", letterSpacing: "1px", color: isDark ? "rgba(244,165,53,0.55)" : "rgba(232,144,159,0.70)", fontWeight: 400 }}>{n}</span>
      <div style={{ width: "40px", height: "1px", background: isDark ? "rgba(244,165,53,0.35)" : "rgba(232,144,159,0.50)" }} />
      <span style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8px,1vw,10px)", letterSpacing: "7px", color: C.faint, textTransform: "uppercase" }}>{text}</span>
    </div>
  );

  return (
    <section style={{ ...SP, background: C.altBg, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
      {/* Very faint grain texture */}
      <div aria-hidden style={{ position: "absolute", inset: 0, opacity: isDark ? 0.04 : 0.02, backgroundImage: grain, backgroundSize: "200px", pointerEvents: "none" }} />
      {/* Faint background glow */}
      <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "500px", borderRadius: "50%", background: isDark ? "radial-gradient(ellipse,rgba(232,144,159,0.06) 0%,transparent 70%)" : "radial-gradient(ellipse,rgba(232,144,159,0.10) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ ...MW, textAlign: "center", position: "relative", zIndex: 1 }}>
        <R dir="up">
          <ChapterLabel n="—" text={t("about.manifesto.chapter")} />
        </R>

        {/* Huge GSAP quote */}
        <blockquote
          ref={quoteRef}
          style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,4.8vw,58px)", fontStyle: "italic", fontWeight: 300, lineHeight: 1.48, color: C.quote, margin: "0 auto 44px", maxWidth: "820px", letterSpacing: "0.1px" }}
        >
          {quoteWords.map((word, i) => (
            <span key={i} className="mf-word" style={{ display: "inline-block", marginRight: "0.3em" }}>{word}</span>
          ))}
        </blockquote>

        <R dir="up" delay={200}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "32px" }}>
            {["#E8909F","#F4A535","#7DAF6E"].map(col => <div key={col} style={{ width: 5, height: 5, borderRadius: "50%", background: col, boxShadow: `0 0 10px ${col}` }} />)}
          </div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(13px,1.6vw,17px)", fontWeight: 300, lineHeight: 1.95, color: C.body, maxWidth: "640px", margin: "0 auto" }}>
            {t("about.manifesto.body")}
          </p>
        </R>
      </div>
    </section>
  );
}


/* ─────────────────────────────────────────
   STATS
───────────────────────────────────────── */
function StatsSection({ isDark, C, SP, MW }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const n1 = useCountUp(111, inView, 1900);
  const n2 = useCountUp(7,   inView, 1400);
  const n3 = useCountUp(50,  inView, 1700);
  const { t } = useTranslation();

  const STATS = [
    { display: t("about.stats.1.num", "1.9M+"), label: t("about.stats.1.label", "Documentary\nViews"),     color: "#F4A535", isStatic: true },
    { display: n1,      label: t("about.stats.2.label", "Jain Sites\nDocumented"), color: "#7DAF6E", suffix: "" },
    { display: n2,      label: t("about.stats.3.label", "States &\nNations"),      color: "#E8909F", suffix: "+" },
    { display: n3,      label: t("about.stats.4.label", "Tamil Voices\nCaptured"), color: "#F4A535", suffix: "+" },
  ];

  return (
    <section style={{ ...SP, paddingTop: "88px", paddingBottom: "88px", borderBottom: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }} ref={ref}>
      {/* Subtle BG image */}
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "url('/journey/09-temple.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: isDark ? 0.06 : 0.05 }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: isDark ? "rgba(6,13,8,0.88)" : "rgba(253,248,240,0.88)" }} />

      <div style={{ ...MW, display: "flex", justifyContent: "center", alignItems: "stretch", flexWrap: "wrap", gap: 0, position: "relative", zIndex: 1 }} className="abt-stats-row">
        {STATS.map((s, i) => (
          <React.Fragment key={s.label}>
            <motion.div
              style={{ textAlign: "center", padding: "0 clamp(20px,5vw,64px)" }}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.14 }}
            >
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(52px,9vw,100px)", fontWeight: 300, lineHeight: 1, color: s.color, marginBottom: "14px", letterSpacing: "-2px" }}>
                {s.isStatic ? s.display : `${s.display}${s.suffix}`}
              </div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(7px,0.85vw,9.5px)", letterSpacing: "2.5px", color: C.faint, textTransform: "uppercase", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                {s.label}
              </div>
            </motion.div>
            {i < STATS.length - 1 && (
              <div className="abt-stats-sep" style={{ width: "1px", alignSelf: "stretch", background: C.divider, margin: "8px 0", flexShrink: 0 }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   OUR WORK — three editorial cards
───────────────────────────────────────── */
function WorkSection({ isDark, C, SP, MW }) {
  const { t } = useTranslation();
  const TRIO = [
    {
      num: "01", word: t("about.work.card1.word", "Research"),
      stat: "111", statLabel: t("about.work.card1.statLabel", "Ancient Sites"),
      body: t("about.work.card1.body", "Decades of on-ground scholarship — from Tamil cave temples to Bihar's forgotten rock inscriptions."),
      img: "/journey/01-rock-sculpture.jpg",
      accent: "#E8909F",
    },
    {
      num: "02", word: t("about.work.card2.word", "Document"),
      stat: "4K", statLabel: t("about.work.card2.statLabel", "Cinematic Coverage"),
      body: t("about.work.card2.body", "Drone, ground and macro footage across India's most remote Jain heritage landscapes."),
      img: "/journey/02-temple-hill.jpg",
      accent: "#F4A535",
    },
    {
      num: "03", word: t("about.work.card3.word", "Preserve"),
      stat: "10K", statLabel: t("about.work.card3.statLabel", "Years of History"),
      body: t("about.work.card3.body", "So the children of Tamil Jains, a thousand years from now, know exactly who they were."),
      img: "/journey/05-rock-carvings.jpg",
      accent: "#7DAF6E",
    },
  ];

  const PILLARS_LOCAL = [
    { Icon: Film,     label: t("about.work.pillars.0.label", "Documentary Filmmaking"), body: t("about.work.pillars.0.body", "Among the first dedicated initiatives creating in-depth, research-based films on the vast and rich history of Jainism."),                    accent: "#E8909F" },
    { Icon: MapPin,   label: t("about.work.pillars.1.label", "Field Research"),         body: t("about.work.pillars.1.body", "Ancient Jain temples, remote cave sites, and neglected historical locations documented through rigorous on-ground work."),                    accent: "#7DAF6E" },
    { Icon: BookOpen, label: t("about.work.pillars.2.label", "Rare Literature"),        body: t("about.work.pillars.2.body", "First-ever video coverage of Naldiyar, Silappadikaram, Ratnakar and other rare Jain texts and oral traditions."),                            accent: "#F4A535" },
    { Icon: Globe,    label: t("about.work.pillars.3.label", "Regional Coverage"),      body: t("about.work.pillars.3.body", "Jain history across Pakistan, Andhra Pradesh, Kerala, Telangana, Tamil Nadu, Karnataka, Goa, Bihar and Lalitpur."),                          accent: "#7DAF6E" },
    { Icon: Users,    label: t("about.work.pillars.4.label", "Inspiring Ancestors"),    body: t("about.work.pillars.4.body", "Documentaries on Chennabhairadevi, Rani Abbakka and other extraordinary Jain figures that history nearly forgot."),                          accent: "#E8909F" },
  ];

  return (
    <section style={{ ...SP }}>
      <div style={MW}>

        {/* Chapter label + heading */}
        <R dir="up" style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,56px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", justifyContent: "center", marginBottom: "18px" }}>
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8px,1vw,10px)", letterSpacing: "1px", color: isDark ? "rgba(244,165,53,0.55)" : "rgba(232,144,159,0.70)" }}>02 /</span>
            <div style={{ width: "40px", height: "1px", background: isDark ? "rgba(244,165,53,0.35)" : "rgba(232,144,159,0.50)" }} />
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8px,1vw,10px)", letterSpacing: "7px", color: C.faint, textTransform: "uppercase" }}>{t("about.work.chapter")}</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,5.5vw,66px)", fontWeight: 300, color: C.title, lineHeight: 1.1, margin: 0, letterSpacing: "-1.5px" }}>
            {t("about.work.title1")}{" "}
            <em style={{ fontStyle: "italic", color: C.rose }}>{t("about.work.title2")}</em>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(14px,1.8vw,19px)", fontStyle: "italic", fontWeight: 300, color: C.faint, margin: "16px 0 0", lineHeight: 1.6 }}>
            {t("about.work.desc")}
          </p>
        </R>

        {/* Three editorial cards */}
        <div className="abt-trio-grid">
          {TRIO.map((item, i) => (
            <R key={item.num} dir="up" delay={i * 110}>
              <motion.div
                className="abt-trio-card"
                whileHover={{ y: -6, transition: { duration: 0.35, ease: "easeOut" } }}
                style={{ background: C.cardBg, border: `1px solid ${C.cardBdr}`, borderRadius: "2px", overflow: "hidden", cursor: "default" }}
              >
                {/* Image with stat overlay */}
                <div style={{ position: "relative", height: "clamp(180px,22vw,280px)", overflow: "hidden" }}>
                  <motion.img
                    src={item.img} alt={item.word} loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    whileHover={{ scale: 1.06, transition: { duration: 0.7 } }}
                  />
                  <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.78) 100%)" }} />
                  {/* Number badge */}
                  <div style={{ position: "absolute", top: "14px", left: "16px", fontFamily: "'Cinzel',serif", fontSize: "10px", letterSpacing: "3px", color: "rgba(253,248,240,0.45)" }}>{item.num}</div>
                  {/* Stat */}
                  <div style={{ position: "absolute", bottom: "16px", left: "18px" }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, color: item.accent, lineHeight: 1, textShadow: "0 2px 24px rgba(0,0,0,0.6)" }}>{item.stat}</div>
                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: "8px", letterSpacing: "3px", color: "rgba(253,248,240,0.55)", textTransform: "uppercase", marginTop: "3px" }}>{item.statLabel}</div>
                  </div>
                </div>
                {/* Text body */}
                <div style={{ padding: "clamp(18px,2.5vw,26px)" }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 300, color: C.title, margin: "0 0 10px", letterSpacing: "-0.5px" }}>{item.word}</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(12px,1.25vw,14px)", fontWeight: 300, lineHeight: 1.82, color: C.body, margin: 0 }}>{item.body}</p>
                  <div style={{ marginTop: "16px", width: "28px", height: "2px", background: item.accent, borderRadius: "1px" }} />
                </div>
              </motion.div>
            </R>
          ))}
        </div>

        {/* Focus area chips */}
        <R dir="up" delay={200}>
          <div style={{ marginTop: "clamp(40px,6vw,64px)", paddingTop: "clamp(28px,4vw,40px)", borderTop: `1px solid ${C.border}` }}>
            <p style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(7.5px,0.9vw,9.5px)", letterSpacing: "5px", color: C.faint, textTransform: "uppercase", marginBottom: "20px", textAlign: "center" }}>{t("about.work.focusAreas")}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
              {PILLARS_LOCAL.map((p) => (
                <motion.div
                   key={p.label}
                  whileHover={{ scale: 1.04, borderColor: p.accent }}
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 18px", background: C.cardBg, border: `1px solid ${C.cardBdr}`, borderRadius: "100px", backdropFilter: "blur(8px)", transition: "border-color 0.25s ease" }}
                >
                  <p.Icon size={12} style={{ color: p.accent }} />
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(7px,0.85vw,8.5px)", letterSpacing: "2px", color: C.title, textTransform: "uppercase" }}>{p.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </R>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   GALLERY STRIP — auto-scroll marquee
───────────────────────────────────────── */
function GalleryStrip({ isDark, C }) {
  const [paused, setPaused] = useState(false);
  const { t } = useTranslation();
  const IMGS = [
    "/journey/01-rock-sculpture.jpg", "/journey/02-temple-hill.jpg",
    "/journey/03-team-group.jpg",     "/journey/04-hillside.jpg",
    "/journey/05-rock-carvings.jpg",  "/journey/06-sheep-site.jpg",
    "/journey/07-stone-carving.jpg",  "/journey/08-community.jpg",
    "/journey/09-temple.jpg",         "/journey/10-founder-research.jpg",
  ];
  const fadeEdge = isDark ? "#060D08" : "#FDF8F0";

  return (
    <section style={{ padding: "52px 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: isDark ? "rgba(0,0,0,0.20)" : "rgba(242,196,206,0.10)", overflow: "hidden", position: "relative" }}>
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, width: "160px", height: "100%", background: `linear-gradient(to right,${fadeEdge},transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", top: 0, right: 0, width: "160px", height: "100%", background: `linear-gradient(to left,${fadeEdge},transparent)`, zIndex: 2, pointerEvents: "none" }} />

      {/* Film sprocket holes — top */}
      <div className="abt-sprocket" style={{ marginBottom: "16px" }}>
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={i} style={{ width: "14px", height: "10px", borderRadius: "2px", background: isDark ? "rgba(200,223,192,0.09)" : "rgba(42,26,14,0.07)", flexShrink: 0 }} />
        ))}
      </div>

      <div style={{ textAlign: "center", marginBottom: "16px", position: "relative", zIndex: 1 }}>
        <p style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(7.5px,0.95vw,10px)", letterSpacing: "7px", color: C.faint, textTransform: "uppercase", margin: 0 }}>
          {t("about.gallery.desc")}
        </p>
      </div>

      <div style={{ overflow: "hidden" }}>
        <div
          style={{ display: "flex", gap: "10px", animation: `abtMarquee 36s linear infinite ${paused ? "paused" : "running"}`, width: "max-content" }}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {[...IMGS, ...IMGS].map((src, i) => (
            <div key={i} style={{ width: "clamp(160px,20vw,260px)", height: "clamp(110px,16vw,190px)", flexShrink: 0, overflow: "hidden", borderRadius: "2px", position: "relative" }}>
              <img
                src={src} alt="" loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease, filter 0.5s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.filter = "brightness(1.1) contrast(1.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "none"; }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Touch hint — mobile only */}
      <p className="abt-gallery-touch-hint" style={{ color: C.faint, margin: "4px 0 0" }}>
        {t("about.gallery.touchHint")}
      </p>

      {/* Film sprocket holes — bottom */}
      <div className="abt-sprocket" style={{ marginTop: "16px" }}>
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={i} style={{ width: "14px", height: "10px", borderRadius: "2px", background: isDark ? "rgba(200,223,192,0.09)" : "rgba(42,26,14,0.07)", flexShrink: 0 }} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   REGIONS
───────────────────────────────────────── */
function RegionsSection({ isDark, C, SP, MW }) {
  const { t } = useTranslation();
  const REGIONS_LOCAL = [
    t("regions.tamilNadu", "Tamil Nadu"),
    t("regions.karnataka", "Karnataka"),
    t("regions.andhraPradesh", "Andhra Pradesh"),
    t("regions.kerala", "Kerala"),
    t("regions.telangana", "Telangana"),
    t("regions.goa", "Goa"),
    t("regions.bihar", "Bihar"),
    t("regions.lalitpur", "Lalitpur"),
    t("regions.pakistan", "Pakistan")
  ];

  return (
    <section style={{ ...SP, background: C.altBg, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ ...MW, textAlign: "center" }}>
        <R dir="up">
          <div style={{ display: "flex", alignItems: "center", gap: "14px", justifyContent: "center", marginBottom: "18px" }}>
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8px,1vw,10px)", letterSpacing: "1px", color: isDark ? "rgba(244,165,53,0.55)" : "rgba(232,144,159,0.70)" }}>03 /</span>
            <div style={{ width: "40px", height: "1px", background: isDark ? "rgba(244,165,53,0.35)" : "rgba(232,144,159,0.50)" }} />
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8px,1vw,10px)", letterSpacing: "7px", color: C.faint, textTransform: "uppercase" }}>{t("about.regions.chapter")}</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,5vw,58px)", fontWeight: 300, color: C.title, lineHeight: 1.18, margin: "0 0 16px", letterSpacing: "-0.8px" }}>
            {t("about.regions.title1")}{" "}
            <em style={{ fontStyle: "italic", color: C.sage }}>{t("about.regions.title2")}</em>
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(12px,1.3vw,15px)", fontWeight: 300, color: C.faint, marginBottom: "52px" }}>
            {t("about.regions.desc")}
          </p>
        </R>
        <div className="abt-regions-wrap" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px 14px" }}>
          {REGIONS_LOCAL.map((r, i) => (
            <R key={r} dir="up" delay={i * 55} style={{ display: "inline-block" }}>
              <span
                style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8.5px,1vw,11px)", letterSpacing: "3px", color: C.tagTxt, background: C.tagBg, border: `1px solid ${C.tagBdr}`, padding: "11px 26px", borderRadius: "2px", textTransform: "uppercase", display: "block", transition: "all 0.3s ease", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(244,165,53,0.16)" : "rgba(232,144,159,0.24)"; e.currentTarget.style.borderColor = isDark ? "#F4A535" : "#E8909F"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = isDark ? "0 6px 20px rgba(244,165,53,0.15)" : "0 6px 20px rgba(232,144,159,0.20)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.tagBg; e.currentTarget.style.borderColor = C.tagBdr; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {r}
              </span>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FOUNDER — cinematic portrait
───────────────────────────────────────── */
function FounderSection({ isDark, C, SP, grain }) {
  const photoRef = useRef(null);
  const { scrollYProgress: photoSP } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const photoY = useTransform(photoSP, [0, 1], ["-10%", "10%"]);
  const { t } = useTranslation();

  return (
    <section style={{ ...SP, position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: "50%", left: "55%", transform: "translate(-50%,-50%)", width: "700px", height: "600px", borderRadius: "50%", background: isDark ? "radial-gradient(ellipse,rgba(244,165,53,0.06) 0%,transparent 65%)" : "radial-gradient(ellipse,rgba(232,144,159,0.10) 0%,transparent 65%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "960px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "clamp(36px,6vw,88px)", alignItems: "center", position: "relative", zIndex: 1 }} className="abt-two-col">

        {/* Photo — cinematic portrait */}
        <R dir="left">
          <div ref={photoRef} style={{ position: "relative", overflow: "hidden", borderRadius: "2px" }}>
            <motion.img
              src="/journey/10-founder-research.jpg"
              alt="Kavi Sajal Jain — Founder"
              loading="lazy"
              style={{ width: "100%", height: "clamp(360px,50vw,580px)", objectFit: "cover", objectPosition: "center 20%", display: "block", y: photoY }}
            />
            {/* Film grain on photo */}
            <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: grain, backgroundSize: "200px", pointerEvents: "none" }} />
            {/* Cinematic gradient overlay at bottom */}
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)" }} />
            {/* Caption in photo */}
            <div style={{ position: "absolute", bottom: "20px", left: "20px", right: "20px" }}>
              <p style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(7px,0.85vw,9px)", letterSpacing: "4px", color: "rgba(253,248,240,0.65)", textTransform: "uppercase", margin: "0 0 4px" }}>{t("about.founder.photoLabel")}</p>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(16px,2.2vw,24px)", fontWeight: 400, color: "#FAF0D9", margin: 0, letterSpacing: "0.5px" }}>Kavi Sajal Jain</p>
            </div>
            {/* Corner film brackets */}
            <div aria-hidden style={{ position: "absolute", top: 14, left: 14, width: 28, height: 28, borderTop: `2px solid ${isDark ? "#F4A535" : "#E8909F"}`, borderLeft: `2px solid ${isDark ? "#F4A535" : "#E8909F"}`, opacity: 0.80 }} />
            <div aria-hidden style={{ position: "absolute", top: 14, right: 14, width: 28, height: 28, borderTop: `2px solid ${isDark ? "#F4A535" : "#E8909F"}`, borderRight: `2px solid ${isDark ? "#F4A535" : "#E8909F"}`, opacity: 0.80 }} />
            <div aria-hidden style={{ position: "absolute", bottom: 14, right: 14, width: 28, height: 28, borderBottom: `2px solid ${C.sage}`, borderRight: `2px solid ${C.sage}`, opacity: 0.80 }} />
          </div>
        </R>

        {/* Text */}
        <div>
          <R dir="up">
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px" }}>
              <span style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8px,1vw,10px)", letterSpacing: "1px", color: isDark ? "rgba(244,165,53,0.55)" : "rgba(232,144,159,0.70)" }}>04 /</span>
              <div style={{ width: "40px", height: "1px", background: isDark ? "rgba(244,165,53,0.35)" : "rgba(232,144,159,0.50)" }} />
              <span style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8px,1vw,10px)", letterSpacing: "7px", color: C.faint, textTransform: "uppercase" }}>{t("about.founder.chapter")}</span>
            </div>
          </R>
          <R dir="up" delay={100}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4.2vw,50px)", fontWeight: 400, color: C.title, letterSpacing: "0.2px", marginBottom: "6px", lineHeight: 1.12 }}>
              Kavi Sajal Jain
            </div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8px,1vw,10px)", letterSpacing: "5px", color: isDark ? C.gold : C.rose, textTransform: "uppercase", marginBottom: "40px" }}>
              {t("about.founder.role")}
            </div>
          </R>
          <R dir="up" delay={200}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "30px" }}>
              <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right,transparent,${C.border})` }} />
              <span style={{ color: isDark ? C.gold : C.rose, fontSize: "12px", opacity: 0.75 }}>✦</span>
              <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left,transparent,${C.border})` }} />
            </div>
            <blockquote style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(20px,2.8vw,32px)", fontStyle: "italic", fontWeight: 300, lineHeight: 1.72, color: C.quote, margin: "0 0 26px", letterSpacing: "0.1px" }}>
              {t("about.founder.quote")}
            </blockquote>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(12px,1.3vw,15px)", fontWeight: 300, color: C.faint, lineHeight: 1.8 }}>
              {t("about.founder.bio")}
            </p>
          </R>
        </div>
      </div>
    </section>
  );
}


/* ─────────────────────────────────────────
   UPCOMING
───────────────────────────────────────── */
function UpcomingSection({ isDark, C, SP, MW }) {
  const { t } = useTranslation();
  const FUTURE_LOCAL = [
    t("about.upcoming.future.0", "Pan-India site mapping & geographical visual archive of Jainism's spread"),
    t("about.upcoming.future.1", "Long-format documentary storytelling for global audiences"),
    t("about.upcoming.future.2", "Deeper field research into unexplored Jain cave sites & remote temples"),
  ];

  return (
    <section style={{ ...SP, background: C.altBg, borderTop: `1px solid ${C.border}` }}>
      <div style={MW}>
        <R dir="up" style={{ textAlign: "center", marginBottom: "68px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", justifyContent: "center", marginBottom: "18px" }}>
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8px,1vw,10px)", letterSpacing: "1px", color: isDark ? "rgba(244,165,53,0.55)" : "rgba(232,144,159,0.70)" }}>05 /</span>
            <div style={{ width: "40px", height: "1px", background: isDark ? "rgba(244,165,53,0.35)" : "rgba(232,144,159,0.50)" }} />
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8px,1vw,10px)", letterSpacing: "7px", color: C.faint, textTransform: "uppercase" }}>{t("about.upcoming.chapter")}</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,5vw,58px)", fontWeight: 300, color: C.title, lineHeight: 1.18, margin: 0, letterSpacing: "-0.8px" }}>
            {t("about.upcoming.title1")}{" "}
            <em style={{ fontStyle: "italic", color: isDark ? C.gold : C.rose }}>{t("about.upcoming.title2")}</em>
          </h2>
        </R>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "clamp(32px,5vw,76px)", alignItems: "start" }} className="abt-two-col">

          {/* Featured film card */}
          <R dir="left">
            <div style={{ background: C.cardBg, border: `1px solid ${C.cardBdr}`, borderTop: `3px solid ${isDark ? C.gold : C.rose}`, borderRadius: "2px", backdropFilter: "blur(12px)", position: "relative", overflow: "hidden" }}>
              {/* Image panel */}
              <div style={{ position: "relative", height: "clamp(160px,22vw,260px)", overflow: "hidden" }}>
                <img src="/journey/08-community.jpg" alt="Tamil Jain community" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.65) 100%)" }} />
                <div style={{ position: "absolute", bottom: "16px", left: "20px" }}>
                  <div style={{ display: "flex", gap: "5px", marginBottom: "8px", opacity: 0.55 }}>
                    {[...Array(7)].map((_, i) => <div key={i} style={{ width: 7, height: 12, borderRadius: 2, background: isDark ? "#7DAF6E" : "#E8909F" }} />)}
                  </div>
                  <p style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(7px,0.9vw,9px)", letterSpacing: "5px", color: isDark ? "rgba(247,213,128,0.9)" : "rgba(253,248,240,0.9)", textTransform: "uppercase", margin: 0 }}>{t("about.upcoming.badge")}</p>
                </div>
              </div>
              {/* Card body */}
              <div style={{ padding: "clamp(24px,3.5vw,40px)", position: "relative" }}>
                <div aria-hidden style={{ position: "absolute", top: 0, left: 0, width: "80px", height: "100%", background: "linear-gradient(90deg,transparent,rgba(232,144,159,0.04),transparent)", animation: "abtShimmer 3.5s ease-out 1s infinite", pointerEvents: "none" }} />
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,3vw,36px)", fontWeight: 400, color: C.title, lineHeight: 1.15, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
                  {t("about.upcoming.docTitle")}
                </h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(12px,1.3vw,14px)", fontWeight: 300, lineHeight: 1.88, color: C.body, margin: "0 0 24px" }}>
                  {t("about.upcoming.docDesc")}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: isDark ? C.gold : C.rose, boxShadow: `0 0 12px ${isDark ? "rgba(244,165,53,0.9)" : "rgba(232,144,159,0.9)"}`, animation: "abtPulse 2.2s ease-in-out infinite" }} />
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8px,1vw,10px)", letterSpacing: "3.5px", color: isDark ? C.gold : C.rose, textTransform: "uppercase" }}>{t("about.upcoming.releasingLabel")}</span>
                </div>
              </div>
            </div>
          </R>

          {/* Future plans */}
          <R dir="right">
            <div>
              <p style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8px,1vw,10px)", letterSpacing: "5px", color: C.faint, textTransform: "uppercase", marginBottom: "32px" }}>{t("about.upcoming.horizonLabel")}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {FUTURE_LOCAL.map((item, i) => (
                  <R key={i} dir="right" delay={i * 100}>
                    <div style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
                      <div style={{ width: "26px", height: "26px", borderRadius: "50%", border: `1px solid ${isDark ? "rgba(125,175,110,0.40)" : "rgba(125,175,110,0.58)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.sage, boxShadow: "0 0 8px rgba(125,175,110,0.80)" }} />
                      </div>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(12px,1.3vw,15px)", fontWeight: 300, lineHeight: 1.82, color: C.body, margin: 0 }}>{item}</p>
                    </div>
                  </R>
                ))}
              </div>
              <R dir="up" delay={360}>
                <div style={{ marginTop: "44px", padding: "20px 24px", background: C.greenTag, border: `1px solid ${C.greenBdr}`, borderRadius: "2px" }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(11px,1.2vw,13px)", fontWeight: 300, lineHeight: 1.78, color: C.greenTxt, margin: 0 }}>
                    {t("about.upcoming.inviteText")}
                  </p>
                </div>
              </R>
            </div>
          </R>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CONNECT
───────────────────────────────────────── */
function ConnectSection({ isDark, C, SP, MW }) {
  const { t } = useTranslation();
  const SOCIALS_LOCAL = [
    { label:"Instagram", handle:"@geo_jainism", href:"https://instagram.com/geo_jainism",                  Icon:Instagram,     accent:"#E8909F" },
    { label:"YouTube",   handle:"@geo_jainism", href:"https://www.youtube.com/@geo_jainism",               Icon:Youtube,       accent:"#F4A535" },
    { label:"Twitter/X", handle:"@geo_jainism", href:"https://x.com/geo_jainism",                          Icon:Twitter,       accent:"#D8EEF5" },
    { label:"WhatsApp",  handle:t("about.connect.whatsappJoin", "Join Group"),   href:"https://chat.whatsapp.com/EnHCodUJre9AlzFO9LRx5j",  Icon:MessageCircle, accent:"#7DAF6E" },
  ];

  return (
    <section style={{ ...SP, borderTop: `1px solid ${C.border}` }}>
      <div style={{ ...MW, textAlign: "center" }}>
        <R dir="up">
          <div style={{ display: "flex", alignItems: "center", gap: "14px", justifyContent: "center", marginBottom: "18px" }}>
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8px,1vw,10px)", letterSpacing: "1px", color: isDark ? "rgba(244,165,53,0.55)" : "rgba(232,144,159,0.70)" }}>06 /</span>
            <div style={{ width: "40px", height: "1px", background: isDark ? "rgba(244,165,53,0.35)" : "rgba(232,144,159,0.50)" }} />
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(8px,1vw,10px)", letterSpacing: "7px", color: C.faint, textTransform: "uppercase" }}>{t("about.connect.chapter")}</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,5vw,58px)", fontWeight: 300, color: C.title, lineHeight: 1.18, margin: "0 0 12px", letterSpacing: "-0.8px" }}>
            {t("about.connect.title1")}{" "}
            <em style={{ fontStyle: "italic", color: isDark ? C.gold : C.rose }}>{t("about.connect.title2")}</em>
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(12px,1.4vw,15px)", fontWeight: 300, color: C.faint, marginBottom: "60px" }}>
            {t("about.connect.desc")}
          </p>
        </R>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "68px" }} className="abt-social-grid">
          {SOCIALS_LOCAL.map((s, i) => (
            <R key={s.label} dir="up" delay={i * 80}>
              <a
                href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", padding: "26px 16px", background: C.cardBg, border: `1px solid ${C.cardBdr}`, borderRadius: "2px", textDecoration: "none", backdropFilter: "blur(10px)", transition: "all 0.4s ease" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s.accent; e.currentTarget.style.background = `${s.accent}14`; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 16px 40px ${s.accent}22`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.cardBdr; e.currentTarget.style.background = C.cardBg; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <s.Icon size={22} style={{ color: s.accent, marginBottom: "12px" }} />
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(7.5px,0.9vw,9.5px)", letterSpacing: "3px", color: C.title, textTransform: "uppercase", marginBottom: "4px" }}>{s.label}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(10px,1.1vw,12px)", fontWeight: 300, color: C.faint }}>{s.handle}</div>
              </a>
            </R>
          ))}
        </div>

        <R dir="up">
          <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "52px" }}>
            <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right,transparent,${C.border})` }} />
            <span style={{ color: isDark ? C.gold : C.rose, fontSize: 11, opacity: 0.6 }}>✦</span>
            <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left,transparent,${C.border})` }} />
          </div>
        </R>

        <R dir="up" delay={100}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "10px 40px" }}>
            {[
              { Icon: Phone, text: "+91-6261820815",               href: "tel:+916261820815" },
              { Icon: Mail,  text: "goldeneraofjainism@gmail.com",  href: "mailto:goldeneraofjainism@gmail.com" },
            ].map(({ Icon, text, href }) => (
              <a key={href} href={href}
                style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(12px,1.3vw,15px)", fontWeight: 300, color: C.faint, textDecoration: "none", transition: "color 0.25s ease" }}
                onMouseEnter={e => { e.currentTarget.style.color = isDark ? C.gold : C.rose; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.faint; }}
              >
                <Icon size={14} style={{ color: isDark ? C.gold : C.rose, flexShrink: 0 }} />
                {text}
              </a>
            ))}
          </div>
        </R>

        <R dir="up" delay={200}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(14px,1.8vw,20px)", fontStyle: "italic", fontWeight: 300, color: C.faint, marginTop: "52px", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: t("about.connect.bottomQuote") }}>
          </p>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(20px,3.5vw,44px)", fontWeight: 400, color: isDark ? C.gold : C.rose, marginTop: "32px", letterSpacing: "2px", opacity: 0.85 }}>
            {t("about.connect.salutation")}
          </div>
        </R>
      </div>
    </section>
  );
}

