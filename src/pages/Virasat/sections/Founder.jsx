import { useRef } from "react";
import { BRAND, coverBox, imageProps, PAGE } from "../data/site";

// Portrait: 4:5 figure, 5 of 12 columns from 1024px (gap 40px), at most 34rem (544px); the image is 118% of the figure's height.
const founderSizes = coverBox(
  { sm: `min(544px, ${PAGE.sm})`, md: `min(544px, ${PAGE.md})`, lg: `min(544px, calc(${PAGE.lg} * 0.4167 - 23px))` },
  { sm: 1.475, md: 1.475, lg: 1.475 },
);
import { useVirasat } from "../hooks/useSmoothScroll";
import { useGsap, revealWords, revealUp, revealImages, parallax } from "../animations/gsapAnimations";
import SplitWords from "../components/common/SplitWords";
import Ornament from "../components/common/Ornament";
import Highlight from "../components/common/Highlight";
import { useVT } from "../i18n";

/**
 * Founder & Visionary. The photograph is Kavi Sajal Jain on the Virasat
 * stage, from the client's Drive folder (Nov 2026).
 * Bio copy is the client-supplied parichay — no invented biography.
 */
export default function Founder() {
  const ref = useRef(null);
  const { reducedMotion, scrollTo } = useVirasat();
  const { v } = useVT();

  useGsap(
    ref,
    (root) => {
      revealWords(root);
      revealUp(root);
      revealImages(root);
      parallax(root);
    },
    [],
    { reducedMotion }
  );

  return (
    <section id="founder" ref={ref} className="relative overflow-hidden bg-vr-ink text-vr-ivory" aria-labelledby="founder-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_40%,rgba(100,28,43,0.55),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 text-vr-gold opacity-[0.04]">
        <Ornament.Jaali id="vr-jaali-founder" />
      </div>
      {/* Devanagari watermark, as in About */}
      <p
        className="pointer-events-none absolute -right-[3vw] bottom-[6%] select-none font-vr-deva text-[clamp(8rem,22vw,24rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(198,161,91,0.12)]"
        data-speed="0.3"
        aria-hidden="true"
      >
        {BRAND.nameDeva}
      </p>

      <div className="relative mx-auto grid max-w-[1600px] gap-16 px-5 py-28 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12 lg:py-36">
        {/* portrait with an offset gold frame */}
        <div className="relative mx-auto w-full max-w-[34rem] self-center lg:col-span-5 lg:mx-0">
          <div className="pointer-events-none absolute -bottom-4 -right-4 top-4 left-4 border border-vr-gold/60 sm:-bottom-6 sm:-right-6 sm:left-6 sm:top-6" aria-hidden="true" />
          <figure className="relative aspect-[4/5] overflow-hidden bg-vr-charcoal shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]" data-clip="up">
            <img
              {...imageProps("vs-kavi-sajal-jain", { sizes: founderSizes })}
              alt={v("vf.alt", "Kavi Sajal Jain performing on the Virasat stage")}
              className="absolute inset-x-0 -top-[9%] h-[118%] w-full object-cover object-[50%_25%]"
              data-speed="-0.12"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vr-ink/70 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <span className="block font-vr-display text-xl text-vr-ivory">{BRAND.founder}</span>
            </figcaption>
          </figure>
        </div>

        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
          <p className="vr-eyebrow text-vr-gold" data-reveal>
            <span className="vr-eyebrow__rule" aria-hidden="true" />
            <span>{v("vf.eyebrow", "The Visionary Behind Virasat")}</span>
          </p>
          <h2 id="founder-title" className="vr-display mt-7 text-[clamp(3.2rem,7vw,7rem)] text-vr-ivory">
            <SplitWords text={v("vf.name", "Kavi Sajal *Jain*")} />
          </h2>
          <p className="mt-6 inline-flex items-center gap-4 self-start border-y border-vr-gold/50 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.28em] text-vr-gold-soft" data-reveal>
            {v("vf.role", "Founder & Visionary")}
          </p>

          <div className="mt-10 space-y-6 text-[1.08rem] leading-[1.85] text-vr-ivory/70">
            <p className="text-[1.2rem] leading-[1.75] text-vr-ivory/85 lg:text-[1.26rem]" data-reveal>
              <Highlight
                className="text-vr-gold-soft"
                text={v(
                  "vf.p1",
                  "A renowned **Hindi poet, storyteller and cultural visionary**, Kavi Sajal Jain has performed at over **300 Jain literary and cultural platforms**, earning recognition in the Hindi Kavi Sammelan circuit. In contemporary Jain poetry, he has pioneered creative expressions by blending historical narratives with modern poetic forms."
                )}
              />
            </p>
            <p data-reveal data-delay="0.08">
              <Highlight
                className="text-vr-gold-soft"
                text={v(
                  "vf.p2",
                  "He is the **Founder of GEO Jainism** and Director of the widely discussed international documentary **Tamil Jains**, bringing overlooked dimensions of Jain heritage to wider audiences. A postgraduate in Hindi from Banaras Hindu University (BHU), he combines literary scholarship with contemporary cultural expression."
                )}
              />
            </p>
            <p data-reveal data-delay="0.1">
              <Highlight
                className="text-vr-gold-soft"
                text={v(
                  "vf.p3",
                  "Through grand productions like Virasat, he is taking **Jain legacy to the masses**, creating a powerful connection between heritage and today’s youth."
                )}
              />
            </p>
          </div>

          <blockquote className="relative mt-10 border-l-2 border-vr-gold pl-6" data-reveal data-delay="0.12">
            <p className="font-vr-display text-[clamp(1.5rem,2.3vw,2.1rem)] italic leading-snug text-vr-ivory">
              {v("vf.quote", "His vision is to make Jainatva a living, celebrated and inspiring part of contemporary culture.")}
            </p>
            <p className="mt-4 font-vr-deva text-lg text-vr-gold" lang="hi">
              {BRAND.taglineDeva}
            </p>
          </blockquote>

          <div className="mt-10" data-reveal>
            <button type="button" onClick={() => scrollTo("contact")} className="vr-link text-sm font-semibold uppercase tracking-[0.2em] text-vr-gold">
              {v("vf.cta", "Invite Virasat to your city")} →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
