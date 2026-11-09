import { useEffect, useState } from "react";
import Modal from "./Modal";
import { VIDEO_CREDITS } from "../../data/gallery";
import { useVT } from "../../i18n";

/**
 * Attribution for the temporary CC-licensed media (required by CC BY-SA).
 * Reads /virasat/images/CREDITS.json lazily, only when opened.
 */
export default function CreditsDialog({ open, onClose }) {
  const [credits, setCredits] = useState(null);
  const { v } = useVT();

  useEffect(() => {
    if (!open || credits) return;
    fetch("/virasat/images/CREDITS.json")
      .then((r) => r.json())
      .then((json) => setCredits(Object.values(json)))
      .catch(() => setCredits([]));
  }, [open, credits]);

  const rows = [...(credits ?? []), ...VIDEO_CREDITS];

  return (
    <Modal open={open} onClose={onClose} label={v("credits.label", "Photo and film credits")}>
      <div className="max-h-[80vh] overflow-y-auto p-6 text-vr-ivory sm:p-10" data-lenis-prevent>
        <p className="vr-eyebrow mb-3">{v("credits.eyebrow", "Credits")}</p>
        <h3 className="vr-display mb-3 text-4xl">{v("credits.title", "Photography & film")}</h3>
        <p className="mb-8 max-w-xl text-sm text-vr-ivory/60">
          {v("credits.body", "Temporary imagery from Wikimedia Commons, used under the licences below. Each title links to its source page.")}
        </p>
        {credits === null ? (
          <p className="text-sm text-vr-ivory/50">{v("credits.loading", "Loading…")}</p>
        ) : (
          <ul className="divide-y divide-vr-ivory/10 text-sm">
            {rows.map((c) => (
              <li key={c.source} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto] sm:gap-6">
                <a href={c.source} target="_blank" rel="noopener noreferrer" className="vr-link truncate">
                  {c.title.replace(/^File:/, "")}
                </a>
                <span className="text-vr-ivory/55">
                  {c.author || v("credits.unknown", "Unknown")} · {c.license}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
