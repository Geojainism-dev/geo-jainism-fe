/**
 * Splits text into masked words so headings can rise word by word
 * (see revealWords). Screen readers get the plain string via aria-label.
 * Wrap a word in *asterisks* to set it in the italic accent style.
 */
export default function SplitWords({ text, as: Tag = "span", className = "" }) {
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text.replace(/\*/g, "")} data-split>
      {words.map((w, i) => {
        // "*word*" or "*word*." — accent the word, keep trailing punctuation plain
        const m = w.match(/^\*(.+)\*([^*]*)$/);
        return (
          <span key={i} aria-hidden="true" className="vr-word-mask">
            <span data-word className="inline-block will-change-transform">
              {m ? (
                <>
                  <span className="vr-accent">{m[1]}</span>
                  {m[2]}
                </>
              ) : (
                w
              )}
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </Tag>
  );
}
