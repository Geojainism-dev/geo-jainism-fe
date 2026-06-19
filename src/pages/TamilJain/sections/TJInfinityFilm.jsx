import React, { useState, useEffect, useRef } from "react";
import { useDarkMode } from "@/hooks";

const VIDEO_ID = "6HN19HhugzU";

/* ── Secondary palette ─────────────────────────────────────────── */
const LOTUS      = "#F2C4CE";
const LOTUS_DEEP = "#E8909F";
const TULSI      = "#C8DFC0";
const TULSI_DEEP = "#7DAF6E";
const SKY        = "#D8EEF5";

/* ── Bokeh atmospheric orbs ────────────────────────────────────── */
const BOKEH = [
  { left:"6%",  top:"15%", size:220, color:"rgba(232,144,159,0.11)", blur:55, dur:"20s", delay:"0s"   },
  { left:"70%", top:"8%",  size:160, color:"rgba(200,223,192,0.09)", blur:45, dur:"24s", delay:"-6s"  },
  { left:"15%", top:"60%", size:280, color:"rgba(216,238,245,0.08)", blur:65, dur:"28s", delay:"-9s"  },
  { left:"80%", top:"50%", size:190, color:"rgba(232,144,159,0.09)", blur:52, dur:"22s", delay:"-13s" },
  { left:"45%", top:"75%", size:130, color:"rgba(253,248,240,0.07)", blur:38, dur:"17s", delay:"-4s"  },
  { left:"30%", top:"25%", size:95,  color:"rgba(200,223,192,0.10)", blur:30, dur:"21s", delay:"-8s"  },
  { left:"60%", top:"65%", size:175, color:"rgba(216,238,245,0.07)", blur:48, dur:"25s", delay:"-15s" },
  { left:"88%", top:"20%", size:110, color:"rgba(242,196,206,0.09)", blur:35, dur:"18s", delay:"-3s"  },
];

/* ── Particles ─────────────────────────────────────────────────── */
const PCOLS = [LOTUS, LOTUS_DEEP, TULSI, SKY];
const PARTICLES = Array.from({ length: 48 }, (_, i) => ({
  left:     `${(i * 2.09) % 100}%`,
  size:     1.2 + (i % 5) * 0.8,
  delay:    `${(i * 0.46) % 20}s`,
  duration: `${12 + (i % 7) * 1.5}s`,
  color:    PCOLS[i % PCOLS.length],
  glow:     i % 4 === 0 ? "0 0 7px rgba(232,144,159,0.85),0 0 18px rgba(242,196,206,0.40)"
          : i % 4 === 1 ? "0 0 6px rgba(242,196,206,0.80),0 0 16px rgba(232,144,159,0.35)"
          : i % 4 === 2 ? "0 0 7px rgba(200,223,192,0.75),0 0 16px rgba(125,175,110,0.30)"
          :               "0 0 6px rgba(216,238,245,0.70),0 0 14px rgba(200,223,192,0.28)",
}));

const KF = `
  @keyframes tjInfBokehDrift {
    0%   { transform:translate(0px,0px)   scale(1);    }
    100% { transform:translate(22px,-28px) scale(1.09); }
  }
  @keyframes tjInfFlareGlow {
    0%,100% { opacity:0.55; }
    50%     { opacity:1.0;  }
  }
  @keyframes tjInfFlarePulse {
    0%,100% { opacity:0.30; transform:scaleX(0.90); }
    50%     { opacity:0.80; transform:scaleX(1.00); }
  }
  @keyframes tjInfPlayPulse {
    0%,100% { box-shadow:0 0 40px rgba(232,144,159,0.60),0 0 80px rgba(125,175,110,0.30); }
    50%     { box-shadow:0 0 70px rgba(232,144,159,0.85),0 0 130px rgba(125,175,110,0.50),0 0 200px rgba(232,144,159,0.22); }
  }
  @keyframes tjInfRipple {
    0%   { transform:translate(-50%,-50%) scale(0.85); opacity:0.85; }
    100% { transform:translate(-50%,-50%) scale(1.70); opacity:0; }
  }
  @keyframes tjInfShimmer {
    0%   { transform:translateX(-160%) skewX(-15deg); }
    100% { transform:translateX(440%)  skewX(-15deg); }
  }
  @keyframes tjInfRise {
    0%   { transform:translateY(0)   scale(1);   opacity:0; }
    8%   { opacity:0.9; }
    88%  { opacity:0.55; }
    100% { transform:translateY(-110vh) scale(0.6); opacity:0; }
  }
  @keyframes tjInfFadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes tjInfBandSlide {
    from { opacity:0; transform:translateY(-100%); }
    to   { opacity:1; transform:translateY(0); }
  }
  #tj-infinity-film {
    transition:opacity 0.9s ease, transform 0.9s ease;
    height: 100vh;
    height: 100svh;
  }
  @media (max-width: 768px) {
    /* Full cinematic height on mobile */
    #tj-infinity-film {
      height: 100svh !important;
      min-height: 380px !important;
    }
    /* Thumbnail fully visible — no cropping, black bars fill the rest */
    #tj-infinity-film .if-thumb {
      object-fit: contain !important;
      background: #000;
    }
    /* Thinner bars on mobile */
    #tj-infinity-film .if-cinemascope { height:3vh !important; }
    /* Hide cluttered bottom strip — play button is enough on mobile */
    #tj-infinity-film .if-bottom-strip { display:none !important; }
    /* Hide marquee on mobile — too crowded */
    #tj-infinity-film .if-marquee { display:none !important; }
    /* Stack buttons if somehow shown */
    #tj-infinity-film .if-btn-row { flex-direction:column !important; align-items:stretch; }
  }
  @media (max-width: 480px) {
    #tj-infinity-film .if-bokeh-lg { display:none; }
  }
`;

export default function TJInfinityFilm() {
  const isDark = useDarkMode();

  const [isPlaying, setIsPlaying] = useState(false);
  const [imgError,  setImgError]  = useState(false);
  const [revealed,  setRevealed]  = useState(false);
  const sectionRef = useRef(null);

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

  const handlePlay = () => setIsPlaying(true);

  const thumb = imgError
    ? `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`
    : `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

  /* Overlay fades out entirely when playing */
  const overlayStyle = {
    opacity:        isPlaying ? 0 : 1,
    pointerEvents:  isPlaying ? "none" : "auto",
    transition:     "opacity 1.2s ease",
  };

  return (
    <section
      id="tj-infinity-film"
      ref={sectionRef}
      style={{
        position:"relative", overflow:"hidden",
        width:"100%", height:"100vh", minHeight:"100svh",
        opacity:   revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(40px)",
      }}
    >
      <style>{KF}</style>

      {/* ══════════════════════════════════════════════════════════
          [z=1]  FULL-BLEED VIDEO / THUMBNAIL
      ══════════════════════════════════════════════════════════ */}
      <div style={{ position:"absolute", inset:0, zIndex:1, background:"#000" }}>
        {isPlaying ? (
          /* Cover-fit iframe — standard 16:9 cover technique */
          <iframe
            src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&controls=1`}
            title="GEO Jainism — The Untold Story"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position:"absolute",
              top:"50%", left:"50%",
              transform:"translate(-50%,-50%)",
              width:"100vw", height:"56.25vw",   /* fill width first */
              minHeight:"100vh",                  /* fill height if portrait */
              minWidth:"177.78vh",                /* fill width if tall viewport */
              border:"none",
            }}
          />
        ) : (
          <img
            src={thumb}
            alt="GEO Jainism — The Untold Story"
            loading="eager"
            className="if-thumb"
            onError={() => setImgError(true)}
            style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center center", display:"block" }}
          />
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
          [z=2]  CINEMASCOPE BARS — always visible
      ══════════════════════════════════════════════════════════ */}
      <div aria-hidden="true" className="if-cinemascope" style={{
        position:"absolute", top:0, left:0, right:0,
        height:"6vh", background:"#000", zIndex:2, pointerEvents:"none",
      }} />
      <div aria-hidden="true" className="if-cinemascope" style={{
        position:"absolute", bottom:0, left:0, right:0,
        height:"6vh", background:"#000", zIndex:2, pointerEvents:"none",
      }} />

      {/* ══════════════════════════════════════════════════════════
          [z=2.5]  SECTION ENTRY TRANSITION — dark fade from top
          Blends smoothly from whatever section precedes this one
      ══════════════════════════════════════════════════════════ */}
      <div aria-hidden="true" style={{
        position:"absolute", top:0, left:0, right:0, zIndex:3, pointerEvents:"none",
        height:"28%",
        background:"linear-gradient(180deg,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.40) 50%,transparent 100%)",
      }} />

      {/* ══════════════════════════════════════════════════════════
          [z=3]  CINEMATIC VIGNETTE — strong dark frame
      ══════════════════════════════════════════════════════════ */}
      <div aria-hidden="true" style={{
        position:"absolute", inset:0, zIndex:4, pointerEvents:"none",
        background:"radial-gradient(ellipse 80% 75% at 50% 50%, transparent 25%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0.88) 100%)",
      }} />

      {/* ══════════════════════════════════════════════════════════
          [z=5]  FILM GRAIN
      ══════════════════════════════════════════════════════════ */}
      <div aria-hidden="true" style={{
        position:"absolute", inset:0, zIndex:5, pointerEvents:"none",
        opacity:0.06,
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='9'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.65 0 0 0 0 0.4 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize:"200px 200px",
      }} />

      {/* ══════════════════════════════════════════════════════════
          [z=5]  PARTICLES
      ══════════════════════════════════════════════════════════ */}
      <div aria-hidden="true" style={{
        position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:5,
        ...overlayStyle,
      }}>
        {PARTICLES.map((p, i) => (
          <span key={i} style={{
            position:"absolute", bottom:"-8px", left:p.left,
            width:p.size+"px", height:p.size+"px", borderRadius:"50%",
            background:p.color, opacity:0, boxShadow:p.glow,
            animation:`tjInfRise ${p.duration} ${p.delay} linear infinite`,
          }} />
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          [z=6]  CINEMATIC ATMOSPHERE — bokeh + anamorphic flare
      ══════════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        style={{
          position:"absolute", inset:0, zIndex:6, pointerEvents:"none",
          opacity: isPlaying ? 0 : 1,
          transition:"opacity 1.8s ease",
        }}
      >
        {/* Bokeh — soft atmospheric orbs drifting slowly */}
        {BOKEH.map((b, i) => (
          <div
            key={i}
            className={b.size > 160 ? "if-bokeh-lg" : undefined}
            style={{
              position:"absolute", left:b.left, top:b.top,
              width:b.size+"px", height:b.size+"px", borderRadius:"50%",
              background:`radial-gradient(circle, ${b.color} 0%, transparent 68%)`,
              filter:`blur(${b.blur}px)`,
              animation:`tjInfBokehDrift ${b.dur} ${b.delay} ease-in-out infinite alternate`,
            }}
          />
        ))}

        {/* Anamorphic lens flare — the iconic horizontal cinema streak */}
        <div style={{
          position:"absolute", top:"50%", left:0, right:0,
          transform:"translateY(-50%)",
        }}>
          {/* Soft glow halo */}
          <div style={{
            position:"absolute", top:"-14px", left:"8%", right:"8%", height:"30px",
            background:`linear-gradient(90deg,transparent,rgba(232,144,159,0.07) 20%,rgba(253,248,240,0.13) 50%,rgba(200,223,192,0.07) 80%,transparent)`,
            filter:"blur(8px)",
            animation:"tjInfFlareGlow 4s ease-in-out infinite",
          }} />
          {/* Main streak — lotus to cream to tulsi */}
          <div style={{
            position:"absolute", top:"-1px", left:"4%", right:"4%", height:"2px",
            background:`linear-gradient(90deg,transparent,rgba(232,144,159,0.50) 18%,rgba(253,248,240,0.90) 50%,rgba(200,223,192,0.50) 82%,transparent)`,
            boxShadow:"0 0 10px rgba(232,144,159,0.35), 0 0 28px rgba(253,248,240,0.18)",
            animation:"tjInfFlarePulse 4s ease-in-out infinite",
          }} />
          {/* Hair-line above */}
          <div style={{
            position:"absolute", top:"-4px", left:"18%", right:"18%", height:"1px",
            background:`linear-gradient(90deg,transparent,rgba(253,248,240,0.28) 40%,rgba(253,248,240,0.45) 50%,rgba(253,248,240,0.28) 60%,transparent)`,
            animation:"tjInfFlarePulse 4s 0.6s ease-in-out infinite",
          }} />
          {/* Hair-line below */}
          <div style={{
            position:"absolute", top:"4px", left:"22%", right:"22%", height:"1px",
            background:`linear-gradient(90deg,transparent,rgba(200,223,192,0.22) 40%,rgba(200,223,192,0.38) 50%,rgba(200,223,192,0.22) 60%,transparent)`,
            animation:"tjInfFlarePulse 4s 1.2s ease-in-out infinite",
          }} />
          {/* Center lens spot */}
          <div style={{
            position:"absolute", top:"-5px", left:"50%",
            transform:"translateX(-50%)",
            width:"18px", height:"12px",
            background:"radial-gradient(ellipse,rgba(253,248,240,0.55) 0%,transparent 100%)",
            filter:"blur(3px)",
            animation:"tjInfFlareGlow 4s 0.3s ease-in-out infinite",
          }} />
        </div>

        {/* Corner light leaks */}
        <div style={{
          position:"absolute", top:0, left:0, width:"40%", height:"40%",
          background:"radial-gradient(ellipse at 0% 0%,rgba(232,144,159,0.13) 0%,transparent 65%)",
          filter:"blur(22px)",
        }} />
        <div style={{
          position:"absolute", bottom:0, right:0, width:"38%", height:"38%",
          background:"radial-gradient(ellipse at 100% 100%,rgba(200,223,192,0.11) 0%,transparent 65%)",
          filter:"blur(20px)",
        }} />
        <div style={{
          position:"absolute", top:0, right:0, width:"28%", height:"28%",
          background:"radial-gradient(ellipse at 100% 0%,rgba(216,238,245,0.09) 0%,transparent 65%)",
          filter:"blur(18px)",
        }} />
      </div>

      {/* ══════════════════════════════════════════════════════════
          [z=7]  LIGHT LEAK — top-left pastel
      ══════════════════════════════════════════════════════════ */}
      <div aria-hidden="true" style={{
        position:"absolute", top:0, left:0, zIndex:7,
        width:"55%", height:"55%", pointerEvents:"none",
        background:"radial-gradient(ellipse at 5% 5%, rgba(232,144,159,0.14) 0%, rgba(200,223,192,0.08) 35%, transparent 65%)",
        ...overlayStyle,
      }} />

      {/* ══════════════════════════════════════════════════════════
          [z=8]  SHIMMER on reveal
      ══════════════════════════════════════════════════════════ */}
      <div key={`sh-${revealed}`} aria-hidden="true" style={{
        position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:8,
      }}>
        <div style={{
          position:"absolute", top:0, left:0, width:"30%", height:"100%",
          background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",
          animation: revealed ? "tjInfShimmer 1s 0.4s ease-out forwards" : "none",
        }} />
      </div>

      {/* ══════════════════════════════════════════════════════════
          [z=9]  TOP MARQUEE BAND
      ══════════════════════════════════════════════════════════ */}
      <div className="if-marquee" style={{
        position:"absolute", top:0, left:0, right:0, zIndex:9,
        padding:"14px 0",
        borderBottom:"1px solid rgba(232,144,159,0.22)",
        background:"linear-gradient(180deg,rgba(0,0,0,0.55),transparent)",
        backdropFilter:"blur(4px)",
        display:"flex", alignItems:"center", justifyContent:"center",
        gap:"clamp(10px,2.5vw,36px)",
        animation: revealed ? "tjInfBandSlide 0.8s 0.2s ease both" : "none",
        ...overlayStyle,
      }}>
        <div style={{ display:"flex", gap:"5px", alignItems:"center" }}>
          {[10,22,10].map((w, i) => (
            <div key={i} style={{
              width:w+"px", height:"1px",
              background:`linear-gradient(90deg,transparent,${LOTUS_DEEP},transparent)`,
              opacity:0.65,
            }} />
          ))}
        </div>
        <span style={{
          fontFamily:"'Cinzel',serif", fontSize:"clamp(9px,1.3vw,12px)",
          letterSpacing:"clamp(4px,1vw,7px)", fontWeight:600,
          color:LOTUS, textTransform:"uppercase", whiteSpace:"nowrap",
        }}>GEO Originals</span>
        <span style={{
          width:"5px", height:"5px", borderRadius:"50%",
          background:`linear-gradient(135deg,${LOTUS_DEEP},${TULSI_DEEP})`,
          display:"inline-block",
        }} />
        <span style={{
          fontFamily:"'Playfair Display',serif", fontSize:"clamp(11px,1.6vw,16px)",
          fontStyle:"italic", color:TULSI, whiteSpace:"nowrap", letterSpacing:"2px",
        }}>A Cinematic Journey</span>
        <span style={{
          width:"5px", height:"5px", borderRadius:"50%",
          background:`linear-gradient(135deg,${TULSI_DEEP},${LOTUS_DEEP})`,
          display:"inline-block",
        }} />
        <span style={{
          fontFamily:"'Cinzel',serif", fontSize:"clamp(9px,1.3vw,12px)",
          letterSpacing:"clamp(4px,1vw,7px)", fontWeight:600,
          color:TULSI, textTransform:"uppercase", whiteSpace:"nowrap",
        }}>Sacred Heritage</span>
        <div style={{ display:"flex", gap:"5px", alignItems:"center" }}>
          {[10,22,10].map((w, i) => (
            <div key={i} style={{
              width:w+"px", height:"1px",
              background:`linear-gradient(90deg,transparent,${LOTUS_DEEP},transparent)`,
              opacity:0.65,
            }} />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          [z=10]  CENTER PLAY OVERLAY
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        position:"absolute", inset:0, zIndex:10,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        ...overlayStyle,
      }}>
        {/* Ghost ∞ watermark */}
        <div aria-hidden="true" style={{
          position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          fontFamily:"'Playfair Display',serif", fontSize:"clamp(100px,20vw,320px)",
          fontWeight:700, lineHeight:1,
          color:"rgba(232,144,159,0.06)",
          userSelect:"none", pointerEvents:"none", whiteSpace:"nowrap",
        }}>∞</div>

        {/* Play button */}
        <div
          style={{
            position:"relative", marginBottom:"20px",
            animation: revealed ? "tjInfFadeUp 0.8s 0.7s ease both" : "none",
          }}
        >
          {/* Ripple 1 */}
          <div aria-hidden="true" style={{
            position:"absolute", width:"116px", height:"116px", borderRadius:"50%",
            border:`1px solid rgba(232,144,159,0.52)`, top:"50%", left:"50%",
            animation:"tjInfRipple 2.4s ease-out infinite", pointerEvents:"none",
          }} />
          {/* Ripple 2 */}
          <div aria-hidden="true" style={{
            position:"absolute", width:"150px", height:"150px", borderRadius:"50%",
            border:`1px solid rgba(200,223,192,0.35)`, top:"50%", left:"50%",
            animation:"tjInfRipple 2.4s 0.65s ease-out infinite", pointerEvents:"none",
          }} />
          {/* Ripple 3 */}
          <div aria-hidden="true" style={{
            position:"absolute", width:"184px", height:"184px", borderRadius:"50%",
            border:`1px solid rgba(216,238,245,0.20)`, top:"50%", left:"50%",
            animation:"tjInfRipple 2.4s 1.3s ease-out infinite", pointerEvents:"none",
          }} />
          {/* Button */}
          <button
            onClick={handlePlay}
            aria-label="Play The Untold Story"
            style={{
              width:"84px", height:"84px", borderRadius:"50%",
              background:`linear-gradient(135deg,${LOTUS_DEEP},${TULSI_DEEP})`,
              border:"2px solid rgba(255,255,255,0.35)",
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer",
              boxShadow:"0 0 50px rgba(232,144,159,0.60), 0 0 100px rgba(125,175,110,0.32)",
              animation:"tjInfPlayPulse 2.4s ease-in-out infinite",
              position:"relative", zIndex:1,
              transition:"transform 0.25s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="scale(1.10)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>

        {/* Micro-copy + mobile title block */}
        <p style={{
          fontFamily:"'Cinzel',serif", fontSize:"10px",
          letterSpacing:"4px", textTransform:"uppercase",
          color:"rgba(253,248,240,0.45)", margin:"0 0 28px",
          animation: revealed ? "tjInfFadeUp 0.8s 0.85s ease both" : "none",
        }}>Click to experience</p>

        {/* Mobile-only title (desktop shows it in the bottom strip instead) */}
        <div style={{
          textAlign:"center",
          animation: revealed ? "tjInfFadeUp 0.8s 0.95s ease both" : "none",
        }}>
          <p style={{
            fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
            fontSize:"clamp(22px,5.5vw,32px)", fontWeight:300,
            color:"rgba(253,248,240,0.82)", margin:"0 0 6px",
            textShadow:"0 2px 24px rgba(0,0,0,0.8)",
            letterSpacing:"0.5px",
          }}>The Untold Story</p>
          <p style={{
            fontFamily:"'DM Sans',sans-serif",
            fontSize:"11px", letterSpacing:"3px",
            color:"rgba(232,144,159,0.70)", margin:0, textTransform:"uppercase",
          }}>GEO Originals · Documentary</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          [z=11]  BOTTOM INFO STRIP
      ══════════════════════════════════════════════════════════ */}
      <div className="if-bottom-strip" style={{
        position:"absolute", bottom:"8px", left:0, right:0, zIndex:11,
        padding:"0 clamp(12px,4vw,60px) 10px",
        display:"flex", alignItems:"flex-end", justifyContent:"space-between",
        gap:"12px", flexWrap:"wrap",
        ...overlayStyle,
      }}>
        {/* Left — title + meta */}
        <div style={{ animation: revealed ? "tjInfFadeUp 0.8s 0.9s ease both" : "none" }}>
          <div style={{
            display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px",
          }}>
            <div style={{
              width:"18px", height:"1.5px",
              background:`linear-gradient(90deg,${LOTUS_DEEP},transparent)`,
            }} />
            <span style={{
              fontFamily:"'Cinzel',serif", fontSize:"9px",
              letterSpacing:"3px", color:LOTUS_DEEP, textTransform:"uppercase",
            }}>Exclusive Documentary</span>
          </div>
          <h3 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:"clamp(18px,2.2vw,28px)", fontWeight:400,
            color:"#FDF8F0", margin:"0 0 8px", lineHeight:1.2,
            textShadow:"0 2px 20px rgba(0,0,0,0.8)",
          }}><em>The Untold Story of Jainism</em></h3>
          <div style={{
            display:"flex", gap:"8px", alignItems:"center",
            fontFamily:"'DM Sans',sans-serif", fontSize:"12px",
            color:"rgba(253,248,240,0.55)",
          }}>
            {["Untold","Sacred","Heritage"].map((tag, idx, arr) => (
              <React.Fragment key={tag}>
                <span>{tag}</span>
                {idx < arr.length - 1 && <span style={{ opacity:0.4 }}>·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right — buttons */}
        <div
          className="if-btn-row"
          style={{
            display:"flex", gap:"10px",
            animation: revealed ? "tjInfFadeUp 0.8s 1s ease both" : "none",
          }}
        >
          <button
            onClick={handlePlay}
            style={{
              display:"flex", alignItems:"center", gap:"8px",
              background:`linear-gradient(135deg,${LOTUS_DEEP},${TULSI_DEEP})`,
              color:"#fff", border:"none", borderRadius:"6px", padding:"10px 22px",
              fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:600,
              cursor:"pointer",
              boxShadow:`0 4px 24px rgba(232,144,159,0.45), 0 4px 24px rgba(125,175,110,0.20)`,
              transition:"transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="scale(1.05)"; e.currentTarget.style.boxShadow=`0 6px 30px rgba(232,144,159,0.65),0 6px 30px rgba(125,175,110,0.30)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform="scale(1)";    e.currentTarget.style.boxShadow=`0 4px 24px rgba(232,144,159,0.45),0 4px 24px rgba(125,175,110,0.20)`; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Play Now
          </button>
          <a
            href="https://www.youtube.com/@geo_jainism"
            target="_blank" rel="noreferrer"
            style={{
              display:"flex", alignItems:"center", gap:"8px",
              background:"rgba(0,0,0,0.35)",
              color:"rgba(253,248,240,0.85)",
              border:"1px solid rgba(253,248,240,0.22)",
              borderRadius:"6px", padding:"10px 22px",
              fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:500,
              cursor:"pointer", textDecoration:"none",
              backdropFilter:"blur(10px)",
              transition:"border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(232,144,159,0.50)"; e.currentTarget.style.background="rgba(0,0,0,0.50)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(253,248,240,0.22)"; e.currentTarget.style.background="rgba(0,0,0,0.35)"; }}
          >
            View Channel ↗
          </a>
        </div>
      </div>

    </section>
  );
}
