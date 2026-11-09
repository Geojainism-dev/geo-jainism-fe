import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { img, imgSm } from "../../data/media";
import Overlay from "../common/Overlay";
import { useShopT } from "../../i18n";

/**
 * Product gallery: thumbnails + main image with cursor-follow zoom on
 * desktop, swipe on touch, and a full-screen lightbox. Optional `extra`
 * renders as an additional "tab" (used for the 3D view).
 */
export default function Gallery({ product, extra = null, extraLabel = "3D view" }) {
  const reduce = useReducedMotion();
  const { s } = useShopT();
  const images = product.images;
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(null);
  const [lightbox, setLightbox] = useState(false);
  const touch = useRef(null);
  const total = images.length + (extra ? 1 : 0);
  const showExtra = extra && i === images.length;

  const go = (d) => setI((v) => (v + d + total) % total);

  const onMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {/* thumbnails */}
      <div className="flex gap-3 lg:w-20 lg:flex-col" role="tablist" aria-label={s("gallery.images", "Product images")}>
        {images.map((k, n) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={i === n}
            aria-label={s("gallery.image", "Image {{n}}", { n: n + 1 })}
            onClick={() => setI(n)}
            className={`relative aspect-[4/5] w-16 overflow-hidden border transition-colors lg:w-full ${i === n ? "border-gj-charcoal" : "border-transparent opacity-70 hover:opacity-100"}`}
          >
            <img src={imgSm(k)} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
        {extra && (
          <button
            type="button"
            role="tab"
            aria-selected={showExtra}
            onClick={() => setI(images.length)}
            className={`gj-keep grid aspect-[4/5] w-16 place-items-center border bg-gj-charcoal text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-gj-gold transition-colors lg:w-full ${showExtra ? "border-gj-gold" : "border-transparent"}`}
          >
            3D
          </button>
        )}
      </div>

      {/* stage */}
      <div
        className="relative aspect-[4/5] flex-1 overflow-hidden bg-gj-sand"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current == null || showExtra) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {showExtra ? (
            <motion.div key="extra" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {extra}
            </motion.div>
          ) : (
            <motion.button
              key={images[i]}
              type="button"
              className="absolute inset-0 block cursor-zoom-in overflow-hidden"
              onPointerMove={onMove}
              onPointerLeave={() => setZoom(null)}
              onClick={() => setLightbox(true)}
              aria-label={s("gallery.open", "Open full-screen image")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.45 }}
            >
              <img
                src={img(images[i])}
                alt={s("gallery.view", "{{name}} — view {{n}}", { name: product.name, n: i + 1 })}
                className="h-full w-full object-cover transition-transform duration-300 ease-out"
                style={zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
                fetchPriority={i === 0 ? "high" : undefined}
              />
            </motion.button>
          )}
        </AnimatePresence>

        {!showExtra && (
          <span className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-2 bg-gj-ivory/85 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.16em] text-gj-charcoal backdrop-blur">
            <Expand size={12} /> {s("gallery.hint", "Hover to zoom · click to enlarge")}
          </span>
        )}
        <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between lg:hidden">
          <button type="button" onClick={() => go(-1)} className="grid h-10 w-10 place-items-center rounded-full bg-gj-ivory/85" aria-label={s("gallery.prev", "Previous image")}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => go(1)} className="grid h-10 w-10 place-items-center rounded-full bg-gj-ivory/85" aria-label={s("gallery.next", "Next image")}>
            <ChevronRight size={18} />
          </button>
        </div>
        <p className="absolute bottom-4 left-4 text-xs tabular-nums text-gj-charcoal/70 lg:hidden" aria-hidden="true">
          {i + 1} / {total}
        </p>
      </div>

      <Overlay
        open={lightbox}
        onClose={() => setLightbox(false)}
        label={s("gallery.lightbox", "{{name}} images", { name: product.name })}
        variant="full"
        closeTone="light"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setI((v) => (v + 1) % images.length);
          if (e.key === "ArrowLeft") setI((v) => (v - 1 + images.length) % images.length);
        }}
      >
        <div className="flex flex-1 items-center justify-center overflow-hidden p-4 pt-16 sm:p-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={images[i % images.length]}
              src={img(images[i % images.length])}
              alt={s("gallery.view", "{{name}} — view {{n}}", { name: product.name, n: (i % images.length) + 1 })}
              className="max-h-full max-w-full object-contain"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.35 }}
            />
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-center gap-4 pb-8 text-gj-ivory">
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-white/25 hover:bg-white/10" onClick={() => setI((v) => (v - 1 + images.length) % images.length)} aria-label={s("gallery.prev", "Previous image")}>
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs tabular-nums tracking-[0.2em] text-white/60">
            {(i % images.length) + 1} / {images.length}
          </span>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-white/25 hover:bg-white/10" onClick={() => setI((v) => (v + 1) % images.length)} aria-label={s("gallery.next", "Next image")}>
            <ChevronRight size={18} />
          </button>
        </div>
      </Overlay>
    </div>
  );
}
