import React from "react";
import { COURSES } from "@/constants/landingData";
import { useDarkMode } from "@/hooks";

const PARTICLE_COLORS = ["#F4A535", "#F7D580", "#7DAF6E", "#A8D4A0"];
const PARTICLES = Array.from({ length: 36 }, (_, i) => ({
  left:     `${(i * 2.78) % 100}%`,
  size:     1.5 + (i % 4),
  delay:    `${(i * 0.52) % 18}s`,
  duration: `${10 + (i % 6) * 1.8}s`,
  color:    PARTICLE_COLORS[i % PARTICLE_COLORS.length],
  glow:     i % 4 === 0 ? "0 0 8px rgba(244,165,53,0.9),0 0 20px rgba(247,213,128,0.45)"
          : i % 4 === 1 ? "0 0 8px rgba(247,213,128,0.9),0 0 18px rgba(244,165,53,0.40)"
          : i % 4 === 2 ? "0 0 7px rgba(125,175,110,0.85),0 0 16px rgba(125,175,110,0.40)"
          :               "0 0 7px rgba(168,212,160,0.8),0 0 15px rgba(168,212,160,0.35)",
}));

const STATS = [
  { num: "30+",   label: "Hours" },
  { num: "1080p", label: "Quality" },
  { num: "Live",  label: "Doubt Sessions" },
];

const Courses = () => {
  const isDark = useDarkMode();
  const course = COURSES[0];

  const bg       = isDark
    ? "linear-gradient(145deg,#060D08 0%,#0E0804 45%,#08100A 100%)"
    : "linear-gradient(145deg,#EBDFC4 0%,#FDF8F0 48%,#E8F0E4 100%)";
  const bandBg   = isDark ? "rgba(125,175,110,0.06)"  : "rgba(125,175,110,0.08)";
  const bandBdr  = isDark ? "rgba(125,175,110,0.20)"  : "rgba(125,175,110,0.25)";
  const green    = isDark ? "#7DAF6E"                 : "#5A9850";
  const saffron  = "#F4A535";
  const titleCol = isDark ? "#FAF0D9"                 : "#3D2314";
  const bodyCol  = isDark ? "rgba(240,223,180,0.70)"  : "rgba(42,26,14,0.65)";
const cardBg   = isDark ? "rgba(14,20,10,0.82)"     : "rgba(255,255,255,0.72)";
  const cardBdr  = isDark ? "rgba(125,175,110,0.22)"  : "rgba(125,175,110,0.28)";

  return (
    <section
      id="courses"
      className="section courses-section reveal"
      style={{ background: bg, position: "relative", overflow: "hidden", padding: "0 0 96px", transition: "background 0.5s ease" }}
    >
      <style>{`
        /* ── Tablet ── */
        @media (max-width: 860px) {
          #courses .courses-grid-wrap {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          #courses .courses-card-col { order: -1; }
          #courses .courses-card-img { height: 260px !important; }
        }
        /* ── Mobile ── */
        @media (max-width: 600px) {
          #courses .courses-stats-grid {
            grid-template-columns: repeat(3,1fr) !important;
          }
          #courses .courses-stats-grid .stat-num { font-size: 20px !important; }
          #courses .courses-card-img { height: 220px !important; }
          #courses .courses-card-body { padding: 18px 18px 20px !important; }
          #courses .courses-coming-pill span:last-child { font-size: 9px !important; letter-spacing: 1.8px !important; }
        }
        /* ── Small phones ── */
        @media (max-width: 400px) {
          #courses .courses-card-img { height: 190px !important; }
          #courses .courses-stats-grid .stat-num { font-size: 18px !important; }
          #courses .courses-stats-grid .stat-label { font-size: 8px !important; }
        }
      `}</style>

      {/* ── Marquee band ── */}
      <div style={{
        width: "100%",
        borderTop: `1px solid ${bandBdr}`, borderBottom: `1px solid ${bandBdr}`,
        background: bandBg, padding: "18px 0",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "clamp(12px,3vw,40px)", marginBottom: "72px",
        backdropFilter: "blur(6px)",
      }}>
        <div style={{ display: "flex", gap: "6px", opacity: 0.35 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ width: 8, height: 14, borderRadius: 2, background: green, opacity: 0.7 }} />
          ))}
        </div>
        <span style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(10px,1.6vw,14px)",
          letterSpacing: "clamp(4px,1vw,8px)",
          fontWeight: 600, color: green,
          textTransform: "uppercase", whiteSpace: "nowrap",
        }}>
          Learning Hub
        </span>
        <span style={{ color: isDark ? "rgba(125,175,110,0.35)" : "rgba(90,152,80,0.35)", fontSize: 18 }}>✦</span>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(12px,1.8vw,17px)",
          fontStyle: "italic", color: saffron,
          whiteSpace: "nowrap", letterSpacing: "2px",
        }}>
          Upcoming Course
        </span>
        <div style={{ display: "flex", gap: "6px", opacity: 0.35 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ width: 8, height: 14, borderRadius: 2, background: green, opacity: 0.7 }} />
          ))}
        </div>
      </div>

      {/* ── Atmospheric glows ── */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "50%", left: "30%",
        transform: "translate(-50%,-50%)",
        width: "600px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(ellipse,rgba(244,165,53,0.08) 0%,transparent 65%)",
        pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", top: "50%", left: "70%",
        transform: "translate(-50%,-50%)",
        width: "500px", height: "450px", borderRadius: "50%",
        background: "radial-gradient(ellipse,rgba(125,175,110,0.08) 0%,transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* ── Ghost text ── */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "52%", left: "50%",
        transform: "translate(-50%,-50%)",
        fontFamily: "'Playfair Display',serif",
        fontSize: "clamp(120px,22vw,320px)",
        fontWeight: 700, lineHeight: 1,
        color: isDark ? "rgba(125,175,110,0.032)" : "rgba(42,26,14,0.028)",
        letterSpacing: "-4px",
        userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap",
      }}>COURSE</div>

      {/* ── Film grain ── */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        opacity: isDark ? 0.05 : 0.022,
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
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: "1200px", margin: "0 auto",
        padding: "0 clamp(16px,4vw,40px)",
      }}>
        <div className="courses-grid-wrap" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px,6vw,100px)", alignItems: "center",
        }}>

          {/* ── LEFT ── */}
          <div className="reveal-left" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

            {/* Label */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ height: "1px", width: "40px", background: green, opacity: 0.5 }} />
              <span style={{
                fontFamily: "'Cinzel', serif", fontSize: "10px",
                letterSpacing: "3px", color: green,
                textTransform: "uppercase", whiteSpace: "nowrap",
              }}>Learning Hub</span>
            </div>

            {/* Title */}
            <div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 400,
                fontSize: "clamp(34px,5vw,60px)", lineHeight: "1.1",
                color: titleCol,
                margin: "0 0 22px",
              }}>
                Explore Jain<br />Heritage Courses
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ height: "1px", width: "36px", background: saffron, opacity: 0.5 }} />
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: green, opacity: 0.7 }} />
                <div style={{ height: "1px", flex: 1, background: green, opacity: 0.15 }} />
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
              fontSize: "clamp(16px,1.8vw,19px)", lineHeight: "1.8",
              color: bodyCol, margin: 0,
              borderLeft: `2px solid rgba(125,175,110,0.45)`,
              paddingLeft: "18px",
            }}>
              Dive deeper into the rich, often-overlooked world of Jain history, literature, and culture — through structured, research-based series crafted by GEO Jainism.
            </p>

            {/* Coming Soon pill */}
            <div className="courses-coming-pill" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "11px 22px", borderRadius: "40px", alignSelf: "flex-start",
              background: isDark ? "rgba(125,175,110,0.08)" : "rgba(125,175,110,0.10)",
              border: `1px solid ${bandBdr}`, backdropFilter: "blur(6px)",
            }}>
              <span style={{
                display: "inline-block", width: "7px", height: "7px", borderRadius: "50%",
                background: green, boxShadow: `0 0 6px rgba(125,175,110,0.8)`,
                animation: "courses-pulse 1.6s ease-in-out infinite", flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'Cinzel', serif", fontSize: "10px",
                letterSpacing: "2.5px", textTransform: "uppercase",
                color: green, fontWeight: 500,
              }}>Upcoming · Launching Soon</span>
            </div>

            {/* Stats */}
            <div className="courses-stats-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(3,1fr)",
              border: `1px solid ${cardBdr}`, borderRadius: "16px", overflow: "hidden",
            }}>
              {STATS.map((s, i) => (
                <div key={s.label} style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: "7px", padding: "20px 8px",
                  borderRight: i < STATS.length - 1 ? `1px solid ${cardBdr}` : "none",
                  background: isDark ? "rgba(125,175,110,0.04)" : "rgba(125,175,110,0.05)",
                }}>
                  <span className="stat-num" style={{
                    fontFamily: "'Playfair Display', serif", fontSize: "26px",
                    fontWeight: 500, color: saffron, lineHeight: 1,
                  }}>{s.num}</span>
                  <span className="stat-label" style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: "9px",
                    fontWeight: 600, letterSpacing: "1.6px", textTransform: "uppercase",
                    color: isDark ? "rgba(200,223,192,0.50)" : "rgba(42,26,14,0.45)",
                    textAlign: "center",
                  }}>{s.label}</span>
                </div>
              ))}
            </div>

          </div>

          {/* ── RIGHT — Card ── */}
          <div className="courses-card-col reveal-right" style={{ position: "relative" }}>

            {/* Glow behind card */}
            <div style={{
              position: "absolute", inset: "-28px",
              background: `radial-gradient(ellipse at 55% 50%,rgba(125,175,110,0.13) 0%,transparent 65%)`,
              borderRadius: "36px", pointerEvents: "none",
            }} />

            <article style={{
              position: "relative", borderRadius: "20px", overflow: "hidden",
              background: cardBg,
              border: `1px solid ${cardBdr}`,
              boxShadow: isDark
                ? "0 28px 72px rgba(0,0,0,0.55)"
                : "0 28px 72px rgba(42,26,14,0.14)",
              backdropFilter: "blur(12px)",
              transition: "transform 0.5s cubic-bezier(0.22,0.9,0.32,1), box-shadow 0.5s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 44px 90px rgba(42,26,14,0.22)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = isDark
                  ? "0 28px 72px rgba(0,0,0,0.55)"
                  : "0 28px 72px rgba(42,26,14,0.14)";
              }}
            >
              {/* Image */}
              <div className="courses-card-img" style={{ position: "relative", height: "300px", overflow: "hidden" }}>
                <img
                  src={course.img} alt={course.title} loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 1.4s ease", display: "block" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg,rgba(6,13,8,0.12) 0%,transparent 40%,rgba(6,13,8,0.6) 100%)",
                }} />
                {/* Tag + Coming Soon row */}
                <div style={{
                  position: "absolute", top: "16px", left: "16px", right: "16px",
                  display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2,
                }}>
                  <span style={{
                    fontFamily: "'Cinzel', serif", fontSize: "9px", letterSpacing: "2.5px",
                    padding: "6px 14px", borderRadius: "30px",
                    background: "rgba(6,13,8,0.60)", backdropFilter: "blur(8px)",
                    border: `1px solid rgba(125,175,110,0.50)`,
                    color: "#A8D4A0", textTransform: "uppercase",
                  }}>{course.tag}</span>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "7px",
                    padding: "6px 14px", borderRadius: "30px",
                    background: "rgba(6,13,8,0.60)", backdropFilter: "blur(8px)",
                    border: `1px solid rgba(125,175,110,0.35)`,
                  }}>
                    <span style={{
                      display: "inline-block", width: "6px", height: "6px", borderRadius: "50%",
                      background: green, boxShadow: `0 0 5px rgba(125,175,110,0.8)`,
                      animation: "courses-pulse 1.6s ease-in-out infinite",
                    }} />
                    <span style={{
                      fontFamily: "'Cinzel', serif", fontSize: "8px",
                      letterSpacing: "2px", color: "#C8E8C0", textTransform: "uppercase",
                    }}>Coming Soon</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="courses-card-body" style={{ padding: "24px 26px 26px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif", fontWeight: 500,
                  fontSize: "19px", lineHeight: "1.45", color: titleCol, margin: 0,
                }}>{course.title}</h3>

                <div style={{ height: "1px", background: `linear-gradient(90deg, ${bandBdr}, transparent)` }} />

                <a
                  href="https://www.youtube.com/@geo_jainism"
                  target="_blank" rel="noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    alignSelf: "flex-start",
                    fontFamily: "'Cinzel', serif", fontSize: "10px",
                    letterSpacing: "2.5px", textTransform: "uppercase",
                    padding: "11px 26px", borderRadius: "40px",
                    background: isDark
                      ? "linear-gradient(135deg,rgba(244,165,53,0.15) 0%,rgba(125,175,110,0.12) 100%)"
                      : "linear-gradient(135deg,rgba(244,165,53,0.18) 0%,rgba(125,175,110,0.14) 100%)",
                    color: isDark ? "#FAF0D9" : "#2A1A0E",
                    border: `1px solid rgba(244,165,53,0.45)`,
                    textDecoration: "none",
                    boxShadow: "0 6px 20px rgba(244,165,53,0.18)",
                    transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(125,175,110,0.30)";
                    e.currentTarget.style.borderColor = "rgba(125,175,110,0.60)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(244,165,53,0.18)";
                    e.currentTarget.style.borderColor = "rgba(244,165,53,0.45)";
                  }}
                >
                  {course.cta} →
                </a>
              </div>
            </article>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Courses;
