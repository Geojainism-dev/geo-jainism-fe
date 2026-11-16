import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { img, imgSm, srcSet } from "../data/site";
import { useVirasat } from "../hooks/useSmoothScroll";
import { useMediaQuery } from "../hooks/useMotionPrefs";
import { gsap, useGsap, revealWords, revealUp, revealImages } from "../animations/gsapAnimations";
import SplitWords from "../components/common/SplitWords";
import Ornament from "../components/common/Ornament";
import { useVT } from "../i18n";

/** Experience categories — not a fixed running order; each evening is curated from them. */
const ACTS = [
  {
    n: "I",
    id: "veer-ras",
    deva: "वीर रस",
    title: "Veer Ras",
    theme: "The Spirit of Valour",
    body: "Powerful poetry celebrating the courage, sacrifice and extraordinary achievements of Jain kings, warriors and legendary personalities.",
    main: "vs-lalitpur",
    mainAlt: "A towering standing Tirthankara sculpture beneath a stone canopy",
    second: "vs-rock-jina",
    secondAlt: "A seated Tirthankara carved into a rock face",
    tall: true,
  },
  {
    n: "II",
    id: "kavya",
    deva: "काव्य",
    title: "Kavya",
    theme: "The Power of Words",
    body: "Soul-stirring poetry, वीर रस, श्रृंगार and हास्य presentations connecting audiences with emotions, values and heritage.",
    main: "vs-inscription",
    mainAlt: "An ancient Brahmi inscription carved into the rock of a cave",
    second: "vs-kalpasutra",
    secondAlt: "A painted folio from a Kalpasutra manuscript",
  },
  {
    n: "III",
    id: "itihaas",
    deva: "इतिहास",
    title: "Itihaas",
    theme: "Stories Untold",
    body: "The extraordinary stories of Bhagwan Bahubali, Bharat Chakravarti, Bhagwan Neminath, Rajul and forgotten chapters of Jain history.",
    main: "vs-samanar-malai",
    mainAlt: "A row of Tirthankara reliefs carved along a granite hill",
    second: "vs-kalugumalai",
    secondAlt: "Tirthankara reliefs at Kalugumalai",
  },
  {
    n: "IV",
    id: "sangeet",
    deva: "संगीत",
    title: "Sangeet",
    theme: "The Soul of Heritage",
    body: "Soulful musical performances celebrating Jain devotion, spirituality, culture and timeless traditions.",
    main: "diyas",
    mainAlt: "A row of lit oil lamps glowing in the dark",
    second: "vs-tirthankara",
    secondAlt: "A golden Tirthankara idol in a temple shrine",
  },
  {
    n: "V",
    id: "mahotsav",
    deva: "महोत्सव",
    title: "Mahotsav",
    theme: "The Grand Celebration",
    body: "A spectacular culmination of poetry, music, performances and collective celebration.",
    main: "vs-dilwara",
    mainAlt: "The intricately carved marble dome of the Dilwara Jain temple",
    second: "vs-gulbarga",
    secondAlt: "A Tirthankara sculpture lit in a dark stone niche",
  },
];

/** Image that tilts towards the cursor in 3D. */
function TiltImage({ src, set, alt, className = "", reducedMotion }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 18 });
  const onMove = (e) => {
    if (reducedMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };
  return (
    <div className={`[perspective:1400px] ${className}`} onPointerMove={onMove} onPointerLeave={reset}>
      <motion.figure style={{ rotateX: rx, rotateY: ry }} className="relative h-full w-full overflow-hidden [transform-style:preserve-3d]" data-clip="up">
        <img src={src} srcSet={set} sizes="(min-width: 1024px) 45vw, 100vw" alt={alt} className="h-full w-full scale-[1.04] object-cover" loading="lazy" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vr-ink/50 to-transparent" />
      </motion.figure>
    </div>
  );
}

function Act({ act: raw, index, reducedMotion }) {
  const { v } = useVT();
  const k = `ve.${raw.id}`;
  const act = {
    ...raw,
    theme: v(`${k}.theme`, raw.theme),
    body: v(`${k}.body`, raw.body),
    mainAlt: v(`${k}.mainAlt`, raw.mainAlt),
    secondAlt: v(`${k}.secondAlt`, raw.secondAlt),
  };
  return (
    <article className="vr-act relative flex shrink-0 items-center lg:h-screen lg:w-[86vw] xl:w-[78vw]" aria-labelledby={`act-${act.id}`}>
      <div className="grid w-full items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-0">
        {/* one col-span per breakpoint: conflicting spans pushed the copy of a tall act onto a second row */}
        <div className={`relative ${act.tall ? "lg:col-span-5 lg:col-start-2" : "lg:col-span-7"}`}>
          <TiltImage
            src={img(act.main)}
            set={srcSet(act.main)}
            alt={act.mainAlt}
            reducedMotion={reducedMotion}
            className={act.tall ? "aspect-[4/5] lg:h-[74vh] lg:aspect-auto" : "aspect-[16/10] lg:h-[62vh] lg:aspect-auto"}
          />
          <span
            className="pointer-events-none absolute -top-10 left-2 select-none font-vr-display text-[clamp(6rem,14vw,13rem)] font-light italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(198,161,91,0.55)] lg:-left-10 lg:-top-16"
            data-hx="-60"
            aria-hidden="true"
          >
            {act.n}
          </span>
        </div>

        <div className={`relative flex flex-col gap-6 ${act.tall ? "lg:col-span-5 lg:col-start-8" : "lg:col-span-5"}`}>
          <figure className="relative hidden w-[58%] self-end overflow-hidden lg:block" data-hx="80">
            <div className="aspect-[4/3] overflow-hidden" data-clip="left">
              <img src={imgSm(act.second)} alt={act.secondAlt} className="h-full w-full object-cover" loading="lazy" />
            </div>
          </figure>
          <p className="vr-eyebrow text-vr-gold">
            <span className="tabular-nums">{v("ve.act", "Act {{n}}", { n: String(index + 1).padStart(2, "0") })}</span>
            <span className="vr-eyebrow__rule" aria-hidden="true" />
            <span>{act.theme}</span>
          </p>
          <h3 id={`act-${act.id}`} className="flex items-baseline gap-5 text-vr-ivory">
            <span className="vr-display text-[clamp(3.4rem,6vw,6rem)]">{act.title}</span>
            <span className="font-vr-deva text-[clamp(1.6rem,2.4vw,2.4rem)] text-vr-gold/80" lang="hi">
              {act.deva}
            </span>
          </h3>
          <p className="max-w-md text-[1.08rem] leading-[1.8] text-vr-ivory/70">{act.body}</p>
        </div>
      </div>
    </article>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);
  const { reducedMotion } = useVirasat();
  const { v } = useVT();
  const horizontal = useMediaQuery("(min-width: 1024px)");

  useGsap(
    ref,
    (root) => {
      revealWords(root);
      revealUp(root);
      // tablet / mobile: vertical stack with standard reveals
      if (!horizontal) {
        revealImages(root);
        return;
      }

      // desktop: pin and travel the acts horizontally
      {
        const el = track.current;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.querySelector("[data-pin]"),
            pin: true,
            scrub: 0.8,
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => bar.current && (bar.current.style.transform = `scaleX(${self.progress})`),
          },
        });
        // horizontal parallax layers within the moving track
        el.querySelectorAll("[data-hx]").forEach((layer) => {
          gsap.fromTo(
            layer,
            { x: Number(layer.dataset.hx) },
            {
              x: -Number(layer.dataset.hx),
              ease: "none",
              scrollTrigger: { trigger: layer.closest(".vr-act"), containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            }
          );
        });
        // clip reveals for each act as it slides in
        el.querySelectorAll("[data-clip]").forEach((clip) => {
          gsap.fromTo(
            clip,
            { clipPath: clip.dataset.clip === "left" ? "inset(0% 100% 0% 0%)" : "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "expo.inOut",
              duration: 1.4,
              scrollTrigger: { trigger: clip, containerAnimation: tween, start: "left 85%", toggleActions: "play none none none" },
            }
          );
        });
      }
    },
    [horizontal],
    { reducedMotion }
  );

  return (
    <section
      id="experience"
      ref={ref}
      className={`relative bg-vr-ink text-vr-ivory ${reducedMotion ? "vr-exp-static" : ""}`}
      aria-labelledby="experience-title"
    >
      <div data-pin className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(100,28,43,0.55),transparent_60%)]" />
        <div ref={track} className="vr-track relative flex flex-col lg:w-max lg:flex-row">
          {/* intro panel */}
          <div className="vr-exp-intro relative flex shrink-0 flex-col justify-center px-5 pb-6 pt-28 sm:px-8 lg:h-screen lg:w-[64vw] lg:px-12 lg:pb-0 lg:pt-0 xl:w-[56vw]">
            <Ornament.Mandala className="pointer-events-none absolute -left-40 top-1/2 hidden w-[44rem] -translate-y-1/2 text-vr-gold/[0.08] lg:block vr-spin-slow" />
            <p className="vr-eyebrow relative mb-8 text-vr-gold" data-reveal>
              <span className="tabular-nums">02</span>
              <span className="vr-eyebrow__rule" aria-hidden="true" />
              <span>{v("ve.eyebrow", "Experience Virasat")}</span>
            </p>
            <h2 id="experience-title" className="vr-display relative text-[clamp(3rem,6.2vw,7rem)]">
              <SplitWords text={v("ve.h1", "One Stage.")} className="block" />
              <SplitWords text={v("ve.h2", "Countless *Stories.*")} className="block" />
              <SplitWords text={v("ve.h3", "An Eternal Heritage.")} className="block text-vr-gold" />
            </h2>
            <p className="relative mt-10 max-w-md text-[1.08rem] leading-[1.8] text-vr-ivory/65" data-reveal>
              {v(
                "ve.body",
                "An immersive journey through the glorious chapters of Jain history, brought alive through powerful poetry, music, historical storytelling and spectacular stage performances."
              )}
            </p>
            <p className="relative mt-5 max-w-md border-l border-vr-gold/40 pl-4 text-sm leading-relaxed text-vr-ivory/50" data-reveal>
              {v("ve.note", "Five experiences, not a fixed running order — every Virasat evening is curated from them.")}
            </p>
            <p className="relative mt-10 hidden items-center gap-3 text-[0.68rem] uppercase tracking-[0.3em] text-vr-ivory/45 lg:flex" data-reveal>
              <span className="h-px w-10 bg-vr-ivory/30" /> {v("ve.keep", "Keep scrolling")}
            </p>
          </div>

          {ACTS.map((act, i) => (
            <Act key={act.id} act={act} index={i} reducedMotion={reducedMotion} />
          ))}
          <div className="hidden shrink-0 lg:block lg:w-[8vw]" aria-hidden="true" />
        </div>

        {/* progress */}
        <div className="absolute bottom-8 left-12 right-12 hidden h-px bg-vr-ivory/10 lg:block" aria-hidden="true">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-vr-gold" />
        </div>
      </div>
    </section>
  );
}
