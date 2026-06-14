import React, { useState, useEffect, useRef } from "react";
import { JOURNEY_SLIDES } from "@/constants/landingData";
import { useDarkMode } from "@/hooks";

const ACCENT     = "#7DAF6E";
const ACCENT_ALT = "#E8909F";

const PARTICLE_COLORS = ["#C8DFC0", "#7DAF6E", "#F2C4CE", "#E8909F"];
const PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  left:     `${(i * 3.15) % 100}%`,
  size:     1.5 + (i % 3),
  delay:    `${(i * 0.6) % 18}s`,
  duration: `${11 + (i % 6) * 1.5}s`,
  color:    PARTICLE_COLORS[i % PARTICLE_COLORS.length],
  glow:     i % 4 === 0 ? "0 0 8px rgba(125,175,110,0.9),0 0 18px rgba(200,223,192,0.45)"
          : i % 4 === 1 ? "0 0 8px rgba(232,144,159,0.9),0 0 18px rgba(242,196,206,0.45)"
          : i % 4 === 2 ? "0 0 7px rgba(125,175,110,0.8),0 0 15px rgba(125,175,110,0.35)"
          :               "0 0 7px rgba(232,144,159,0.8),0 0 14px rgba(232,144,159,0.35)",
}));

const navBtnStyle = {
  width: "50px", height: "50px", borderRadius: "50%",
  background: "rgba(125,175,110,0.12)", backdropFilter: "blur(10px)",
  border: "1px solid rgba(125,175,110,0.40)", color: ACCENT,
  fontSize: "22px", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  transition: "background 0.3s, border-color 0.3s",
  flexShrink: 0,
};

const JourneyCarousel = () => {
  const isDark      = useDarkMode();
  const carouselRef = useRef(null);
  const [slideIdx, setSlideIdx] = useState(0);

  const goPrev = () => setSlideIdx(i => (i - 1 + JOURNEY_SLIDES.length) % JOURNEY_SLIDES.length);
  const goNext = () => setSlideIdx(i => (i + 1) % JOURNEY_SLIDES.length);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let interval;
    let paused = false;
    const start = () => {
      stop();
      interval = setInterval(() => {
        if (!paused) setSlideIdx(i => (i + 1) % JOURNEY_SLIDES.length);
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

  const bg = isDark
    ? "linear-gradient(145deg,#060D08 0%,#091209 45%,#060D06 100%)"
    : "linear-gradient(145deg,#FDF8F0 0%,#F5EBD8 48%,#EBDFC4 100%)";

  const bandBg  = isDark ? "rgba(125,175,110,0.06)" : "rgba(125,175,110,0.10)";
  const bandBdr = isDark ? "rgba(125,175,110,0.18)" : "rgba(125,175,110,0.30)";
  const accentCol = isDark ? ACCENT : "#5A9448";
  const titleCol  = isDark ? "#FAF0D9" : "#2A3D1E";
  const bodyCol   = isDark ? "rgba(200,223,192,0.70)" : "rgba(42,61,30,0.65)";

  const slide = JOURNEY_SLIDES[slideIdx];

  return (
    <section
      id="journey"
      style={{
        background: bg, padding: "0 0 96px",
        position: "relative", overflow: "hidden",
        transition: "background 0.5s ease",
      }}
    >
      <style>{`
        @keyframes jc-fadein {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        #journey .jc-nav-btn:hover {
          background: rgba(125,175,110,0.25) !important;
          border-color: rgba(125,175,110,0.70) !important;
        }
        /* ── Tablet ── */
        @media (max-width:900px) {
          #journey .jc-full { height: clamp(460px,82vh,720px) !important; }
          #journey .jc-title { font-size: clamp(28px,5vw,52px) !important; max-width: 90% !important; }
        }
        /* ── Mobile ── */
        @media (max-width:640px) {
          #journey .jc-full { height: clamp(420px,78vh,580px) !important; }
          #journey .jc-ghost-num { display: none !important; }
          #journey .jc-bottom-pad { padding: 0 16px 22px !important; }
          #journey .jc-title { font-size: clamp(22px,6.5vw,36px) !important; max-width: 100% !important; margin-bottom: 10px !important; }
          #journey .jc-caption { font-size: 13px !important; display: -webkit-box !important; -webkit-line-clamp: 3 !important; -webkit-box-orient: vertical !important; overflow: hidden !important; }
          #journey .jc-meta-row { flex-wrap: wrap; gap: 8px !important; }
          #journey .jc-chapter-label { display: none !important; }
          #journey .jc-dots { gap: 4px !important; }
          #journey .jc-caption-row { flex-direction: column !important; align-items: flex-start !important; gap: 14px !important; }
          #journey .jc-nav-row { align-self: flex-end !important; }
          #journey .jc-nav-btn { width: 42px !important; height: 42px !important; font-size: 18px !important; }
          #journey .jc-accent-line { margin-bottom: 12px !important; }
        }
        /* ── Small phones ── */
        @media (max-width:400px) {
          #journey .jc-full { height: clamp(380px,76vh,520px) !important; }
          #journey .jc-title { font-size: clamp(20px,6vw,30px) !important; }
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
        <div style={{ display: "flex", gap: "6px", opacity: 0.4 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ width: 8, height: 14, borderRadius: 2, background: ACCENT, opacity: 0.75 }} />
          ))}
        </div>
        <span style={{
          fontFamily: "'Cinzel', serif", fontSize: "clamp(10px,1.6vw,14px)",
          letterSpacing: "clamp(4px,1vw,8px)", fontWeight: 600,
          color: accentCol, textTransform: "uppercase", whiteSpace: "nowrap",
        }}>Sacred Trails</span>
        <span style={{ color: isDark ? "rgba(125,175,110,0.40)" : "rgba(90,148,72,0.40)", fontSize: 18 }}>✦</span>
        <span style={{
          fontFamily: "'Playfair Display', serif", fontSize: "clamp(12px,1.8vw,17px)",
          fontStyle: "italic", color: isDark ? ACCENT_ALT : "#C0607A",
          whiteSpace: "nowrap", letterSpacing: "2px",
        }}>Jain India</span>
        <div style={{ display: "flex", gap: "6px", opacity: 0.4 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ width: 8, height: 14, borderRadius: 2, background: ACCENT, opacity: 0.75 }} />
          ))}
        </div>
      </div>

      {/* ── Atmospheric glows ── */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "40%", left: "25%", transform: "translate(-50%,-50%)",
        width: "700px", height: "550px", borderRadius: "50%",
        background: isDark
          ? "radial-gradient(ellipse,rgba(125,175,110,0.08) 0%,transparent 65%)"
          : "radial-gradient(ellipse,rgba(200,223,192,0.55) 0%,transparent 65%)",
        pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", top: "60%", left: "75%", transform: "translate(-50%,-50%)",
        width: "550px", height: "480px", borderRadius: "50%",
        background: isDark
          ? "radial-gradient(ellipse,rgba(232,144,159,0.07) 0%,transparent 65%)"
          : "radial-gradient(ellipse,rgba(242,196,206,0.55) 0%,transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* ── Ghost text ── */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "52%", left: "50%", transform: "translate(-50%,-50%)",
        fontFamily: "'Playfair Display',serif", fontSize: "clamp(80px,16vw,240px)",
        fontWeight: 700, lineHeight: 1,
        color: isDark ? "rgba(125,175,110,0.04)" : "rgba(42,61,30,0.05)",
        letterSpacing: "-4px", userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap",
      }}>JAIN</div>

      {/* ── Film grain ── */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, opacity: isDark ? 0.05 : 0.03,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='5'/%3E%3CfeColorMatrix values='0 0 0 0 0.4 0 0 0 0 0.55 0 0 0 0 0.35 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
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

        {/* Header */}
        <div className="journey-header">
          <div className="section-sub" style={{ color: accentCol }}>Sacred Trails</div>
          <h2 className="section-title" style={{ color: titleCol }}>Journey Through GEO Jainism</h2>

          {/* Quote */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", margin: "28px auto 0", maxWidth: "680px" }}>
            <div style={{ flex: 1, height: "1px", background: isDark ? "rgba(125,175,110,0.25)" : "rgba(125,175,110,0.40)" }} />
            <p style={{
              fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic",
              fontSize: "clamp(15px,1.6vw,19px)", lineHeight: 1.8,
              color: bodyCol, margin: 0, textAlign: "center",
              letterSpacing: "0.3px",
            }}>
              " Tracing the Sacred Landscapes, Ancient Routes,<br/>and Hidden Heritage of Jain India. "
            </p>
            <div style={{ flex: 1, height: "1px", background: isDark ? "rgba(125,175,110,0.25)" : "rgba(125,175,110,0.40)" }} />
          </div>
        </div>

        {/* ── Full-bleed cinematic carousel ── */}
        <div
          className="jc-full"
          ref={carouselRef}
          style={{
            position: "relative",
            width: "100%",
            height: "clamp(520px, 88vh, 900px)",
            overflow: "hidden",
            margin: "56px 0 0",
          }}
        >
          {/* Cross-fade images */}
          {JOURNEY_SLIDES.map((s, i) => (
            <img
              key={s.img}
              src={s.img}
              alt={s.title}
              loading={i === 0 ? "eager" : "lazy"}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%", objectFit: "cover",
                opacity: i === slideIdx ? 1 : 0,
                transform: i === slideIdx ? "scale(1.06)" : "scale(1.0)",
                transition: "opacity 1.2s ease, transform 7s ease-out",
                zIndex: 1,
              }}
            />
          ))}

          {/* Letterbox bars */}
          <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "56px", background: "rgba(0,0,0,0.80)", zIndex: 4 }} />
          <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "56px", background: "rgba(0,0,0,0.80)", zIndex: 4 }} />

          {/* Film grain */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, zIndex: 3, opacity: 0.07, pointerEvents: "none",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' seed='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "180px 180px",
          }} />

          {/* Vignette */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)",
          }} />

          {/* Heavy bottom gradient */}
          <div aria-hidden="true" style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "70%", zIndex: 4, pointerEvents: "none",
            background: "linear-gradient(to top, rgba(4,10,4,0.97) 0%, rgba(4,10,4,0.75) 40%, transparent 100%)",
          }} />

          {/* Timecode — top left inside letterbox */}
          <div style={{
            position: "absolute", top: "19px", left: "28px", zIndex: 6,
            fontFamily: "'Courier New', monospace", fontSize: "11px", letterSpacing: "2px",
            color: "rgba(200,223,192,0.65)",
          }}>
            GEO:JAINISM · {String(slideIdx + 1).padStart(2, "0")}/{String(JOURNEY_SLIDES.length).padStart(2, "0")}
          </div>

          {/* Chapter label — top right inside letterbox */}
          <div style={{
            position: "absolute", top: "19px", right: "28px", zIndex: 6,
            fontFamily: "'Cinzel', serif", fontSize: "10px", letterSpacing: "3px",
            color: "rgba(125,175,110,0.80)", textTransform: "uppercase",
          }}>
            {slide?.num?.split("·")[0].trim()}
          </div>

          {/* Huge ghost chapter number — left side */}
          <div
            aria-hidden="true"
            className="jc-ghost-num"
            style={{
              position: "absolute",
              left: "clamp(20px,4vw,60px)",
              bottom: "clamp(90px,16vh,180px)",
              zIndex: 5,
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(100px,22vw,280px)",
              fontWeight: 700, lineHeight: 1,
              color: "rgba(125,175,110,0.06)",
              userSelect: "none", pointerEvents: "none",
              transition: "opacity 0.6s ease",
            }}
          >
            {String(slideIdx + 1).padStart(2, "0")}
          </div>

          {/* Bottom content */}
          <div
            className="jc-bottom-pad"
            style={{
              position: "absolute", bottom: "56px", left: 0, right: 0,
              zIndex: 6, padding: "0 clamp(28px,5vw,80px) 40px",
            }}
          >
            {/* Meta row — chapter num + pill dots */}
            <div className="jc-meta-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div className="jc-chapter-label" style={{
                fontFamily: "'Cinzel', serif", fontSize: "10px", letterSpacing: "4px",
                color: ACCENT, textTransform: "uppercase",
              }}>
                {slide?.num}
              </div>
              <div className="jc-dots" style={{ display: "flex", gap: "6px" }}>
                {JOURNEY_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIdx(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    style={{
                      width: i === slideIdx ? "24px" : "6px",
                      height: "6px", borderRadius: "3px",
                      background: i === slideIdx ? ACCENT : "rgba(125,175,110,0.30)",
                      border: "none", cursor: "pointer",
                      transition: "all 0.4s ease", padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Thin accent line */}
            <div className="jc-accent-line" style={{
              height: "1px",
              background: `linear-gradient(90deg,${ACCENT},${ACCENT_ALT},transparent)`,
              marginBottom: "18px", opacity: 0.7,
            }} />

            {/* Title */}
            <h3
              key={`t-${slideIdx}`}
              className="jc-title"
              style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                fontSize: "clamp(32px,5.5vw,72px)", fontWeight: 400, lineHeight: 1.1,
                color: "#FDF8F0", margin: "0 0 16px", maxWidth: "75%",
                animation: "jc-fadein 0.8s ease forwards",
              }}
            >
              {slide?.title}
            </h3>

            {/* Caption + nav row */}
            <div className="jc-caption-row" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px" }}>
              <p
                key={`c-${slideIdx}`}
                className="jc-caption"
                style={{
                  fontSize: "clamp(13px,1.4vw,16px)", lineHeight: 1.75,
                  color: "rgba(200,223,192,0.80)", maxWidth: "600px", margin: 0,
                  animation: "jc-fadein 0.9s 0.15s ease both",
                }}
              >
                {slide?.caption}
              </p>

              {/* Prev / Next */}
              <div className="jc-nav-row" style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                <button
                  className="jc-nav-btn"
                  onClick={goPrev}
                  aria-label="Previous slide"
                  data-testid="journey-prev"
                  style={navBtnStyle}
                >‹</button>
                <button
                  className="jc-nav-btn"
                  onClick={goNext}
                  aria-label="Next slide"
                  data-testid="journey-next"
                  style={navBtnStyle}
                >›</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default JourneyCarousel;
