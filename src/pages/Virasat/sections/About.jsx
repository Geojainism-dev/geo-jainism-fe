import { useRef } from "react";
import { BRAND, ART_FORMS, img, imgSm, srcSet } from "../data/site";
import { useVirasat } from "../hooks/useSmoothScroll";
import { useGsap, revealWords, revealUp, revealImages, parallax } from "../animations/gsapAnimations";
import SectionHeading from "../components/common/SectionHeading";
import Ornament from "../components/common/Ornament";
import { useVT } from "../i18n";

function Marquee() {
  const { v } = useVT();
  const forms = ART_FORMS.map((name) => v(`art.${name}`, name));
  const row = [...forms, ...forms];
  return (
    <div className="relative overflow-hidden border-y border-vr-charcoal/15 py-6" aria-label={v("about.artForms", "Art forms: {{list}}", { list: forms.join(", ") })}>
      <div className="vr-marquee flex w-max items-center gap-10" aria-hidden="true">
        {row.map((name, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-vr-display text-[clamp(1.8rem,3.2vw,3rem)] italic text-vr-maroon">
            {name}
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
    body: "To give India’s classical and folk artists the stages, audiences and respect their traditions deserve — and to make every performance an evening people carry with them for life.",
  },
  {
    n: "ii.",
    id: "vision",
    title: "Our Vision",
    body: "A country where heritage is not kept behind glass but lived, out loud, by every generation — performed in the very places where it was born.",
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
          eyebrow={v("about.eyebrow", "About Virasat")}
          tone="dark"
          title={v("about.title", "A living stage for India’s *timeless* arts.")}
          titleClassName="max-w-[14ch]"
        />

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 lg:pt-10">
            <p className={`${lang === "en" ? "vr-dropcap " : ""}text-[1.2rem] leading-[1.75] text-vr-charcoal/85 lg:text-[1.28rem]`} data-reveal>
              <em className="not-italic font-semibold text-vr-maroon">{v("brand.name", "Virasat")}</em>{" "}
              {v("about.p1", "— the Hindi and Urdu word for inheritance — is a season of live performance staged where India’s heritage was made: in fort courtyards, on temple lawns, down the steps of ancient wells and around desert fires.")}
            </p>
            <p className="mt-6 text-[1.05rem] leading-[1.8] text-vr-charcoal/70" data-reveal data-delay="0.1">
              {v("about.p2", "Each evening brings masters and young torchbearers together — gharana musicians, classical dancers and folk performers whose art has passed from guru to shishya for generations. Nothing is staged for the camera. Everything is staged for the people sitting in front of it.")}
            </p>
            <Ornament.Divider className="mt-10 w-52 text-vr-gold" />
          </div>

          {/* layered parallax composition */}
          <div className="relative lg:col-span-7">
            <figure className="relative ml-auto aspect-[4/3] w-full overflow-hidden lg:w-[88%]" data-clip="up">
              <img
                src={img("kathak-group")}
                srcSet={srcSet("kathak-group")}
                sizes="(min-width: 1024px) 52vw, 100vw"
                alt={v("about.alt1", "A Kathak ensemble performing in green and blue costumes")}
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
                <img src={imgSm("bharatanatyam-portrait")} alt={v("about.alt2", "A Bharatanatyam dancer holding a pose on stage")} className="h-full w-full object-cover" loading="lazy" />
              </div>
            </figure>
            <figcaption className="mt-6 text-right text-xs uppercase tracking-[0.25em] text-vr-charcoal/50 lg:mt-8" data-reveal>
              {v("about.caption", "Kathak & Bharatanatyam — two of the eight classical forms")}
            </figcaption>
          </div>
        </div>
      </div>

      <Marquee />

      <div className="relative mx-auto grid max-w-[1600px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12 lg:py-32">
        <figure className="relative aspect-[4/5] overflow-hidden lg:col-span-4" data-clip="down">
          <img src={imgSm("chand-baori")} alt={v("about.alt3", "The geometric steps of Chand Baori stepwell")} className="h-[120%] w-full object-cover grayscale-[30%]" data-speed="-0.2" loading="lazy" />
        </figure>
        <div className="flex flex-col justify-center gap-14 lg:col-span-7 lg:col-start-6">
          {PILLARS.map((p, i) => (
            <article key={p.title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-vr-charcoal/15 pt-8" data-reveal data-delay={i * 0.1}>
              <span className="font-vr-display text-3xl italic text-vr-gold">{p.n}</span>
              <div>
                <h3 className="font-vr-display text-[clamp(2rem,3.2vw,3rem)] leading-none text-vr-maroon">{v(`about.${p.id}.title`, p.title)}</h3>
                <p className="mt-5 max-w-xl text-[1.08rem] leading-[1.8] text-vr-charcoal/75">{v(`about.${p.id}.body`, p.body)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
