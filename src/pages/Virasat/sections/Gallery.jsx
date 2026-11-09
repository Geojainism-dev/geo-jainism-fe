import { useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Expand, Play } from "lucide-react";
import { GALLERY, GALLERY_FILTERS } from "../data/gallery";
import { useVirasat } from "../hooks/useSmoothScroll";
import { useGsap, revealWords, revealUp } from "../animations/gsapAnimations";
import SectionHeading from "../components/common/SectionHeading";
import Lightbox from "../components/common/Lightbox";
import { useVT } from "../i18n";

const SPAN = {
  tall: "row-span-2",
  wide: "col-span-2",
  square: "",
};

function Tile({ item, onOpen, reducedMotion }) {
  const { v } = useVT();
  const isVideo = item.type === "video";
  return (
    <motion.li
      layout={!reducedMotion}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`relative ${SPAN[item.span] ?? ""}`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group relative block h-full w-full overflow-hidden bg-vr-charcoal text-left"
        aria-label={`${isVideo ? v("gallery.play", "Play film") : v("gallery.enlarge", "Enlarge photo")}: ${item.caption}`}
      >
        <img
          src={item.thumb}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07] group-focus-visible:scale-[1.07]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-vr-ink/85 via-vr-ink/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
        {isVideo && (
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-vr-ivory/60 bg-vr-ink/30 text-vr-ivory backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
            <Play size={20} strokeWidth={1.25} className="translate-x-0.5" fill="currentColor" />
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
          <span className="translate-y-2 font-vr-display text-lg italic leading-snug text-vr-ivory opacity-90 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:text-xl">
            {item.caption}
          </span>
          {!isVideo && (
            <Expand size={16} strokeWidth={1.25} className="shrink-0 text-vr-ivory/0 transition-colors duration-500 group-hover:text-vr-ivory/80" aria-hidden="true" />
          )}
        </span>
      </button>
    </motion.li>
  );
}

export default function Gallery() {
  const ref = useRef(null);
  const { reducedMotion } = useVirasat();
  const [filter, setFilter] = useState("all");
  const [index, setIndex] = useState(null);
  const { v, lang } = useVT();

  const items = useMemo(
    () => (filter === "all" ? GALLERY : GALLERY.filter((g) => g.category === filter)).map((g) => ({ ...g, caption: v(`gal.${g.id}`, g.caption) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter, lang]
  );

  useGsap(
    ref,
    (root) => {
      revealWords(root);
      revealUp(root);
    },
    [],
    { reducedMotion }
  );

  return (
    <section id="gallery" ref={ref} className="relative bg-vr-ink text-vr-ivory">
      <div className="mx-auto max-w-[1600px] px-5 py-28 sm:px-8 lg:px-12 lg:py-36">
        <div className="mb-14 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading index="04" eyebrow={v("gallery.eyebrow", "Photo & Video Gallery")} title={v("gallery.title", "Moments that *stayed*.")} />
          <LayoutGroup id="gallery-filters">
            <div role="tablist" aria-label={v("gallery.filter", "Filter gallery")} className="flex flex-wrap gap-x-1 gap-y-2" data-reveal>
              {GALLERY_FILTERS.map((f) => (
                <button
                  key={f.id}
                  role="tab"
                  type="button"
                  aria-selected={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className={`relative px-4 py-2 text-[0.72rem] uppercase tracking-[0.22em] transition-colors ${filter === f.id ? "text-vr-ink" : "text-vr-ivory/65 hover:text-vr-ivory"}`}
                >
                  {filter === f.id && (
                    <motion.span layoutId="gallery-pill" className="absolute inset-0 rounded-full bg-vr-gold" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <span className="relative">{v(`galf.${f.id}`, f.label)}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>

        <motion.ul layout={!reducedMotion} className="grid grid-flow-dense auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[14rem] md:grid-cols-3 lg:auto-rows-[16rem] lg:grid-cols-4 lg:gap-4">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <Tile key={item.id} item={item} reducedMotion={reducedMotion} onOpen={() => setIndex(i)} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      <Lightbox items={items} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </section>
  );
}
