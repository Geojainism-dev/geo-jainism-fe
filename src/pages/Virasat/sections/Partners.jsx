import { useRef } from "react";
import { useVirasat } from "../hooks/useSmoothScroll";
import { useGsap, revealWords, revealUp } from "../animations/gsapAnimations";
import SectionHeading from "../components/common/SectionHeading";
import Button from "../components/common/Button";
import { useVT } from "../i18n";

/**
 * Partnership categories. No partners are confirmed yet, so the section
 * presents the categories themselves — never invented names or logos.
 * When partners are announced, add them to the relevant category.
 */
const CATEGORIES = [
  {
    id: "institutional",
    title: "Event & Institutional Partners",
    body: "Jain organisations, trusts, institutions and community groups supporting cultural celebrations.",
  },
  {
    id: "cultural",
    title: "Cultural Partners",
    body: "Artists, performers, poets, musicians and creative collaborators.",
  },
  {
    id: "associate",
    title: "Associate Partners",
    body: "Organisations and brands contributing to the Virasat experience.",
  },
  {
    id: "sponsor",
    title: "Brand Collaboration Opportunities",
    body: "Collaborate with Virasat and connect your brand with a grand celebration of Jain heritage, culture and timeless traditions.",
    cta: true,
  },
];

export default function Partners() {
  const ref = useRef(null);
  const { reducedMotion, enquire } = useVirasat();
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
    <section id="partners" ref={ref} className="relative isolate bg-vr-ivory text-vr-charcoal">
      <div className="mx-auto max-w-[1600px] px-5 py-28 sm:px-8 lg:px-12 lg:py-36">
        <div className="mb-16 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="05"
            eyebrow={v("vp.eyebrow", "Our Collaborations")}
            tone="dark"
            title={v("vp.title", "Together, We Celebrate Our *Heritage.*")}
            titleClassName="max-w-[15ch] !text-[clamp(2.6rem,5.6vw,5.75rem)]"
          />
          <div className="max-w-md" data-reveal>
            <p className="leading-[1.75] text-vr-charcoal/70">
              {v(
                "vp.p1",
                "Virasat brings together Jain organisations, institutions, cultural communities and partners to celebrate the glorious heritage of Jainism."
              )}
            </p>
            <p className="mt-4 leading-[1.75] text-vr-charcoal/70">
              {v(
                "vp.p2",
                "Together, we aim to bring the extraordinary stories of our heritage to wider audiences and create meaningful cultural experiences."
              )}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => enquire("partnership")}>{v("vp.cta.partner", "Become a Virasat Partner")}</Button>
            </div>
          </div>
        </div>

        <div className="border-b border-vr-charcoal/15">
          {CATEGORIES.map((c, i) => (
            <div
              key={c.id}
              className={`group relative grid gap-4 border-t border-vr-charcoal/15 py-8 lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-10 ${c.cta ? "before:absolute before:inset-y-0 before:-inset-x-5 before:-z-10 before:bg-vr-maroon/[0.05] sm:before:-inset-x-8 lg:before:-inset-x-12" : ""}`}
              data-reveal
            >
              <span
                className="select-none font-vr-display text-[clamp(3.6rem,6vw,5.5rem)] font-light italic leading-none text-transparent [-webkit-text-stroke:1.25px_rgba(100,28,43,0.6)] transition-colors duration-500 group-hover:[-webkit-text-stroke:1px_rgba(198,161,91,0.9)] lg:col-span-3"
                aria-hidden="true"
              >
                {["i.", "ii.", "iii.", "iv."][i]}
              </span>
              <div className={c.cta ? "lg:col-span-6" : "lg:col-span-9"}>
                <h3 className="font-vr-display text-[clamp(1.9rem,3vw,2.8rem)] leading-tight text-vr-charcoal transition-colors duration-500 group-hover:text-vr-maroon">
                  {v(`vp.${c.id}.title`, c.title)}
                </h3>
                <p className="mt-2 max-w-2xl leading-[1.75] text-vr-charcoal/65">{v(`vp.${c.id}.body`, c.body)}</p>
              </div>
              {c.cta && (
                <div className="lg:col-span-3 lg:text-right">
                  <button type="button" onClick={() => enquire("sponsorship")} className="vr-link text-sm font-semibold uppercase tracking-[0.18em] text-vr-maroon">
                    {v("vp.sponsor.cta", "Discuss Sponsorship")} →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
