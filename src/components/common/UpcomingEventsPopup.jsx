import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { X, CalendarDays, MapPin, Ticket } from "lucide-react";
import { usePublicScreenings } from "@/features/publicScreenings/hooks";

export default function UpcomingEventsPopup({ onDismiss }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  // `status` (not isLoading/isFetching) is used deliberately: react-query's
  // default retry has backoff gaps between attempts where isFetching is
  // briefly false but the query hasn't errored yet either — isLoading would
  // flicker to false in that gap and misrender the "no events" empty state.
  const { data, status, refetch, isRefetching } = usePublicScreenings({ limit: 50 });

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 50);
    return () => clearTimeout(t);
  }, []);

  const upcoming = useMemo(() => {
    const screenings = data?.screenings ?? [];
    const now = Date.now();
    return screenings
      .filter((s) => s.isActive && new Date(s.date).getTime() >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 9);
  }, [data]);

  if (!open) return null;

  const close = () => {
    setOpen(false);
    onDismiss?.();
  };

  const handleRegister = (screening) => {
    setOpen(false);
    onDismiss?.();
    navigate(`/register?screeningId=${screening.id}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Upcoming events"
      onClick={(e) => e.target === e.currentTarget && close()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(15,10,5,0.6)",
        backdropFilter: "blur(4px)",
        animation: "uepFadeIn 0.35s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "min(960px, 95vw)",
          width: "100%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "20px",
          background: "var(--cream, #FDF8F0)",
          border: "1px solid var(--card-border, rgba(244,165,53,0.25))",
          boxShadow: "0 40px 100px rgba(0,0,0,0.45)",
          animation: "uepSlideUp 0.38s cubic-bezier(0.22,0.9,0.32,1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            flexShrink: 0,
            padding: "clamp(22px,3.5vw,32px) clamp(24px,4vw,40px) 20px",
            borderBottom: "1px solid var(--card-border, rgba(244,165,53,0.18))",
            background: "var(--bg-alt, var(--pearl, #FAF6EF))",
            textAlign: "center",
            position: "relative",
          }}
        >
          <button
            onClick={close}
            aria-label="Close"
            className="uep-close"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid var(--card-border, rgba(61,35,20,0.15))",
              background: "var(--cream, #FDF8F0)",
              color: "var(--text-strong, #3D2314)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s, background 0.2s",
            }}
          >
            <X size={16} />
          </button>

          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(9px, 1.1vw, 11px)",
              letterSpacing: "6px",
              color: "var(--tulsi-deep, #7DAF6E)",
              textTransform: "uppercase",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Join Us
          </p>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(24px, 4vw, 30px)",
              fontWeight: 600,
              lineHeight: 1.2,
              color: "var(--text-strong, #3D2314)",
            }}
          >
            Upcoming Events
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            overflowY: "auto",
            padding: "clamp(20px,3vw,32px) clamp(24px,4vw,40px) clamp(28px,4vw,40px)",
          }}
        >
          {status === "pending" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid var(--card-border, rgba(61,35,20,0.1))",
                    background: "var(--card-bg, rgba(253,248,240,0.9))",
                  }}
                >
                  <div className="uep-shimmer" style={{ aspectRatio: "4 / 3" }} />
                  <div style={{ padding: "14px" }}>
                    <div className="uep-shimmer" style={{ height: "14px", borderRadius: "4px", marginBottom: "8px" }} />
                    <div className="uep-shimmer" style={{ height: "10px", width: "70%", borderRadius: "4px" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {status === "error" && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ color: "var(--lotus-deep, #E8909F)", fontSize: "14px", marginBottom: "14px", fontWeight: 600 }}>
                Couldn't load events right now.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isRefetching}
                style={{
                  padding: "9px 20px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  color: "var(--text-strong, #3D2314)",
                  background: "var(--saffron-light, #FDECC8)",
                  border: "1px solid var(--saffron, #F4A535)",
                  borderRadius: "8px",
                  cursor: isRefetching ? "default" : "pointer",
                  opacity: isRefetching ? 0.6 : 1,
                }}
              >
                {isRefetching ? "Retrying..." : "Try again"}
              </button>
            </div>
          )}

          {status === "success" && upcoming.length === 0 && (
            <p
              style={{
                textAlign: "center",
                color: "var(--text-main, #2A1A0E)",
                opacity: 0.6,
                fontSize: "14px",
                padding: "40px 0",
              }}
            >
              No upcoming events right now — check back soon.
            </p>
          )}

          {status === "success" && upcoming.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              {upcoming.map((screening) => (
                <div key={screening.id} className="uep-card">
                  <div className="uep-card-image">
                    {screening.image ? (
                      <img src={screening.image} alt={screening.title} loading="lazy" />
                    ) : (
                      <div className="uep-card-fallback" aria-hidden="true">
                        🎬
                      </div>
                    )}
                  </div>

                  <div className="uep-card-body">
                    <p className="uep-card-title">{screening.title}</p>

                    <div className="uep-card-meta">
                      <CalendarDays size={13} style={{ flexShrink: 0 }} />
                      <span>
                        {screening.localDate}
                        {screening.localTime ? ` · ${screening.localTime}` : ""}
                      </span>
                    </div>
                    <div className="uep-card-meta">
                      <MapPin size={13} style={{ flexShrink: 0 }} />
                      <span>
                        {screening.venue}
                        {screening.city ? `, ${screening.city}` : ""}
                      </span>
                    </div>

                    <button type="button" className="uep-card-register" onClick={() => handleRegister(screening)}>
                      <Ticket size={14} />
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes uepFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes uepSlideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes uepShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

        .uep-close:hover { transform: rotate(90deg); background: var(--saffron-light, #FDECC8); }

        .uep-shimmer {
          background: linear-gradient(90deg, var(--card-border, rgba(61,35,20,0.08)) 25%, var(--saffron-light, rgba(244,165,53,0.15)) 50%, var(--card-border, rgba(61,35,20,0.08)) 75%);
          background-size: 200% 100%;
          animation: uepShimmer 1.4s ease-in-out infinite;
        }

        .uep-card {
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          overflow: hidden;
          background: var(--card-bg, rgba(253,248,240,0.9));
          border: 1px solid var(--card-border, rgba(61,35,20,0.1));
          box-shadow: 0 4px 14px rgba(20,10,4,0.06);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .uep-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px rgba(20,10,4,0.16);
          border-color: var(--saffron, #F4A535);
        }

        .uep-card-image {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: linear-gradient(160deg, var(--bg-alt, #F5EBD8), var(--card-border, #EBDFC4));
        }
        .uep-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .uep-card:hover .uep-card-image img { transform: scale(1.06); }
        .uep-card-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }

        .uep-card-body {
          padding: 14px 14px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .uep-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 15.5px;
          font-weight: 600;
          color: var(--text-strong, #3D2314);
          margin-bottom: 8px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .uep-card-meta {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 11.5px;
          color: var(--text-main, #2A1A0E);
          opacity: 0.7;
          line-height: 1.5;
          margin-bottom: 4px;
        }
        .uep-card-register {
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 9px;
          font-family: 'Cinzel', serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #FAF0D9;
          background: linear-gradient(135deg, var(--saffron, #F4A535), var(--tulsi-deep, #7DAF6E));
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: filter 0.2s ease, transform 0.2s ease;
        }
        .uep-card-register:hover { filter: brightness(1.08); transform: translateY(-1px); }
      `}</style>
    </div>
  );
}
