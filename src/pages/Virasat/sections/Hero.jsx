import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, CalendarDays, MapPin, Play, Volume2, VolumeX } from "lucide-react";
import { BRAND, HERO_MEDIA, srcSet } from "../data/site";
import { featuredEvent, eventDate } from "../data/events";
import { useVirasat } from "../hooks/useSmoothScroll";
import { gsap } from "../animations/gsapAnimations";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { useVT } from "../i18n";

const ease = [0.16, 1, 0.3, 1];

/**
 * Hero film, looping endlessly and graded to monochrome. On desktop it is
 * framed to the right (feathered into the dark on its left edge) so the
 * performer sits beside the title, not under it; on phones it fills the top
 * of the screen and fades into the copy below. It fades up from black once
 * it is actually playing, drifts slowly like a camera move, and pauses while
 * the hero is off-screen. Reduced-motion visitors get the still poster.
 */
function HeroVideo({ reducedMotion, sectionRef, videoRef, holdRef }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const el = sectionRef.current;
    if (!video || !el) return undefined;
    // autoplay can start before React attaches handlers, so check as well as listen
    const reveal = () => setPlaying(true);
    if (!video.paused && video.readyState > 2) reveal();
    video.addEventListener("playing", reveal, { once: true });
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !holdRef.current) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      video.removeEventListener("playing", reveal);
    };
  }, [sectionRef, videoRef, holdRef]);

  return (
    <div className="vr-film-frame absolute inset-x-0 top-0 h-[66svh] overflow-hidden lg:inset-y-0 lg:left-auto lg:h-auto lg:w-[80%]">
      {reducedMotion ? (
        <img
          src={HERO_MEDIA.poster}
          srcSet={srcSet(HERO_MEDIA.posterKey)}
          sizes="(min-width: 1024px) 80vw, 100vw"
          alt=""
          className="vr-film-grade h-full w-full object-cover"
          fetchPriority="high"
        />
      ) : (
        /* scroll parallax target (GSAP) → slow camera drift + grade (CSS) → film */
        <div data-hero-film className="absolute inset-0 will-change-transform">
          <div className="vr-film-drift vr-film-grade absolute inset-0">
            <video
              ref={videoRef}
              className={`vr-film-reveal h-full w-full object-cover object-[50%_50%] sm:object-[34%_50%] lg:object-[12%_50%] ${playing ? "is-playing" : ""}`}
              src={HERO_MEDIA.video}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
            />
          </div>
        </div>
      )}
      {/* warm the monochrome slightly, and sink the top-right corner (where the source carries a watermark) */}
      <div className="vr-film-tone pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="vr-film-corner pointer-events-none absolute inset-0" aria-hidden="true" />
    </div>
  );
}

/** The full performance with sound and controls, in a fullscreen dialog. */
function FilmModal({ open, onClose, label }) {
  return (
    <Modal open={open} onClose={onClose} label={label} variant="fullscreen">
      <div className="flex h-full w-full flex-col items-center justify-center gap-5 px-4 pb-10 pt-16 sm:px-20">
        <video src={HERO_MEDIA.video} controls autoPlay playsInline className="max-h-[78vh] w-full max-w-6xl bg-black object-contain shadow-2xl" />
        <p className="font-vr-display text-lg italic text-vr-ivory/80 sm:text-2xl">{label}</p>
      </div>
    </Modal>
  );
}

/** Anamorphic letterbox bars: start closed like a darkened screen, then part to a widescreen frame. */
function Letterbox({ open }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5]" aria-hidden="true">
      <motion.div
        className="absolute inset-x-0 top-0 bg-black"
        initial={{ height: "50.5%" }}
        animate={{ height: open ? "0%" : "50.5%" }}
        transition={{ duration: 2.2, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 bg-black"
        initial={{ height: "50.5%" }}
        animate={{ height: open ? "0%" : "50.5%" }}
        transition={{ duration: 2.2, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  );
}

export default function Hero({ introDone }) {
  const { scrollTo, reducedMotion } = useVirasat();
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const holdRef = useRef(false); // true while the full film is open, so the hero loop stays paused
  const [soundOn, setSoundOn] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const { v, tev, locale } = useVT();
  const show = tev(featuredEvent());
  const d = eventDate(show, locale);

  // content drifts up and fades as the hero scrolls away
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      // the film pushes in and sinks slower than the page: depth on scroll
      gsap.to("[data-hero-film]", {
        scale: 1.14,
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
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

  // browsers only allow sound after a tap, so the loop starts muted and this toggles it
  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !soundOn;
    video.muted = !next;
    if (next) video.play().catch(() => {});
    setSoundOn(next);
  };

  const openFilm = () => {
    holdRef.current = true;
    videoRef.current?.pause();
    setFilmOpen(true);
  };
  const closeFilm = () => {
    holdRef.current = false;
    setFilmOpen(false);
    videoRef.current?.play().catch(() => {});
  };

  const appear = (delay) =>
    reducedMotion
      ? {}
      : { initial: { opacity: 0, y: 34 }, animate: introDone ? { opacity: 1, y: 0 } : {}, transition: { duration: 1.2, delay, ease } };

  return (
    <section id="home" ref={sectionRef} className="relative min-h-[100svh] w-full overflow-hidden bg-vr-ink" aria-label={v("vh.aria", BRAND.title)}>
      <HeroVideo reducedMotion={reducedMotion} sectionRef={sectionRef} videoRef={videoRef} holdRef={holdRef} />

      {/* grade + readability: warm light, lens vignette, left/bottom shade, heavy film grain */}
      <div className="vr-film-light pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="vr-film-vignette pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-vr-ink/70 via-vr-ink/10 to-transparent lg:block" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-vr-ink via-vr-ink/80 to-transparent lg:h-1/2 lg:via-vr-ink/40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-vr-ink/70 to-transparent" />
      <div className="vr-grain vr-grain--film" aria-hidden="true" />
      {!reducedMotion && <Letterbox open={introDone} />}

      <div data-hero-content className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-end px-5 pb-10 pt-[50svh] sm:px-8 sm:pt-28 lg:px-12 lg:pb-14">
        <div className="max-w-[54rem] lg:max-w-[40rem]">
          <motion.p className="vr-eyebrow mb-6 text-vr-gold" {...appear(0.1)}>
            <span className="hidden sm:inline">{BRAND.nameDeva}</span>
            <span className="vr-eyebrow__rule hidden sm:block" aria-hidden="true" />
            <span>{v("vh.presented", "Presented by Kavi Sajal Jain")}</span>
          </motion.p>

          <h1 className="vr-display text-vr-ivory" aria-label={v("vh.aria", BRAND.title)}>
            <span className="block overflow-hidden pb-[0.06em]" aria-hidden="true">
              <motion.span
                className="block text-[clamp(1.5rem,2.8vw,2.6rem)] font-light lg:text-[clamp(1.4rem,2vw,2.1rem)] italic leading-tight text-vr-ivory/90"
                initial={reducedMotion ? false : { yPercent: 110 }}
                animate={introDone ? { yPercent: 0 } : {}}
                transition={{ duration: 1.4, ease }}
              >
                {v("vh.kavi", "Kavi Sajal Jain’s")}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]" aria-hidden="true">
              <motion.span
                className="block text-[clamp(4.2rem,13.5vw,12.5rem)] font-light lg:text-[clamp(5rem,8.6vw,9rem)] uppercase leading-[0.82] tracking-[0.06em]"
                initial={reducedMotion ? false : { yPercent: 110 }}
                animate={introDone ? { yPercent: 0 } : {}}
                transition={{ duration: 1.5, ease }}
              >
                {BRAND.name}
              </motion.span>
            </span>
            <span className="block overflow-hidden" aria-hidden="true">
              <motion.span
                className="mt-3 block text-[clamp(1.6rem,3.4vw,3.1rem)] font-light lg:text-[clamp(1.5rem,2.3vw,2.4rem)] italic leading-tight text-vr-ivory/90"
                initial={reducedMotion ? false : { yPercent: 110 }}
                animate={introDone ? { yPercent: 0 } : {}}
                transition={{ duration: 1.4, delay: 0.15, ease }}
              >
                {v("vh.subtitle", BRAND.subtitle)}
              </motion.span>
            </span>
          </h1>

          <motion.p className="mt-5 flex items-center gap-4 text-vr-gold" lang="hi" {...appear(0.35)}>
            <span className="h-px w-8 bg-vr-gold/60" aria-hidden="true" />
            <span className="font-vr-deva text-[clamp(1.3rem,2.2vw,1.9rem)] leading-normal">{BRAND.taglineDeva}</span>
            <span className="h-px w-8 bg-vr-gold/60" aria-hidden="true" />
          </motion.p>
          <motion.p className="mt-4 hidden max-w-[34rem] text-[1.05rem] sm:block leading-[1.75] text-vr-ivory/75 sm:text-[1.12rem]" {...appear(0.4)}>
            {v("vh.body", "An extraordinary celebration of Jain history, culture, literature, poetry and music.")}
          </motion.p>

          <motion.div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4" {...appear(0.45)}>
            <Button size="lg" onClick={() => scrollTo("experience")}>
              {v("vh.explore", "Explore the Experience")}
            </Button>
            <Button variant="ghost" size="lg" icon={false} onClick={() => scrollTo("contact")}>
              {v("vh.book", "Book Virasat")}
            </Button>
          </motion.div>

          <motion.button
            type="button"
            onClick={openFilm}
            className="group mt-6 inline-flex items-center gap-4 text-left text-vr-ivory sm:mt-8"
            {...appear(0.55)}
          >
            <span className="vr-play-ring grid h-14 w-14 shrink-0 place-items-center rounded-full border border-vr-gold/70 text-vr-gold transition-colors group-hover:bg-vr-gold group-hover:text-vr-ink">
              <Play size={18} strokeWidth={1.5} className="translate-x-[1px] fill-current" aria-hidden="true" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[0.68rem] uppercase tracking-[0.3em] text-vr-ivory/55">{v("vh.watchKicker", "With sound")}</span>
              <span className="font-vr-display text-xl italic leading-tight transition-colors group-hover:text-vr-gold">
                {v("vh.watch", "Watch the performance")}
              </span>
            </span>
          </motion.button>
        </div>

        <motion.div
          className="mt-12 flex flex-col gap-6 border-t border-vr-ivory/15 pt-6 text-vr-ivory sm:flex-row sm:items-end sm:justify-between"
          {...appear(0.65)}
        >
          <button type="button" onClick={() => scrollTo("shows")} className="group flex items-center gap-5 text-left" aria-label={v("vh.nextAria", "Next show: {{title}}, {{date}}. View details", { title: show.title, date: d.long })}>
            <span className="font-vr-display text-5xl font-light leading-none text-vr-gold tabular-nums">{d.day}</span>
            <span className="flex flex-col gap-1">
              <span className="text-[0.68rem] uppercase tracking-[0.3em] text-vr-ivory/55">{v("vh.next", "Next performance")}</span>
              <span className="font-vr-display text-2xl leading-tight transition-colors group-hover:text-vr-gold">
                {show.title} <span className="italic text-vr-ivory/60">— {show.subtitle}</span>
              </span>
              <span className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-vr-ivory/65">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} strokeWidth={1.5} /> {d.long}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} strokeWidth={1.5} /> {show.venue}, {show.city}
                </span>
              </span>
            </span>
          </button>
          <div className="flex items-center gap-8">
          {!reducedMotion && (
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={soundOn}
              className="inline-flex items-center gap-3 whitespace-nowrap text-[0.68rem] uppercase tracking-[0.3em] text-vr-ivory/60 transition-colors hover:text-vr-ivory"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full border border-vr-ivory/25">
                {soundOn ? <Volume2 size={14} strokeWidth={1.5} aria-hidden="true" /> : <VolumeX size={14} strokeWidth={1.5} aria-hidden="true" />}
              </span>
              {soundOn ? v("vh.soundOff", "Sound off") : v("vh.soundOn", "Sound on")}
            </button>
          )}
          <button
            type="button"
            onClick={() => scrollTo("about")}
            className="hidden items-center gap-3 whitespace-nowrap text-[0.68rem] uppercase tracking-[0.3em] text-vr-ivory/60 transition-colors hover:text-vr-ivory sm:inline-flex"
          >
            {v("vh.scroll", "Scroll to enter")}
            <span className="grid h-10 w-10 place-items-center rounded-full border border-vr-ivory/25">
              <ArrowDown size={14} className={reducedMotion ? "" : "vr-bob"} />
            </span>
          </button>
          </div>
        </motion.div>
      </div>

      <FilmModal open={filmOpen} onClose={closeFilm} label={v("vh.filmLabel", "Kavi Sajal Jain’s Virasat — live")} />
    </section>
  );
}
