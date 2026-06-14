import React from "react";
import { useDarkMode } from "@/hooks";

const CARDS = [
  {
    // badge: "FEATURED",
    date:  "JAN · 2025",
    title: "The Legacy of Jainism in the Lalitpur District Of Uttar Pradesh",
    body:  "Documenting forgotten Jain heritage, ancient temples, and hidden stories from the historic heartland of Central India.",
    img:   "/ground-documentation/Lalitpur.jpg",
  },
  {
    // badge: "RESEARCH",
    date:  "MAR · 2025",
    title: "The Lost Jain Temples of Gulbarga — On Camera for the First Time",
    body:  "Exploring the forgotten Jain monuments of Karnataka — ancient structures that have waited centuries for the world to notice them. Captured on camera for the very first time.",
    img:   "/ground-documentation/GULBARGA.JPG",
  },
  {
    // badge: "HERITAGE",
    date:  "OCT · 2025",
    title: "Jain Heritage in Bihar – The Birth Place of Bhagwan Mahavir",
    body:  "Tracing the sacred roots of Jain history across ancient pilgrimage sites, archaeological remains, and timeless traditions.",
    img:   "/ground-documentation/BIHAR.jpg",
  },
  {
    // badge: "HERITAGE",
    date:  "JAN · 2026",
    title: "Tamil Jains – Minority within in Minority",
    body:  "In the heart of Tamil Nadu, carved into ancient rock faces and scattered across jungle-covered hills, lies one of the world's oldest yet most overlooked spiritual traditions — Tamil Jainism.",
    img:   "/ground-documentation/TAMIL NADU.JPG",
  },
];


const ChallengeCard = ({ item, isDark }) => {
  const T = {
    cardBg:     isDark ? "rgba(42,26,14,0.88)"      : "#FDF8F0",
    cardBorder: isDark ? "rgba(232,144,159,0.30)"     : "rgba(242,196,206,0.55)",
    cardShadow: isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(232,144,159,0.08)",
    title:      isDark ? "#FAF0D9"                   : "#3D2314",
    body:       isDark ? "#E8DFCE"                   : "#2A1A0E",
    saffron:    "#F4A535",
    cinzel:     "'Cinzel', serif",
    cormorant:  "'Cormorant Garamond', serif",
    raleway:    "'Raleway', sans-serif",
  };

  return (
    <div
      style={{
        background: T.cardBg,
        borderRadius: "18px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${T.cardBorder}`,
        boxShadow: T.cardShadow,
        cursor: "pointer",
        transition: "transform 0.4s cubic-bezier(0.22,0.9,0.32,1), box-shadow 0.4s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 24px 50px rgba(232,144,159,0.22)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = T.cardShadow;
      }}
    >
      {/* Image */}
      <div style={{ width: "100%", height: "220px", overflow: "hidden", position: "relative" }}>
        <img
          src={item.img}
          alt={item.title}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 1s ease" }}
        />
      </div>

      {/* Body */}
      <div style={{
        padding: "24px 24px 26px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flex: 1,
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: T.cinzel, fontSize: "10px", letterSpacing: "2px",
          color: T.saffron, textTransform: "uppercase", margin: 0, textAlign: "center",
        }}>
          {item.date}
        </p>

        <h3 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: "20px",
          lineHeight: "25.65px", letterSpacing: 0, color: T.title, margin: 0, textAlign: "center",
        }}>
          {item.title}
        </h3>

        <p style={{
          fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: "14px",
          lineHeight: "22.75px", letterSpacing: 0,
          color: T.body, opacity: 0.7, margin: 0, flex: 1, textAlign: "center",
        }}>
          {item.body}
        </p>

        {/* <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: "6px", paddingTop: "12px", marginTop: "auto",
          fontFamily: T.cinzel, fontSize: "10px", letterSpacing: "2.5px",
          color: T.saffron, textTransform: "uppercase",
        }}>
          Read Article <span>→</span>
        </div> */}
      </div>
    </div>
  );
};

const Challenges = () => {
  const isDark = useDarkMode();

  const sectionBg = isDark
    ? "linear-gradient(155deg,#130508 0%,#1A0B0F 45%,#0F0A0C 100%)"
    : "linear-gradient(155deg,#F2C4CE 0%,#FDF8F0 42%,#F5EBD8 72%,#EBDFC4 100%)";
  const descCol   = "#F4A535";
  const saffron   = "#F4A535";

  return (
    <section
      id="challenges"
      className="challenges-section reveal"
      style={{ background: sectionBg, padding: "96px 0", position: "relative", overflow: "hidden" }}
    >
      {/* Lotus atmospheric glows */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "40%", left: "15%", transform: "translate(-50%,-50%)",
        width: "600px", height: "500px", borderRadius: "50%",
        background: isDark
          ? "radial-gradient(ellipse,rgba(232,144,159,0.07) 0%,transparent 65%)"
          : "radial-gradient(ellipse,rgba(242,196,206,0.45) 0%,transparent 65%)",
        pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", top: "55%", left: "85%", transform: "translate(-50%,-50%)",
        width: "500px", height: "450px", borderRadius: "50%",
        background: isDark
          ? "radial-gradient(ellipse,rgba(232,144,159,0.05) 0%,transparent 65%)"
          : "radial-gradient(ellipse,rgba(232,144,159,0.25) 0%,transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "20px" }}>
            <div style={{ height: "1px", flex: "0 1 96px", minWidth: "20px", background: saffron, opacity: 0.3 }} />
            <span style={{
              fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "11px",
              lineHeight: "16px", letterSpacing: "2.2px", color: "#C8881A", textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}>
              HISTORICAL JOURNEY
            </span>
            <div style={{ height: "1px", flex: "0 1 96px", minWidth: "20px", background: saffron, opacity: 0.3 }} />
          </div>

          <h2 className="section-title" style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "clamp(32px, 6.5vw, 64px)",
            lineHeight: "1.4", letterSpacing: 0, marginBottom: "20px",
          }}>
            To Ground Documentation
          </h2>

          <p style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            lineHeight: "27px",
            letterSpacing: "0.8px",
            textAlign: "center",
            color: descCol,
            opacity: 0.9,
            maxWidth: "560px",
            margin: "0 auto",
          }}>
            Exploring ancient sites, documenting hidden heritage, and uncovering
            history through on-ground research and real-world journeys.
          </p>

        </div>

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "28px",
        }}>
          {CARDS.map((item) => (
            <ChallengeCard key={item.title} item={item} isDark={isDark} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Challenges;
