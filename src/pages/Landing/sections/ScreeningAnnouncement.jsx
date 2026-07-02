import React from "react";
import { useDarkMode } from "@/hooks";
import { useTranslation } from "react-i18next";

/* 42 particles — spread across palette colours for variety */
const PARTICLE_COLORS = ["#F4A535", "#F7D580", "#7DAF6E", "#E8909F"];
const PARTICLES = Array.from({ length: 42 }, (_, i) => ({
  left:     `${(i * 2.42) % 100}%`,
  size:     1.5 + (i % 4),
  delay:    `${(i * 0.47) % 20}s`,
  duration: `${10 + (i % 7) * 1.6}s`,
  color:    PARTICLE_COLORS[i % PARTICLE_COLORS.length],
  glow:     i % 4 === 0 ? "0 0 8px rgba(244,165,53,0.9),0 0 20px rgba(247,213,128,0.45)"
          : i % 4 === 1 ? "0 0 8px rgba(247,213,128,0.9),0 0 18px rgba(244,165,53,0.40)"
          : i % 4 === 2 ? "0 0 7px rgba(125,175,110,0.85),0 0 16px rgba(125,175,110,0.40)"
          :               "0 0 7px rgba(232,144,159,0.8),0 0 15px rgba(232,144,159,0.35)",
}));


export default function ScreeningAnnouncement() {
  const isDark = useDarkMode();
  const { t } = useTranslation();

  const bg        = isDark ? "linear-gradient(145deg,#060D08 0%,#0E0804 45%,#08100A 100%)"
                           : "linear-gradient(145deg,#EBDFC4 0%,#FDF8F0 48%,#E8F0E4 100%)";
  const labelCol  = isDark ? "rgba(200,223,192,0.45)"     : "rgba(42,26,14,0.38)";
  const subCol    = isDark ? "rgba(200,223,192,0.58)"     : "rgba(42,26,14,0.50)";
  const bandBg    = isDark ? "rgba(125,175,110,0.06)"     : "rgba(125,175,110,0.08)";
  const bandBdr   = isDark ? "rgba(125,175,110,0.20)"     : "rgba(125,175,110,0.25)";

  return (
    <section
      id="screening"
      style={{
        background: bg,
        padding: "0 0 96px",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.5s ease",
      }}
    >
      {/* ── COMING TO SCREENS — full-width marquee band ── */}
      <div style={{
        width: "100%",
        borderTop:    `1px solid ${bandBdr}`,
        borderBottom: `1px solid ${bandBdr}`,
        background: bandBg,
        padding: "18px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(12px,3vw,40px)",
        marginBottom: "80px",
        backdropFilter: "blur(6px)",
      }}>
        <div style={{ display:"flex", gap:"6px", opacity:0.35 }}>
          {[...Array(6)].map((_,i) => (
            <div key={i} style={{ width:8, height:14, borderRadius:2, background:"#7DAF6E", opacity:0.7 }}/>
          ))}
        </div>
        <span style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(10px, 1.6vw, 15px)",
          letterSpacing: "clamp(4px, 1vw, 9px)",
          fontWeight: 600,
          color: isDark ? "#7DAF6E" : "#5A9850",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}>
          {t("screening.marqueeLabel")}
        </span>
        <span style={{ color: isDark ? "rgba(125,175,110,0.35)" : "rgba(90,152,80,0.35)", fontSize:18 }}>✦</span>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(12px, 1.8vw, 18px)",
          fontStyle: "italic",
          color: "#F4A535",
          whiteSpace: "nowrap",
          letterSpacing: "2px",
        }}>
          {t("screening.marqueeDate")}
        </span>
        <div style={{ display:"flex", gap:"6px", opacity:0.35 }}>
          {[...Array(6)].map((_,i) => (
            <div key={i} style={{ width:8, height:14, borderRadius:2, background:"#7DAF6E", opacity:0.7 }}/>
          ))}
        </div>
      </div>

      {/* ── Dual atmospheric glows ── */}
      <div aria-hidden="true" style={{
        position:"absolute", top:"45%", left:"35%",
        transform:"translate(-50%,-50%)",
        width:"650px", height:"550px", borderRadius:"50%",
        background:"radial-gradient(ellipse,rgba(244,165,53,0.09) 0%,transparent 65%)",
        pointerEvents:"none",
      }}/>
      <div aria-hidden="true" style={{
        position:"absolute", top:"55%", left:"65%",
        transform:"translate(-50%,-50%)",
        width:"550px", height:"500px", borderRadius:"50%",
        background:"radial-gradient(ellipse,rgba(125,175,110,0.09) 0%,transparent 65%)",
        pointerEvents:"none",
      }}/>

      {/* ── Ghost year ── */}
      <div aria-hidden="true" style={{
        position:"absolute", top:"52%", left:"50%",
        transform:"translate(-50%,-50%)",
        fontFamily:"'Playfair Display',serif",
        fontSize:"clamp(160px,30vw,420px)",
        fontWeight:700, lineHeight:1,
        color: isDark ? "rgba(125,175,110,0.038)" : "rgba(42,26,14,0.032)",
        letterSpacing:"-8px",
        userSelect:"none", pointerEvents:"none", whiteSpace:"nowrap",
      }}>2026</div>

      {/* ── Film grain ── */}
      <div aria-hidden="true" style={{
        position:"absolute", inset:0,
        opacity: isDark ? 0.055 : 0.025,
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='9'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.65 0 0 0 0 0.4 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize:"200px 200px", pointerEvents:"none",
      }}/>

      {/* ── Section-scoped particles ── */}
      <div aria-hidden="true" style={{
        position:"absolute", inset:0,
        overflow:"hidden", pointerEvents:"none", zIndex:1,
      }}>
        {PARTICLES.map((p, i) => (
          <span key={i} style={{
            position:"absolute",
            bottom:"-8px",
            left: p.left,
            width:  p.size + "px",
            height: p.size + "px",
            borderRadius:"50%",
            background: p.color,
            opacity: 0,
            boxShadow: p.glow,
            animation: `gpRise ${p.duration} ${p.delay} linear infinite`,
          }}/>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{
        position:"relative", zIndex:2,
        maxWidth:"920px", margin:"0 auto",
        padding:"0 clamp(20px,6vw,60px)",
        textAlign:"center",
      }}>

        {/* Releasing label */}
        <p style={{
          fontFamily:"'Cinzel',serif",
          fontSize:"clamp(9px,1.1vw,11px)",
          letterSpacing:"8px", color:subCol,
          textTransform:"uppercase", marginBottom:"14px",
        }}>{t("screening.releasing")}</p>

        {/* August 2026 — saffron → tulsi gradient */}
        <div style={{
          fontFamily:"'Playfair Display',serif",
          fontSize:"clamp(42px,8.5vw,100px)",
          fontWeight:600, lineHeight:1,
          background:"linear-gradient(120deg,#F4A535 0%,#F7D580 38%,#7DAF6E 100%)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          backgroundClip:"text",
          marginBottom:"38px", letterSpacing:"1px",
        }}>
          {t("screening.date")}
        </div>

        {/* Narrative description */}
        <div style={{
          maxWidth: "640px",
          margin: "0 auto 52px",
          padding: "40px clamp(20px,5vw,48px)",
          borderTop:    `1px solid ${bandBdr}`,
          borderBottom: `1px solid ${bandBdr}`,
          position: "relative",
        }}>
          {/* corner ornaments */}
          {[{top:0,left:0},{top:0,right:0},{bottom:0,left:0},{bottom:0,right:0}].map((pos,i) => (
            <div key={i} aria-hidden="true" style={{
              position:"absolute", ...pos,
              width:10, height:10,
              borderTop:   i<2 ? `1.5px solid #F4A535` : "none",
              borderBottom:i>=2? `1.5px solid #F4A535` : "none",
              borderLeft:  (i===0||i===2) ? `1.5px solid #F4A535` : "none",
              borderRight: (i===1||i===3) ? `1.5px solid #F4A535` : "none",
              opacity: 0.55,
            }}/>
          ))}

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(14px, 1.9vw, 18px)",
            fontWeight: 300,
            lineHeight: 1.85,
            color: isDark ? "rgba(240,223,180,0.72)" : "rgba(42,26,14,0.65)",
            marginBottom: "22px",
            letterSpacing: "0.15px",
          }} dangerouslySetInnerHTML={{ __html: t("screening.narrative1") }}>
          </p>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(11px, 1.3vw, 13px)",
            fontWeight: 300,
            lineHeight: 1.75,
            color: isDark ? "rgba(200,223,192,0.42)" : "rgba(42,26,14,0.38)",
            letterSpacing: "0.3px",
          }} dangerouslySetInnerHTML={{ __html: t("screening.narrative2") }}>
          </p>
        </div>

        {/* 100+ Locations — data highlight */}
        <div style={{ marginBottom: "60px" }}>
          <p style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(8px, 1vw, 10px)",
            letterSpacing: "7px",
            color: subCol,
            textTransform: "uppercase",
            marginBottom: "10px",
          }}>{t("screening.nationwideLabel")}</p>

          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(72px, 14vw, 172px)",
            fontWeight: 300,
            lineHeight: 0.9,
            background: "linear-gradient(120deg,#7DAF6E 0%,#F7D580 55%,#F4A535 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-2px",
            marginBottom: "12px",
          }}>
            100<span style={{ fontStyle: "italic" }}>+</span>
          </div>

          <p style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(9px, 1.1vw, 12px)",
            letterSpacing: "5px",
            color: isDark ? "rgba(200,223,192,0.50)" : "rgba(42,26,14,0.42)",
            textTransform: "uppercase",
          }}>{t("screening.venuesLabel")}</p>
        </div>

        {/* CTA — Register for Screening */}
        <div style={{ marginBottom: "56px" }}>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSe3nqFqnZMohiZ8xauuxnKtaOyMZQlEiIjcax4SASt6xQMzFQ/viewform"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 42px",
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(10px, 1.2vw, 12px)",
              fontWeight: 600,
              letterSpacing: "4px",
              textTransform: "uppercase",
              textDecoration: "none",
              color: isDark ? "#FAF0D9" : "#2A1A0E",
              background: isDark
                ? "linear-gradient(135deg,rgba(244,165,53,0.15) 0%,rgba(125,175,110,0.10) 100%)"
                : "linear-gradient(135deg,rgba(244,165,53,0.18) 0%,rgba(125,175,110,0.12) 100%)",
              border: `1px solid ${isDark ? "rgba(244,165,53,0.40)" : "rgba(244,165,53,0.50)"}`,
              borderRadius: "2px",
              backdropFilter: "blur(8px)",
              boxShadow: isDark
                ? "0 0 28px rgba(244,165,53,0.12), inset 0 1px 0 rgba(247,213,128,0.08)"
                : "0 4px 24px rgba(244,165,53,0.15), inset 0 1px 0 rgba(247,213,128,0.20)",
              cursor: "pointer",
              transition: "all 0.35s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = isDark
                ? "0 0 42px rgba(244,165,53,0.28), 0 0 80px rgba(125,175,110,0.12), inset 0 1px 0 rgba(247,213,128,0.14)"
                : "0 6px 36px rgba(244,165,53,0.28), inset 0 1px 0 rgba(247,213,128,0.30)";
              e.currentTarget.style.borderColor = isDark ? "rgba(244,165,53,0.70)" : "rgba(244,165,53,0.80)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = isDark
                ? "0 0 28px rgba(244,165,53,0.12), inset 0 1px 0 rgba(247,213,128,0.08)"
                : "0 4px 24px rgba(244,165,53,0.15), inset 0 1px 0 rgba(247,213,128,0.20)";
              e.currentTarget.style.borderColor = isDark ? "rgba(244,165,53,0.40)" : "rgba(244,165,53,0.50)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* film reel icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F4A535" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
              <line x1="12" y1="2"  x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22"/>
              <line x1="4.22"  y1="4.22"  x2="6.34" y2="6.34"/>
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
              <line x1="2"  y1="12" x2="5"  y2="12"/>
              <line x1="19" y1="12" x2="22" y2="12"/>
            </svg>
            {t("screening.btnRegister")}
            {/* arrow */}
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#F4A535" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4"/>
            </svg>
          </a>

          <p style={{
            marginTop: "16px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(9px, 1vw, 11px)",
            letterSpacing: "1.5px",
            color: isDark ? "rgba(200,223,192,0.32)" : "rgba(42,26,14,0.28)",
            textTransform: "uppercase",
          }}>
            {t("screening.btnSubtext")}
          </p>
        </div>

        {/* Meta */}
        <div style={{
          display:"flex", justifyContent:"center", alignItems:"center",
          flexWrap:"wrap", gap:"8px 18px", marginBottom:"40px",
        }}>
          {/* <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", letterSpacing:"1.8px", color:labelCol, textTransform:"uppercase" }}>
            With Arham Dhyan Yog
          </span> */}
        </div>

        {/* Contact */}
        <div>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:"14px",
            marginBottom:"22px",
          }}>
            <span style={{ width:"28px", height:"1px", background: `linear-gradient(90deg, transparent, ${isDark ? "rgba(244,165,53,0.6)" : "rgba(244,165,53,0.7)"})` }}/>
            <p style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(13px, 1.8vw, 17px)",
              fontWeight: 600,
              letterSpacing: "5px",
              background: "linear-gradient(120deg,#F4A535 0%,#F7D580 45%,#7DAF6E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textTransform: "uppercase",
              margin: 0,
              textShadow: isDark ? "0 0 24px rgba(244,165,53,0.25)" : "none",
            }}>{t("screening.getInTouch")}</p>
            <span style={{ width:"28px", height:"1px", background: `linear-gradient(90deg, ${isDark ? "rgba(125,175,110,0.6)" : "rgba(125,175,110,0.7)"}, transparent)` }}/>
          </div>

          <div style={{
            display:"flex", justifyContent:"center", alignItems:"center",
            flexWrap:"wrap", gap:"12px 16px",
          }}>
            {["+91 63789 02642", "+91 72470 87515"].map(n => (
              <a key={n} href={`tel:${n.replace(/\s/g,"")}`}
                style={{
                  display:"inline-flex", alignItems:"center", gap:"9px",
                  padding:"13px 24px",
                  fontFamily:"'DM Sans',sans-serif", fontSize:"15px", fontWeight:600,
                  letterSpacing:"0.3px",
                  color: isDark ? "#FAF0D9" : "#1A3512",
                  background: isDark ? "rgba(125,175,110,0.20)" : "rgba(125,175,110,0.16)",
                  border: `1.5px solid ${isDark ? "rgba(125,175,110,0.60)" : "rgba(125,175,110,0.65)"}`,
                  borderRadius:"30px",
                  textDecoration:"none",
                  transition:"all 0.25s ease",
                  boxShadow: isDark
                    ? "0 0 20px rgba(125,175,110,0.18), inset 0 1px 0 rgba(200,223,192,0.10)"
                    : "0 4px 18px rgba(125,175,110,0.22), inset 0 1px 0 rgba(255,255,255,0.30)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#7DAF6E";
                  e.currentTarget.style.background = isDark ? "rgba(125,175,110,0.32)" : "rgba(125,175,110,0.28)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(125,175,110,0.35), inset 0 1px 0 rgba(255,255,255,0.25)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = isDark ? "rgba(125,175,110,0.60)" : "rgba(125,175,110,0.65)";
                  e.currentTarget.style.background = isDark ? "rgba(125,175,110,0.20)" : "rgba(125,175,110,0.16)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = isDark
                    ? "0 0 20px rgba(125,175,110,0.18), inset 0 1px 0 rgba(200,223,192,0.10)"
                    : "0 4px 18px rgba(125,175,110,0.22), inset 0 1px 0 rgba(255,255,255,0.30)";
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7DAF6E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {n}
              </a>
            ))}
            <a href="mailto:goldeneraofjainsim@gmail.com"
              style={{
                display:"inline-flex", alignItems:"center", gap:"9px",
                padding:"13px 24px",
                fontFamily:"'DM Sans',sans-serif", fontSize:"15px", fontWeight:600,
                letterSpacing:"0.3px",
                color: isDark ? "#FAF0D9" : "#5C3A0A",
                background: isDark ? "rgba(244,165,53,0.20)" : "rgba(244,165,53,0.16)",
                border: `1.5px solid ${isDark ? "rgba(244,165,53,0.60)" : "rgba(244,165,53,0.65)"}`,
                borderRadius:"30px",
                textDecoration:"none",
                transition:"all 0.25s ease",
                boxShadow: isDark
                  ? "0 0 20px rgba(244,165,53,0.18), inset 0 1px 0 rgba(247,213,128,0.10)"
                  : "0 4px 18px rgba(244,165,53,0.22), inset 0 1px 0 rgba(255,255,255,0.30)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#F4A535";
                e.currentTarget.style.background = isDark ? "rgba(244,165,53,0.32)" : "rgba(244,165,53,0.28)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 0 30px rgba(244,165,53,0.35), inset 0 1px 0 rgba(255,255,255,0.25)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = isDark ? "rgba(244,165,53,0.60)" : "rgba(244,165,53,0.65)";
                e.currentTarget.style.background = isDark ? "rgba(244,165,53,0.20)" : "rgba(244,165,53,0.16)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = isDark
                  ? "0 0 20px rgba(244,165,53,0.18), inset 0 1px 0 rgba(247,213,128,0.10)"
                  : "0 4px 18px rgba(244,165,53,0.22), inset 0 1px 0 rgba(255,255,255,0.30)";
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F4A535" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <path d="m22 6-10 7L2 6"/>
              </svg>
              goldeneraofjainsim@gmail.com
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
