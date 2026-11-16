/**
 * Renders a string in which **double-starred** phrases are highlighted
 * (maroon accent by default). Keeps emphasis inside translatable copy.
 */
export default function Highlight({ text, className = "text-vr-maroon" }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className={`font-semibold ${className}`}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}
