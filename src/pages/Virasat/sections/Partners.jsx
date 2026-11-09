import { useRef } from "react";
import { SPONSOR_TIERS } from "../data/sponsors";
import { CONTACT } from "../data/site";
import { useVirasat } from "../hooks/useSmoothScroll";
import { useGsap, revealWords, revealUp } from "../animations/gsapAnimations";
import SectionHeading from "../components/common/SectionHeading";
import Button from "../components/common/Button";
import { useVT } from "../i18n";

const SIZES = {
  xl: { cell: "h-36 sm:h-44", text: "text-[clamp(2.2rem,4.2vw,3.6rem)]", logo: "max-h-20", cols: "grid-cols-1" },
  lg: { cell: "h-28 sm:h-32", text: "text-[clamp(1.5rem,2.4vw,2.2rem)]", logo: "max-h-14", cols: "grid-cols-1 sm:grid-cols-3" },
  md: { cell: "h-24", text: "text-[clamp(1.2rem,1.7vw,1.55rem)]", logo: "max-h-10", cols: "grid-cols-2 lg:grid-cols-4" },
  sm: { cell: "h-20", text: "text-[clamp(1rem,1.3vw,1.2rem)]", logo: "max-h-8", cols: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" },
};

/** Logo if provided, otherwise the name as a typographic wordmark. */
function SponsorMark({ sponsor, size }) {
  const s = SIZES[size];
  const content = sponsor.logo ? (
    <img src={sponsor.logo} alt={sponsor.name} className={`${s.logo} w-auto max-w-[80%] object-contain opacity-70 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0`} loading="lazy" />
  ) : (
    <span className={`font-vr-display ${s.text} text-center leading-tight text-vr-charcoal/70 transition-colors duration-500 group-hover:text-vr-maroon`}>{sponsor.name}</span>
  );
  const cls = `group relative flex ${s.cell} items-center justify-center px-6 transition-colors duration-500 hover:bg-vr-maroon/[0.04]`;
  return sponsor.href ? (
    <a href={sponsor.href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={sponsor.name}>
      {content}
    </a>
  ) : (
    <div className={cls}>{content}</div>
  );
}

export default function Partners() {
  const ref = useRef(null);
  const { reducedMotion } = useVirasat();
  const tiers = SPONSOR_TIERS.filter((t) => t.sponsors.length);
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
    <section id="partners" ref={ref} className="relative bg-vr-ivory text-vr-charcoal">
      <div className="mx-auto max-w-[1600px] px-5 py-28 sm:px-8 lg:px-12 lg:py-36">
        <div className="mb-16 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading index="05" eyebrow={v("partners.eyebrow", "Partners & Sponsors")} tone="dark" title={v("partners.title", "In good *company*.")} />
          <div className="max-w-sm" data-reveal>
            <p className="leading-[1.75] text-vr-charcoal/70">{v("partners.body", "The institutions and brands who help keep India’s living arts on stage, and in front of new audiences.")}</p>
            <Button
              variant="ghost"
              className="mt-6 !border-vr-maroon/40 !bg-transparent !text-vr-maroon hover:!bg-vr-maroon hover:!text-vr-ivory"
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Partnering with Virasat")}`}
            >
              {v("partners.cta", "Become a partner")}
            </Button>
          </div>
        </div>

        <div className="space-y-0">
          {tiers.map((tier) => (
            <div key={tier.id} className="grid gap-4 border-t border-vr-charcoal/15 py-8 lg:grid-cols-12 lg:gap-8" data-reveal>
              <p className="vr-eyebrow text-vr-maroon lg:col-span-3 lg:pt-4">{v(`tier.${tier.id}`, tier.label)}</p>
              <div className={`grid ${SIZES[tier.size].cols} divide-vr-charcoal/10 lg:col-span-9 [&>*]:border-vr-charcoal/10 sm:[&>*]:border-l`}>
                {tier.sponsors.map((sp) => (
                  <SponsorMark key={sp.name} sponsor={sp} size={tier.size} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
