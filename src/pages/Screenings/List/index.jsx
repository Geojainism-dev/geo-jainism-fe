import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Clapperboard, MapPin, Search, Ticket } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";
import { usePublicScreenings } from "@/features/publicScreenings/hooks";
import { ACCENTS, getAccent, REGISTER_GRADIENT, dateBadge, urgencyLabel } from "@/features/publicScreenings/display";

const HERO_SLIDE_COUNT = 5;
const HERO_AUTOPLAY_MS = 6000;

const DATE_FILTERS = [
  { id: "all", label: "All" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
];

function PosterFallback({ accent, size = "normal" }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{
        backgroundImage: `radial-gradient(${accent.dot} 1px, transparent 1px)`,
        backgroundSize: "14px 14px",
      }}
    >
      <div
        className={`flex items-center justify-center rounded-full bg-white ${
          size === "hero" ? "h-20 w-20" : "h-12 w-12"
        }`}
        style={{ boxShadow: `0 1px 2px rgba(0,0,0,0.05), 0 0 0 1px ${accent.ring}` }}
      >
        <Clapperboard
          className={size === "hero" ? "h-9 w-9" : "h-5 w-5"}
          style={{ color: accent.to }}
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}

function AmbientDots() {
  const dots = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: `${(i * 23.7) % 100}%`,
        top: `${(i * 31.3) % 100}%`,
        size: 2 + (i % 3),
        duration: 7 + (i % 5) * 1.5,
        delay: (i * 0.4) % 5,
        color: ACCENTS[i % ACCENTS.length].from,
      })),
    []
  );
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.35]">
      {dots.map((d, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: d.color,
            animation: `eventsDotFloat ${d.duration}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes eventsDotFloat {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-14px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function HeroSlide({ screening, accent }) {
  const badge = dateBadge(screening.localDate);
  const urgency = urgencyLabel(screening.date);
  return (
    <motion.div
      key={screening.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute inset-0"
    >
      <div className="absolute inset-0">
        {screening.image ? (
          <motion.img
            key={screening.id}
            src={screening.image}
            alt=""
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: HERO_AUTOPLAY_MS / 1000, ease: "linear" }}
            className="h-full w-full object-cover opacity-45"
          />
        ) : (
          <div className="h-full w-full opacity-60">
            <PosterFallback accent={accent} size="hero" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#11170F] via-[#11170F]/75 to-[#11170F]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#11170F] via-[#11170F]/50 to-transparent" />
      </div>

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[3px] sm:tracking-[4px]"
            style={{ color: accent.from }}
          >
            <Ticket className="h-3.5 w-3.5" />
            Featured Screening
          </div>
          {urgency && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
              style={{ background: `linear-gradient(to right, ${accent.from}, ${accent.to})` }}
            >
              {urgency}
            </span>
          )}
        </div>
        <h1
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-5xl"
        >
          {screening.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" style={{ color: accent.from }} />
            {badge ? `${badge.month} ${badge.day}` : screening.localDate}
            {screening.localTime ? ` · ${screening.localTime}` : ""}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" style={{ color: accent.from }} />
            {screening.venue}
            {screening.city ? `, ${screening.city}` : ""}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={`/register?screeningId=${screening.id}`}
            className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${REGISTER_GRADIENT} px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-[#0E2A0B]/40 transition-transform hover:-translate-y-0.5`}
          >
            <Ticket className="h-4 w-4" />
            Register Now
          </Link>
          <Link
            to={`/events/${screening.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function HeroCarousel({ events }) {
  const [index, setIndex] = useState(0);
  const slides = events.slice(0, HERO_SLIDE_COUNT);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), HERO_AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const current = slides[index] ?? slides[0];
  const accent = getAccent(index);

  return (
    <section className="relative h-[520px] overflow-hidden bg-[#11170F] sm:h-[560px]">
      <AnimatePresence mode="wait">
        <HeroSlide key={current.id} screening={current} accent={accent} />
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            aria-label="Previous event"
            className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            aria-label="Next event"
            className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show event ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6" : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
                style={i === index ? { backgroundColor: getAccent(i).from } : undefined}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function PosterCard({ screening, index }) {
  const badge = dateBadge(screening.localDate);
  const urgency = urgencyLabel(screening.date);
  const accent = getAccent(index);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05, ease: "easeOut" }}
    >
      <Link
        to={`/events/${screening.id}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-[#3C3228]/10 bg-white shadow-[0_4px_14px_rgba(20,10,4,0.06)] transition-all duration-300 hover:-translate-y-1.5"
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = accent.to;
          e.currentTarget.style.boxShadow = `0 20px 44px -8px ${accent.to}55`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        <div className="relative aspect-[3/4] overflow-hidden" style={{ backgroundColor: accent.soft }}>
          {screening.image ? (
            <img
              src={screening.image}
              alt={screening.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <PosterFallback accent={accent} />
          )}

          {badge && (
            <div className="absolute left-2 top-2 flex flex-col items-center overflow-hidden rounded-md bg-white shadow-md">
              <span
                className="w-full px-2 pt-0.5 text-center text-[9px] font-bold uppercase tracking-wide text-white"
                style={{ background: `linear-gradient(to right, ${accent.from}, ${accent.to})` }}
              >
                {badge.month}
              </span>
              <span className="px-2 pb-0.5 pt-0.5 text-center text-sm font-bold leading-none text-neutral-900">
                {badge.day}
              </span>
            </div>
          )}

          {urgency && (
            <span
              className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide shadow-md"
              style={{ color: accent.to }}
            >
              {urgency}
            </span>
          )}

          <div
            className={`absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-r ${REGISTER_GRADIENT} py-2.5 text-[11px] font-bold uppercase tracking-wide text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
          >
            <Ticket className="h-3.5 w-3.5" />
            Register
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h2
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#1F1D19]"
          >
            {screening.title}
          </h2>

          <div className="mt-auto space-y-1 text-[12px] text-[#3C3228]/70">
            <div className="flex items-start gap-1.5">
              <CalendarDays className="mt-0.5 h-3 w-3 flex-shrink-0" style={{ color: accent.to }} />
              <span className="truncate">
                {screening.localDate}
                {screening.localTime ? ` · ${screening.localTime}` : ""}
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" style={{ color: accent.from }} />
              <span className="truncate">
                {screening.venue}
                {screening.city ? `, ${screening.city}` : ""}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ScreeningsListPage() {
  const { data, isLoading, isError } = usePublicScreenings({ limit: 50 });
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const upcoming = useMemo(() => {
    const screenings = data?.screenings ?? [];
    const now = Date.now();
    return screenings
      .filter((s) => s.isActive && new Date(s.date).getTime() >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  const cities = useMemo(
    () => [...new Set(upcoming.map((s) => s.city).filter(Boolean))].sort(),
    [upcoming]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = Date.now();
    const windowMs = dateFilter === "week" ? 7 * 86400000 : dateFilter === "month" ? 31 * 86400000 : Infinity;
    return upcoming.filter((s) => {
      const matchesCity = city === "all" || s.city === city;
      const matchesDate = new Date(s.date).getTime() - now <= windowMs;
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.venue?.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q);
      return matchesCity && matchesDate && matchesSearch;
    });
  }, [upcoming, search, city, dateFilter]);

  const hasUpcoming = upcoming.length > 0;

  useEffect(() => {
    document.body.classList.toggle("has-dark-hero", hasUpcoming);
    return () => document.body.classList.remove("has-dark-hero");
  }, [hasUpcoming]);

  return (
    <>
      <Navbar />
      <main className="bg-[#FDF8F0]">
        {hasUpcoming && <HeroCarousel events={upcoming} />}

        <div className="relative overflow-hidden">
          <AmbientDots />
          <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
            {!hasUpcoming && (
              <div className="pb-6 pt-16">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[4px] text-[#5C8F4E]">Join Us</p>
                <h1
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-3xl font-semibold text-[#1F1D19] sm:text-4xl"
                >
                  Upcoming Events
                </h1>
                <p className="mt-2 max-w-xl text-muted-foreground">
                  Tamil Jains Documentary screenings and events near you.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-semibold text-[#1F1D19]">
                All Events
              </h2>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3C3228]/40" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search events, venue, city..."
                    className="w-full rounded-full border border-[#3C3228]/15 bg-white py-2.5 pl-9 pr-4 text-sm text-[#1F1D19] placeholder:text-[#3C3228]/40 focus:border-[#7DAF6E] focus:outline-none sm:w-64"
                  />
                </div>

                {cities.length > 1 && (
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="rounded-full border border-[#3C3228]/15 bg-white px-4 py-2.5 text-sm text-[#1F1D19] focus:border-[#7DAF6E] focus:outline-none"
                  >
                    <option value="all">All cities</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {DATE_FILTERS.map((f) => {
                const active = dateFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setDateFilter(f.id)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? "border-[#7DAF6E] bg-[#EDF4E7] text-[#4A7A3F]"
                        : "border-[#3C3228]/15 bg-white text-[#3C3228]/70 hover:border-[#7DAF6E]/60"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              {isLoading && (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-[#3C3228]/10 bg-white">
                      <div className="aspect-[3/4] bg-[#3C3228]/10" />
                      <div className="space-y-2 p-4">
                        <div className="h-3 w-3/4 rounded bg-[#3C3228]/10" />
                        <div className="h-2.5 w-1/2 rounded bg-[#3C3228]/10" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isError && (
                <p className="rounded-xl border border-[#3C3228]/10 bg-white p-6 text-center text-sm text-muted-foreground">
                  No events to show right now — we're updating this, please check back soon!
                </p>
              )}

              {!isLoading && !isError && filtered.length === 0 && (
                <p className="rounded-xl border border-[#3C3228]/10 bg-white p-6 text-center text-sm text-muted-foreground">
                  {upcoming.length === 0
                    ? "No upcoming events right now — check back soon."
                    : "No events match your filters."}
                </p>
              )}

              {filtered.length > 0 && (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((screening, i) => (
                    <PosterCard key={screening.id} screening={screening} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
