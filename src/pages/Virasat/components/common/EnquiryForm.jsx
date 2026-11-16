import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { CONTACT, whatsappLink, mailLink } from "../../data/site";
import { useVirasat } from "../../hooks/useSmoothScroll";
import Button from "./Button";
import { useVT } from "../../i18n";

const EVENT_TYPES = [
  { id: "mahotsav", label: "Jain Mahotsav" },
  { id: "cultural", label: "Cultural Celebration" },
  { id: "community", label: "Community Event" },
  { id: "institutional", label: "Institutional / Educational Event" },
  { id: "partnership", label: "Partnership / Collaboration" },
  { id: "sponsorship", label: "Sponsorship" },
  { id: "other", label: "Other" },
];

const AUDIENCE = ["Up to 250", "250 – 500", "500 – 1,000", "1,000 – 5,000", "5,000+"];

const EMPTY = { name: "", organisation: "", city: "", date: "", audience: "", phone: "", type: "", message: "" };

/** Indian mobile (with or without +91 / 0) or any international number in E.164 form. */
export function isValidPhone(raw) {
  const s = raw.replace(/[\s\-().]/g, "");
  return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(s) || /^\+(?!91)\d{8,15}$/.test(s);
}

const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

function Field({ id, label, required, error, hint, children }) {
  const { v } = useVT();
  return (
    <div className="vr-field">
      <label htmlFor={id} className="vr-field__label">
        {label}
        {required ? (
          <span className="text-vr-gold" aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className="normal-case tracking-normal text-vr-ivory/40"> {v("vc.optional", "(optional)")}</span>
        )}
      </label>
      {children}
      {hint && !error && <span className="text-xs text-vr-ivory/45">{hint}</span>}
      {error && (
        <span id={`${id}-err`} className="vr-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

/**
 * Booking enquiry. A valid submission is POSTed to FormSubmit, which emails it
 * to CONTACT.email (see CONTACT.formEndpoint) — no backend needed. Success is
 * shown only when the service confirms delivery; if it fails, the visitor is
 * offered WhatsApp and email with the details prefilled.
 */
export default function EnquiryForm() {
  const { enquiry } = useVirasat();
  const { v } = useVT();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  // "idle" | "sending" | "sent" | "error"; `links` = prefilled WhatsApp / email fallbacks
  const [status, setStatus] = useState("idle");
  const [links, setLinks] = useState(null);
  const [sentTo, setSentTo] = useState("");
  const formRef = useRef(null);

  // Partners / Contact CTAs preselect the event type and focus the form
  useEffect(() => {
    if (!enquiry.n) return;
    if (enquiry.type) setForm((f) => ({ ...f, type: enquiry.type }));
    setStatus((s) => (s === "sending" ? s : "idle"));
    const t = setTimeout(() => formRef.current?.querySelector("#vq-name")?.focus({ preventScroll: true }), 900);
    return () => clearTimeout(t);
  }, [enquiry]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 2) er.name = v("vc.err.name", "Please enter your full name.");
    if (!form.city.trim()) er.city = v("vc.err.city", "Please enter the city of your event.");
    if (!form.phone.trim()) er.phone = v("vc.err.phoneMissing", "Please enter a contact number.");
    else if (!isValidPhone(form.phone)) er.phone = v("vc.err.phone", "Enter a valid 10-digit mobile number, or an international number starting with +.");
    if (!form.type) er.type = v("vc.err.type", "Please choose the type of event.");
    if (form.date && form.date < todayISO()) er.date = v("vc.err.date", "The event date can’t be in the past.");
    return er;
  };

  const typeLabel = EVENT_TYPES.find((t) => t.id === form.type)?.label ?? "";

  const message = () =>
    [
      "Namaste! I would like to enquire about Kavi Sajal Jain’s Virasat.\n",
      `Name: ${form.name.trim()}`,
      form.organisation.trim() && `Organisation: ${form.organisation.trim()}`,
      `City: ${form.city.trim()}`,
      form.date && `Event date: ${new Date(`${form.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
      form.audience && `Expected audience: ${form.audience}`,
      `Contact number: ${form.phone.trim()}`,
      `Event type: ${typeLabel}`,
      form.message.trim() && `\nMessage: ${form.message.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const er = validate();
    setErrors(er);
    const first = Object.keys(er)[0];
    if (first) {
      formRef.current?.querySelector(`#vq-${first}`)?.focus();
      return;
    }
    const text = message();
    setLinks({ wa: whatsappLink(text), mail: mailLink(`Virasat enquiry — ${form.city.trim()}`, text) });
    setStatus("sending");

    const honey = formRef.current?.querySelector('[name="_honey"]')?.value ?? "";
    const payload = {
      "Full name": form.name.trim(),
      "Organisation / institution": form.organisation.trim() || "—",
      City: form.city.trim(),
      "Event date": form.date ? new Date(`${form.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—",
      "Expected audience": form.audience || "—",
      "Contact number": form.phone.trim(),
      "Event type": typeLabel,
      Message: form.message.trim() || "—",
      _subject: `Virasat booking enquiry — ${form.name.trim()}, ${form.city.trim()}`,
      _template: "table",
      _captcha: "false",
      _honey: honey,
    };

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(CONTACT.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      const data = await res.json().catch(() => ({}));
      // FormSubmit answers { success: "true" | "false", message }
      if (!res.ok || String(data.success) !== "true") throw new Error(data.message || `HTTP ${res.status}`);
      setSentTo(form.phone.trim());
      setStatus("sent");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timer);
    }
  };

  const input = (key, props = {}) => ({
    id: `vq-${key}`,
    name: key,
    value: form[key],
    onChange: set(key),
    className: "vr-field__input",
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `vq-${key}-err` : undefined,
    ...props,
  });

  return (
    <form id="enquiry" ref={formRef} onSubmit={onSubmit} noValidate className="vr-form relative p-6 sm:p-10" aria-labelledby="enquiry-title">
      <p className="vr-eyebrow text-vr-gold">{v("vc.formEyebrow", "Booking Enquiry")}</p>
      <h3 id="enquiry-title" className="vr-display mt-4 text-[clamp(2rem,3vw,2.8rem)]">
        {v("vc.formTitle", "Invite Virasat to your event")}
      </h3>

      {/* spam trap: hidden from people, filled in by bots — FormSubmit discards those */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <Field id="vq-name" label={v("vc.f.name", "Full Name")} required error={errors.name}>
          <input {...input("name", { type: "text", autoComplete: "name", required: true })} />
        </Field>
        <Field id="vq-organisation" label={v("vc.f.org", "Organisation / Institution Name")}>
          <input {...input("organisation", { type: "text", autoComplete: "organization" })} />
        </Field>
        <Field id="vq-city" label={v("vc.f.city", "City")} required error={errors.city}>
          <input {...input("city", { type: "text", autoComplete: "address-level2", required: true })} />
        </Field>
        <Field id="vq-date" label={v("vc.f.date", "Event Date")} error={errors.date}>
          <input {...input("date", { type: "date", min: todayISO() })} />
        </Field>
        <Field id="vq-audience" label={v("vc.f.audience", "Expected Audience Size")}>
          <select {...input("audience")}>
            <option value="">{v("vc.select", "Select")}</option>
            {AUDIENCE.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>
        <Field id="vq-phone" label={v("vc.f.phone", "Contact Number")} required error={errors.phone}>
          <input {...input("phone", { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "+91 98765 43210", required: true })} />
        </Field>
        <div className="sm:col-span-2">
          <Field id="vq-type" label={v("vc.f.type", "Event Type")} required error={errors.type}>
            <select {...input("type", { required: true })}>
              <option value="">{v("vc.select", "Select")}</option>
              {EVENT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {v(`vc.type.${t.id}`, t.label)}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="vq-message" label={v("vc.f.message", "Additional Message")}>
            <textarea {...input("message", { rows: 3, maxLength: 1000 })} />
          </Field>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" className="justify-center" disabled={status === "sending"} aria-busy={status === "sending"} icon={status !== "sending"}>
          {status === "sending" ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              {v("vc.sending", "Sending…")}
            </span>
          ) : (
            v("vc.submit", "Submit Enquiry")
          )}
        </Button>
        <p className="flex items-start gap-2 text-sm leading-relaxed text-vr-ivory/55">
          <Send size={14} strokeWidth={1.5} className="mt-1 shrink-0 text-vr-gold" aria-hidden="true" />
          {v("vc.how", "Your enquiry goes straight to the Virasat team, who will get back to you on the number you share.")}
        </p>
      </div>

      <div aria-live="polite">
        {status === "sent" && (
          <div className="mt-8 flex gap-4 border border-vr-gold/50 bg-vr-gold/[0.08] p-5 text-sm leading-relaxed text-vr-ivory/85">
            <CheckCircle2 size={22} strokeWidth={1.4} className="mt-0.5 shrink-0 text-vr-gold" aria-hidden="true" />
            <div>
              <p className="font-semibold text-vr-gold-soft">{v("vc.sentTitle", "Thank you — your enquiry has been sent.")}</p>
              <p className="mt-1">{v("vc.sent", "The Virasat team will contact you on {{phone}} soon.", { phone: sentTo })}</p>
              {links && (
                <a href={links.wa} target="_blank" rel="noopener noreferrer" className="vr-link mt-3 inline-block text-vr-gold">
                  {v("vc.alsoWhatsapp", "Want a quicker reply? Message us on WhatsApp")}
                </a>
              )}
            </div>
          </div>
        )}
        {status === "error" && links && (
          <div className="mt-8 border border-[#e58a7a]/60 bg-[#e58a7a]/[0.08] p-5 text-sm leading-relaxed text-vr-ivory/85" role="alert">
            <p className="font-semibold text-[#f0a597]">{v("vc.errTitle", "We couldn’t send your enquiry just now.")}</p>
            <p className="mt-1">{v("vc.errBody", "Your details are still in the form. Please try again, or send them to us directly:")}</p>
            <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              <a href={links.wa} target="_blank" rel="noopener noreferrer" className="vr-link text-vr-gold">
                {v("vc.viaWhatsapp", "Send on WhatsApp")}
              </a>
              <a href={links.mail} className="vr-link text-vr-gold">
                {v("vc.byEmail", "Send by email")}
              </a>
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
