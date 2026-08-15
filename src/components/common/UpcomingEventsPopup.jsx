import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, ChevronRight, Clapperboard, MapPin, Ticket } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { usePublicScreenings } from "@/features/publicScreenings/hooks";
import { getAccent, REGISTER_GRADIENT, dateBadge, urgencyLabel } from "@/features/publicScreenings/display";

function EventThumbnail({ screening, accent }) {
  const badge = dateBadge(screening.localDate);
  return (
    <div
      className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl sm:h-auto sm:w-full sm:aspect-[4/3] sm:rounded-none"
      style={{ backgroundColor: accent.soft }}
    >
      {screening.image ? (
        <img
          src={screening.image}
          alt={screening.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            backgroundImage: `radial-gradient(${accent.dot} 1px, transparent 1px)`,
            backgroundSize: "12px 12px",
          }}
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm sm:h-14 sm:w-14"
            style={{ boxShadow: `0 1px 2px rgba(0,0,0,0.05), 0 0 0 1px ${accent.ring}` }}
          >
            <Clapperboard className="h-4 w-4 sm:h-6 sm:w-6" style={{ color: accent.to }} strokeWidth={1.75} />
          </div>
        </div>
      )}

      {badge && (
        <div className="absolute left-1.5 top-1.5 hidden flex-col items-center overflow-hidden rounded-md bg-white shadow-md sm:flex">
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
    </div>
  );
}

function EventRow({ screening, index, onSelect }) {
  const accent = getAccent(index);
  const urgency = urgencyLabel(screening.date);
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      onClick={() => onSelect(screening)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accent.to;
        e.currentTarget.style.boxShadow = `0 16px 32px -10px ${accent.to}55`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.boxShadow = "";
      }}
      className="group flex items-stretch gap-3 rounded-2xl border border-neutral-200 bg-white p-2 text-left shadow-sm outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 sm:flex-col sm:gap-0 sm:overflow-hidden sm:p-0"
      style={{ "--tw-ring-color": accent.to }}
    >
      <div className="relative">
        <EventThumbnail screening={screening} accent={accent} />
        {urgency && (
          <span
            className="absolute right-1.5 top-1.5 hidden rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide shadow-md sm:block"
            style={{ color: accent.to }}
          >
            {urgency}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-0.5 pr-1 sm:justify-start sm:gap-2 sm:p-4">
        <h3
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="truncate text-[13px] font-semibold text-neutral-900 sm:whitespace-normal sm:text-base sm:leading-snug sm:line-clamp-2"
        >
          {screening.title}
        </h3>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 sm:text-xs">
            <CalendarDays className="h-3 w-3 flex-shrink-0 sm:h-3.5 sm:w-3.5" style={{ color: accent.to }} />
            <span className="truncate">
              {urgency ? `${urgency} · ` : ""}
              {screening.localDate}
              {screening.localTime ? ` · ${screening.localTime}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 sm:text-xs">
            <MapPin className="h-3 w-3 flex-shrink-0 sm:h-3.5 sm:w-3.5" style={{ color: accent.from }} />
            <span className="truncate">
              {screening.venue}
              {screening.city ? `, ${screening.city}` : ""}
            </span>
          </div>
        </div>

        <span
          className={`mt-2 hidden w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r ${REGISTER_GRADIENT} px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm transition-shadow group-hover:shadow-md sm:inline-flex`}
        >
          <Ticket className="h-3.5 w-3.5" />
          Register
        </span>
      </div>

      <ChevronRight className="my-auto h-4 w-4 flex-shrink-0 text-neutral-300 transition-transform group-hover:translate-x-0.5 sm:hidden" />
    </motion.button>
  );
}

export default function UpcomingEventsPopup({ onDismiss }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  // `status` (not isLoading/isFetching) is used deliberately: react-query's
  // default retry has backoff gaps between attempts where isFetching is
  // briefly false but the query hasn't errored yet either — isLoading would
  // flicker to false in that gap and misrender the "no events" empty state.
  const { data, status } = usePublicScreenings({ limit: 50 });

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 50);
    return () => clearTimeout(t);
  }, []);

  const upcoming = useMemo(() => {
    const screenings = data?.screenings ?? [];
    const now = Date.now();
    return screenings
      .filter((s) => s.isActive && new Date(s.date).getTime() >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 9);
  }, [data]);

  const handleOpenChange = (next) => {
    setOpen(next);
    if (!next) onDismiss?.();
  };

  // Clicking any event, or "View all events", both send the visitor to the
  // full events page to pick which screening to register for — the modal
  // itself never deep-links straight to a specific event's form.
  const goToEvents = () => {
    setOpen(false);
    onDismiss?.();
    navigate("/events");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex w-[94vw] max-w-2xl translate-x-[-50%] translate-y-[-50%] flex-col gap-0 overflow-hidden rounded-2xl border-none bg-white p-0 shadow-2xl sm:w-full sm:rounded-2xl">
        <div
          className="relative flex flex-shrink-0 items-center gap-3 overflow-hidden border-b border-neutral-200 bg-gradient-to-br from-[#FDF8F0] to-[#EDF4E7] px-5 py-4 sm:px-8 sm:py-6"
          style={{
            backgroundImage:
              "radial-gradient(rgba(125,175,110,0.18) 1px, transparent 1px), linear-gradient(to bottom right, #FDF8F0, #EDF4E7)",
            backgroundSize: "16px 16px, 100% 100%",
          }}
        >
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${REGISTER_GRADIENT} shadow-sm sm:h-12 sm:w-12`}
          >
            <Ticket className="h-4.5 w-4.5 text-white sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[3px] text-[#5C8F4E] sm:text-[11px] sm:tracking-[5px]">
              Join Us
            </p>
            <DialogTitle
              style={{
                fontFamily: "'Playfair Display', serif",
                backgroundImage: "linear-gradient(120deg, #4A7A3F, #7DAF6E, #4A7A3F)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              className="truncate text-xl font-semibold sm:text-2xl"
            >
              Upcoming Events
            </DialogTitle>
          </div>
        </div>

        <div className="max-h-[65vh] overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
          {status === "pending" && (
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-2xl border border-neutral-200 p-2 sm:flex-col sm:gap-0 sm:overflow-hidden sm:p-0"
                >
                  <div className="h-20 w-20 flex-shrink-0 animate-pulse rounded-xl bg-neutral-100 sm:aspect-[4/3] sm:h-auto sm:w-full sm:rounded-none" />
                  <div className="flex flex-1 flex-col justify-center gap-2 py-1 sm:p-4">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-100" />
                    <div className="h-2.5 w-1/2 animate-pulse rounded bg-neutral-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {status === "error" && (
            <p className="py-10 text-center text-sm text-neutral-500">
              No events to show right now — we're updating this, please check back soon!
            </p>
          )}

          {status === "success" && upcoming.length === 0 && (
            <p className="py-10 text-center text-sm text-neutral-500">
              No upcoming events right now — check back soon.
            </p>
          )}

          {status === "success" && upcoming.length > 0 && (
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] sm:gap-4">
              {upcoming.map((screening, i) => (
                <EventRow key={screening.id} screening={screening} index={i} onSelect={goToEvents} />
              ))}
            </div>
          )}
        </div>

        <Link
          to="/events"
          onClick={goToEvents}
          className="flex flex-shrink-0 items-center justify-center gap-1.5 border-t border-neutral-200 bg-neutral-50 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          View all events
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </DialogContent>
    </Dialog>
  );
}
