import { useRef, useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { upcomingEvents, featuredEvent, eventDate } from "../data/events";
import { buildSizes, coverSize } from "@/lib/cloudinary";
import { coverBox, imageProps } from "../data/site";

// Ticket card: 3:4 arch, 62% of the card (max 250px) below 640px, 44% from 640px, a fixed 230px from 768px; the photo is landscape so cover
// makes it about twice as wide as the arch. Modal: 450px-ish image column (45% of the modal, max 467px) with a ~500px tall photo from
// 768px; below that a full-width 16:10 box.
const showCardSizes = coverBox(
  { sm: "min(250px, (100vw - 90px) * 0.62)", md: "min(250px, (100vw - 146px) * 0.44)", lg: "230px" },
  { sm: 1.3333, md: 1.3333, lg: 1.3333 },
);
const showModalSizes = (aspect) =>
  buildSizes(
    [["(max-width: 767px)", coverSize("(100vw - 34px)", "calc((100vw - 34px) * 0.625)", aspect)]],
    coverSize("min(467px, (100vw - 34px) * 0.45)", "505px", aspect),
  );
import { useVirasat } from "../hooks/useSmoothScroll";
import { gsap, useGsap, revealWords, revealUp } from "../animations/gsapAnimations";
import SplitWords from "../components/common/SplitWords";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Ornament from "../components/common/Ornament";
import { useVT } from "../i18n";

/** Event details — only confirmed facts (date, venue); no invented tickets or timings. */
function EventDetails({ event, open, onClose }) {
  const { v, locale } = useVT();
  const { scrollTo } = useVirasat();
  if (!event) return null;
  const d = eventDate(event, locale);
  const enquire = () => {
    onClose();
    setTimeout(() => scrollTo("contact"), 80); // after the modal releases the scroll lock
  };
  return (
    <Modal open={open} onClose={onClose} label={v("vs.detailsLabel", "{{title}} — event details", { title: event.title })}>
      <div className="grid md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative aspect-[16/10] overflow-hidden bg-vr-ink md:aspect-auto md:min-h-[500px]">
          <img {...imageProps(event.imageKey, { sizes: showModalSizes })} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-vr-ink via-vr-ink/30 to-transparent" />
        </div>
        <div className="flex flex-col gap-6 p-7 text-vr-ivory sm:p-10">
          <p className="vr-eyebrow text-vr-gold">{v("vs.featured", "Featured upcoming event")}</p>
          <div>
            <h3 className="vr-display text-[clamp(2.8rem,5vw,4.2rem)]">{event.title}</h3>
            <p className="mt-2 font-vr-display text-2xl italic text-vr-gold-soft">{event.subtitle}</p>
            {event.subtitleDeva && (
              <p className="mt-1 font-vr-deva text-xl text-vr-ivory/60" lang="hi">
                {event.subtitleDeva}
              </p>
            )}
          </div>
          <Ornament.Divider className="w-40 text-vr-gold" />
          <dl className="space-y-3 text-vr-ivory/80">
            <div className="flex items-start gap-3">
              <dt className="sr-only">{v("shows.date", "Date")}</dt>
              <CalendarDays size={17} strokeWidth={1.4} className="mt-0.5 shrink-0 text-vr-gold" aria-hidden="true" />
              <dd>
                {d.long} <span className="text-vr-ivory/50">· {d.weekday}</span>
              </dd>
            </div>
            <div className="flex items-start gap-3">
              <dt className="sr-only">{v("shows.venue", "Venue")}</dt>
              <MapPin size={17} strokeWidth={1.4} className="mt-0.5 shrink-0 text-vr-gold" aria-hidden="true" />
              <dd>
                {event.venue}, {event.city}
              </dd>
            </div>
          </dl>
          <p className="text-sm leading-relaxed text-vr-ivory/55">
            {v("vs.detailsNote", "For timings, passes and group enquiries, please write to the Virasat team.")}
          </p>
          <div className="mt-auto flex flex-wrap gap-3 pt-2">
            <Button onClick={enquire}>{v("vs.enquire", "Enquire now")}</Button>
            <Button variant="ghost" icon={false} onClick={onClose}>
              {v("vs.close", "Close")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/**
 * A show presented as a theatre playbill-ticket: the poster in a temple-arch
 * window, the title set like a playbill, and a perforated stub carrying the
 * date. Purely a visual metaphor — no ticket prices or sales are implied.
 */
function ShowRow({ event: raw, onDetails }) {
  const { v, tev, locale } = useVT();
  const event = tev(raw);
  const d = eventDate(event, locale);
  return (
    <article className="vr-ticket group relative mx-auto grid max-w-[1180px] lg:grid-cols-[minmax(0,1fr)_300px]" data-reveal aria-labelledby={`show-${event.id}`}>
      {/* ── playbill ── */}
      <div className="relative flex flex-col items-center gap-8 p-6 sm:p-10 md:flex-row md:items-center md:gap-10 lg:p-12">
        {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t lg:hidden", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r lg:hidden"].map((c) => (
          <span key={c} className={`pointer-events-none absolute h-6 w-6 border-vr-gold/70 ${c}`} aria-hidden="true" />
        ))}

        {/* poster in an arched window */}
        <button
          type="button"
          onClick={onDetails}
          className="vr-ticket__arch relative w-[62%] max-w-[250px] shrink-0 sm:w-[44%] md:w-[230px]"
          aria-label={v("vs.detailsFor", "Event details: {{title}}", { title: event.title })}
        >
          <span className="relative block aspect-[3/4] overflow-hidden rounded-t-full">
            <img
              {...imageProps(event.imageKey, { sizes: showCardSizes })}
              alt=""
              className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#2a0810]/70 via-transparent to-transparent" />
          </span>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap border border-vr-gold/70 bg-[#3b0b15] px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-vr-gold-soft">
            {v("vs.nextOnStage", "Next on stage")}
          </span>
        </button>

        {/* playbill copy */}
        <div className="min-w-0 flex-1 text-center md:text-left">
          <p className="vr-eyebrow text-vr-gold">
            <span className="text-[0.55rem]" aria-hidden="true">◆</span>
            <span>{v("vs.featured", "Featured upcoming event")}</span>
            <span className="text-[0.55rem]" aria-hidden="true">◆</span>
          </p>
          <h3 id={`show-${event.id}`} className="vr-display mt-4 text-[clamp(3.2rem,6vw,5.6rem)] leading-[0.9] text-vr-ivory transition-colors duration-500 group-hover:text-vr-gold-soft">
            {event.title}
          </h3>
          <p className="mt-3 font-vr-display text-[clamp(1.4rem,2.2vw,2rem)] italic leading-tight text-vr-gold-soft">{event.subtitle}</p>
          {event.subtitleDeva && (
            <p className="mt-1 font-vr-deva text-[clamp(1.1rem,1.6vw,1.4rem)] text-vr-ivory/60" lang="hi">
              {event.subtitleDeva}
            </p>
          )}
          <Ornament.Divider className="mx-auto mt-6 w-44 text-vr-gold md:mx-0" />
          {event.description && <p className="mt-5 max-w-md leading-[1.75] text-vr-ivory/65">{event.description}</p>}
          <dl className="mt-5 flex flex-col items-center gap-2 text-sm text-vr-ivory/75 md:items-start">
            <div className="flex items-center gap-2.5">
              <dt className="sr-only">{v("shows.venue", "Venue")}</dt>
              <MapPin size={15} strokeWidth={1.4} className="shrink-0 text-vr-gold" aria-hidden="true" />
              <dd>
                {event.venue}, <span className="text-vr-ivory/60">{event.city}</span>
              </dd>
            </div>
            {d.time && (
              <div className="flex items-center gap-2.5">
                <dt className="sr-only">{v("shows.time", "Time")}</dt>
                <Clock size={15} strokeWidth={1.4} className="shrink-0 text-vr-gold" aria-hidden="true" />
                <dd>{d.time}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* ── stub, torn along the perforation ── */}
      <div className="vr-ticket__stub relative flex flex-col items-center justify-center px-6 pb-10 pt-12 text-center md:flex-row md:gap-14 md:py-10 lg:flex-col lg:gap-0 lg:py-12">
        <span className="vr-ticket__notch vr-ticket__notch--a" aria-hidden="true" />
        <span className="vr-ticket__notch vr-ticket__notch--b" aria-hidden="true" />
        <dl>
          <dt className="sr-only">{v("shows.date", "Date")}</dt>
          <dd className="flex flex-col items-center">
            <span className="font-vr-display text-lg italic text-vr-ivory/60">{d.weekday}</span>
            <span className="font-vr-display text-[clamp(5rem,7vw,7rem)] font-light leading-[0.85] text-vr-gold tabular-nums">{d.day}</span>
            <span className="mt-2 text-sm uppercase tracking-[0.3em] text-vr-ivory/80">
              {d.month} {d.year}
            </span>
          </dd>
        </dl>
        <span className="my-7 h-px w-16 bg-vr-gold/50 md:hidden lg:block" aria-hidden="true" />
        <Button onClick={onDetails} aria-haspopup="dialog">
          {v("vs.details", "Event details")}
        </Button>
        <span
          className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rotate-180 whitespace-nowrap text-[0.55rem] uppercase tracking-[0.4em] text-vr-gold/45 [writing-mode:vertical-rl] lg:block"
          aria-hidden="true"
        >
          Virasat · {d.year}
        </span>
      </div>
    </article>
  );
}

/* ── Stage arch ────────────────────────────────────────────────────────────
 * A carved, multi-lobed Jain temple arch (toran) drawn as gold line-work.
 * Geometry is generated once per proportion: the outer and inner pointed
 * arches are cubic Béziers; the scalloped (cusped) inner edge is a run of
 * small arcs between points sampled along a further-inset curve.
 */
const bez = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};
const f = (n) => Math.round(n * 10) / 10;

function archGeometry({ W, H, x0, spring, apex }) {
  const mid = W / 2;
  const left = (inset) => {
    const X = x0 + inset;
    const A = apex + inset * 1.25;
    return [
      [X, spring],
      [X, spring - (spring - A) * 0.62],
      [mid - (mid - X) * 0.42, A + (spring - A) * 0.1],
      [mid, A],
    ];
  };
  const mirror = (pts) => pts.map(([x, y]) => [W - x, y]).reverse();
  const curve = (inset) => {
    const L = left(inset);
    const R = mirror(L);
    return `M${f(L[0][0])},${H} L${f(L[0][0])},${f(L[0][1])} C${f(L[1][0])},${f(L[1][1])} ${f(L[2][0])},${f(L[2][1])} ${f(L[3][0])},${f(L[3][1])} C${f(R[1][0])},${f(R[1][1])} ${f(R[2][0])},${f(R[2][1])} ${f(R[3][0])},${f(R[3][1])} L${f(R[3][0])},${H}`;
  };
  // cusps: 7 lobes per side along an inset curve, bulging into the opening
  const L = left(54);
  const pts = [];
  for (let i = 0; i <= 7; i += 1) pts.push(bez(...L, i / 7));
  const all = [...pts, ...pts.slice(0, -1).reverse().map(([x, y]) => [W - x, y])];
  let cusps = `M${f(all[0][0])},${f(all[0][1])}`;
  for (let i = 1; i < all.length; i += 1) {
    const [x, y] = all[i];
    const [px, py] = all[i - 1];
    const r = Math.hypot(x - px, y - py) * 0.62;
    cusps += ` A${f(r)},${f(r)} 0 0 1 ${f(x)},${f(y)}`;
  }
  const finialY = apex - 8;
  return {
    outer: curve(0),
    inner: curve(18),
    cusps,
    posts: [x0 + 54, W - x0 - 54].map((x) => `M${f(x)},${f(L[0][1])} L${f(x)},${H}`).join(" "),
    capitals: [x0, W - x0 - 18].map((x) => `M${f(x - 14)},${spring} h${18 + 28} M${f(x - 8)},${spring + 12} h${18 + 16}`).join(" "),
    finial: `M${mid},${f(finialY - 62)} C${mid + 14},${f(finialY - 40)} ${mid + 14},${f(finialY - 22)} ${mid},${f(finialY - 14)} C${mid - 14},${f(finialY - 22)} ${mid - 14},${f(finialY - 40)} ${mid},${f(finialY - 62)}Z M${mid - 22},${finialY} h44`,
  };
}

const ARCH_WIDE = { W: 1000, H: 560, x0: 190, spring: 330, apex: 112 };
const ARCH_MID = { W: 1000, H: 700, x0: 160, spring: 400, apex: 130 };
const ARCH_TALL = { W: 1000, H: 1320, x0: 120, spring: 660, apex: 190 };
/** One proportion per breakpoint: phone (tall), tablet / small laptop (mid), desktop (wide). */
const ARCHES = {
  tall: { ...ARCH_TALL, geo: archGeometry(ARCH_TALL), sw: 3.2 },
  mid: { ...ARCH_MID, geo: archGeometry(ARCH_MID), sw: 2 },
  wide: { ...ARCH_WIDE, geo: archGeometry(ARCH_WIDE), sw: 1.6 },
};

function StageArch({ variant = "wide", className = "" }) {
  const { W, H, geo: g, sw } = ARCHES[variant];
  return (
    <svg className={className} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <g fill="none" stroke="#C6A15B" strokeLinecap="round" strokeLinejoin="round">
        <path data-arch d={g.outer} strokeWidth={sw} pathLength="1" strokeDasharray="1" strokeDashoffset="0" />
        <path data-arch d={g.inner} strokeWidth={sw * 0.6} strokeOpacity="0.55" pathLength="1" strokeDasharray="1" strokeDashoffset="0" />
        <path data-arch d={g.cusps} strokeWidth={sw * 0.8} strokeOpacity="0.85" pathLength="1" strokeDasharray="1" strokeDashoffset="0" />
        <path data-arch-fade d={g.posts} strokeWidth={sw * 0.6} strokeOpacity="0.45" />
        <path data-arch-fade d={g.capitals} strokeWidth={sw * 0.8} />
        <path data-arch-fade d={g.finial} strokeWidth={sw * 0.8} fill="rgba(198,161,91,0.18)" />
      </g>
    </svg>
  );
}

/** Velvet curtain panel; `side` decides which way it parts. */
/** Velvet valance across the top of the proscenium, with swaying gold tassels. */
const TASSELS = [6, 14, 22, 30, 38, 46, 54, 62, 70, 78, 86, 94];
function Valance() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30" aria-hidden="true">
      <div className="vr-valance h-[clamp(18px,3.4vw,44px)]" />
      <div className="vr-valance__scallops h-[clamp(10px,1.6vw,22px)]" />
      {TASSELS.map((x, i) => (
        <span
          key={x}
          className={`vr-tassel absolute top-[clamp(18px,3.4vw,44px)] ${i % 2 ? "hidden sm:block" : ""}`}
          style={{ left: `${x}%`, animationDelay: `${-(i * 0.37).toFixed(2)}s` }}
        />
      ))}
    </div>
  );
}

/** Dust drifting up through the spotlight beams (deterministic positions). */
const MOTES = Array.from({ length: 22 }, (_, i) => ({
  left: 18 + ((i * 37) % 64),
  bottom: 8 + ((i * 23) % 55),
  size: 1.5 + (i % 3) * 0.8,
  dur: 7 + (i % 5) * 1.6,
  delay: -((i * 0.9) % 9),
}));
function Motes() {
  return (
    <div data-light className="pointer-events-none absolute inset-0 z-[5]" aria-hidden="true">
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="vr-mote absolute rounded-full bg-[#f7dfa6]"
          style={{ left: `${m.left}%`, bottom: `${m.bottom}%`, width: m.size, height: m.size, animationDuration: `${m.dur}s`, animationDelay: `${m.delay}s` }}
        />
      ))}
    </div>
  );
}

/** A clay diya with a flickering flame — the stage footlights. */
function Diya({ i }) {
  return (
    <span data-diya className="relative block" aria-hidden="true">
      <span data-glow className="absolute -inset-4">
        <span className="vr-diya-glow absolute inset-0 rounded-full" style={{ animationDelay: `${-(i * 0.43).toFixed(2)}s` }} />
      </span>
      <span data-flash className="vr-diya-flash absolute left-1/2 top-[22%] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <svg viewBox="0 0 40 34" className="relative h-[clamp(20px,2.2vw,30px)] w-[clamp(24px,2.6vw,36px)] overflow-visible">
        <g data-flame>
          <path className="vr-flame" style={{ animationDelay: `${-(i * 0.31).toFixed(2)}s` }} d="M20 2 C25 9 25 15 20 19 C15 15 15 9 20 2Z" fill="#f6c25e" />
          <path d="M20 8 C22 12 22 15 20 17 C18 15 18 12 20 8Z" fill="#fff4cf" />
        </g>
        <path d="M3 20 H37 Q35 33 20 33 Q5 33 3 20Z" fill="#9a5b2c" />
        <path d="M3 20 H37" stroke="#d9a35a" strokeWidth="1.4" />
      </svg>
    </span>
  );
}

function Curtain({ side }) {
  return (
    <div
      data-curtain={side}
      className={`vr-curtain pointer-events-none absolute inset-y-0 z-20 w-[9%] sm:w-[12%] ${side === "left" ? "left-0 origin-left" : "right-0 origin-right vr-curtain--right"}`}
      aria-hidden="true"
    />
  );
}

export default function UpcomingShows() {
  const ref = useRef(null);
  const { reducedMotion, scrollTo } = useVirasat();
  const events = upcomingEvents();
  const { v, tev, locale } = useVT();
  const [detailsId, setDetailsId] = useState(null);
  const [open, setOpen] = useState(false);
  const detailsEvent = tev(events.find((e) => e.id === detailsId));

  useGsap(
    ref,
    (root) => {
      revealWords(root);
      revealUp(root);
      const stage = root.querySelector("[data-stage]");
      if (!stage) return;
      const q = (sel) => [...stage.querySelectorAll(sel)];
      const curtains = q("[data-curtain]");
      const diyas = q("[data-diya]").filter((d) => d.offsetParent !== null); // skip diyas hidden at this width

      // closed stage before the show: curtains meet in the middle, flames unlit
      // open widths as % of the stage, so a replay after resizing still lands right
      const stageW = stage.getBoundingClientRect().width || 1;
      const openW = curtains.map((c) => `${((c.getBoundingClientRect().width / stageW) * 100).toFixed(2)}%`);
      gsap.set(curtains, { width: "50.5%" });
      gsap.set(diyas.map((d) => d.querySelector("[data-flame]")), { autoAlpha: 0, scale: 0, transformOrigin: "50% 100%" });
      gsap.set(diyas.map((d) => d.querySelector("[data-glow]")), { autoAlpha: 0 });

      // plays every time the stage comes into view (from above or below), and
      // quietly resets to "curtains closed" once it has scrolled out of sight
      const tl = gsap.timeline({
        scrollTrigger: { trigger: stage, start: "top 65%", end: "bottom top", toggleActions: "restart reset restart reset" },
      });
      // 1. the curtains draw open
      tl.to(curtains, {
        width: (i) => openW[i],
        duration: 0.9,
        ease: "power2.inOut",
      })
        // 2. spotlights come up as the stage is revealed
        .from(q("[data-light]"), { autoAlpha: 0, duration: 0.6, stagger: 0.08 }, 0.25)
        // 3. the arch is drawn in gold, line by line
        .fromTo(q("[data-arch]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut", stagger: 0.08 }, 0.35)
        .from(q("[data-arch-fade]"), { autoAlpha: 0, duration: 0.35 }, 0.8);

      // 4. the footlights are lit one by one, left to right, the floor warming with each
      const lightAt = 0.85;
      const step = 0.11;
      diyas.forEach((d, i) => {
        const t = lightAt + i * step;
        tl.fromTo(d.querySelector("[data-flash]"), { scale: 0, autoAlpha: 0.95 }, { scale: 2.8, autoAlpha: 0, duration: 0.4, ease: "power2.out" }, t)
          .to(d.querySelector("[data-flame]"), { autoAlpha: 1, scale: 1, duration: 0.28, ease: "back.out(3)" }, t)
          .to(d.querySelector("[data-glow]"), { autoAlpha: 1, duration: 0.35, ease: "power1.out" }, t + 0.04);
      });
      const lit = lightAt + diyas.length * step;
      tl.fromTo(q("[data-floor]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: lit - lightAt + 0.6, ease: "power1.in" }, lightAt)
        // 5. finally, the plaque announces the next show
        .from(stage.querySelector("[data-plaque]"), { y: 20, autoAlpha: 0, duration: 0.45, ease: "power3.out" }, lit - 0.15);
    },
    [],
    { reducedMotion }
  );

  const stageRef = useRef(null);
  const onStageMove = (e) => {
    const el = stageRef.current;
    if (!el || reducedMotion) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--sy", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };
  const nextShowRaw = featuredEvent();
  const nextShow = nextShowRaw && tev(nextShowRaw);
  const nextDate = nextShow && eventDate(nextShow, locale);

  const showDetails = (id) => {
    setDetailsId(id);
    setOpen(true);
  };

  return (
    <section id="shows" ref={ref} className="relative overflow-hidden bg-vr-burgundy text-vr-ivory">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(198,161,91,0.10),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        {/* ── the stage ── */}
        <div
          ref={stageRef}
          data-stage
          onPointerMove={onStageMove}
          className="vr-stage relative mx-auto aspect-[1000/1320] max-w-[1400px] overflow-hidden sm:aspect-[1000/700] lg:aspect-[1000/560]"
        >
          {/* follow-spot that tracks the pointer (desktop only, see .vr-stage__follow) */}
          <div className="vr-stage__follow pointer-events-none absolute inset-0 z-[6]" aria-hidden="true" />
          <Motes />
          {/* spotlights from the wings, and a pool of light on the floor */}
          <div data-light className="vr-spot vr-spot--left pointer-events-none absolute -top-[10%] left-[8%] h-[120%] w-[38%]" aria-hidden="true" />
          <div data-light className="vr-spot vr-spot--right pointer-events-none absolute -top-[10%] right-[8%] h-[120%] w-[38%]" aria-hidden="true" />
          <div
            data-floor
            className="pointer-events-none absolute inset-x-[10%] bottom-0 h-[22%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(232,196,128,0.28),transparent_70%)]"
            aria-hidden="true"
          />

          <StageArch variant="tall" className="absolute inset-0 h-full w-full sm:hidden" />
          <StageArch variant="mid" className="absolute inset-0 hidden h-full w-full sm:block lg:hidden" />
          <StageArch variant="wide" className="absolute inset-0 hidden h-full w-full lg:block" />

          {/* the act on stage */}
          <header className="absolute inset-x-[12%] top-[29%] z-10 flex flex-col items-center text-center sm:inset-x-[22%] sm:top-[33%] lg:top-[35%]">
            <p className="vr-eyebrow whitespace-nowrap text-[0.62rem] tracking-[0.22em] text-vr-gold sm:text-[0.7rem] sm:tracking-[0.3em]" data-reveal>
              <span className="hidden tabular-nums sm:inline">03</span>
              <span className="vr-eyebrow__rule hidden sm:block" aria-hidden="true" />
              <span>{v("vs.eyebrow", "Virasat on Stage")}</span>
            </p>
            <h2 className="vr-display mt-5 text-[clamp(2.2rem,5.6vw,6rem)] leading-[0.98] sm:mt-6 sm:text-[clamp(2rem,4.1vw,6rem)] md:text-[clamp(2.2rem,4.8vw,6rem)] lg:text-[clamp(2.2rem,4.6vw,6rem)] xl:text-[clamp(2.2rem,5.2vw,5.5rem)]" aria-label={v("vs.title", "A Journey of Heritage, Across Cities.")}>
              <SplitWords text={v("vs.h1", "A Journey")} className="block" />
              <SplitWords text={v("vs.h2", "of *Heritage,*")} className="block" />
              <SplitWords text={v("vs.h3", "Across Cities.")} className="block" />
            </h2>
          </header>

          {/* next on stage: a gold plaque above the footlights */}
          <div className="absolute inset-x-[12%] bottom-[3%] z-10 flex flex-col items-center gap-[clamp(14px,2.2vw,30px)] sm:inset-x-[24%]">
            {nextShow && (
              <button
                type="button"
                onClick={() => showDetails(nextShow.id)}
                data-plaque
                className="vr-plaque group relative px-[clamp(16px,2.4vw,34px)] py-[clamp(8px,1vw,14px)] text-center"
                aria-label={v("vs.plaqueAria", "Next on stage: {{title}}, {{date}}. Event details", { title: nextShow.title, date: nextDate.long })}
              >
                <span className="block text-[0.58rem] uppercase tracking-[0.34em] text-vr-gold sm:text-[0.62rem]">{v("vs.nextOnStage", "Next on stage")}</span>
                <span className="mt-1 block font-vr-display text-[clamp(1.05rem,1.8vw,1.7rem)] leading-tight text-vr-ivory transition-colors group-hover:text-vr-gold-soft">
                  {nextShow.title} <span className="italic text-vr-gold-soft">— {nextShow.subtitle}</span>
                </span>
                <span className="mt-1 block whitespace-nowrap text-[0.6rem] uppercase tracking-[0.12em] text-vr-ivory/60 sm:text-[0.68rem] sm:tracking-[0.24em]">
                  {nextDate.long} · {nextShow.venue.split(",").pop().trim()}
                </span>
              </button>
            )}
            <div className="flex w-full items-end justify-between" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <span key={i} className={i === 1 || i === 5 ? "hidden sm:block" : ""}>
                  <Diya i={i} />
                </span>
              ))}
            </div>
          </div>

          <Curtain side="left" />
          <Curtain side="right" />
          <Valance />

          {/* stage floor */}
          <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-vr-gold/80 to-transparent" aria-hidden="true" />
        </div>

        <div className="relative mx-auto mb-14 mt-12 flex max-w-2xl flex-col items-center text-center lg:mb-16" data-reveal>
          <p className="text-[1.08rem] leading-[1.8] text-vr-ivory/70">
            {v(
              "vs.body",
              "Every Virasat performance is a unique celebration of Jain culture. We collaborate with Jain organisations, institutions and communities to bring this extraordinary experience to different cities."
            )}
          </p>
          <button type="button" onClick={() => scrollTo("contact")} className="vr-link mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-vr-gold">
            {v("vs.bring", "Bring Virasat to your city")} →
          </button>
        </div>

        <div className="space-y-10">
          {events.map((ev) => (
            <ShowRow
              key={ev.id}
              event={ev}
              onDetails={() => showDetails(ev.id)}
            />
          ))}
        </div>
      </div>

      <EventDetails event={detailsEvent} open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
