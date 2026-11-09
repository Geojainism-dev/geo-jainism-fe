import { useRef } from "react";
import { Mail, MessageCircle, Clock } from "lucide-react";
import { CONTACT, img } from "../data/site";
import { upcomingEvents, eventDate } from "../data/events";
import { useVirasat } from "../hooks/useSmoothScroll";
import { useGsap, revealWords, revealUp, parallax } from "../animations/gsapAnimations";
import SplitWords from "../components/common/SplitWords";
import Button from "../components/common/Button";
import Ornament from "../components/common/Ornament";
import { useVT } from "../i18n";

export default function Contact() {
  const ref = useRef(null);
  const { reducedMotion, openBooking } = useVirasat();
  const { v, tev, locale } = useVT();
  const events = upcomingEvents().map(tev);

  useGsap(
    ref,
    (root) => {
      revealWords(root);
      revealUp(root);
      parallax(root);
    },
    [],
    { reducedMotion }
  );

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden bg-vr-maroon text-vr-ivory">
      <div className="absolute inset-0 overflow-hidden">
        <img src={img("mehrangarh-night")} alt="" className="h-[130%] w-full object-cover opacity-30" data-speed="0.3" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-vr-maroon via-vr-maroon/80 to-vr-burgundy" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="flex flex-col items-center text-center">
          <p className="vr-eyebrow text-vr-gold" data-reveal>
            <span className="tabular-nums">06</span>
            <span className="vr-eyebrow__rule" aria-hidden="true" />
            <span>{v("contact.eyebrow", "Book Tickets & Contact")}</span>
          </p>
          <h2 className="vr-display mt-8 text-[clamp(3.4rem,9vw,9.5rem)]">
            <SplitWords text={v("contact.h1", "Be Part of the")} className="block" />
            <SplitWords text={v("contact.h2", "*Celebration*")} className="block text-vr-gold-soft" />
          </h2>
          <Ornament.Divider className="mt-8 w-56 text-vr-gold" />
          <p className="mt-8 max-w-xl text-lg leading-[1.75] text-vr-ivory/75" data-reveal>
            {v("contact.body", "Reserve your seats for the season, or write to us about group bookings, private performances and partnerships.")}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4" data-reveal>
            <Button size="lg" onClick={() => openBooking()}>
              {v("cta.book", "Book Tickets")}
            </Button>
            <Button size="lg" variant="ghost" href={`mailto:${CONTACT.email}`} icon={false}>
              {v("contact.write", "Write to us")}
            </Button>
          </div>
        </div>

        <div className="mt-24 grid gap-px overflow-hidden border border-vr-ivory/10 bg-vr-ivory/10 md:grid-cols-3">
          <div className="bg-vr-burgundy/70 p-8 backdrop-blur-md lg:p-10" data-reveal>
            <p className="vr-eyebrow mb-6 text-vr-gold">{v("contact.enquiries", "Enquiries")}</p>
            <ul className="space-y-4 text-vr-ivory/80">
              <li className="flex items-start gap-3">
                <Mail size={17} strokeWidth={1.4} className="mt-1 shrink-0 text-vr-gold" aria-hidden="true" />
                <a href={`mailto:${CONTACT.email}`} className="vr-link break-all">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle size={17} strokeWidth={1.4} className="mt-1 shrink-0 text-vr-gold" aria-hidden="true" />
                <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="vr-link">
                  {v("contact.whatsapp", "Join us on WhatsApp")}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={17} strokeWidth={1.4} className="mt-1 shrink-0 text-vr-gold" aria-hidden="true" />
                <span>{v("contact.hours", CONTACT.enquiryHours)}</span>
              </li>
            </ul>
          </div>

          <div className="bg-vr-burgundy/70 p-8 backdrop-blur-md lg:p-10" data-reveal data-delay="0.08">
            <p className="vr-eyebrow mb-6 text-vr-gold">{v("contact.venues", "Venues this season")}</p>
            <ul className="space-y-4">
              {events.map((ev) => {
                const d = eventDate(ev, locale);
                return (
                  <li key={ev.id} className="flex items-baseline justify-between gap-4 border-b border-vr-ivory/10 pb-3 last:border-0 last:pb-0">
                    <span>
                      <span className="block font-vr-display text-xl">{ev.venue}</span>
                      <span className="text-sm text-vr-ivory/55">{ev.city}</span>
                    </span>
                    <span className="shrink-0 text-xs uppercase tracking-[0.2em] text-vr-ivory/50 tabular-nums">
                      {d.day} {d.month}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-vr-burgundy/70 p-8 backdrop-blur-md lg:p-10" data-reveal data-delay="0.16">
            <p className="vr-eyebrow mb-6 text-vr-gold">{v("contact.follow", "Follow the season")}</p>
            <ul className="space-y-1">
              {CONTACT.socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-b border-vr-ivory/10 py-3 font-vr-display text-2xl transition-colors hover:text-vr-gold-soft"
                  >
                    {s.label}
                    <span className="text-sm text-vr-ivory/40 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-vr-gold" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
