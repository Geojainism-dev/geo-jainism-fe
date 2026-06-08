import React, { useRef, useEffect, useState } from "react";
import { ChevronDown, Film, MapPin, BookOpen, Globe, Users, Phone, Mail, Instagram, Youtube, Facebook, Twitter } from "lucide-react";
import { useLenis, useTheme } from "@/hooks";
import { Navbar, Footer } from "@/components/layout";
import { ErrorBoundary } from "@/components/common";
import "@/styles/about.css";

/* ── Hooks ── */
const useReveal = (threshold = 0.12) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, shown];
};

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

/* ── Reveal wrapper ── */
const R = ({ children, dir = "up", delay = 0, style = {}, className = "" }) => {
  const [ref, shown] = useReveal();
  return (
    <div
      ref={ref}
      className={`abt-rev abt-${dir} ${shown ? "abt-shown" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
};

/* ── Static data ── */
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  left:  `${(i * 4.6) % 100}%`,
  size:  1.5 + (i % 3) * 0.7,
  delay: `${(i * 0.6) % 12}s`,
  dur:   `${10 + (i % 5) * 1.8}s`,
  color: ["#F4A535","#F7D580","#7DAF6E","#E8909F"][i % 4],
}));

const PILLARS = [
  { Icon: Film,     label: "Documentary Filmmaking", body: "Among the first dedicated initiatives creating in-depth, research-based films on the vast and rich history of Jainism.", accent: "#F4A535" },
  { Icon: MapPin,   label: "Field Research",         body: "Ancient Jain temples, remote cave sites, and neglected historical locations documented through rigorous on-ground work.", accent: "#7DAF6E" },
  { Icon: BookOpen, label: "Rare Literature",        body: "First-ever video coverage of Naldiyar, Silappadikaram, Ratnakar and other rare Jain texts and oral traditions.", accent: "#E8909F" },
  { Icon: Globe,    label: "Regional Coverage",      body: "Jain history across Pakistan, Andhra Pradesh, Kerala, Telangana, Tamil Nadu, Karnataka, Goa, Bihar and Lalitpur.", accent: "#F7D580" },
  { Icon: Users,    label: "Inspiring Ancestors",    body: "Documentaries on Chennabhairadevi, Rani Abbakka and other extraordinary Jain figures that history nearly forgot.", accent: "#7DAF6E" },
];

const REGIONS = [
  "Tamil Nadu","Karnataka","Andhra Pradesh","Kerala",
  "Telangana","Goa","Bihar","Lalitpur","Pakistan",
];

const FUTURE = [
  "Pan-India site mapping & geographical visual archive of Jainism's spread",
  "Long-format documentary storytelling for global audiences",
  "Deeper field research into unexplored Jain cave sites & remote temples",
];

const SOCIALS = [
  { label:"Instagram", handle:"@geo_jainism", href:"https://instagram.com/geo_jainism", Icon:Instagram, accent:"#E8909F" },
  { label:"YouTube",   handle:"GEO JAINISM",  href:"https://youtube.com",               Icon:Youtube,   accent:"#F4A535" },
  { label:"Facebook",  handle:"GEO JAINISM",  href:"https://facebook.com",              Icon:Facebook,  accent:"#7DAF6E" },
  { label:"Twitter/X", handle:"@geo_jainism", href:"https://twitter.com",               Icon:Twitter,   accent:"#F7D580" },
];

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function AboutPage() {
  const { theme } = useTheme();
  useLenis();
  const isDark = theme === "dark";

  const C = {
    bg:       isDark ? "linear-gradient(150deg,#060D08 0%,#0E0804 52%,#070C05 100%)"
                     : "linear-gradient(150deg,#FDF8F0 0%,#F5EBD8 55%,#EDF4E8 100%)",
    title:    isDark ? "#FAF0D9"                  : "#2A1A0E",
    body:     isDark ? "rgba(200,223,192,0.65)"   : "rgba(42,26,14,0.65)",
    faint:    isDark ? "rgba(200,223,192,0.38)"   : "rgba(42,26,14,0.38)",
    quote:    isDark ? "rgba(240,223,180,0.82)"   : "rgba(42,26,14,0.78)",
    border:   isDark ? "rgba(244,165,53,0.18)"    : "rgba(244,165,53,0.24)",
    divider:  isDark ? "rgba(200,223,192,0.09)"   : "rgba(42,26,14,0.09)",
    cardBg:   isDark ? "rgba(125,175,110,0.05)"   : "rgba(255,255,255,0.60)",
    cardBdr:  isDark ? "rgba(125,175,110,0.14)"   : "rgba(244,165,53,0.20)",
    altBg:    isDark ? "rgba(0,0,0,0.25)"         : "rgba(244,165,53,0.04)",
    altBdr:   isDark ? "rgba(244,165,53,0.14)"    : "rgba(244,165,53,0.18)",
    tagBg:    isDark ? "rgba(244,165,53,0.07)"    : "rgba(244,165,53,0.09)",
    tagBdr:   isDark ? "rgba(244,165,53,0.28)"    : "rgba(244,165,53,0.32)",
    tagTxt:   isDark ? "rgba(247,213,128,0.88)"   : "#7A4D0A",
    greenTag: isDark ? "rgba(125,175,110,0.10)"   : "rgba(125,175,110,0.12)",
    greenBdr: isDark ? "rgba(125,175,110,0.30)"   : "rgba(125,175,110,0.40)",
    greenTxt: isDark ? "#7DAF6E"                  : "#3E7E30",
  };

  const SP = { padding: "clamp(60px,8vw,100px) clamp(24px,8vw,100px)", position: "relative" };
  const MW = { maxWidth: "980px", margin: "0 auto" };
  const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='7'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

  return (
    <ErrorBoundary>
      <div data-theme={theme} style={{ background: C.bg, minHeight: "100vh", transition: "background 0.5s ease" }}>
        <Navbar />

        <main style={{ paddingTop: "72px" }}>

          {/* ════════════════════════════
              1 · HERO
          ════════════════════════════ */}
          <section style={{ ...SP, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden" }}>

            {/* Atmosphere glows */}
            <div aria-hidden style={{ position:"absolute", top:"32%", left:"22%", transform:"translate(-50%,-50%)", width:"620px", height:"520px", borderRadius:"50%", background:"radial-gradient(ellipse,rgba(244,165,53,0.11) 0%,transparent 65%)", pointerEvents:"none" }}/>
            <div aria-hidden style={{ position:"absolute", top:"68%", right:"8%",  transform:"translate(50%,-50%)",  width:"480px", height:"420px", borderRadius:"50%", background:"radial-gradient(ellipse,rgba(125,175,110,0.09) 0%,transparent 65%)", pointerEvents:"none" }}/>
            <div aria-hidden style={{ position:"absolute", top:"50%", left:"50%",  transform:"translate(-50%,-50%)", fontFamily:"'Playfair Display',serif", fontSize:"clamp(180px,32vw,460px)", fontWeight:700, lineHeight:1, color: isDark ? "rgba(125,175,110,0.028)" : "rgba(42,26,14,0.025)", userSelect:"none", pointerEvents:"none", whiteSpace:"nowrap", letterSpacing:"-10px" }}>GEO</div>

            {/* Film grain */}
            <div aria-hidden style={{ position:"absolute", inset:0, opacity: isDark ? 0.055 : 0.022, backgroundImage: grain, backgroundSize:"200px", pointerEvents:"none" }}/>

            {/* Particles */}
            <div aria-hidden style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
              {PARTICLES.map((p, i) => (
                <span key={i} style={{ position:"absolute", bottom:"-6px", left:p.left, width:p.size+"px", height:p.size+"px", borderRadius:"50%", background:p.color, opacity:0, boxShadow:`0 0 7px ${p.color}`, animation:`abtParticle ${p.dur} ${p.delay} linear infinite` }}/>
              ))}
            </div>

            {/* Content */}
            <div style={{ position:"relative", zIndex:2, maxWidth:"860px", width:"100%" }}>
              <p style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(8px,1.1vw,11px)", letterSpacing:"9px", color:C.faint, textTransform:"uppercase", marginBottom:"36px", animation:"abtFadeUp 0.8s ease 0.1s both" }}>
                Golden Era of Jainism
              </p>

              <h1 style={{ margin:"0 0 12px", lineHeight:0.86 }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(64px,14vw,178px)", fontWeight:300, color:C.title, animation:"abtFadeUp 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.28s both", letterSpacing:"-4px" }}>
                  Geo
                </div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(64px,14vw,178px)", fontWeight:700, background:"linear-gradient(120deg,#F4A535 0%,#F7D580 44%,#E8A820 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"abtFadeUp 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.44s both", letterSpacing:"-4px" }}>
                  Jainism.
                </div>
              </h1>

              {/* Lotus divider */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"16px", margin:"32px 0 0", animation:"abtFadeUp 0.7s ease 0.60s both" }}>
                <div style={{ flex:"0 1 72px", height:"1px", background:"linear-gradient(to right,transparent,rgba(232,144,159,0.55))" }}/>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(15px,2.1vw,21px)", fontStyle:"italic", fontWeight:300, color:C.quote, lineHeight:1.65, margin:0, maxWidth:"520px", textAlign:"center" }}>
                  Where every stone holds a story<br />two thousand years old.
                </p>
                <div style={{ flex:"0 1 72px", height:"1px", background:"linear-gradient(to left,transparent,rgba(232,144,159,0.55))" }}/>
              </div>

              {/* Sub-label */}
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(11px,1.2vw,13px)", fontWeight:300, letterSpacing:"0.5px", color:C.faint, marginTop:"20px", animation:"abtFadeUp 0.7s ease 0.74s both" }}>
                Research · Documentation · Preservation
              </p>

              {/* Scroll cue */}
              <div style={{ marginTop:"68px", display:"flex", flexDirection:"column", alignItems:"center", gap:"7px", animation:"abtFadeUp 0.6s ease 0.9s both" }}>
                <span style={{ fontFamily:"'Cinzel',serif", fontSize:"7px", letterSpacing:"4px", color:C.faint, textTransform:"uppercase" }}>Discover</span>
                <ChevronDown size={16} style={{ color:"#F4A535", animation:"abtBounce 2s ease-in-out infinite" }}/>
              </div>
            </div>
          </section>

          {/* ════════════════════════════
              2 · MANIFESTO
          ════════════════════════════ */}
          <section style={{ ...SP, background: C.altBg, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ ...MW, textAlign:"center" }}>
              <R dir="up">
                <p style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(8px,1vw,10px)", letterSpacing:"7px", color:C.faint, textTransform:"uppercase", marginBottom:"36px" }}>Our Purpose</p>
              </R>
              <R dir="up" delay={120}>
                <blockquote style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(24px,4.2vw,46px)", fontStyle:"italic", fontWeight:300, lineHeight:1.5, color:C.quote, margin:"0 0 32px", letterSpacing:"0.2px" }}>
                  "We don't just talk about history —<br />
                  we travel to ancient places, document hidden temples,<br />
                  and bring lost stories back to life."
                </blockquote>
              </R>
              <R dir="up" delay={240}>
                {/* Triple dot */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", marginBottom:"32px" }}>
                  {["#F4A535","#E8909F","#7DAF6E"].map(c => <div key={c} style={{ width:5, height:5, borderRadius:"50%", background:c, boxShadow:`0 0 8px ${c}80` }}/>)}
                </div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(13px,1.5vw,16px)", fontWeight:300, lineHeight:1.9, color:C.body, maxWidth:"640px", margin:"0 auto" }}>
                  GEO Jainism is among the first dedicated content initiatives creating in-depth, research-based documentary films on the vast and rich history of Jainism. Our sole objective: to bring the neglected heritage of Jainism into the mainstream.
                </p>
              </R>
            </div>
          </section>

          {/* ════════════════════════════
              3 · STATS
          ════════════════════════════ */}
          <StatsSection isDark={isDark} C={C} SP={SP} MW={MW} />

          {/* ════════════════════════════
              4 · OUR WORK
          ════════════════════════════ */}
          <WorkSection isDark={isDark} C={C} SP={SP} MW={MW} grain={grain} />

          {/* ════════════════════════════
              5 · REGIONS
          ════════════════════════════ */}
          <RegionsSection isDark={isDark} C={C} SP={SP} MW={MW} />

          {/* ════════════════════════════
              6 · FOUNDER
          ════════════════════════════ */}
          <FounderSection isDark={isDark} C={C} SP={SP} grain={grain} />

          {/* ════════════════════════════
              7 · UPCOMING
          ════════════════════════════ */}
          <UpcomingSection isDark={isDark} C={C} SP={SP} MW={MW} />

          {/* ════════════════════════════
              8 · CONNECT
          ════════════════════════════ */}
          <ConnectSection isDark={isDark} C={C} SP={SP} MW={MW} />

        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

/* ─────────────────────────────────────────
   STATS
───────────────────────────────────────── */
function StatsSection({ isDark, C, SP, MW }) {
  const [ref, shown] = useReveal(0.15);

  const n1 = useCountUp(111, shown, 1800);
  const n2 = useCountUp(7,   shown, 1400);
  const n3 = useCountUp(50,  shown, 1600);

  const STATS = [
    { display: "1.9M+", label: "Documentary\nViews",      color: "#F4A535", static: true },
    { display: n1,      label: "Jain Sites\nDocumented",  color: "#7DAF6E", suffix: "" },
    { display: n2,      label: "States &\nNations",       color: "#E8909F", suffix: "+" },
    { display: n3,      label: "Tamil Voices\nCaptured",  color: "#F4A535", suffix: "+" },
  ];

  return (
    <section style={{ ...SP, paddingTop: "80px", paddingBottom: "80px", borderBottom: `1px solid ${C.border}` }} ref={ref}>
      <div style={{ ...MW, display:"flex", justifyContent:"center", alignItems:"stretch", flexWrap:"wrap", gap:0 }} className="abt-stats-row">
        {STATS.map((s, i) => (
          <React.Fragment key={s.label}>
            <div style={{ textAlign:"center", padding:"0 clamp(18px,4.5vw,56px)", opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(28px)", transition:`opacity 0.7s ease ${i*130}ms, transform 0.75s ease ${i*130}ms` }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(46px,8vw,88px)", fontWeight:300, lineHeight:1, color:s.color, marginBottom:"12px", letterSpacing:"-1px" }}>
                {s.static ? s.display : `${s.display}${s.suffix}`}
              </div>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(7px,0.85vw,9.5px)", letterSpacing:"2.5px", color:C.faint, textTransform:"uppercase", lineHeight:1.75, whiteSpace:"pre-line" }}>
                {s.label}
              </div>
            </div>
            {i < STATS.length - 1 && (
              <div className="abt-stats-sep" style={{ width:"1px", alignSelf:"stretch", background:C.divider, margin:"8px 0", flexShrink:0 }}/>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   OUR WORK
───────────────────────────────────────── */
function WorkSection({ isDark, C, SP, MW, grain }) {
  return (
    <section style={SP}>
      <div style={MW}>
        <R dir="up" style={{ textAlign:"center", marginBottom:"76px" }}>
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(8px,1vw,10px)", letterSpacing:"7px", color:C.faint, textTransform:"uppercase", marginBottom:"16px" }}>What We Do</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(30px,5vw,60px)", fontWeight:300, color:C.title, lineHeight:1.12, margin:0, letterSpacing:"-1.5px" }}>
            Research. Document.{" "}
            <em style={{ fontStyle:"italic", color:"#F4A535" }}>Preserve.</em>
          </h2>
        </R>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"clamp(40px,6vw,96px)", alignItems:"start" }} className="abt-two-col">

          {/* Left — story */}
          <R dir="left">
            <div style={{ position:"relative", overflow:"hidden" }}>
              {/* Shimmer on reveal */}
              <div aria-hidden style={{ position:"absolute", top:0, left:0, width:"60px", height:"100%", background:"linear-gradient(90deg,transparent,rgba(244,165,53,0.07),transparent)", animation:"abtShimmer 2s ease-out 0.5s 1 forwards", pointerEvents:"none" }}/>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(19px,2.5vw,27px)", fontStyle:"italic", fontWeight:300, lineHeight:1.6, color:C.quote, marginBottom:"24px" }}>
                We travel. We climb.<br />We document.
              </p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(13px,1.4vw,15px)", fontWeight:300, lineHeight:1.9, color:C.body, marginBottom:"22px" }}>
                Through on-field shooting and careful research across the length and breadth of India — and beyond — we help people discover the beautiful and hidden Jain heritage that still quietly exists.
              </p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(13px,1.4vw,15px)", fontWeight:300, lineHeight:1.9, color:C.body, marginBottom:"32px" }}>
                Our cameras have witnessed ancient inscriptions in Tamil cave temples, priceless idols in forgotten Bihar shrines, and living traditions in coastal Karnataka — ensuring nothing is lost to time or neglect.
              </p>
              {/* Decorative rule */}
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <div style={{ flex:1, height:"1px", background:`linear-gradient(to right,${C.border},transparent)`, animation:"abtLineGrow 1s ease 0.3s both", transformOrigin:"left" }}/>
                <span style={{ fontFamily:"'Cinzel',serif", fontSize:"8px", letterSpacing:"3px", color:C.faint, textTransform:"uppercase" }}>Est. Golden Era</span>
              </div>
            </div>
          </R>

          {/* Right — pillars */}
          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
            {PILLARS.map((p, i) => (
              <R key={p.label} dir="right" delay={i * 85}>
                <div style={{ display:"flex", gap:"16px", alignItems:"flex-start", padding:"18px 20px", background:C.cardBg, border:`1px solid ${C.cardBdr}`, borderLeft:`3px solid ${p.accent}`, borderRadius:"2px", backdropFilter:"blur(8px)", transition:"transform 0.3s ease, box-shadow 0.3s ease", cursor:"default" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = `0 4px 20px ${p.accent}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <p.Icon size={16} style={{ color:p.accent, flexShrink:0, marginTop:"3px" }}/>
                  <div>
                    <div style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(8.5px,1vw,10.5px)", letterSpacing:"2.5px", color:C.title, textTransform:"uppercase", marginBottom:"5px", fontWeight:600 }}>{p.label}</div>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(11px,1.15vw,13px)", fontWeight:300, color:C.body, margin:0, lineHeight:1.7 }}>{p.body}</p>
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   REGIONS
───────────────────────────────────────── */
function RegionsSection({ isDark, C, SP, MW }) {
  return (
    <section style={{ ...SP, background:C.altBg, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ ...MW, textAlign:"center" }}>
        <R dir="up">
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(8px,1vw,10px)", letterSpacing:"7px", color:C.faint, textTransform:"uppercase", marginBottom:"14px" }}>Where We've Been</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4.2vw,50px)", fontWeight:300, color:C.title, lineHeight:1.2, margin:"0 0 16px", letterSpacing:"-0.5px" }}>
            Jain Heritage Across{" "}
            <em style={{ fontStyle:"italic", color:"#7DAF6E" }}>Borders</em>
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(12px,1.3vw,14px)", fontWeight:300, color:C.faint, marginBottom:"52px" }}>
            Field documentation spanning multiple states and nations
          </p>
        </R>

        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"12px 14px" }}>
          {REGIONS.map((r, i) => (
            <R key={r} dir="up" delay={i * 55} style={{ display:"inline-block" }}>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(8.5px,1vw,11px)", letterSpacing:"3px", color:C.tagTxt, background:C.tagBg, border:`1px solid ${C.tagBdr}`, padding:"10px 24px", borderRadius:"2px", textTransform:"uppercase", display:"block", transition:"all 0.3s ease", cursor:"default" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(244,165,53,0.16)"; e.currentTarget.style.borderColor = "#F4A535"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.tagBg; e.currentTarget.style.borderColor = C.tagBdr; e.currentTarget.style.transform = "none"; }}
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
   FOUNDER
───────────────────────────────────────── */
function FounderSection({ isDark, C, SP, grain }) {
  return (
    <section style={{ ...SP, textAlign:"center", position:"relative", overflow:"hidden" }}>
      {/* Atmosphere */}
      <div aria-hidden style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"600px", height:"500px", borderRadius:"50%", background:"radial-gradient(ellipse,rgba(244,165,53,0.07) 0%,transparent 65%)", pointerEvents:"none" }}/>
      <div aria-hidden style={{ position:"absolute", inset:0, opacity: isDark ? 0.04 : 0.018, backgroundImage:grain, backgroundSize:"200px", pointerEvents:"none" }}/>

      <div style={{ maxWidth:"640px", margin:"0 auto", position:"relative", zIndex:1 }}>
        <R dir="up">
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(8px,1vw,10px)", letterSpacing:"7px", color:C.faint, textTransform:"uppercase", marginBottom:"48px" }}>The Voice Behind</p>
        </R>

        {/* Avatar with orbit rings */}
        <R dir="scale" delay={80}>
          <div style={{ position:"relative", width:"108px", height:"108px", margin:"0 auto 28px" }}>
            {/* Outer orbit ring */}
            <div aria-hidden style={{ position:"absolute", inset:"-20px", borderRadius:"50%", border:`1px solid ${isDark ? "rgba(244,165,53,0.12)" : "rgba(244,165,53,0.18)"}` }}/>
            <div aria-hidden style={{ position:"absolute", inset:"-12px", borderRadius:"50%", border:`1px solid ${isDark ? "rgba(125,175,110,0.10)" : "rgba(125,175,110,0.15)"}`, borderTopColor:"transparent", animation:"abtOrbit 8s linear infinite" }}/>
            {/* Avatar */}
            <div style={{ width:"108px", height:"108px", borderRadius:"50%", background:"linear-gradient(135deg,#F4A535 0%,#E8A820 45%,#7DAF6E 100%)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Playfair Display',serif", fontSize:"30px", fontWeight:600, color:"#FAF0D9", animation:"abtGlowRing 3.5s ease-in-out infinite", position:"relative", zIndex:1 }}>
              KJ
            </div>
          </div>
        </R>

        <R dir="up" delay={160}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(24px,3.2vw,38px)", fontWeight:400, color:C.title, letterSpacing:"0.5px", marginBottom:"6px" }}>
            Kavi Sajal Jain
          </div>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(8px,1vw,10px)", letterSpacing:"5px", color:"#F4A535", textTransform:"uppercase", marginBottom:"44px" }}>
            Founder & Concept Director
          </div>
        </R>

        <R dir="up" delay={260}>
          {/* Ornament rule */}
          <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"32px" }}>
            <div style={{ flex:1, height:"1px", background:`linear-gradient(to right,transparent,${C.border})` }}/>
            <span style={{ color:"#F4A535", fontSize:"11px", opacity:0.7 }}>✦</span>
            <div style={{ flex:1, height:"1px", background:`linear-gradient(to left,transparent,${C.border})` }}/>
          </div>
          <blockquote style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(19px,2.6vw,28px)", fontStyle:"italic", fontWeight:300, lineHeight:1.7, color:C.quote, margin:"0 0 28px" }}>
            "To bring the eternal Jain heritage into the light —<br />that is our foremost purpose."
          </blockquote>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(12px,1.3vw,14px)", fontWeight:300, color:C.faint, lineHeight:1.75 }}>
            Researcher · Filmmaker · Cultural Documentarian
          </p>
        </R>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   UPCOMING
───────────────────────────────────────── */
function UpcomingSection({ isDark, C, SP, MW }) {
  return (
    <section style={{ ...SP, background:C.altBg, borderTop:`1px solid ${C.border}` }}>
      <div style={MW}>
        <R dir="up" style={{ textAlign:"center", marginBottom:"64px" }}>
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(8px,1vw,10px)", letterSpacing:"7px", color:C.faint, textTransform:"uppercase", marginBottom:"14px" }}>What's Next</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4.2vw,50px)", fontWeight:300, color:C.title, lineHeight:1.2, margin:0, letterSpacing:"-0.5px" }}>
            Upcoming Work &{" "}
            <em style={{ fontStyle:"italic", color:"#F4A535" }}>Vision</em>
          </h2>
        </R>

        <div style={{ display:"grid", gridTemplateColumns:"1.25fr 1fr", gap:"clamp(32px,5vw,76px)", alignItems:"start" }} className="abt-two-col">

          {/* Featured — Tamil Nadu doc */}
          <R dir="left">
            <div style={{ padding:"clamp(28px,4vw,48px)", background:C.cardBg, border:`1px solid ${C.cardBdr}`, borderTop:"3px solid #F4A535", borderRadius:"2px", backdropFilter:"blur(8px)", position:"relative", overflow:"hidden" }}>
              {/* Shimmer overlay */}
              <div aria-hidden style={{ position:"absolute", top:0, left:0, width:"80px", height:"100%", background:"linear-gradient(90deg,transparent,rgba(244,165,53,0.06),transparent)", animation:"abtShimmer 3s ease-out 1s infinite", pointerEvents:"none" }}/>
              {/* Film perforations */}
              <div style={{ display:"flex", gap:"5px", marginBottom:"24px", opacity:0.45 }}>
                {[...Array(8)].map((_,i) => <div key={i} style={{ width:7, height:12, borderRadius:2, background: isDark ? "#7DAF6E" : "#5A9850" }}/>)}
              </div>
              <p style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(7px,0.9vw,9px)", letterSpacing:"5px", color:"#F4A535", textTransform:"uppercase", marginBottom:"12px" }}>Now in Post-Production</p>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(20px,2.8vw,34px)", fontWeight:400, color:C.title, lineHeight:1.15, margin:"0 0 16px", letterSpacing:"-0.5px" }}>
                Tamil Jains Documentary
              </h3>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(12px,1.3vw,14px)", fontWeight:300, lineHeight:1.85, color:C.body, margin:"0 0 28px" }}>
                On-ground shooting complete across 111 ancient Jain sites in Tamil Nadu — 4K footage, 50+ hilltop pilgrimages, and the living testimony of 30,000 Tamil Jains preserved forever on film.
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#F4A535", boxShadow:"0 0 10px rgba(244,165,53,0.8)", animation:"abtPulse 2s ease-in-out infinite" }}/>
                <span style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(8px,1vw,10px)", letterSpacing:"3.5px", color:"#F4A535", textTransform:"uppercase" }}>Releasing August 2026</span>
              </div>
            </div>
          </R>

          {/* Future plans */}
          <R dir="right">
            <div>
              <p style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(8px,1vw,10px)", letterSpacing:"5px", color:C.faint, textTransform:"uppercase", marginBottom:"32px" }}>On The Horizon</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"28px" }}>
                {FUTURE.map((item, i) => (
                  <R key={i} dir="right" delay={i * 110}>
                    <div style={{ display:"flex", gap:"18px", alignItems:"flex-start" }}>
                      <div style={{ width:"26px", height:"26px", borderRadius:"50%", border:`1px solid ${isDark ? "rgba(125,175,110,0.38)" : "rgba(125,175,110,0.55)"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"1px" }}>
                        <div style={{ width:7, height:7, borderRadius:"50%", background:"#7DAF6E", boxShadow:"0 0 6px rgba(125,175,110,0.7)" }}/>
                      </div>
                      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(12px,1.3vw,14px)", fontWeight:300, lineHeight:1.8, color:C.body, margin:0 }}>{item}</p>
                    </div>
                  </R>
                ))}
              </div>

              {/* Support note */}
              <R dir="up" delay={380}>
                <div style={{ marginTop:"44px", padding:"20px 24px", background:C.greenTag, border:`1px solid ${C.greenBdr}`, borderRadius:"2px" }}>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(11px,1.2vw,13px)", fontWeight:300, lineHeight:1.75, color:C.greenTxt, margin:0 }}>
                    We warmly invite individuals, families, trusts and institutions to join us as supporters and patrons. Your support is a contribution to protecting our rich heritage.
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
  return (
    <section style={{ ...SP, borderTop:`1px solid ${C.border}` }}>
      <div style={{ ...MW, textAlign:"center" }}>
        <R dir="up">
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(8px,1vw,10px)", letterSpacing:"7px", color:C.faint, textTransform:"uppercase", marginBottom:"14px" }}>Find Us</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4.2vw,50px)", fontWeight:300, color:C.title, lineHeight:1.2, margin:"0 0 12px", letterSpacing:"-0.5px" }}>
            Stay{" "}
            <em style={{ fontStyle:"italic", color:"#F4A535" }}>Connected</em>
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(12px,1.3vw,14px)", fontWeight:300, color:C.faint, marginBottom:"56px" }}>
            Follow the journey — each frame is a discovery.
          </p>
        </R>

        {/* Social grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"64px" }} className="abt-social-grid">
          {SOCIALS.map((s, i) => (
            <R key={s.label} dir="up" delay={i * 80}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" style={{ display:"block", padding:"24px 16px", background:C.cardBg, border:`1px solid ${C.cardBdr}`, borderRadius:"2px", textDecoration:"none", backdropFilter:"blur(8px)", transition:"all 0.35s ease" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s.accent; e.currentTarget.style.background = `${s.accent}12`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${s.accent}20`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.cardBdr; e.currentTarget.style.background = C.cardBg; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <s.Icon size={22} style={{ color:s.accent, marginBottom:"10px" }}/>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(7.5px,0.9vw,9.5px)", letterSpacing:"3px", color:C.title, textTransform:"uppercase", marginBottom:"4px" }}>{s.label}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(10px,1.1vw,12px)", fontWeight:300, color:C.faint }}>{s.handle}</div>
              </a>
            </R>
          ))}
        </div>

        {/* Divider */}
        <R dir="up">
          <div style={{ display:"flex", alignItems:"center", gap:"20px", marginBottom:"48px" }}>
            <div style={{ flex:1, height:"1px", background:`linear-gradient(to right,transparent,${C.border})` }}/>
            <span style={{ color:"#F4A535", fontSize:10, opacity:0.6 }}>✦</span>
            <div style={{ flex:1, height:"1px", background:`linear-gradient(to left,transparent,${C.border})` }}/>
          </div>
        </R>

        {/* Contact */}
        <R dir="up" delay={100}>
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", flexWrap:"wrap", gap:"10px 36px" }}>
            {[
              { Icon:Phone, text:"+91-6261820815",              href:"tel:+916261820815" },
              { Icon:Mail,  text:"goldeneraofjainism@gmail.com", href:"mailto:goldeneraofjainism@gmail.com" },
            ].map(({ Icon, text, href }) => (
              <a key={href} href={href} style={{ display:"flex", alignItems:"center", gap:"10px", fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(12px,1.3vw,14px)", fontWeight:300, color:C.faint, textDecoration:"none", transition:"color 0.25s ease" }}
                onMouseEnter={e => e.currentTarget.style.color = "#F4A535"}
                onMouseLeave={e => e.currentTarget.style.color = C.faint}
              >
                <Icon size={14} style={{ color:"#F4A535", flexShrink:0 }}/>
                {text}
              </a>
            ))}
          </div>
        </R>

        {/* Bottom sign-off */}
        <R dir="up" delay={220}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(13px,1.6vw,17px)", fontStyle:"italic", fontWeight:300, color:C.faint, marginTop:"48px", lineHeight:1.7 }}>
            Together, we can discover hidden sites, document ancient temples,<br />and pass this legacy on to future generations.
          </p>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(9px,1.1vw,11px)", letterSpacing:"6px", color:"#F4A535", textTransform:"uppercase", marginTop:"24px", opacity:0.8 }}>
            जय जिनेन्द्र
          </div>
        </R>
      </div>
    </section>
  );
}
