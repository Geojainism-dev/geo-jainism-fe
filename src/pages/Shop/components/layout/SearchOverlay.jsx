import { useDeferredValue, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { useShop } from "../../store/ShopStore";
import { ALL_PRODUCTS, queryProducts } from "../../services/catalog";
import { CATEGORIES } from "../../data/categories";
import { imgSm } from "../../data/media";
import { formatINR, unitPrice } from "../../services/pricing";
import Overlay from "../common/Overlay";
import { useShopT } from "../../i18n";

const SUGGESTIONS = ["Brass diya", "Kalpasutra", "Khadi", "Postcards", "Tattvartha"];

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop();
  const navigate = useNavigate();
  const { s, cat } = useShopT();
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const results = useMemo(() => (dq.trim() ? queryProducts(ALL_PRODUCTS, { q: dq, sort: "popular" }).slice(0, 6) : []), [dq]);
  const close = () => {
    setSearchOpen(false);
    setQ("");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/shop/products?q=${encodeURIComponent(q.trim())}`);
    close();
  };

  return (
    <Overlay open={searchOpen} onClose={close} label={s("dock.search", "Search the shop")} variant="top">
      <div className="mx-auto max-w-4xl px-5 pb-10 pt-8 sm:px-8">
        <form onSubmit={submit} role="search" className="flex items-center gap-4 border-b border-gj-charcoal/70 pb-3 pr-12">
          <Search size={22} strokeWidth={1.3} className="shrink-0 text-gj-brown" />
          <input
            data-autofocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={s("search.placeholder", "Search books, art, lamps, textiles…")}
            className="gj-display w-full bg-transparent text-[clamp(1.6rem,4vw,2.6rem)] text-gj-charcoal placeholder:text-gj-brown/35 focus:outline-none"
            aria-label={s("search.aria", "Search products")}
          />
        </form>

        {!q.trim() ? (
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="gj-eyebrow mb-3">{s("search.popular", "Popular searches")}</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => setQ(s)} className="border border-gj-brown/20 px-3.5 py-2 text-sm transition-colors hover:border-gj-charcoal">
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="gj-eyebrow mb-3">{s("search.browse", "Browse categories")}</p>
              <ul className="grid grid-cols-2 gap-y-2 text-sm">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link to={`/shop/products?category=${c.slug}`} onClick={close} className="gj-link">
                      {cat(c).name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="mt-6" aria-live="polite">
            {results.length === 0 ? (
              <p className="py-8 text-gj-brown/70">{s("search.none", "No products match “{{q}}”. Try a broader word, like “brass” or “print”.", { q })}</p>
            ) : (
              <>
                <ul className="divide-y divide-gj-brown/10">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link to={`/shop/product/${p.slug}`} onClick={close} className="group flex items-center gap-4 py-3">
                        <img src={imgSm(p.images[0])} alt="" className="h-16 w-[52px] shrink-0 object-cover" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium group-hover:text-gj-maroon">{p.name}</span>
                          <span className="block truncate text-sm text-gj-brown/60">{p.subtitle}</span>
                        </span>
                        <span className="text-sm tabular-nums">{formatINR(unitPrice(p))}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={submit} className="gj-link mt-5 inline-flex items-center gap-2 text-sm font-medium text-gj-maroon">
                  {s("search.all", "See all results for “{{q}}”", { q })} <ArrowRight size={15} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </Overlay>
  );
}
