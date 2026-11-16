import { useRef } from "react";
import { Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { CONTACT, img, whatsappLink, mailLink } from "../data/site";
import { useVirasat } from "../hooks/useSmoothScroll";
import { useGsap, revealWords, revealUp, parallax } from "../animations/gsapAnimations";
import SplitWords from "../components/common/SplitWords";
import Button from "../components/common/Button";
import Ornament from "../components/common/Ornament";
import EnquiryForm from "../components/common/EnquiryForm";
import { useVT } from "../i18n";

export default function Contact() {
  const ref = useRef(null);
  const { reducedMotion, enquire } = useVirasat();
  const { v } = useVT();
  const ig = CONTACT.socials.find((s) => s.id === "instagram");
  const hello = whatsappLink("Namaste! I would like to know more about bringing Kavi Sajal Jain’s Virasat to our city.");

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
        <img src={img("vs-dilwara")} alt="" className="h-[130%] w-full object-cover opacity-25" data-speed="0.3" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-vr-maroon via-vr-maroon/80 to-vr-burgundy" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="flex flex-col items-center text-center">
          <p className="vr-eyebrow text-vr-gold" data-reveal>
            <span className="tabular-nums">06</span>
            <span className="vr-eyebrow__rule" aria-hidden="true" />
            <span>{v("vc.eyebrow", "Bring Virasat to Your City")}</span>
          </p>
          <h2 className="vr-display mt-8 text-[clamp(2.7rem,6.5vw,6.5rem)]">
            <SplitWords text={v("vc.h1", "Bring the Grand Experience")} className="block" />
            <SplitWords text={v("vc.h2", "of *Virasat* to Your City.")} className="block text-vr-gold-soft" />
          </h2>
          <Ornament.Divider className="mt-8 w-56 text-vr-gold" />
          <div className="mt-8 max-w-2xl space-y-4 text-lg leading-[1.75] text-vr-ivory/75" data-reveal>
            <p className="font-vr-display text-[1.5rem] italic text-vr-ivory">
              {v("vc.p1", "Planning a Jain Mahotsav, cultural celebration or a special community event?")}
            </p>
            <p>{v("vc.p2", "Invite Kavi Sajal Jain’s Virasat and create an unforgettable celebration of Jain history, culture and heritage.")}</p>
            <p>{v("vc.p3", "Connect with us for event bookings, collaborations and sponsorship opportunities.")}</p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4" data-reveal>
            <Button size="lg" onClick={() => enquire("")}>
              {v("vc.cta.book", "Book Virasat for Your Event")}
            </Button>
            <Button size="lg" variant="ghost" icon={false} href={hello}>
              <span className="inline-flex items-center gap-2">
                <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />
                {v("vc.cta.whatsapp", "Connect on WhatsApp")}
              </span>
            </Button>
            <Button size="lg" variant="ghost" icon={false} href={mailLink("Collaboration with Kavi Sajal Jain’s Virasat")}>
              {v("vc.cta.collab", "Discuss Collaboration")}
            </Button>
          </div>
        </div>

        <div className="mt-24 grid gap-px overflow-hidden border border-vr-ivory/10 bg-vr-ivory/10 md:grid-cols-3">
          <div className="bg-vr-burgundy/70 p-8 backdrop-blur-md lg:p-10" data-reveal>
            <p className="vr-eyebrow mb-6 text-vr-gold">{v("vc.direct", "Direct contact")}</p>
            <p className="font-vr-display text-3xl">{CONTACT.person}</p>
            <p className="mt-1 text-[0.7rem] uppercase tracking-[0.26em] text-vr-gold-soft">{v("vc.role", CONTACT.role)}</p>
            <ul className="mt-8 space-y-5 text-vr-ivory/80">
              <li>
                <span className="text-[0.65rem] uppercase tracking-[0.26em] text-vr-ivory/45">{v("vc.phoneLabel", "Phone / WhatsApp")}</span>
                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <a href={CONTACT.phoneHref} className="vr-link inline-flex items-center gap-3">
                    <Phone size={17} strokeWidth={1.4} className="shrink-0 text-vr-gold" aria-hidden="true" />
                    {CONTACT.phone}
                  </a>
                  <a href={hello} target="_blank" rel="noopener noreferrer" className="vr-link inline-flex items-center gap-1.5 text-sm text-vr-gold">
                    <MessageCircle size={14} strokeWidth={1.5} aria-hidden="true" /> WhatsApp
                  </a>
                </div>
              </li>
              <li>
                <span className="text-[0.65rem] uppercase tracking-[0.26em] text-vr-ivory/45">{v("vc.emailLabel", "Email")}</span>
                <a href={mailLink("Virasat enquiry")} className="vr-link mt-2 flex items-start gap-3 break-all">
                  <Mail size={17} strokeWidth={1.4} className="mt-1 shrink-0 text-vr-gold" aria-hidden="true" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <span className="text-[0.65rem] uppercase tracking-[0.26em] text-vr-ivory/45">Instagram</span>
                <a href={ig.href} target="_blank" rel="noopener noreferrer" className="vr-link mt-2 flex items-center gap-3">
                  <Instagram size={17} strokeWidth={1.4} className="shrink-0 text-vr-gold" aria-hidden="true" />
                  {ig.handle}
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-vr-burgundy/70 backdrop-blur-md md:col-span-2" data-reveal data-delay="0.08">
            <EnquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
