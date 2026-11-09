import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, CalendarDays, MapPin } from "lucide-react";
import { BRAND, HERO_MEDIA, srcSet } from "../data/site";
import { featuredEvent, eventDate } from "../data/events";
import { useVirasat } from "../hooks/useSmoothScroll";
import { useCanRender3D } from "../hooks/useMotionPrefs";
import { gsap, ScrollTrigger } from "../animations/gsapAnimations";
import Button from "../components/common/Button";
import { useVT } from "../i18n";

// Three.js + R3F only download when the 3D hero is actually used.
const SceneCanvas = lazy(() => import("../components/three/SceneCanvas"));
const HeroScene = lazy(() => import("../components/three/HeroScene"));

const PORTAL_VIDEO = "/virasat/videos/khajuraho-festival-01.webm";

const ease = [0.16, 1, 0.3, 1];

/** Non-3D hero background: looping film on larger screens, still photo on phones. */
function CinematicBackdrop({ reducedMotion }) {
  const [useVideo] = useState(() => !reducedMotion && window.matchMedia("(min-width: 768px)").matches);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {useVideo ? (
        <video className="h-full w-full object-cover" src={HERO_MEDIA.video} poster={HERO_MEDIA.poster} autoPlay muted loop playsInline aria-hidden="true" />
      ) : (
        <img
          src={HERO_MEDIA.poster}
          srcSet={srcSet(HERO_MEDIA.posterKey)}
          sizes="100vw"
          alt=""
          className={`h-full w-full object-cover ${reducedMotion ? "" : "vr-kenburns"}`}
          fetchPriority="high"
        />
      )}
    </div>
  );
}

export default function Hero({ introDone }) {
  const { openBooking, scrollTo, reducedMotion } = useVirasat();
  const use3D = useCanRender3D();
  const sectionRef = useRef(null);
  const progress = useRef(0);
  const [inView, setInView] = useState(true);
  const { v, tev, locale } = useVT();
  const show = tev(featuredEvent());
  const d = eventDate(show, locale);

  // scroll progress drives the camera walk + content fade
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => (progress.current = self.progress),
      });
      gsap.to("[data-hero-content]", {
        yPercent: -18,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "70% top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, [reducedMotion]);

  // stop rendering the WebGL scene once the hero is off-screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const appear = (delay) =>
    reducedMotion
      ? {}
      : { initial: { opacity: 0, y: 34 }, animate: introDone ? { opacity: 1, y: 0 } : {}, transition: { duration: 1.2, delay, ease } };

  return (
    <section id="home" ref={sectionRef} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-vr-ink" aria-label={v("brand.name", "Virasat")}>
      {use3D ? (
        <Suspense fallback={<CinematicBackdrop reducedMotion />}>
          <SceneCanvas className="!absolute inset-0" frameloop={inView ? "always" : "never"}>
            <HeroScene progress={progress} videoSrc={PORTAL_VIDEO} />
          </SceneCanvas>
        </Suspense>
      ) : (
        <CinematicBackdrop reducedMotion={reducedMotion} />
      )}

      {/* readability: left + bottom vignettes, plus film grain */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-vr-ink/85 via-vr-ink/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-vr-ink via-vr-ink/50 to-transparent" />
      {!use3D && <div className="pointer-events-none absolute inset-0 bg-vr-burgundy/25 mix-blend-multiply" />}
      <div className="vr-grain" aria-hidden="true" />

      <div data-hero-content className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-10 sm:px-8 lg:px-12 lg:pb-14">
        <div className="max-w-[54rem]">
          <motion.p className="vr-eyebrow mb-6 text-vr-gold" {...appear(0.1)}>
            <span className="hidden sm:inline">{BRAND.nameDeva}</span>
            <span className="vr-eyebrow__rule hidden sm:block" aria-hidden="true" />
            <span>{v("hero.season", "Live heritage season · 2026–27")}</span>
          </motion.p>

          <h1 className="vr-display text-vr-ivory">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block text-[clamp(4.2rem,13.5vw,12.5rem)] font-light uppercase leading-[0.82] tracking-[0.06em]"
                initial={reducedMotion ? false : { yPercent: 110 }}
                animate={introDone ? { yPercent: 0 } : {}}
                transition={{ duration: 1.5, ease }}
              >
                {BRAND.name}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="mt-3 block text-[clamp(1.6rem,3.4vw,3.1rem)] font-light italic leading-tight text-vr-ivory/90"
                initial={reducedMotion ? false : { yPercent: 110 }}
                animate={introDone ? { yPercent: 0 } : {}}
                transition={{ duration: 1.4, delay: 0.15, ease }}
              >
                {v("brand.tagline", BRAND.tagline)}
              </motion.span>
            </span>
          </h1>

          <motion.div className="mt-9 flex flex-wrap items-center gap-4" {...appear(0.45)}>
            <Button size="lg" onClick={() => openBooking()}>
              {v("cta.book", "Book Tickets")}
            </Button>
            <Button variant="ghost" size="lg" icon={false} onClick={() => scrollTo("about")}>
              {v("hero.discover", "Discover the Experience")}
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 flex flex-col gap-6 border-t border-vr-ivory/15 pt-6 text-vr-ivory sm:flex-row sm:items-end sm:justify-between"
          {...appear(0.65)}
        >
          <button type="button" onClick={() => openBooking(show.id)} className="group flex items-center gap-5 text-left" aria-label={v("hero.nextAria", "Next show: {{title}}. Book tickets", { title: show.title })}>
            <span className="font-vr-display text-5xl font-light leading-none text-vr-gold tabular-nums">{d.day}</span>
            <span className="flex flex-col gap-1">
              <span className="text-[0.68rem] uppercase tracking-[0.3em] text-vr-ivory/55">{v("hero.next", "Next performance")}</span>
              <span className="font-vr-display text-2xl leading-tight transition-colors group-hover:text-vr-gold">
                {show.title} <span className="italic text-vr-ivory/60">— {locale === "en-IN" ? show.subtitle.toLowerCase() : show.subtitle}</span>
              </span>
              <span className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-vr-ivory/65">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} strokeWidth={1.5} /> {d.month} {d.year} · {d.time}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} strokeWidth={1.5} /> {show.venue}, {show.city}
                </span>
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => scrollTo("about")}
            className="hidden items-center gap-3 text-[0.68rem] uppercase tracking-[0.3em] text-vr-ivory/60 transition-colors hover:text-vr-ivory sm:inline-flex"
          >
            {v("hero.scroll", "Scroll to enter")}
            <span className="grid h-10 w-10 place-items-center rounded-full border border-vr-ivory/25">
              <ArrowDown size={14} className={reducedMotion ? "" : "vr-bob"} />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
