const COLORS = ["#F4A535", "#7DAF6E", "#F7D580", "#E8909F"];

const DOTS = Array.from({ length: 34 }, (_, i) => ({
  left: `${(i * 29.7) % 100}%`,
  top: `${(i * 41.3) % 100}%`,
  size: 2 + (i % 4),
  drift: 14 + (i % 5) * 6,
  duration: 5 + (i % 6) * 1.4,
  delay: (i * 0.33) % 6,
  opacity: 0.18 + (i % 5) * 0.06,
  color: COLORS[i % COLORS.length],
}));

// Purely decorative bob-in-place particles for the plain background behind
// the login/register card — kept separate from the card so it never steals
// focus or pointer events.
export default function FloatingDots() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {DOTS.map((dot, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            borderRadius: "50%",
            background: dot.color,
            opacity: dot.opacity,
            boxShadow: `0 0 ${dot.size * 3}px ${dot.color}`,
            animation: `authDotFloat ${dot.duration}s ease-in-out ${dot.delay}s infinite`,
            "--drift": `${dot.drift}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes authDotFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(calc(-1 * var(--drift))); }
        }
      `}</style>
    </div>
  );
}
