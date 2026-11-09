import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus, Plus } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
import Ornament from "./Ornament";
import { upcomingEvents, eventDate, SEAT_TIERS as TIERS } from "../../data/events";
import { CONTACT } from "../../data/site";
import { useVT } from "../../i18n";

/**
 * Ticket request form. If the chosen show has a `ticketUrl`, the primary
 * action goes straight to that box office. Otherwise the request is handed to
 * the visitor's mail app, addressed to CONTACT.email, with every detail
 * pre-filled — so the button always does something real.
 */
export default function BookingModal({ open, onClose, initialEventId }) {
  const { v, tev, locale, lang } = useVT();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const events = useMemo(() => upcomingEvents().map(tev), [lang]);
  const [eventId, setEventId] = useState(initialEventId || events[0]?.id);
  const [tier, setTier] = useState(TIERS[0].id);
  const [qty, setQty] = useState(2);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setEventId(initialEventId || events[0]?.id);
      setSent(false);
      setErrors({});
    }
  }, [open, initialEventId, events]);

  const event = events.find((e) => e.id === eventId) ?? events[0];
  const d = event ? eventDate(event, locale) : null;

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = v("book.errName", "Please tell us your name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = v("book.errEmail", "Enter a valid email so we can confirm your seats.");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (event.ticketUrl) {
      window.open(event.ticketUrl, "_blank", "noopener,noreferrer");
      setSent(true);
      return;
    }
    const tierLabel = TIERS.find((t) => t.id === tier)?.label;
    const subject = `Ticket request — ${event.title}, ${d.full}`;
    const body = [
      `Show: ${event.title} (${event.subtitle})`,
      `Date: ${d.full}, ${d.time}`,
      `Venue: ${event.venue}, ${event.city}`,
      `Seating: ${tierLabel}`,
      `Tickets: ${qty}`,
      "",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.phone ? `Phone: ${form.phone}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field = (key, label, type = "text", autoComplete) => (
    <label className="vr-field">
      <span className="vr-field__label">{label}</span>
      <input
        type={type}
        value={form[key]}
        autoComplete={autoComplete}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `err-${key}` : undefined}
        className="vr-field__input"
      />
      {errors[key] && (
        <span id={`err-${key}`} className="vr-field__error">
          {errors[key]}
        </span>
      )}
    </label>
  );

  return (
    <Modal open={open} onClose={onClose} label={v("book.label", "Book tickets")}>
      <div className="grid md:grid-cols-[0.9fr_1.1fr] min-h-[min(640px,85vh)]">
        {/* show preview */}
        <div className="relative hidden md:block overflow-hidden bg-vr-ink">
          <AnimatePresence mode="wait">
            {event && (
              <motion.img
                key={event.id}
                src={event.imageSm}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              />
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-vr-ink via-vr-ink/40 to-transparent" />
          {event && (
            <div className="absolute bottom-0 left-0 right-0 p-8 text-vr-ivory">
              <p className="vr-eyebrow mb-3">{event.category}</p>
              <p className="vr-display text-4xl">{event.title}</p>
              <p className="mt-3 text-sm text-vr-ivory/70">
                {d.full} · {d.time}
                <br />
                {event.venue}, {event.city}
              </p>
            </div>
          )}
        </div>

        <div className="relative p-6 sm:p-10 text-vr-ivory">
          {sent ? (
            <div className="flex h-full flex-col items-start justify-center gap-6">
              <span className="grid h-14 w-14 place-items-center rounded-full border border-vr-gold/60 text-vr-gold">
                <Check size={24} strokeWidth={1.25} />
              </span>
              <h3 className="vr-display text-4xl">{v("book.sentTitle", "Your request is on its way.")}</h3>
              <p className="max-w-sm text-vr-ivory/70">
                {event.ticketUrl
                  ? v("book.sentUrl", "We've opened the box office in a new tab to complete your booking.")
                  : v("book.sentMail", "Your mail app has opened with the details filled in. Send it to {{email}}, and our box office will confirm your seats within one working day.", { email: CONTACT.email })}
              </p>
              <Button variant="ghost" onClick={onClose} icon={false}>
                {v("book.back", "Back to Virasat")}
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-7">
              <div>
                <p className="vr-eyebrow mb-3">{v("book.eyebrow", "Box office")}</p>
                <h3 className="vr-display text-[2.6rem] leading-none">{v("book.title", "Reserve your seats")}</h3>
                <Ornament.Divider className="mt-5 w-40 text-vr-gold/70" />
              </div>

              <label className="vr-field">
                <span className="vr-field__label">{v("book.show", "Show")}</span>
                <select className="vr-field__input" value={eventId} onChange={(e) => setEventId(e.target.value)}>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} — {eventDate(ev, locale).day} {eventDate(ev, locale).month} · {ev.city.split(",")[0]}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset>
                <legend className="vr-field__label mb-3">{v("book.seating", "Seating")}</legend>
                <div className="grid grid-cols-3 gap-2">
                  {TIERS.map((t) => (
                    <label key={t.id} className={`vr-tier ${tier === t.id ? "is-active" : ""}`}>
                      <input type="radio" name="tier" value={t.id} checked={tier === t.id} onChange={() => setTier(t.id)} className="sr-only" />
                      <span className="block font-vr-display text-xl">{v(`seat.${t.id}.label`, t.label)}</span>
                      <span className="mt-1 block text-[0.7rem] leading-snug text-vr-ivory/55">{v(`seat.${t.id}.note`, t.note)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="flex items-center justify-between gap-4">
                <span className="vr-field__label">{v("book.tickets", "Tickets")}</span>
                <div className="flex items-center gap-4">
                  <button type="button" className="vr-stepper" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={v("book.fewer", "Fewer tickets")}>
                    <Minus size={16} />
                  </button>
                  <span className="w-6 text-center font-vr-display text-2xl tabular-nums" aria-live="polite">
                    {qty}
                  </span>
                  <button type="button" className="vr-stepper" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label={v("book.more", "More tickets")}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {field("name", v("book.name", "Full name"), "text", "name")}
                {field("email", v("book.email", "Email"), "email", "email")}
                <div className="sm:col-span-2">{field("phone", v("book.phone", "Phone (optional)"), "tel", "tel")}</div>
              </div>

              <Button type="submit" size="lg" className="mt-2 w-full justify-between">
                {event?.ticketUrl ? v("book.continue", "Continue to box office") : v("book.request", "Request tickets")}
              </Button>
              <p className="-mt-3 text-xs text-vr-ivory/50">
                {v("book.note", "Seats are confirmed by email. Enquiries: {{email}}", { email: CONTACT.email })}
              </p>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}
