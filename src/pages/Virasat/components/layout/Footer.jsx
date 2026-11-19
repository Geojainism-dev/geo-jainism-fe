import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Mail } from "lucide-react";
import { BRAND, CONTACT, NAV_ITEMS, mailLink } from "../../data/site";
import { useVirasat } from "../../hooks/useSmoothScroll";
import CreditsDialog from "../common/CreditsDialog";
import FooterWordmark from "./FooterWordmark";
import { useVT } from "../../i18n";

export default function Footer() {
  const { scrollTo } = useVirasat();
  const [credits, setCredits] = useState(false);
  const { v } = useVT();

  return (
    <footer className="relative overflow-hidden bg-vr-ink text-vr-ivory">
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-20 sm:px-8 lg:px-12">
        <div className="grid gap-12 border-b border-vr-ivory/10 pb-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.3em] text-vr-gold">{v("vft.kavi", "Kavi Sajal Jain’s")}</p>
            <p className="vr-display mt-2 text-[2.6rem] uppercase tracking-[0.08em] text-vr-gold-soft">{BRAND.name}</p>
            <p className="mt-2 text-[0.72rem] uppercase tracking-[0.24em] text-vr-ivory/70">{v("vh.subtitle", BRAND.subtitle)}</p>
            <p className="mt-3 font-vr-deva text-2xl text-vr-gold" lang="hi">
              {BRAND.taglineDeva}।
            </p>
            <p className="mt-5 max-w-sm text-vr-ivory/60">
              {v("vft.blurb", "A spectacular celebration of Jain history, culture, literature, poetry and music.")}
            </p>
            <div className="mt-8 flex items-center gap-4 border-t border-vr-ivory/10 pt-6">
              <Link to="/" aria-label={v("footer.home", "{{name}} home", { name: BRAND.presenter })} className="shrink-0">
                <img src="/logo.png" alt="" className="h-12 w-12 rounded-full object-cover ring-1 ring-vr-gold/40" loading="lazy" />
              </Link>
              <p className="text-sm leading-relaxed text-vr-ivory/70">
                {v("vft.initiative", "An initiative by")}{" "}
                <Link to="/" className="vr-link font-semibold text-vr-ivory">
                  {BRAND.presenter}
                </Link>
                <br />
                {v("footer.founded", "Founded by")}{" "}
                <Link to="/about" className="vr-link font-vr-display text-base italic text-vr-gold">
                  {BRAND.founder}
                </Link>
              </p>
            </div>
          </div>
          <nav aria-label={v("footer.nav", "Footer")}>
            <p className="vr-eyebrow mb-5">{v("footer.explore", "Explore")}</p>
            <ul className="grid grid-cols-2 gap-y-2.5 text-vr-ivory/75">
              {NAV_ITEMS.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className="vr-link"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(n.id);
                    }}
                  >
                    {v(`vft.n.${n.id}`, n.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="vr-eyebrow mb-5">{v("vft.contact", "Contact & Follow")}</p>
            <ul className="space-y-2.5 text-vr-ivory/75">
              <li>
                <a href={mailLink()} className="vr-link inline-flex items-center gap-2 break-all">
                  <Mail size={14} strokeWidth={1.4} className="shrink-0 text-vr-gold" aria-hidden="true" />
                  {CONTACT.email}
                </a>
              </li>
              {CONTACT.socials.map((s) => (
                <li key={s.id}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="vr-link">
                    {s.label} <span className="text-sm text-vr-ivory/45">{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FooterWordmark />

        <div className="flex flex-col gap-4 text-xs text-vr-ivory/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Kavi Sajal Jain’s Virasat | GEO Jainism. {v("vft.rights", "All Rights Reserved.")}
          </p>
          <div className="flex items-center gap-6">
            <button type="button" className="vr-link" onClick={() => setCredits(true)}>
              {v("footer.credits", "Photo credits")}
            </button>
            <button type="button" onClick={() => scrollTo("home")} className="inline-flex items-center gap-2 vr-link">
              {v("footer.top", "Back to top")} <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
      <CreditsDialog open={credits} onClose={() => setCredits(false)} />
    </footer>
  );
}
