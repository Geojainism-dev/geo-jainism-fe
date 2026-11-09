import { useRef } from "react";
import { Clock, MapPin } from "lucide-react";
import { upcomingEvents, eventDate } from "../data/events";
import { useVirasat } from "../hooks/useSmoothScroll";
import { useGsap, revealWords, revealUp } from "../animations/gsapAnimations";
import SectionHeading from "../components/common/SectionHeading";
import Button from "../components/common/Button";
import { useVT } from "../i18n";

function ShowRow({ event: raw, onBook }) {
  const { v, tev, locale } = useVT();
  const event = tev(raw);
  const d = eventDate(event, locale);
  return (
    <article className="vr-show group relative grid gap-6 border-t border-vr-gold/25 py-10 lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-12" data-reveal>
      {/* date */}
      <div className="flex items-baseline gap-4 lg:col-span-2 lg:flex-col lg:gap-1">
        <span className="font-vr-display text-[clamp(4rem,6vw,6rem)] font-light leading-[0.85] text-vr-gold tabular-nums">{d.day}</span>
        <span className="text-sm uppercase tracking-[0.25em] text-vr-ivory/70">
          {d.month} {d.year}
        </span>
        <span className="font-vr-display text-lg italic text-vr-ivory/50">{d.weekday}</span>
      </div>

      {/* poster */}
      <button
        type="button"
        onClick={onBook}
        className="relative block aspect-[16/10] overflow-hidden lg:col-span-3 lg:aspect-[4/5]"
        aria-label={v("shows.bookFor", "Book tickets for {{title}}", { title: event.title })}
      >
        <img
          src={event.imageSm}
          alt=""
          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 bg-vr-ink/70 px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-vr-ivory backdrop-blur-sm">
          {event.category}
        </span>
      </button>

      {/* copy */}
      <div className="lg:col-span-4 lg:pl-4">
        <h3 className="vr-display text-[clamp(2.4rem,3.6vw,3.6rem)] text-vr-ivory transition-colors duration-500 group-hover:text-vr-gold-soft">{event.title}</h3>
        <p className="mt-2 font-vr-display text-xl italic text-vr-ivory/70">{event.subtitle}</p>
        <p className="mt-5 max-w-md leading-[1.75] text-vr-ivory/65">{event.description}</p>
      </div>

      {/* logistics */}
      <div className="flex flex-col gap-6 lg:col-span-3 lg:items-end lg:text-right">
        <dl className="w-full space-y-3 text-sm text-vr-ivory/75">
          <div className="flex items-start gap-2.5 lg:flex-row-reverse lg:justify-start">
            <dt className="sr-only">{v("shows.venue", "Venue")}</dt>
            <MapPin size={16} strokeWidth={1.4} className="mt-0.5 shrink-0 text-vr-gold" aria-hidden="true" />
            <dd className="min-w-0">
              {event.venue}
              <br />
              <span className="text-vr-ivory/50">{event.city}</span>
            </dd>
          </div>
          <div className="flex items-start gap-2.5 lg:flex-row-reverse lg:justify-start">
            <dt className="sr-only">{v("shows.time", "Time")}</dt>
            <Clock size={16} strokeWidth={1.4} className="mt-0.5 shrink-0 text-vr-gold" aria-hidden="true" />
            <dd className="min-w-0">
              {d.time} <span className="text-vr-ivory/50">· {v("shows.doors", "doors {{time}}", { time: event.doors })}</span>
            </dd>
          </div>
        </dl>
        <Button onClick={onBook} className="self-start lg:self-end">
          {v("cta.book", "Book Tickets")}
        </Button>
      </div>
    </article>
  );
}

export default function UpcomingShows() {
  const ref = useRef(null);
  const { reducedMotion, openBooking, scrollTo } = useVirasat();
  const events = upcomingEvents();
  const { v } = useVT();

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
    <section id="shows" ref={ref} className="relative overflow-hidden bg-vr-burgundy text-vr-ivory">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_0%,rgba(198,161,91,0.16),transparent_55%)]" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-28 sm:px-8 lg:px-12 lg:py-36">
        <div className="mb-16 flex flex-col gap-10 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading index="03" eyebrow={v("shows.eyebrow", "Upcoming Shows")} title={v("shows.title", "The *season* ahead.")} />
          <div className="max-w-sm text-vr-ivory/65" data-reveal>
            <p className="leading-[1.75]">{v("shows.body", "Every evening is staged at a landmark venue, and seats are limited at each site — group and corporate bookings by enquiry.")}</p>
            <button type="button" onClick={() => scrollTo("contact")} className="vr-link mt-4 text-sm text-vr-gold">
              {v("shows.group", "Enquire about group bookings")}
            </button>
          </div>
        </div>

        <div className="border-b border-vr-gold/25">
          {events.map((ev) => (
            <ShowRow key={ev.id} event={ev} onBook={() => openBooking(ev.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}
