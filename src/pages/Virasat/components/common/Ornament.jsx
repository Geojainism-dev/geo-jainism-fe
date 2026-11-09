/**
 * Line ornaments drawn in currentColor, kept thin and sparing:
 *  - <Ornament.Divider/>  a rule with a small lotus-bud centre
 *  - <Ornament.Jaali/>    a lattice tile used as a faint background texture
 *  - <Ornament.Mandala/>  a large concentric motif for watermarks
 */
function Divider({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 220 16" fill="none" aria-hidden="true">
      <path d="M0 8h88M132 8h88" stroke="currentColor" strokeWidth="0.75" />
      <path d="M110 1.5c3.2 3 4.8 4.9 4.8 6.5S113.2 11.5 110 14.5c-3.2-3-4.8-4.9-4.8-6.5S106.8 4.5 110 1.5Z" stroke="currentColor" strokeWidth="0.75" />
      <path d="M95 8c4.5 0 8-1.8 10.5-4.2M95 8c4.5 0 8 1.8 10.5 4.2M125 8c-4.5 0-8-1.8-10.5-4.2M125 8c-4.5 0-8 1.8-10.5 4.2" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="91" cy="8" r="1.2" fill="currentColor" />
      <circle cx="129" cy="8" r="1.2" fill="currentColor" />
    </svg>
  );
}

function Jaali({ className = "", id = "vr-jaali" }) {
  return (
    <svg className={className} aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <path
            d="M28 4 34 22 52 28 34 34 28 52 22 34 4 28 22 22Z M0 0 10 10M56 0 46 10M0 56 10 46M56 56 46 46"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
          />
          <circle cx="28" cy="28" r="4" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function Mandala({ className = "" }) {
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="0.6">
        {[196, 170, 120, 70, 34].map((r) => (
          <circle key={r} cx="200" cy="200" r={r} />
        ))}
        {petals.map((a) => (
          <g key={a} transform={`rotate(${a} 200 200)`}>
            <path d="M200 30c18 30 22 58 0 90-22-32-18-60 0-90Z" />
            <path d="M200 130c9 14 11 28 0 40-11-12-9-26 0-40Z" />
            <circle cx="200" cy="18" r="3" />
          </g>
        ))}
      </g>
    </svg>
  );
}

const Ornament = { Divider, Jaali, Mandala };
export default Ornament;
