import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Leaf, HandHeart, BookOpen } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { EDITORIAL, img, srcSet } from "../data/media";
import { getProducts } from "../services/catalog";
import { useAsync } from "../hooks/useAsync";
import { Button, CardSkeleton, Reveal, SectionHeader, ShopImage } from "../components/common/ui";
import ProductCard from "../components/product/ProductCard";
import ProductRail from "../components/product/ProductRail";
import { useShopT } from "../i18n";

gsap.registerPlugin(ScrollTrigger);
const ease = [0.22, 1, 0.36, 1];

function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { s } = useShopT();

  useLayoutEffect(() => {
    if (reduce || !ref.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-bg]", { yPercent: 14, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to("[data-hero-inset]", { yPercent: -22, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  const up = (d) => (reduce ? {} : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.1, delay: d, ease } });

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:pb-24 lg:pt-16">
        <div className="relative z-10 flex flex-col justify-center lg:col-span-5 lg:pr-6">
          <motion.p className="gj-eyebrow" {...up(0.05)}>
            {s("home.eyebrow", "The GEO Jainism collection")}
          </motion.p>
          <h1 className="gj-display mt-6 text-[clamp(3rem,6.6vw,6.4rem)] leading-[0.95] text-gj-charcoal">
            {[s("home.h1a", "Discover the"), s("home.h1b", "Essence of"), s("home.h1c", "Jain Heritage.")].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${i === 2 ? "italic text-gj-maroon" : ""}`}
                  initial={reduce ? false : { yPercent: 105 }}
                  animate={{ yPercent: 0 }}
                  transition={{ duration: 1.2, delay: 0.1 + i * 0.1, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="mt-7 max-w-md text-lg leading-relaxed text-gj-brown/80" {...up(0.45)}>
            {s("home.lead", "Books, art and handmade objects shaped by 2,500 years of Jain thought — made by artisans, chosen by our researchers.")}
          </motion.p>
          <motion.div className="mt-9 flex flex-wrap gap-3" {...up(0.6)}>
            <Button to="/shop/products">
              {s("common.explore", "Explore the collection")} <ArrowRight size={16} />
            </Button>
            <Button to="/shop/products?sort=newest" variant="outline">
              {s("home.arrivals", "New arrivals")}
            </Button>
          </motion.div>
        </div>

        <div className="relative lg:col-span-7">
          <motion.div
            className="gj-keep relative aspect-[4/3] overflow-hidden lg:aspect-[5/4]"
            initial={reduce ? false : { clipPath: "inset(12% 12% 12% 12%)", opacity: 0 }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
            transition={{ duration: 1.5, ease }}
          >
            <img
              data-hero-bg
              src={img(EDITORIAL.hero)}
              srcSet={srcSet(EDITORIAL.hero)}
              sizes="(min-width: 1024px) 58vw, 100vw"
              alt={s("home.heroAlt", "Intricately carved marble ceiling of the Dilwara Jain temples")}
              className="absolute inset-0 h-[115%] w-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gj-charcoal/45 via-transparent to-transparent" />
            <p className="absolute bottom-5 right-5 text-right text-xs uppercase tracking-[0.2em] text-gj-ivory/85">{s("home.heroCap", "Dilwara · carved marble, 11th century")}</p>
          </motion.div>
          <motion.figure
            data-hero-inset
            className="absolute -bottom-10 -left-4 hidden w-[34%] border-[10px] border-gj-ivory shadow-[0_30px_60px_-25px_rgba(36,33,30,0.45)] sm:block lg:-left-14"
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease }}
          >
            <ShopImage k={EDITORIAL.heroDetail} small className="aspect-[4/5] overflow-hidden" alt={s("home.insetAlt", "A hand-cast brass oil lamp")} eager />
          </motion.figure>
        </div>
      </div>
    </section>
  );
}

/* Staggered 4 × 3 masonry on desktop: tall cards alternate columns so the grid has no holes. */
const CAT_POS = [
  "lg:col-start-1 lg:row-start-1 lg:row-span-2",
  "lg:col-start-2 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1 lg:row-span-2",
  "lg:col-start-4 lg:row-start-1",
  "lg:col-start-1 lg:row-start-3",
  "lg:col-start-2 lg:row-start-2 lg:row-span-2",
  "lg:col-start-3 lg:row-start-3",
  "lg:col-start-4 lg:row-start-2 lg:row-span-2",
];
const isTall = (i) => CAT_POS[i]?.includes("row-span-2");

function Categories() {
  const { s, cat } = useShopT();
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <Reveal>
        <SectionHeader
          eyebrow={s("home.catEyebrow", "Shop by category")}
          title={s("home.catTitle", "Eight ways into the tradition")}
          action={
            <Link to="/shop/products" className="gj-link inline-flex items-center gap-2 text-sm font-medium text-gj-maroon">
              {s("home.viewAll", "View everything")} <ArrowRight size={15} />
            </Link>
          }
        />
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {CATEGORIES.map(cat).map((c, i) => (
          <Reveal key={c.slug} delay={(i % 4) * 0.06} className={CAT_POS[i] ?? ""}>
            <Link to={`/shop/products?category=${c.slug}`} className="gj-keep group relative block h-full overflow-hidden">
              <ShopImage
                k={c.image}
                small={!isTall(i)}
                className={`${isTall(i) ? "aspect-[4/5] lg:aspect-auto lg:h-full" : "aspect-[4/5] lg:aspect-[5/4]"} overflow-hidden`}
                imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gj-charcoal/75 via-gj-charcoal/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-gj-ivory sm:p-6">
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-gj-ivory/70">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="gj-display mt-1 text-[clamp(1.35rem,2.2vw,2rem)] leading-tight">{c.name}</h3>
                <p className="mt-2 hidden max-w-xs text-sm text-gj-ivory/75 sm:block">{c.blurb}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Grid({ products, loading, count = 4 }) {
  return (
    <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
      {loading ? Array.from({ length: count }, (_, i) => <CardSkeleton key={i} />) : products.map((p, i) => (
        <Reveal key={p.id} delay={(i % 4) * 0.06}>
          <ProductCard product={p} />
        </Reveal>
      ))}
    </div>
  );
}

function Story() {
  const { s } = useShopT();
  return (
    <section className="gj-paper">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-28">
        <div className="relative lg:col-span-6">
          <Reveal>
            <ShopImage k={EDITORIAL.storyB} className="aspect-[4/3] overflow-hidden" sizes="(min-width: 1024px) 45vw, 100vw" alt={s("story.altA", "Samanar Malai hill near Madurai, a Jain heritage site")} />
          </Reveal>
          <Reveal delay={0.15} className="absolute -bottom-10 right-4 w-[46%] border-[10px] border-gj-sand sm:right-10">
            <ShopImage k={EDITORIAL.storyA} small className="aspect-[4/3] overflow-hidden" alt={s("story.altB", "A Tamil-Brahmi inscription carved in rock")} />
          </Reveal>
        </div>
        <div className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
          <Reveal>
            <p className="gj-eyebrow">{s("story.eyebrow", "Why this shop exists")}</p>
            <h2 className="gj-display mt-4 text-[clamp(2.3rem,4.2vw,3.8rem)]">
              {s("story.t1", "Every object carries a")} <em className="text-gj-maroon">{s("story.place", "place")}</em>, {s("story.t2", "a")} <em className="text-gj-maroon">{s("story.practice", "practice")}</em> {s("story.t3", "and a")} <em className="text-gj-maroon">{s("story.person", "person")}</em>.
            </h2>
            <p className="mt-6 leading-[1.85] text-gj-brown/85">
              {s("story.p1", "GEO Jainism began in the field — on hillsides in Tamil Nadu, in caves with 2,000-year-old inscriptions, in villages where Jain craft survives in a handful of families. This shop brings that work home: books from our research, prints from our archive, and objects from the artisans we meet along the way.")}
            </p>
            <p className="mt-4 leading-[1.85] text-gj-brown/85">{s("story.p2", "Proceeds fund documentation, restoration advocacy and the films that bring this heritage to new audiences.")}</p>
            <Link to="/about" className="gj-link mt-8 inline-flex items-center gap-2 self-start text-sm font-medium text-gj-maroon">
              {s("story.link", "Read the GEO Jainism story")} <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const PROMISES = [
  { id: "hand", Icon: HandHeart, title: "Made by hand", body: "Brass, stone, cloth and paper — shaped by artisans we know by name." },
  { id: "care", Icon: Leaf, title: "Made with care", body: "Non-violent materials wherever we can: ahimsa silk, charcoal-free dhoop, natural dyes." },
  { id: "inform", Icon: BookOpen, title: "Made to inform", body: "Every piece comes with the history behind it, written by our research team." },
];

export default function ShopHome() {
  const { data, loading } = useAsync(getProducts, []);
  const { s } = useShopT();
  const all = data ?? [];
  const featured = all.filter((p) => p.featured).slice(0, 8);
  const arrivals = [...all].filter((p) => p.newArrival).sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  const best = [...all].filter((p) => p.bestseller).sort((a, b) => b.sold - a.sold).slice(0, 4);

  return (
    <>
      <Hero />

      <section className="border-y border-gj-brown/10 bg-gj-beige/50">
        <ul className="mx-auto grid max-w-[1440px] gap-6 px-5 py-8 sm:grid-cols-3 sm:px-8 lg:px-12">
          {PROMISES.map(({ id, Icon, title, body }) => (
            <li key={title} className="flex items-start gap-4">
              <Icon size={22} strokeWidth={1.3} className="mt-1 shrink-0 text-gj-gold-deep" />
              <span>
                <span className="block font-medium">{s(`promise.${id}.title`, title)}</span>
                <span className="mt-0.5 block text-sm text-gj-brown/70">{s(`promise.${id}.body`, body)}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Categories />

      <section className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <Reveal>
          <SectionHeader eyebrow={s("home.curated", "Curated")} title={s("home.featured", "Featured pieces")} />
        </Reveal>
        <Grid products={featured} loading={loading} count={8} />
      </section>

      <section className="border-t border-gj-brown/10 bg-gj-mist py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionHeader
              eyebrow={s("home.justIn", "Just in")}
              title={s("home.arrivals", "New arrivals")}
              action={
                <Link to="/shop/products?sort=newest" className="gj-link inline-flex items-center gap-2 text-sm font-medium text-gj-maroon">
                  {s("home.allNew", "Shop all new")} <ArrowRight size={15} />
                </Link>
              }
            />
          </Reveal>
          <div className="mt-6">
            {loading ? (
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <ProductRail products={arrivals} label={s("home.arrivals", "New arrivals")} />
            )}
          </div>
        </div>
      </section>

      <Story />

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <Reveal>
          <SectionHeader
            eyebrow={s("home.loved", "Most loved")}
            title={s("home.best", "Best sellers")}
            action={
              <Link to="/shop/products?sort=popular" className="gj-link inline-flex items-center gap-2 text-sm font-medium text-gj-maroon">
                {s("home.allBest", "See all best sellers")} <ArrowRight size={15} />
              </Link>
            }
          />
        </Reveal>
        <Grid products={best} loading={loading} />
      </section>

      <section className="gj-keep relative overflow-hidden bg-gj-maroon text-gj-ivory">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-20">
          <Reveal>
            <p className="gj-eyebrow !text-gj-gold">{s("gift.eyebrow", "For gifting")}</p>
            <h2 className="gj-display mt-4 text-[clamp(2.2rem,4vw,3.6rem)]">{s("gift.title", "Gifts that carry a story")}</h2>
            <p className="mt-4 max-w-md text-gj-ivory/75">{s("gift.body", "Postcards from the hills, festival hampers and keepsakes — wrapped in handloom, with a note on where each piece comes from.")}</p>
            <Button to="/shop/products?category=gifts-souvenirs" variant="gold" className="mt-8">
              {s("gift.cta", "Shop gifts")} <ArrowRight size={16} />
            </Button>
          </Reveal>
          <Reveal delay={0.1}>
            <ShopImage k="cat-gifts-souvenirs" className="aspect-[4/3] overflow-hidden" sizes="(min-width: 1024px) 45vw, 100vw" alt={s("gift.alt", "A fan of heritage postcards")} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
