import SplitWords from "./SplitWords";

/**
 * Editorial section heading: a numbered eyebrow (e.g. "02 — About Virasat")
 * and a large display title that reveals word by word.
 */
export default function SectionHeading({ index, eyebrow, title, align = "left", tone = "light", className = "", titleClassName = "" }) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";
  const toneCls = tone === "dark" ? "text-vr-charcoal" : "text-vr-ivory";
  return (
    <header className={`flex flex-col gap-6 ${alignCls} ${toneCls} ${className}`}>
      <p className="vr-eyebrow" data-reveal>
        {index && <span className="tabular-nums">{index}</span>}
        {index && <span className="vr-eyebrow__rule" aria-hidden="true" />}
        <span>{eyebrow}</span>
      </p>
      <h2 className={`vr-display text-[clamp(2.75rem,6.4vw,6.5rem)] ${titleClassName}`}>
        <SplitWords text={title} />
      </h2>
    </header>
  );
}
