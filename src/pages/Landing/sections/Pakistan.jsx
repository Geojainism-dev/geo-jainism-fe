import React, { useState, useEffect, useRef } from "react";
import { useDarkMode } from "@/hooks";

const ACCENT = "#E8909F"; // lotus deep — replaces legacy crimson

const VIDEO_IDS = [
  "v7oNV3fJ4yo",
  "8KghuPYq7iE",
  "aE6DCVRvlNo",
  "cbup7K6nTYs",
  "_gwpaF_8rRw",
  "p9pFoMZZqFA",
  "-QJnSJE58vg",
  "dMaBnEExY_o",
  "oPqgz8qNQug",
  "WLecysbMGAs",
];

const PARTICLE_COLORS = ["#E8909F", "#F2C4CE", "#7DAF6E", "#F4A535"];
const PARTICLES = Array.from({ length: 36 }, (_, i) => ({
  left:     `${(i * 2.78) % 100}%`,
  size:     1.5 + (i % 4),
  delay:    `${(i * 0.52) % 20}s`,
  duration: `${10 + (i % 7) * 1.6}s`,
  color:    PARTICLE_COLORS[i % PARTICLE_COLORS.length],
  glow:     i % 4 === 0 ? "0 0 8px rgba(232,144,159,0.9),0 0 20px rgba(242,196,206,0.45)"
          : i % 4 === 1 ? "0 0 8px rgba(242,196,206,0.9),0 0 18px rgba(232,144,159,0.40)"
          : i % 4 === 2 ? "0 0 7px rgba(244,165,53,0.85),0 0 16px rgba(247,213,128,0.40)"
          :               "0 0 7px rgba(232,144,159,0.8),0 0 15px rgba(242,196,206,0.35)",
}));

const CARD_W = 62;
const STEP   = 30;

export default function Pakistan() {
  const isDark       = useDarkMode();
  const carouselRef  = useRef(null);
  const playingIdRef = useRef(null);

  const [slideIdx,  setSlideIdx]  = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const [imgErrors, setImgErrors] = useState({});
  const [progress,  setProgress]  = useState(0);
  const [tilt,      setTilt]      = useState({ x: 0, y: 0 });

  useEffect(() => { playingIdRef.current = playingId; }, [playingId]);

  /* Auto-advance — pauses when video is playing */
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let interval;
    let paused = false;

    const start = () => {
      stop();
      interval = setInterval(() => {
        if (!paused && !playingIdRef.current) setSlideIdx(i => (i + 1) % VIDEO_IDS.length);
      }, 6000);
    };
    const stop = () => { if (interval) clearInterval(interval); };

    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) start(); else stop(); },
      { threshold: 0.25 }
    );
    io.observe(el);

    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      stop(); io.disconnect();
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* Stop video on slide change */
  useEffect(() => { setPlayingId(null); }, [slideIdx]);

  /* Progress bar — fills over 6s, resets on slide change or play */
  useEffect(() => {
    if (playingId) { setProgress(0); return; }
    setProgress(0);
    const start = Date.now();
    const DURATION = 6000;
    let rafId;
    const tick = () => {
      const p = Math.min((Date.now() - start) / DURATION, 1);
      setProgress(p);
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [slideIdx, playingId]);

  const goPrev = () => setSlideIdx(i => (i - 1 + VIDEO_IDS.length) % VIDEO_IDS.length);
  const goNext = () => setSlideIdx(i => (i + 1) % VIDEO_IDS.length);

  /* 3D tilt handlers */
  const handleTiltMove = (e) => {
    if (playingId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
    const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
    setTilt({ x: dy * -8, y: dx * 8 });
  };
  const handleTiltLeave = () => setTilt({ x: 0, y: 0 });

  /* Colour tokens */
  const bg      = isDark
    ? "linear-gradient(145deg,#060D08 0%,#091209 45%,#080D06 100%)"
    : "linear-gradient(145deg,#F5EBD8 0%,#FDF8F0 48%,#F2C4CE 100%)";
  const bandBg  = isDark ? "rgba(232,144,159,0.06)"  : "rgba(232,144,159,0.08)";
  const bandBdr = isDark ? "rgba(232,144,159,0.20)"  : "rgba(232,144,159,0.28)";
  const titleCol = isDark ? "#FAF0D9" : "#3D2314";
  const bodyCol  = isDark ? "rgba(240,223,180,0.70)" : "rgba(42,26,14,0.65)";

  /* Coverflow card style */
  const getCardStyle = (i) => {
    const offset = i - slideIdx;
    const abs    = Math.abs(offset);
    if (abs > 2) return {
      position: "absolute", left: "50%", top: "50%",
      opacity: 0, pointerEvents: "none", zIndex: 0,
      width: `${CARD_W}%`, aspectRatio: "16/9",
    };

    const xPct   = ((offset * STEP) / CARD_W * 100).toFixed(1);
    const scale  = [1,    0.83, 0.67][abs];
    const opacity= [1,    0.60, 0.30][abs];
    const blur   = [0,    2,    4   ][abs];
    const zIndex = [5,    4,    3   ][abs];

    const baseTx = `translate(calc(-50% + ${xPct}%), -50%) scale(${scale})`;
    const transform = abs === 0
      ? `translate(calc(-50% + ${xPct}%), -50%) scale(${scale}) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
      : baseTx;

    return {
      position: "absolute", left: "50%", top: "50%",
      width: `${CARD_W}%`, aspectRatio: "16/9",
      borderRadius: abs === 0 ? "14px" : "10px",
      overflow: "hidden",
      transform,
      transformStyle: "preserve-3d",
      opacity,
      filter: blur ? `blur(${blur}px)` : "none",
      zIndex,
      boxShadow: abs === 0
        ? "0 24px 80px rgba(232,144,159,0.28), 0 8px 32px rgba(0,0,0,0.55)"
        : "0 8px 20px rgba(0,0,0,0.30)",
      transition: abs === 0 && (tilt.x !== 0 || tilt.y !== 0)
        ? "transform 0.08s ease-out, opacity 0.65s ease, filter 0.65s ease, box-shadow 0.65s ease"
        : "transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.65s ease, filter 0.65s ease, box-shadow 0.65s ease",
      cursor: "pointer",
    };
  };

  const navBtnStyle = (side) => ({
    position: "absolute", top: "50%", [side]: "clamp(8px,2vw,24px)",
    transform: "translateY(-50%)", zIndex: 10,
    width: "48px", height: "48px", borderRadius: "50%",
    background: "rgba(232,144,159,0.20)", backdropFilter: "blur(8px)",
    border: "1px solid rgba(232,144,159,0.45)", color: ACCENT,
    fontSize: "22px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.3s",
  });

  return (
    <section
      id="pakistan"
      className="reveal"
      style={{ background: bg, padding: "0 0 96px", position: "relative", overflow: "hidden", transition: "background 0.5s ease" }}
    >
      <style>{`
        #pakistan .journey-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(232,144,159,0.30); }
        #pakistan .journey-dot.active { width: 8px; height: 8px; border-radius: 50%; background: #E8909F; box-shadow: 0 0 10px rgba(232,144,159,0.7); }
        @keyframes cf-shimmer {
          0%   { transform: translateX(-150%) skewX(-15deg); }
          100% { transform: translateX(400%) skewX(-15deg); }
        }
        @media (max-width: 640px) {
          #pakistan .cf-wrap { height: clamp(160px, 46vw, 320px) !important; }
        }
      `}</style>

      {/* ── Marquee band ── */}
      <div style={{
        width: "100%",
        borderTop: `1px solid ${bandBdr}`, borderBottom: `1px solid ${bandBdr}`,
        background: bandBg, padding: "18px 0",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "clamp(12px,3vw,40px)", marginBottom: "80px",
        backdropFilter: "blur(6px)",
      }}>
        <div style={{ display: "flex", gap: "6px", opacity: 0.35 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ width: 8, height: 14, borderRadius: 2, background: ACCENT, opacity: 0.75 }} />
          ))}
        </div>
        <span style={{
          fontFamily: "'Cinzel', serif", fontSize: "clamp(10px,1.6vw,14px)",
          letterSpacing: "clamp(4px,1vw,8px)", fontWeight: 600,
          color: isDark ? ACCENT : "#C0607A", textTransform: "uppercase", whiteSpace: "nowrap",
        }}>Field Research</span>
        <span style={{ color: isDark ? "rgba(232,144,159,0.40)" : "rgba(192,96,122,0.38)", fontSize: 18 }}>✦</span>
        <span style={{
          fontFamily: "'Playfair Display', serif", fontSize: "clamp(12px,1.8vw,17px)",
          fontStyle: "italic", color: "#F4A535", whiteSpace: "nowrap", letterSpacing: "2px",
        }}>On Camera</span>
        <div style={{ display: "flex", gap: "6px", opacity: 0.35 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ width: 8, height: 14, borderRadius: 2, background: ACCENT, opacity: 0.75 }} />
          ))}
        </div>
      </div>

      {/* ── Atmospheric glows ── */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "45%", left: "30%", transform: "translate(-50%,-50%)",
        width: "600px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(ellipse,rgba(232,144,159,0.09) 0%,transparent 65%)",
        pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", top: "55%", left: "70%", transform: "translate(-50%,-50%)",
        width: "500px", height: "450px", borderRadius: "50%",
        background: "radial-gradient(ellipse,rgba(244,165,53,0.07) 0%,transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* ── Ghost text ── */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "52%", left: "50%", transform: "translate(-50%,-50%)",
        fontFamily: "'Playfair Display',serif", fontSize: "clamp(80px,16vw,240px)",
        fontWeight: 700, lineHeight: 1,
        color: isDark ? "rgba(232,144,159,0.04)" : "rgba(42,26,14,0.028)",
        letterSpacing: "-4px", userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap",
      }}>GEO</div>

      {/* ── Film grain ── */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, opacity: isDark ? 0.055 : 0.025,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='9'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.65 0 0 0 0 0.4 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "200px 200px", pointerEvents: "none",
      }} />

      {/* ── Particles ── */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
        {PARTICLES.map((p, i) => (
          <span key={i} style={{
            position: "absolute", bottom: "-8px", left: p.left,
            width: p.size + "px", height: p.size + "px", borderRadius: "50%",
            background: p.color, opacity: 0, boxShadow: p.glow,
            animation: `gpRise ${p.duration} ${p.delay} linear infinite`,
          }} />
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ position: "relative", zIndex: 2 }}>

        {/* Header — extra bottom margin for breathing room */}
        <div className="journey-header" style={{ marginBottom: "64px" }}>
          <div className="section-sub" style={{ color: ACCENT }}>GEO Jainism</div>
          <h2 className="section-title" style={{ color: titleCol }}>Documenting the Untold</h2>
          <p className="journey-sub-desc" style={{ color: bodyCol }}>
            Ancient sites. Forgotten histories. On-ground journeys across India and beyond —
            GEO Jainism brings untold Jain stories to the world, one documentary at a time.
          </p>
        </div>

        {/* ── Coverflow carousel ── */}
        <div
          ref={carouselRef}
          className="cf-wrap"
          style={{ position: "relative", width: "100%", height: "clamp(200px, 35vw, 800px)", margin: "48px auto 0", perspective: "1200px" }}
        >
          {VIDEO_IDS.map((id, i) => {
            const isCenter = i === slideIdx;
            const thumb = imgErrors[id]
              ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
              : `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

            return (
              <div
                key={id}
                style={getCardStyle(i)}
                onClick={() => {
                  if (!isCenter) { setSlideIdx(i); return; }
                  if (playingId !== id) setPlayingId(id);
                }}
                onMouseMove={isCenter ? handleTiltMove : undefined}
                onMouseLeave={isCenter ? handleTiltLeave : undefined}
              >
                {isCenter && playingId === id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
                    title="GEO Jainism"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                  />
                ) : (
                  <>
                    <img
                      src={thumb}
                      alt={`GEO Jainism — Video ${i + 1}`}
                      loading={i === 0 ? "eager" : "lazy"}
                      onError={() => setImgErrors(prev => ({ ...prev, [id]: true }))}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />

                    {isCenter && (
                      <>
                        {/* Dark overlay + metadata */}
                        <div style={{
                          position: "absolute", inset: 0,
                          background: "linear-gradient(180deg,transparent 35%,rgba(4,10,4,0.5) 65%,rgba(4,10,4,0.92) 100%)",
                          display: "flex", flexDirection: "column", justifyContent: "flex-end",
                          padding: "clamp(20px,3vw,48px) clamp(20px,4vw,54px)",
                        }}>
                          <div style={{ fontFamily: "'Cinzel',serif", fontSize: "11px", letterSpacing: "4px", color: ACCENT, textTransform: "uppercase", marginBottom: "10px" }}>
                            Video {String(i + 1).padStart(2, "0")}
                          </div>
                          <div style={{
                            width: "60px", height: "60px", borderRadius: "50%",
                            background: "rgba(232,144,159,0.80)", backdropFilter: "blur(6px)",
                            border: "2px solid rgba(255,255,255,0.25)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            marginBottom: "16px",
                            boxShadow: "0 0 32px rgba(232,144,159,0.6)",
                          }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(20px,2.8vw,38px)", fontWeight: 400, color: "#FDF8F0", margin: 0, lineHeight: 1.2 }}>
                            <em>GEO Jainism Originals</em>
                          </h3>
                          <p style={{ fontSize: "13px", color: "rgba(253,248,240,0.7)", marginTop: "8px" }}>Click to play</p>

                          {/* Progress bar */}
                          <div style={{
                            position: "absolute", bottom: 0, left: 0, right: 0,
                            height: "3px", background: "rgba(255,255,255,0.08)",
                          }}>
                            <div style={{
                              height: "100%", width: `${progress * 100}%`,
                              background: `linear-gradient(90deg, ${ACCENT}, #F2C4CE)`,
                              boxShadow: "0 0 8px rgba(232,144,159,0.8)",
                              transition: "none",
                            }} />
                          </div>
                        </div>

                        {/* Shimmer sweep — key forces remount on each new slide */}
                        <div key={`shimmer-${slideIdx}`} aria-hidden="true" style={{
                          position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 7,
                        }}>
                          <div style={{
                            position: "absolute", top: 0, left: 0,
                            width: "35%", height: "100%",
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",
                            animation: "cf-shimmer 0.75s ease-out forwards",
                          }} />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })}

          <button onClick={goPrev} aria-label="Previous" style={navBtnStyle("left")}>‹</button>
          <button onClick={goNext} aria-label="Next"     style={navBtnStyle("right")}>›</button>
        </div>

        {/* ── Netflix info panel ── */}
        <div style={{
          maxWidth: "720px", margin: "40px auto 0",
          padding: "0 clamp(16px,4vw,48px)",
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", gap: "14px",
        }}>
          {/* GEO Originals badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: ACCENT, color: "#fff",
            padding: "5px 14px", borderRadius: "4px",
            fontFamily: "'Cinzel',serif", fontSize: "10px",
            letterSpacing: "3px", fontWeight: 700, textTransform: "uppercase",
          }}>
            GEO Originals
          </div>

          {/* Video counter */}
          <p style={{
            fontFamily: "'Cinzel',serif", fontSize: "11px",
            letterSpacing: "4px", textTransform: "uppercase",
            color: isDark ? "rgba(220,180,170,0.55)" : "rgba(42,26,14,0.42)",
            margin: 0,
          }}>
            Video{" "}
            <strong style={{ color: isDark ? "#FAF0D9" : "#3D2314" }}>
              {String(slideIdx + 1).padStart(2, "0")}
            </strong>
            {" "}of {VIDEO_IDS.length}
          </p>

          {/* Genre tags */}
          <div style={{
            display: "flex", gap: "10px", alignItems: "center",
            fontFamily: "'DM Sans',sans-serif", fontSize: "12px",
            color: isDark ? "rgba(240,223,180,0.50)" : "rgba(42,26,14,0.45)",
          }}>
            {["Untold", "Ancient", "Sacred"].map((tag, idx, arr) => (
              <React.Fragment key={tag}>
                <span>{tag}</span>
                {idx < arr.length - 1 && <span style={{ opacity: 0.4 }}>·</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
            <button
              onClick={() => setPlayingId(VIDEO_IDS[slideIdx])}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: ACCENT, color: "#fff",
                border: "none", borderRadius: "6px",
                padding: "10px 24px",
                fontFamily: "'DM Sans',sans-serif", fontSize: "14px", fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(232,144,159,0.45)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(232,144,159,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = "0 4px 20px rgba(232,144,159,0.45)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              Play Now
            </button>

            <a
              href="https://www.youtube.com/@geo_jainism"
              target="_blank" rel="noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "transparent",
                color: isDark ? "#FAF0D9" : "#3D2314",
                border: `1px solid ${isDark ? "rgba(250,240,217,0.25)" : "rgba(61,35,20,0.25)"}`,
                borderRadius: "6px", padding: "10px 24px",
                fontFamily: "'DM Sans',sans-serif", fontSize: "14px", fontWeight: 500,
                cursor: "pointer", textDecoration: "none",
                backdropFilter: "blur(6px)",
                transition: "border-color 0.2s",
              }}
            >
              View Channel ↗
            </a>
          </div>
        </div>

        {/* Indicators */}
        <div className="journey-indicators" style={{ marginTop: "40px" }}>
          {VIDEO_IDS.map((_, i) => (
            <button
              key={i}
              className={`journey-dot${i === slideIdx ? " active" : ""}`}
              onClick={() => setSlideIdx(i)}
              aria-label={`Go to video ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
