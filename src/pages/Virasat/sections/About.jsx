import { useRef } from "react";
import { BRAND, ART_FORMS, ART_FORMS_DEVA, img, imgSm, srcSet } from "../data/site";
import { useVirasat } from "../hooks/useSmoothScroll";
import { useGsap, revealWords, revealUp, revealImages, parallax } from "../animations/gsapAnimations";
import SectionHeading from "../components/common/SectionHeading";
import Ornament from "../components/common/Ornament";
import Highlight from "../components/common/Highlight";
import { useVT } from "../i18n";

function Marquee() {
  const { v } = useVT();
  const forms = ART_FORMS.map((name) => v(`va.theme.${name}`, name));
  const row = [...ART_FORMS, ...ART_FORMS].map((name) => ({ name: v(`va.theme.${name}`, name), deva: ART_FORMS_DEVA[name] }));
  return (
    <div className="relative overflow-hidden border-y border-vr-charcoal/15 py-6" aria-label={v("va.themes", "Themes: {{list}}", { list: forms.join(", ") })}>
      <div className="vr-marquee flex w-max items-center gap-10" aria-hidden="true">
        {row.map(({ name, deva }, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-vr-display text-[clamp(1.8rem,3.2vw,3rem)] italic text-vr-maroon">
            <span className="flex items-baseline gap-4">
              {name}
              <span className="font-vr-deva text-[0.55em] not-italic text-vr-gold" lang="hi">
                {deva}
              </span>
            </span>
            <svg width="14" height="14" viewBox="0 0 14 14" className="text-vr-gold" aria-hidden="true">
              <path d="M7 0c1.6 2.6 2.6 4.6 2.6 7S8.6 11.4 7 14C5.4 11.4 4.4 9.4 4.4 7S5.4 2.6 7 0Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

const PILLARS = [
  {
    n: "i.",
    id: "mission",
    title: "Our Mission",
    body: "To bring the inspiring stories, teachings and extraordinary lives of our **Tirthankaras** to every corner of society, making the **timeless wisdom** and glorious heritage of Jainism known to generations through powerful storytelling, poetry, music and live cultural experiences.",
  },
  {
    n: "ii.",
    id: "vision",
    title: "Our Vision",
    body: "To inspire **future generations** to discover, understand and take **pride** in the extraordinary legacy of Jainism.",
  },
];

export default function About() {
  const ref = useRef(null);
  const { reducedMotion } = useVirasat();
  const { v, lang } = useVT();

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
    <section id="about" ref={ref} className="relative overflow-hidden bg-vr-ivory text-vr-charcoal">
      <div className="pointer-events-none absolute inset-0 text-vr-maroon opacity-[0.05]">
        <Ornament.Jaali id="vr-jaali-about" />
      </div>
      {/* Devanagari watermark */}
      <p
        className="pointer-events-none absolute -right-[4vw] top-[14%] select-none font-vr-deva text-[clamp(10rem,28vw,30rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(100,28,43,0.14)]"
        data-speed="0.35"
        aria-hidden="true"
      >
        {BRAND.nameDeva}
      </p>

      <div className="relative mx-auto max-w-[1600px] px-5 pb-24 pt-28 sm:px-8 lg:px-12 lg:pb-32 lg:pt-40">
        <SectionHeading
          index="01"
          eyebrow={v("va.eyebrow", "The Story of Virasat")}
          tone="dark"
          title={v("va.title", "A Grand Celebration of *Jain* Heritage, History & Culture.")}
          titleClassName="max-w-[18ch] !text-[clamp(2.6rem,5.6vw,5.75rem)]"
        />

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 lg:pt-10">
            <p className={`${lang === "en" ? "vr-dropcap " : ""}text-[1.2rem] leading-[1.75] text-vr-charcoal/85 lg:text-[1.28rem]`} data-reveal>
              <Highlight
                text={v(
                  "va.p1",
                  "Virasat is a grand live cultural experience conceptualised by **Kavi Sajal Jain**, celebrating the glorious history, values, literature and heritage of **Jainism**."
                )}
              />
            </p>
            <p className="mt-6 text-[1.05rem] leading-[1.8] text-vr-charcoal/70" data-reveal data-delay="0.1">
              <Highlight
                text={v(
                  "va.p2",
                  "Through powerful **poetry**, soulful **music**, captivating **storytelling** and spectacular live performances, Virasat brings the **forgotten chapters** of Jain history to life."
                )}
              />
            </p>
            <p className="mt-6 text-[1.05rem] leading-[1.8] text-vr-charcoal/70" data-reveal data-delay="0.15">
              <Highlight
                text={v(
                  "va.p3",
                  "From the extraordinary courage of our **Tirthankaras** to the legacy of great kings, queens and spiritual leaders — every performance celebrates the **pride of Jain heritage**."
                )}
              />
            </p>
            <Ornament.Divider className="mt-10 w-52 text-vr-gold" />
          </div>

          {/* layered parallax composition */}
          <div className="relative lg:col-span-7">
            <figure className="relative ml-auto aspect-[4/3] w-full overflow-hidden lg:w-[88%]" data-clip="up">
              <img
                src={img("vs-event-01")}
                srcSet={srcSet("vs-event-01")}
                sizes="(min-width: 1024px) 52vw, 100vw"
                alt={v("va.alt1", "Poetry and song before an epic backdrop on the Virasat stage")}
                className="h-[118%] w-full object-cover"
                data-speed="-0.15"
                loading="lazy"
              />
            </figure>
            <figure
              className="relative -mt-24 w-[52%] overflow-hidden border-[10px] border-vr-ivory shadow-[0_30px_60px_-20px_rgba(23,19,19,0.45)] sm:-mt-40 lg:absolute lg:-bottom-20 lg:left-0 lg:mt-0 lg:w-[40%]"
              data-speed="0.25"
            >
              <div className="aspect-[3/4] overflow-hidden" data-clip="right">
                <img src={imgSm("vs-event-02")} alt={v("va.alt2", "Addressing a full hall at Virasat")} className="h-full w-full object-cover" loading="lazy" />
              </div>
            </figure>
            <figcaption className="mt-6 text-right text-xs uppercase tracking-[0.25em] text-vr-charcoal/50 lg:mt-8" data-reveal>
              {v("va.caption", "Scenes from the Virasat stage")}
            </figcaption>
          </div>
        </div>
      </div>

      <Marquee />

      <div className="relative mx-auto grid max-w-[1600px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12 lg:py-32">
        <figure className="relative aspect-[4/5] overflow-hidden lg:col-span-4" data-clip="down">
          <img src={imgSm("vs-event-03")} alt={v("va.alt3", "The Virasat ensemble")} className="h-[120%] w-full object-cover" data-speed="-0.2" loading="lazy" />
        </figure>
        <div className="flex flex-col justify-center gap-14 lg:col-span-7 lg:col-start-6">
          {PILLARS.map((p, i) => (
            <article key={p.title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-vr-charcoal/15 pt-8" data-reveal data-delay={i * 0.1}>
              <span className="font-vr-display text-3xl italic text-vr-gold">{p.n}</span>
              <div>
                <h3 className="font-vr-display text-[clamp(2rem,3.2vw,3rem)] leading-none text-vr-maroon">{v(`va.${p.id}.title`, p.title)}</h3>
                <p className="mt-5 max-w-xl text-[1.08rem] leading-[1.8] text-vr-charcoal/75">
                  <Highlight text={v(`va.${p.id}.body`, p.body)} />
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
