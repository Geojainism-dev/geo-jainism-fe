import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Instagram, Mail, MessageCircle, Youtube } from "lucide-react";
import { CATEGORIES } from "../../data/categories";
import Overlay from "../common/Overlay";
import { useShopT, st } from "../../i18n";

const CONTACT_EMAIL = "goldeneraofjainism@gmail.com";

const POLICIES = [
  { id: "shipping", label: "Shipping", body: "Orders ship within 2 working days. Standard delivery takes 4–7 working days; express 1–3. Free standard shipping on orders over ₹999." },
  { id: "returns", label: "Returns", body: "Return unused items in original packaging within 7 days of delivery. Prints, books and hampers can be returned only if damaged in transit." },
  { id: "care", label: "Care", body: "Handmade pieces vary slightly in colour and finish — that’s the mark of the maker. Care notes are included with every order." },
];

/** Attribution for the temporary CC-licensed photography (read lazily from CREDITS.json). */
function CreditsDialog({ open, onClose }) {
  const [rows, setRows] = useState(null);
  const { s } = useShopT();
  useEffect(() => {
    if (!open || rows) return;
    fetch("/shop-assets/CREDITS.json")
      .then((r) => r.json())
      .then((j) => setRows(Object.values(j)))
      .catch(() => setRows([]));
  }, [open, rows]);
  return (
    <Overlay open={open} onClose={onClose} label={s("credits.label", "Image credits")} variant="center">
      <div className="p-6 sm:p-10">
        <p className="gj-eyebrow">{s("credits.eyebrow", "Credits")}</p>
        <h2 className="gj-display mt-2 text-4xl">{s("credits.title", "Photography")}</h2>
        <p className="mt-3 max-w-xl text-sm text-gj-brown/70">
          {s("credits.body", "Sample product photographs are from Wikimedia Commons, used under the licences below. Other images are GEO Jainism field photography or compositions made for this prototype.")}
        </p>
        {rows === null ? (
          <p className="mt-6 text-sm text-gj-brown/60">{s("common.loading", "Loading…")}</p>
        ) : (
          <ul className="mt-6 divide-y divide-gj-brown/10 text-sm">
            {rows.map((c) => (
              <li key={c.source} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto] sm:gap-6">
                <a href={c.source} target="_blank" rel="noopener noreferrer" className="gj-link truncate">
                  {c.title.replace(/^File:/, "")}
                </a>
                <span className="text-gj-brown/60">
                  {c.author || s("credits.unknown", "Unknown")} · {c.license}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Overlay>
  );
}

export default function ShopFooter() {
  const [credits, setCredits] = useState(false);
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const { s, cat } = useShopT();

  const subscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErr(st("news.invalid", "Please enter a valid email address."));
      return;
    }
    setErr("");
    // DEMO: no mailing list is connected yet — wire this to your provider's API.
    toast.success(st("news.ok", "You’re on the list"), { description: st("news.okBody", "New collections and stories, about once a month.") });
    setEmail("");
  };

  return (
    // A <section>, not <footer>: the shared src/styles/footer.css styles every <footer>
    // element, and the site's own Footer renders right after this one.
    <section aria-label={s("footer.label", "Shop information")} className="gj-keep bg-gj-charcoal text-gj-ivory">
      {/* newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-end lg:px-12 lg:py-20">
          <div>
            <p className="gj-eyebrow !text-gj-gold">{s("news.eyebrow", "Letters from the field")}</p>
            <h2 className="gj-display mt-4 text-[clamp(2.2rem,4vw,3.4rem)]">{s("news.title", "New collections, heritage stories and early access.")}</h2>
          </div>
          <form onSubmit={subscribe} noValidate className="w-full">
            <label htmlFor="gj-news" className="sr-only">
              {s("news.email", "Email address")}
            </label>
            <div className="flex border-b border-gj-ivory/40 focus-within:border-gj-gold">
              <input
                id="gj-news"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={s("news.placeholder", "Your email address")}
                aria-invalid={!!err}
                aria-describedby={err ? "gj-news-err" : undefined}
                className="min-h-[52px] flex-1 bg-transparent text-lg text-gj-ivory placeholder:text-gj-ivory/40 focus:outline-none"
              />
              <button type="submit" className="flex items-center gap-2 pl-4 text-xs font-semibold uppercase tracking-[0.16em] text-gj-gold hover:text-gj-ivory">
                {s("news.subscribe", "Subscribe")} <ArrowRight size={16} />
              </button>
            </div>
            {err && (
              <p id="gj-news-err" className="mt-2 text-sm text-[#f0a597]">
                {err}
              </p>
            )}
            <p className="mt-3 text-xs text-gj-ivory/45">{s("news.noSpam", "No spam. Unsubscribe any time.")}</p>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-12">
        <div>
          <p className="gj-display text-3xl">{s("title.suffix", "GEO Jainism Shop")}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gj-ivory/60">
            {s("footer.mission", "Every purchase supports GEO Jainism’s research and documentary work to bring neglected Jain heritage into the mainstream.")}
          </p>
          <Link to="/about" className="gj-link mt-4 inline-block text-sm text-gj-gold">
            {s("footer.about", "About GEO Jainism")}
          </Link>
        </div>
        <nav aria-label={s("footer.cats", "Shop categories")}>
          <p className="gj-eyebrow mb-4 !text-gj-ivory/50">{s("footer.shop", "Shop")}</p>
          <ul className="space-y-2 text-sm text-gj-ivory/80">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to={`/shop/products?category=${c.slug}`} className="gj-link">
                  {cat(c).name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={s("footer.care", "Customer care")}>
          <p className="gj-eyebrow mb-4 !text-gj-ivory/50">{s("footer.help", "Help")}</p>
          <ul className="space-y-2 text-sm text-gj-ivory/80">
            <li>
              <Link to="/shop/cart" className="gj-link">
                {s("drawer.title", "Your bag")}
              </Link>
            </li>
            <li>
              <Link to="/shop/wishlist" className="gj-link">
                {s("title.wishlist", "Wishlist")}
              </Link>
            </li>
            {POLICIES.map((p) => (
              <li key={p.label}>
                <details className="group">
                  <summary className="cursor-pointer list-none hover:text-gj-ivory">
                    {s(`policy.${p.id}.label`, `${p.label} policy`)} <span className="text-gj-ivory/40 group-open:hidden">+</span>
                    <span className="hidden text-gj-ivory/40 group-open:inline">−</span>
                  </summary>
                  <p className="mt-2 max-w-xs text-xs leading-relaxed text-gj-ivory/55">{s(`policy.${p.id}.body`, p.body)}</p>
                </details>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="gj-eyebrow mb-4 !text-gj-ivory/50">{s("footer.contact", "Contact")}</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="gj-link inline-flex items-center gap-2 break-all text-sm text-gj-ivory/80">
            <Mail size={15} className="shrink-0" /> {CONTACT_EMAIL}
          </a>
          <div className="mt-6 flex gap-2">
            {[
              { href: "https://instagram.com/geo_jainism", Icon: Instagram, label: "Instagram" },
              { href: "https://www.youtube.com/@geo_jainism", Icon: Youtube, label: "YouTube" },
              { href: "https://chat.whatsapp.com/EnHCodUJre9AlzFO9LRx5j", Icon: MessageCircle, label: "WhatsApp community" },
            ].map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-gj-ivory/80 transition-colors hover:border-gj-gold hover:text-gj-gold">
                <Icon size={16} strokeWidth={1.5} />
              </a>
            ))}
          </div>
          <p className="mt-6 text-xs text-gj-ivory/40">{s("footer.demo", "Prototype store — products, prices and checkout are for demonstration.")}</p>
          <button type="button" onClick={() => setCredits(true)} className="gj-link mt-2 text-xs text-gj-ivory/60">
            {s("credits.label", "Image credits")}
          </button>
        </div>
      </div>
      <CreditsDialog open={credits} onClose={() => setCredits(false)} />
    </section>
  );
}
