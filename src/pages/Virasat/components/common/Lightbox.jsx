import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "./Modal";
import { useVirasat } from "../../hooks/useSmoothScroll";
import { useVT } from "../../i18n";

/**
 * Full-screen viewer for gallery items. Images and films share one viewer:
 * arrows / ←→ keys / swipe step through `items`; films autoplay with sound
 * controls and pause when you move on.
 */
export default function Lightbox({ items, index, onClose, onIndex }) {
  const { reducedMotion } = useVirasat();
  const { v } = useVT();
  const open = index !== null && index !== undefined;
  const item = open ? items[index] : null;
  const touch = useRef(null);
  const videoRef = useRef(null);

  const step = (dir) => onIndex((index + dir + items.length) % items.length);

  useEffect(() => {
    if (item?.type === "video") videoRef.current?.play().catch(() => {});
  }, [item]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };

  return (
    <Modal open={open} onClose={onClose} label={item ? item.caption : v("gallery.label", "Gallery")} variant="fullscreen" onKeyDown={onKeyDown}>
      {item && (
        <div
          className="relative flex h-full w-full flex-col"
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pt-16 sm:px-20">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.id}
                className="flex h-full w-full items-center justify-center"
                initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.02 }}
                transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {item.type === "video" ? (
                  <video
                    ref={videoRef}
                    src={item.video}
                    poster={item.src}
                    controls
                    playsInline
                    className="max-h-[78vh] w-full max-w-6xl bg-black object-contain"
                  />
                ) : (
                  <img src={item.src} alt={item.caption} className="max-h-[78vh] max-w-full object-contain shadow-2xl" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between gap-6 px-4 py-6 text-vr-ivory sm:px-10">
            <p className="min-w-0 flex-1 font-vr-display text-lg italic text-vr-ivory/85 sm:text-2xl">{item.caption}</p>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-xs tabular-nums tracking-[0.2em] text-vr-ivory/50">
                {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <button type="button" className="vr-stepper" onClick={() => step(-1)} aria-label={v("gallery.prev", "Previous")}>
                <ChevronLeft size={18} strokeWidth={1.25} />
              </button>
              <button type="button" className="vr-stepper" onClick={() => step(1)} aria-label={v("gallery.next", "Next")}>
                <ChevronRight size={18} strokeWidth={1.25} />
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
