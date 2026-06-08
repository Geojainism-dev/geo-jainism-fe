import React, { useState, useEffect } from "react";

export default function ScreeningPopup() {
  const [open, setOpen] = useState(false);

  // Slight delay so the page loads before the popup appears
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Screening announcement"
      onClick={() => setOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(3px)",
        animation: "spFadeIn 0.35s ease",
      }}
    >
      {/* Modal — stop propagation so clicking image doesn't close */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "min(480px, 92vw)",
          width: "100%",
          animation: "spSlideUp 0.38s cubic-bezier(0.22,0.9,0.32,1)",
        }}
      >
        {/* Poster image */}
        <img
          src="/Screening.png"
          alt="Screening announcement"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            maxHeight: "88vh",
            objectFit: "contain",
            borderRadius: "12px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(244,165,53,0.18)",
          }}
        />

        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "-14px",
            right: "-14px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1.5px solid rgba(244,165,53,0.55)",
            background: "rgba(18,8,3,0.92)",
            color: "#F4A535",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
            transition: "transform 0.2s, background 0.2s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.12) rotate(90deg)";
            e.currentTarget.style.background = "rgba(244,165,53,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) rotate(0deg)";
            e.currentTarget.style.background = "rgba(18,8,3,0.92)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes spFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes spSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        /* Mobile: reduce button size offset on very small screens */
        @media (max-width: 480px) {
          .sp-close-btn { top: 8px !important; right: 8px !important; }
        }
      `}</style>
    </div>
  );
}
