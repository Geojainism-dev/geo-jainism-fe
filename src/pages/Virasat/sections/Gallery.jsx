import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Expand, Play } from "lucide-react";
import { GALLERY } from "../data/gallery";
import { useVirasat } from "../hooks/useSmoothScroll";
import { useMediaQuery } from "../hooks/useMotionPrefs";
import { gsap, useGsap, revealWords, revealUp } from "../animations/gsapAnimations";
import SplitWords from "../components/common/SplitWords";
import Ornament from "../components/common/Ornament";
import Lightbox from "../components/common/Lightbox";
import { useVT } from "../i18n";

/**
 * "The Virasat Experience" — a jharokha gallery.
 * Every photograph hangs in an arched temple window with a museum label
 * beneath it. The windows sit in staggered columns that drift at different
 * speeds as the section scrolls, and a soft lamp follows the pointer across
 * the dark wall.
 */

/** Window heights cycle so neighbouring arches never line up. */
const ASPECTS = ["3 / 4", "3 / 4.7", "3 / 3.9", "3 / 4.4"];
/** Plate number for each photo, fixed by its place in the full collection. */
const PLATE = Object.fromEntries(GALLERY.map((g, i) => [g.id, String(i + 1).padStart(2, "0")]));

function Jharokha({ item, aspect, onOpen, reducedMotion }) {
  const { v } = useVT();
  const isVideo = item.type === "video";
  return (
    <motion.li
      layout={!reducedMotion}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <button
        type="button"
        onClick={onOpen}
        className="group relative block w-full text-left"
        aria-label={`${isVideo ? v("vg.play", "Play film") : v("vg.enlarge", "Enlarge photo")}: ${item.caption}`}
      >
        {/* finial above the arch */}
        <span className="absolute -top-[18px] left-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border border-vr-gold/80 bg-vr-ink transition-colors duration-500 group-hover:bg-vr-gold" aria-hidden="true" />
        <span className="vr-jharokha relative block overflow-hidden rounded-t-full bg-vr-charcoal" style={{ aspectRatio: aspect }}>
          <img
            src={item.thumb}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08] group-focus-visible:scale-[1.08]"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vr-ink/70 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-30" />
          {isVideo ? (
            <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-vr-gold/70 bg-vr-ink/40 text-vr-gold-soft backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
              <Play size={18} strokeWidth={1.25} className="translate-x-0.5" fill="currentColor" />
            </span>
          ) : (
            <Expand
              size={16}
              strokeWidth={1.25}
              className="absolute bottom-4 right-4 text-vr-ivory/0 transition-colors duration-500 group-hover:text-vr-gold-soft"
              aria-hidden="true"
            />
          )}
        </span>

        {/* museum label */}
        <span className="mt-5 flex flex-col items-center gap-1.5 text-center">
          <span className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.3em] text-vr-gold sm:text-[0.62rem]">
            <span className="tabular-nums">{v("vg.plate", "No. {{n}}", { n: PLATE[item.id] })}</span>
          </span>
          <span className="font-vr-display text-[1.02rem] italic leading-snug text-vr-ivory/80 transition-colors duration-500 group-hover:text-vr-gold-soft sm:text-[1.15rem]">
            {item.caption}
          </span>
          <span className="h-px w-0 bg-vr-gold/70 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-16" aria-hidden="true" />
        </span>
      </button>
    </motion.li>
  );
}

export default function Gallery() {
  const ref = useRef(null);
  const { reducedMotion } = useVirasat();
  const [index, setIndex] = useState(null);
  const { v, lang } = useVT();
  const wide = useMediaQuery("(min-width: 1024px)");
  const colCount = wide ? 3 : 2;

  const items = useMemo(
    () => GALLERY.map((g) => ({ ...g, caption: v(`vg.${g.id}`, g.caption) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang]
  );
  // deal the photos into staggered columns, left to right
  const columns = useMemo(() => {
    const cols = Array.from({ length: colCount }, () => []);
    items.forEach((item, i) => cols[i % colCount].push({ item, i }));
    return cols;
  }, [items, colCount]);

  useGsap(
    ref,
    (root) => {
      revealWords(root);
      revealUp(root);
      // the columns drift at different speeds as the wall scrolls past
      const drift = wide ? [-50, 70, -30] : [-24, 36];
      root.querySelectorAll("[data-col]").forEach((col, c) => {
        gsap.fromTo(
          col,
          { y: drift[c] ?? 0 },
          { y: -(drift[c] ?? 0), ease: "none", scrollTrigger: { trigger: root.querySelector("[data-wall]"), start: "top bottom", end: "bottom top", scrub: true } }
        );
      });
    },
    [wide],
    { reducedMotion }
  );


  // a soft lamp that follows the pointer across the wall (desktop only, see .vr-gallery__lamp)
  const onMove = (e) => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - r.left}px`);
    el.style.setProperty("--gy", `${e.clientY - r.top}px`);
  };

  return (
    <section id="gallery" ref={ref} onPointerMove={onMove} className="vr-gallery relative overflow-hidden bg-vr-ink text-vr-ivory">
      {/* the wall: a faint carved jaali, warmed at the centre and darkened at the edges */}
      <div className="pointer-events-none absolute inset-0 text-vr-gold opacity-[0.035]">
        <Ornament.Jaali id="vr-jaali-gallery" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,rgba(100,28,43,0.4),transparent_60%),radial-gradient(ellipse_at_50%_50%,transparent_55%,rgba(0,0,0,0.6))]" />
      <div className="vr-gallery__lamp pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1600px] px-5 py-28 sm:px-8 lg:px-12 lg:py-36">
        {/* the hall's entrance */}
        <header className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="vr-eyebrow text-vr-gold" data-reveal>
            <span className="tabular-nums">04</span>
            <span className="vr-eyebrow__rule" aria-hidden="true" />
            <span>{v("vg.eyebrow", "The Virasat Experience")}</span>
          </p>
          <h2 className="vr-display mt-8 text-[clamp(2.6rem,6vw,6.25rem)]" aria-label={v("vg.title", "Moments That Celebrate Our Legacy").replace(/\*/g, "")}>
            <SplitWords text={v("vg.h1", "Moments That")} className="block" />
            <SplitWords text={v("vg.h2", "*Celebrate* Our Legacy")} className="block" />
          </h2>
          <Ornament.Divider className="mt-8 w-56 text-vr-gold" />
          <div className="mt-8 max-w-2xl space-y-3 text-[1.05rem] leading-[1.8] text-vr-ivory/65" data-reveal>
            <p className="font-vr-display text-[1.35rem] italic text-vr-ivory/90">{v("vg.p1", "Every Virasat performance creates memories that stay forever.")}</p>
            <p>
              {v(
                "vg.p2",
                "Explore the journey of Kavi Sajal Jain’s Virasat through powerful poetry, musical performances, spectacular stage moments and unforgettable audience experiences."
              )}
            </p>
          </div>
        </header>

        {/* the wall of jharokhas */}
        <div data-wall className="mx-auto mt-20 grid max-w-[1320px] grid-cols-2 gap-x-4 sm:gap-x-8 lg:mt-24 lg:grid-cols-3 lg:gap-x-14">
          {columns.map((col, c) => (
            <ul key={c} data-col className={`flex flex-col gap-y-14 sm:gap-y-20 ${c === 1 ? "pt-16 sm:pt-28 lg:pt-36" : c === 2 ? "lg:pt-12" : ""}`}>
                {col.map(({ item, i }) => (
                  <Jharokha
                    key={item.id}
                    item={item}
                    aspect={ASPECTS[(i + c) % ASPECTS.length]}
                    reducedMotion={reducedMotion}
                    onOpen={() => setIndex(i)}
                  />
                ))}
            </ul>
          ))}
        </div>
      </div>

      <Lightbox items={items} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </section>
  );
}
