import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { img, imgSm, srcSet } from "../data/site";
import { useVirasat } from "../hooks/useSmoothScroll";
import { useMediaQuery } from "../hooks/useMotionPrefs";
import { gsap, useGsap, revealWords, revealUp, revealImages } from "../animations/gsapAnimations";
import SplitWords from "../components/common/SplitWords";
import Ornament from "../components/common/Ornament";
import { useVT } from "../i18n";

const ACTS = [
  {
    n: "I",
    deva: "राग",
    title: "Raag",
    theme: "Traditional music",
    body: "Hours-long raags unfold from a single drone — sarangi, shehnai and tabla answering one another until the courtyard holds its breath.",
    main: "manganiyar",
    mainAlt: "Manganiyar musicians performing on steps at a festival",
    second: "tabla",
    secondAlt: "A tabla player in concert",
  },
  {
    n: "II",
    deva: "नृत्य",
    title: "Nritya",
    theme: "Classical dance",
    body: "Kathak’s spins, Odissi’s sculpted curves and Bharatanatyam’s geometry — codified over centuries, performed against the temples that inspired them.",
    main: "kathak-festival",
    mainAlt: "Kathak dancers performing on a festival stage",
    second: "odissi-festival",
    secondAlt: "An Odissi dancer in costume and jewellery",
  },
  {
    n: "III",
    deva: "लोक",
    title: "Lok",
    theme: "Folk traditions",
    body: "Kalbelia and Ghoomar arrive in a blaze of mirrorwork and whirling skirts, carrying the songs of desert communities into the night.",
    main: "kalbelia-desert",
    mainAlt: "A Kalbelia dancer whirling in the desert",
    second: "ghoomar",
    secondAlt: "A Ghoomar dancer mid-spin with musicians behind",
    tall: true,
  },
  {
    n: "IV",
    deva: "कलाकार",
    title: "Kalakar",
    theme: "The artists",
    body: "Gharana masters share the stage with the students they are training — voices and hands that keep an unbroken line alive.",
    main: "sound-of-desert",
    mainAlt: "Two Rajasthani musicians playing string instruments",
    second: "manganiyar-singers",
    secondAlt: "A Manganiyar singer in a colourful turban",
  },
  {
    n: "V",
    deva: "उत्सव",
    title: "Utsav",
    theme: "Stage & audience",
    body: "Lit monuments for a backdrop, lamps underfoot, and an audience close enough to hear the ghungroo — every show ends as a celebration.",
    main: "dance-stage",
    mainAlt: "An illuminated temple stage with a dancer at night",
    second: "diyas",
    secondAlt: "A row of lit oil lamps",
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
  const k = `act.${raw.title.toLowerCase()}`;
  const act = {
    ...raw,
    theme: v(`${k}.theme`, raw.theme),
    body: v(`${k}.body`, raw.body),
    mainAlt: v(`${k}.mainAlt`, raw.mainAlt),
    secondAlt: v(`${k}.secondAlt`, raw.secondAlt),
  };
  return (
    <article className="vr-act relative flex shrink-0 items-center lg:h-screen lg:w-[86vw] xl:w-[78vw]" aria-labelledby={`act-${act.title}`}>
      <div className="grid w-full items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-0">
        <div className={`relative lg:col-span-7 ${act.tall ? "lg:col-start-2 lg:col-span-5" : ""}`}>
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

        <div className={`relative flex flex-col gap-6 lg:col-span-5 ${act.tall ? "lg:col-span-5 lg:col-start-8" : ""}`}>
          <figure className="relative hidden w-[58%] self-end overflow-hidden lg:block" data-hx="80">
            <div className="aspect-[4/3] overflow-hidden" data-clip="left">
              <img src={imgSm(act.second)} alt={act.secondAlt} className="h-full w-full object-cover" loading="lazy" />
            </div>
          </figure>
          <p className="vr-eyebrow text-vr-gold">
            <span className="tabular-nums">{v("act.label", "Act {{n}}", { n: String(index + 1).padStart(2, "0") })}</span>
            <span className="vr-eyebrow__rule" aria-hidden="true" />
            <span>{act.theme}</span>
          </p>
          <h3 id={`act-${act.title}`} className="flex items-baseline gap-5 text-vr-ivory">
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
              <span>{v("exp.eyebrow", "The Grand Live Experience")}</span>
            </p>
            <h2 id="experience-title" className="vr-display relative text-[clamp(3.4rem,7.5vw,8.5rem)]">
              <SplitWords text={v("exp.h1", "One evening.")} className="block" />
              <SplitWords text={v("exp.h2", "*Five* acts.")} className="block" />
              <SplitWords text={v("exp.h3", "A thousand years.")} className="block text-vr-gold" />
            </h2>
            <p className="relative mt-10 max-w-md text-[1.08rem] leading-[1.8] text-vr-ivory/65" data-reveal>
              {v("exp.body", "Every Virasat evening moves through music, dance, folk, artistry and celebration — staged in the open air, under monuments that have heard these sounds before.")}
            </p>
            <p className="relative mt-10 hidden items-center gap-3 text-[0.68rem] uppercase tracking-[0.3em] text-vr-ivory/45 lg:flex" data-reveal>
              <span className="h-px w-10 bg-vr-ivory/30" /> {v("exp.keep", "Keep scrolling")}
            </p>
          </div>

          {ACTS.map((act, i) => (
            <Act key={act.title} act={act} index={i} reducedMotion={reducedMotion} />
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
