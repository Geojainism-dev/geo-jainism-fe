import React, { useState, useEffect, useRef } from "react";
import { useDarkMode } from "@/hooks";
import { JOURNEY_SLIDES } from "@/constants/landingData";

/* ── Secondary palette ─────────────────────────────────────────── */
const LOTUS      = "#F2C4CE";
const LOTUS_DEEP = "#E8909F";
const TULSI      = "#C8DFC0";
const TULSI_DEEP = "#7DAF6E";
const SKY        = "#D8EEF5";

/* ── Pastel particles ──────────────────────────────────────────── */
const PCOLS = [LOTUS, LOTUS_DEEP, TULSI, SKY];
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  left:     `${(i * 3.36) % 100}%`,
  size:     1.2 + (i % 4) * 0.75,
  delay:    `${(i * 0.65) % 18}s`,
  duration: `${13 + (i % 5) * 1.9}s`,
  color:    PCOLS[i % PCOLS.length],
  glow:     i % 4 === 0 ? "0 0 6px rgba(242,196,206,0.80),0 0 14px rgba(232,144,159,0.40)"
          : i % 4 === 1 ? "0 0 6px rgba(232,144,159,0.75),0 0 12px rgba(242,196,206,0.35)"
          : i % 4 === 2 ? "0 0 5px rgba(200,223,192,0.70),0 0 12px rgba(125,175,110,0.30)"
          :               "0 0 5px rgba(216,238,245,0.70),0 0 10px rgba(125,175,110,0.25)",
}));

const KF = `
  @keyframes trRise {
    0%   { transform:translateY(0) scale(1);    opacity:0; }
    10%  { opacity:0.85; }
    90%  { opacity:0.50; }
    100% { transform:translateY(-110vh) scale(0.7); opacity:0; }
  }
  @keyframes trShimmer {
    0%   { transform:translateX(-160%) skewX(-15deg); }
    100% { transform:translateX(440%)  skewX(-15deg); }
  }
  @keyframes trFadeUp {
    from { opacity:0; transform:translateY(26px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes trImgFade {
    from { opacity:0; transform:scale(1.015); }
    to   { opacity:1; transform:scale(1); }
  }
  #journey { transition: opacity 0.9s ease, transform 0.9s ease, background 0.5s ease; }
  @media (max-width: 640px) {
    #journey .tr-main  { width:95vw !important; }
    #journey .tr-scope { height:3.5vh !important; }
    #journey .tr-btn-row { flex-direction:column !important; width:100%; }
  }
  @media (max-width: 480px) {
    #journey .tr-thumb { width:52px !important; height:33px !important; }
  }
`;

export default function Trailer() {
  const isDark = useDarkMode();
  const [slideIdx, setSlideIdx] = useState(0);
  const [tilt,     setTilt]     = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState(false);
  const [shimKey,  setShimKey]  = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRef  = useRef(null);
  const carouselRef = useRef(null);

  /* Scroll reveal */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealed(true); },
      { threshold: 0.20 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Auto-advance + pause-on-hover */
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let timer, paused = false;
    const start = () => {
      clearInterval(timer);
      timer = setInterval(() => {
        if (!paused) setSlideIdx(i => (i + 1) % JOURNEY_SLIDES.length);
      }, 6000);
    };
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) start(); else clearInterval(timer); },
      { threshold: 0.25 }
    );
    io.observe(el);
    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      clearInterval(timer); io.disconnect();
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* Shimmer + progress bar on slide change */
  useEffect(() => {
    setShimKey(k => k + 1);
    setProgress(0);
    const start = Date.now();
    const DURATION = 6000;
    let raf;
    const tick = () => {
      const p = Math.min((Date.now() - start) / DURATION, 1);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [slideIdx]);

  const goPrev = () => setSlideIdx(i => (i - 1 + JOURNEY_SLIDES.length) % JOURNEY_SLIDES.length);
  const goNext = () => setSlideIdx(i => (i + 1) % JOURNEY_SLIDES.length);

  /* 3-D tilt */
  const onTiltMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
    const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
    setTilt({ x: dy * -5, y: dx * 5 });
  };
  const onTiltLeave = () => setTilt({ x: 0, y: 0 });

  const slide = JOURNEY_SLIDES[slideIdx];

  /* Color tokens */
  const bg = isDark
    ? "linear-gradient(145deg,#070503 0%,#0E0A06 50%,#060402 100%)"
    : "linear-gradient(145deg,#F5EBD8 0%,#FDF8F0 48%,#EDE5D8 100%)";
  const titleCol = isDark ? "#FAF0D9"                    : "#3D2314";
  const bodyCol  = isDark ? "rgba(240,223,180,0.68)"     : "rgba(42,26,14,0.62)";
  const bandBdr  = isDark ? "rgba(232,144,159,0.20)"     : "rgba(232,144,159,0.32)";
  const bandBg   = isDark ? "rgba(242,196,206,0.05)"     : "rgba(242,196,206,0.14)";
  const cardGlow = isDark
    ? "0 28px 80px rgba(0,0,0,0.62), 0 0 0 1px rgba(232,144,159,0.28), 0 0 55px rgba(232,144,159,0.08)"
    : "0 24px 70px rgba(61,35,20,0.16), 0 0 0 1px rgba(232,144,159,0.42), 0 0 55px rgba(232,144,159,0.20)";
  const navBtnBg  = isDark ? "rgba(242,196,206,0.10)" : "rgba(255,255,255,0.80)";
  const navBtnBdr = isDark ? "rgba(242,196,206,0.32)" : "rgba(232,144,159,0.48)";

  return (
    <section
      id="journey"
      ref={sectionRef}
      style={{
        position: "relative", overflow: "hidden",
        minHeight: "100vh", width: "100%",
        background: bg,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 0 100px",
        opacity:   revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(36px)",
      }}
    >
      <style>{KF}</style>

      {/* ── Atmospheric glows ── */}
      <div aria-hidden="true" style={{
        position:"absolute", top:"28%", left:"12%", transform:"translate(-50%,-50%)",
        width:"55vw", height:"50vw", borderRadius:"50%",
        background:"radial-gradient(ellipse,rgba(200,223,192,0.13) 0%,transparent 65%)",
        pointerEvents:"none", zIndex:0,
      }} />
      <div aria-hidden="true" style={{
        position:"absolute", top:"68%", left:"82%", transform:"translate(-50%,-50%)",
        width:"48vw", height:"42vw", borderRadius:"50%",
        background:"radial-gradient(ellipse,rgba(242,196,206,0.16) 0%,transparent 65%)",
        pointerEvents:"none", zIndex:0,
      }} />
      <div aria-hidden="true" style={{
        position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        width:"55vw", height:"48vw", borderRadius:"50%",
        background:"radial-gradient(ellipse,rgba(216,238,245,0.09) 0%,transparent 65%)",
        pointerEvents:"none", zIndex:0,
      }} />

      {/* ── Ghost watermark ── */}
      <div aria-hidden="true" style={{
        position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        fontFamily:"'Playfair Display',serif", fontSize:"clamp(80px,16vw,240px)",
        fontWeight:700, lineHeight:1,
        color: isDark ? "rgba(242,196,206,0.032)" : "rgba(42,26,14,0.028)",
        letterSpacing:"-4px", userSelect:"none", pointerEvents:"none", whiteSpace:"nowrap",
        zIndex:0,
      }}>GEO</div>

      {/* ── Film grain ── */}
      <div aria-hidden="true" style={{
        position:"absolute", inset:0,
        opacity: isDark ? 0.045 : 0.020,
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='9'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.65 0 0 0 0 0.4 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize:"200px 200px", pointerEvents:"none", zIndex:1,
      }} />

      {/* ── Particles ── */}
      <div aria-hidden="true" style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:2 }}>
        {PARTICLES.map((p, i) => (
          <span key={i} style={{
            position:"absolute", bottom:"-8px", left:p.left,
            width:p.size+"px", height:p.size+"px", borderRadius:"50%",
            background:p.color, opacity:0, boxShadow:p.glow,
            animation:`trRise ${p.duration} ${p.delay} linear infinite`,
          }} />
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ position:"relative", zIndex:3, width:"100%" }}>

        {/* Marquee band */}
        <div style={{
          width:"100%",
          borderTop:`1px solid ${bandBdr}`, borderBottom:`1px solid ${bandBdr}`,
          background:bandBg, padding:"18px 0", marginBottom:"80px",
          display:"flex", alignItems:"center", justifyContent:"center",
          gap:"clamp(12px,3vw,36px)", backdropFilter:"blur(8px)",
        }}>
          {/* Left dashes */}
          <div style={{ display:"flex", gap:"5px", alignItems:"center" }}>
            {[10,24,10].map((w, i) => (
              <div key={i} style={{
                width:w+"px", height:"1px",
                background:`linear-gradient(90deg, transparent, ${LOTUS_DEEP}, transparent)`,
                opacity:0.65,
              }} />
            ))}
          </div>
          <span style={{
            fontFamily:"'Cinzel',serif", fontSize:"clamp(9px,1.4vw,12px)",
            letterSpacing:"clamp(3px,1vw,7px)", fontWeight:600,
            color: isDark ? LOTUS : "#C0607A",
            textTransform:"uppercase", whiteSpace:"nowrap",
          }}>Field Research</span>
          <span style={{
            width:"5px", height:"5px", borderRadius:"50%",
            background:`linear-gradient(135deg,${LOTUS_DEEP},${TULSI_DEEP})`,
            display:"inline-block", flexShrink:0,
          }} />
          <span style={{
            fontFamily:"'Playfair Display',serif", fontSize:"clamp(12px,1.8vw,17px)",
            fontStyle:"italic", color: isDark ? TULSI : TULSI_DEEP,
            whiteSpace:"nowrap", letterSpacing:"1.5px",
          }}>On the Ground</span>
          <span style={{
            width:"5px", height:"5px", borderRadius:"50%",
            background:`linear-gradient(135deg,${TULSI_DEEP},${LOTUS_DEEP})`,
            display:"inline-block", flexShrink:0,
          }} />
          <span style={{
            fontFamily:"'Cinzel',serif", fontSize:"clamp(9px,1.4vw,12px)",
            letterSpacing:"clamp(3px,1vw,7px)", fontWeight:600,
            color: isDark ? TULSI : TULSI_DEEP,
            textTransform:"uppercase", whiteSpace:"nowrap",
          }}>Documenting Heritage</span>
          {/* Right dashes */}
          <div style={{ display:"flex", gap:"5px", alignItems:"center" }}>
            {[10,24,10].map((w, i) => (
              <div key={i} style={{
                width:w+"px", height:"1px",
                background:`linear-gradient(90deg, transparent, ${LOTUS_DEEP}, transparent)`,
                opacity:0.65,
              }} />
            ))}
          </div>
        </div>

        {/* Section header */}
        <div style={{
          textAlign:"center", marginBottom:"52px",
          animation: revealed ? "trFadeUp 0.9s ease both" : "none",
        }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:"10px", marginBottom:"14px",
          }}>
            <div style={{
              width:"30px", height:"1px",
              background:`linear-gradient(90deg,transparent,${TULSI_DEEP})`, opacity:0.75,
            }} />
            <span style={{
              fontFamily:"'Cinzel',serif", fontSize:"11px",
              letterSpacing:"4px", textTransform:"uppercase",
              color: isDark ? TULSI : TULSI_DEEP,
            }}>Official Videos</span>
            <div style={{
              width:"30px", height:"1px",
              background:`linear-gradient(90deg,${TULSI_DEEP},transparent)`, opacity:0.75,
            }} />
          </div>
          <h2 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:"clamp(38px,6vw,70px)", fontWeight:300,
            color:titleCol, lineHeight:1.1, margin:"0 0 18px",
          }}>Journey Through GEO Jainism</h2>
          <p style={{
            fontFamily:"'DM Sans',sans-serif", fontWeight:300,
            fontSize:"15px", lineHeight:"27px",
            color:bodyCol, maxWidth:"550px", margin:"0 auto",
          }}>
            A visual chronicle across ancient literature, forgotten temples,
            and the living legacy of Jain civilization — documented on the ground.
          </p>
        </div>

        {/* Chapter indicator dots */}
        <div style={{
          display:"flex", gap:"8px", justifyContent:"center", marginBottom:"18px",
        }}>
          {JOURNEY_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              aria-label={`Go to chapter ${i + 1}`}
              style={{
                width:  i === slideIdx ? "28px" : "8px",
                height: "8px", borderRadius: "4px",
                background: i === slideIdx
                  ? `linear-gradient(90deg,${LOTUS_DEEP},${TULSI_DEEP})`
                  : isDark ? "rgba(242,196,206,0.22)" : "rgba(232,144,159,0.25)",
                border:"none", cursor:"pointer", padding:0,
                transition:"all 0.4s ease",
                boxShadow: i === slideIdx ? `0 0 10px rgba(232,144,159,0.55)` : "none",
              }}
            />
          ))}
        </div>

        {/* Main carousel card */}
        <div
          ref={carouselRef}
          className="tr-main"
          style={{
            position:"relative", width:"82vw", maxWidth:"1300px",
            margin:"0 auto", perspective:"1200px",
          }}
        >
          {/* Tiltable image card */}
          <div
            style={{
              position:"relative", width:"100%", aspectRatio:"16 / 9",
              borderRadius:"20px", overflow:"hidden",
              transform:`rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transformStyle:"preserve-3d",
              transition:(tilt.x!==0||tilt.y!==0)
                ? "transform 0.09s ease-out, box-shadow 0.8s ease"
                : "transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.75s ease",
              boxShadow: cardGlow,
              cursor:"default",
            }}
            onMouseMove={onTiltMove}
            onMouseLeave={onTiltLeave}
          >
            {/* Main image — key forces remount + fade animation on slide change */}
            <img
              key={slideIdx}
              src={slide.img}
              alt={slide.title}
              loading={slideIdx === 0 ? "eager" : "lazy"}
              style={{
                width:"100%", height:"100%", objectFit:"cover", display:"block",
                animation:"trImgFade 0.55s ease both",
              }}
            />

            {/* Bottom gradient overlay */}
            <div aria-hidden="true" style={{
              position:"absolute", inset:0,
              background:"linear-gradient(180deg,transparent 28%,rgba(0,0,0,0.12) 52%,rgba(0,0,0,0.82) 100%)",
              pointerEvents:"none",
            }} />

            {/* Pastel light leak — top-left */}
            <div aria-hidden="true" style={{
              position:"absolute", top:0, left:0,
              width:"55%", height:"55%", pointerEvents:"none",
              background:"radial-gradient(ellipse at 6% 6%,rgba(242,196,206,0.20) 0%,rgba(200,223,192,0.12) 32%,transparent 65%)",
            }} />

            {/* CinemaScope top bar */}
            <div aria-hidden="true" className="tr-scope" style={{
              position:"absolute", top:0, left:0, right:0,
              height:"5.5vh", background:"#000", opacity:0.90,
              zIndex:6, pointerEvents:"none",
            }} />

            {/* Shimmer sweep — key forces re-fire on each slide */}
            <div key={`sh-${shimKey}`} aria-hidden="true" style={{
              position:"absolute", inset:0, overflow:"hidden",
              pointerEvents:"none", zIndex:7,
            }}>
              <div style={{
                position:"absolute", top:0, left:0,
                width:"30%", height:"100%",
                background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.09),transparent)",
                animation:"trShimmer 0.80s 0.1s ease-out forwards",
              }} />
            </div>

            {/* Bottom text overlay */}
            <div style={{
              position:"absolute", inset:0,
              display:"flex", flexDirection:"column", justifyContent:"flex-end",
              padding:"clamp(18px,3vw,48px) clamp(20px,4vw,54px)",
              zIndex:8,
            }}>
              {/* Chapter label */}
              <div style={{
                display:"inline-flex", alignItems:"center", gap:"8px", marginBottom:"9px",
              }}>
                <div style={{
                  width:"18px", height:"1px",
                  background:`linear-gradient(90deg,${LOTUS_DEEP},transparent)`,
                }} />
                <span style={{
                  fontFamily:"'Cinzel',serif", fontSize:"10px",
                  letterSpacing:"4px", color:LOTUS_DEEP, textTransform:"uppercase",
                }}>{slide.num}</span>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:"clamp(20px,3.2vw,44px)", fontWeight:400,
                color:"#FDF8F0", margin:"0 0 9px", lineHeight:1.2,
              }}><em>{slide.title}</em></h3>

              {/* Caption */}
              <p style={{
                fontFamily:"'DM Sans',sans-serif",
                fontSize:"clamp(11px,1.1vw,13.5px)",
                color:"rgba(253,248,240,0.70)", margin:0, lineHeight:1.7,
                maxWidth:"600px",
              }}>{slide.caption}</p>

              {/* Progress bar */}
              <div style={{
                position:"absolute", bottom:0, left:0, right:0,
                height:"3px", background:"rgba(255,255,255,0.08)",
              }}>
                <div style={{
                  height:"100%", width:`${progress * 100}%`,
                  background:`linear-gradient(90deg,${LOTUS_DEEP},${TULSI_DEEP})`,
                  boxShadow:`0 0 8px rgba(232,144,159,0.7)`,
                  transition:"none",
                }} />
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          {[
            { side:"left",  label:"Previous chapter", icon:"‹", fn:goPrev },
            { side:"right", label:"Next chapter",     icon:"›", fn:goNext },
          ].map(({ side, label, icon, fn }) => (
            <button
              key={side}
              onClick={fn}
              aria-label={label}
              style={{
                position:"absolute", top:"50%",
                [side]: "clamp(-20px,-2.8vw,-10px)",
                transform:"translateY(-50%)", zIndex:10,
                width:"48px", height:"48px", borderRadius:"50%",
                background:navBtnBg, backdropFilter:"blur(10px)",
                border:`1px solid ${navBtnBdr}`,
                color:LOTUS_DEEP, fontSize:"22px", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"background 0.3s, transform 0.3s",
                boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.40)" : "0 4px 18px rgba(61,35,20,0.12)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-50%) scale(1.10)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(-50%) scale(1)"; }}
            >{icon}</button>
          ))}
        </div>

        {/* Thumbnail strip */}
        <div style={{
          display:"flex", gap:"10px", justifyContent:"center",
          flexWrap:"wrap", marginTop:"22px",
        }}>
          {JOURNEY_SLIDES.map((s, i) => (
            <button
              key={i}
              className="tr-thumb"
              onClick={() => setSlideIdx(i)}
              aria-label={`Chapter ${i + 1}: ${s.title}`}
              style={{
                width:"64px", height:"40px", borderRadius:"6px",
                overflow:"hidden", padding:0, border:"none", cursor:"pointer",
                flexShrink:0,
                outline:       i === slideIdx ? `2px solid ${LOTUS_DEEP}` : "2px solid transparent",
                outlineOffset: "2px",
                transform:     i === slideIdx ? "scale(1.10)" : "scale(1)",
                transition:    "transform 0.3s ease, outline 0.3s ease, box-shadow 0.3s ease",
                boxShadow:     i === slideIdx
                  ? `0 4px 18px rgba(232,144,159,0.52)`
                  : "0 2px 8px rgba(0,0,0,0.18)",
              }}
            >
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                style={{
                  width:"100%", height:"100%", objectFit:"cover", display:"block",
                  filter: i === slideIdx ? "none" : "brightness(0.58) saturate(0.70)",
                  transition:"filter 0.3s ease",
                }}
              />
            </button>
          ))}
        </div>

        {/* Info panel */}
        <div style={{
          maxWidth:"680px", margin:"36px auto 0",
          padding:"0 clamp(16px,4vw,48px)",
          display:"flex", flexDirection:"column", alignItems:"center",
          textAlign:"center", gap:"16px",
        }}>
          {/* Chapter counter */}
          <div style={{
            display:"flex", alignItems:"center", gap:"7px",
            fontFamily:"'Cinzel',serif", fontSize:"11px",
            letterSpacing:"3px", textTransform:"uppercase",
          }}>
            <span style={{ color: isDark ? "rgba(240,223,180,0.42)" : "rgba(42,26,14,0.36)" }}>Chapter</span>
            <strong style={{ fontSize:"20px", letterSpacing:"1px", fontWeight:600, color:LOTUS_DEEP }}>
              {String(slideIdx + 1).padStart(2, "0")}
            </strong>
            <span style={{ color: isDark ? "rgba(240,223,180,0.30)" : "rgba(42,26,14,0.26)" }}>
              / {String(JOURNEY_SLIDES.length).padStart(2, "0")}
            </span>
          </div>

          {/* Meta badges */}
          <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", justifyContent:"center" }}>
            {[
              { strong:"23 Days", sub:"In the Field",   accent:LOTUS_DEEP, bg: isDark?"rgba(242,196,206,0.10)":"rgba(242,196,206,0.24)", bdr:"rgba(232,144,159,0.22)" },
              { strong:"4K",      sub:"Cinematic",       accent:TULSI_DEEP, bg: isDark?"rgba(200,223,192,0.10)":"rgba(200,223,192,0.28)", bdr:"rgba(125,175,110,0.22)" },
              { strong:"50+",     sub:"Ancient Sites",   accent: isDark?"#C2DDE8":"#5B8EA6", bg: isDark?"rgba(216,238,245,0.08)":"rgba(216,238,245,0.42)", bdr:"rgba(91,142,166,0.20)" },
            ].map(({ strong, sub, accent, bg: badgeBg, bdr }) => (
              <div key={strong} style={{
                display:"flex", flexDirection:"column", alignItems:"center",
                padding:"10px 22px", borderRadius:"10px",
                background:badgeBg, border:`1px solid ${bdr}`,
              }}>
                <strong style={{
                  fontFamily:"'Cinzel',serif", fontSize:"18px",
                  color:accent, letterSpacing:"1px",
                }}>{strong}</strong>
                <span style={{
                  fontFamily:"'DM Sans',sans-serif", fontSize:"11px",
                  color:bodyCol, letterSpacing:"0.8px", marginTop:"3px",
                }}>{sub}</span>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <div className="tr-btn-row" style={{ display:"flex", gap:"12px", marginTop:"4px" }}>
            <a
              href="https://www.youtube.com/@geo_jainism"
              target="_blank" rel="noreferrer"
              style={{
                display:"inline-flex", alignItems:"center", gap:"8px",
                background:`linear-gradient(135deg,${LOTUS_DEEP},${TULSI_DEEP})`,
                color:"#fff", border:"none", borderRadius:"8px",
                padding:"11px 28px",
                fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600,
                cursor:"pointer", textDecoration:"none",
                boxShadow:`0 4px 22px rgba(232,144,159,0.38), 0 4px 22px rgba(125,175,110,0.18)`,
                transition:"transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow=`0 6px 32px rgba(232,144,159,0.55),0 6px 32px rgba(125,175,110,0.28)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow=`0 4px 22px rgba(232,144,159,0.38),0 4px 22px rgba(125,175,110,0.18)`; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              View All on YouTube ↗
            </a>
            <a
              href="https://www.youtube.com/@geo_jainism"
              target="_blank" rel="noreferrer"
              style={{
                display:"inline-flex", alignItems:"center", gap:"8px",
                background:"transparent",
                color: isDark ? "#FAF0D9" : "#3D2314",
                border:`1px solid ${isDark?"rgba(250,240,217,0.22)":"rgba(61,35,20,0.22)"}`,
                borderRadius:"8px", padding:"11px 24px",
                fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:500,
                cursor:"pointer", textDecoration:"none",
                backdropFilter:"blur(6px)", transition:"border-color 0.2s",
              }}
            >
              Subscribe ↗
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
