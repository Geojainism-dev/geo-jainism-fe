import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, SlidersHorizontal, X, PackageSearch } from "lucide-react";
import { CATEGORIES, categoryBySlug } from "../data/categories";
import { getProducts, queryProducts, PRICE_BOUNDS, SORTS } from "../services/catalog";
import { formatINR } from "../services/pricing";
import { useAsync } from "../hooks/useAsync";
import { Breadcrumbs, Button, CardSkeleton, EmptyState } from "../components/common/ui";
import ProductCard from "../components/product/ProductCard";
import Overlay from "../components/common/Overlay";
import { useShopT } from "../i18n";

const PAGE = 12;

/** Filters live in the URL: ?category=a,b&q=&min=&max=&stock=1&sort= */
function useFilters() {
  const [params, setParams] = useSearchParams();
  const filters = {
    categories: (params.get("category") || "").split(",").filter(Boolean),
    q: params.get("q") || "",
    min: Number(params.get("min") || PRICE_BOUNDS.min),
    max: Number(params.get("max") || PRICE_BOUNDS.max),
    inStock: params.get("stock") === "1",
    sort: params.get("sort") || "featured",
  };
  const update = (patch) => {
    const next = { ...filters, ...patch };
    const p = new URLSearchParams();
    if (next.categories.length) p.set("category", next.categories.join(","));
    if (next.q) p.set("q", next.q);
    if (next.min > PRICE_BOUNDS.min) p.set("min", String(next.min));
    if (next.max < PRICE_BOUNDS.max) p.set("max", String(next.max));
    if (next.inStock) p.set("stock", "1");
    if (next.sort !== "featured") p.set("sort", next.sort);
    setParams(p, { replace: true });
  };
  return [filters, update];
}

function PriceRange({ min, max, onChange }) {
  const { s } = useShopT();
  const [lo, setLo] = useState(min);
  const [hi, setHi] = useState(max);
  useEffect(() => {
    setLo(min);
    setHi(max);
  }, [min, max]);
  const span = PRICE_BOUNDS.max - PRICE_BOUNDS.min;
  const commit = () => onChange(Math.min(lo, hi), Math.max(lo, hi));
  return (
    <div>
      <div className="gj-range">
        <div className="gj-range__track" />
        <div className="gj-range__fill" style={{ left: `${((lo - PRICE_BOUNDS.min) / span) * 100}%`, right: `${100 - ((hi - PRICE_BOUNDS.min) / span) * 100}%` }} />
        <input type="range" min={PRICE_BOUNDS.min} max={PRICE_BOUNDS.max} step={100} value={lo} aria-label={s("filter.min", "Minimum price")} onChange={(e) => setLo(Math.min(Number(e.target.value), hi - 100))} onPointerUp={commit} onKeyUp={commit} onBlur={commit} />
        <input type="range" min={PRICE_BOUNDS.min} max={PRICE_BOUNDS.max} step={100} value={hi} aria-label={s("filter.max", "Maximum price")} onChange={(e) => setHi(Math.max(Number(e.target.value), lo + 100))} onPointerUp={commit} onKeyUp={commit} onBlur={commit} />
      </div>
      <p className="mt-2 flex justify-between text-sm tabular-nums text-gj-brown/80">
        <span>{formatINR(lo)}</span>
        <span>{formatINR(hi)}</span>
      </p>
    </div>
  );
}

function Filters({ filters, update, counts }) {
  const { s, cat } = useShopT();
  const toggleCat = (slug) => update({ categories: filters.categories.includes(slug) ? filters.categories.filter((c) => c !== slug) : [...filters.categories, slug] });
  return (
    <div className="space-y-9">
      <fieldset>
        <legend className="gj-eyebrow mb-4">{s("filter.category", "Category")}</legend>
        <ul className="space-y-2.5">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="checkbox" className="gj-check" checked={filters.categories.includes(c.slug)} onChange={() => toggleCat(c.slug)} />
                <span className="flex-1">{cat(c).name}</span>
                <span className="text-xs tabular-nums text-gj-brown/50">{counts[c.slug] ?? 0}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <fieldset>
        <legend className="gj-eyebrow mb-4">{s("filter.price", "Price")}</legend>
        <PriceRange min={filters.min} max={filters.max} onChange={(min, max) => update({ min, max })} />
      </fieldset>
      <fieldset>
        <legend className="gj-eyebrow mb-4">{s("filter.availability", "Availability")}</legend>
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" className="gj-check" checked={filters.inStock} onChange={(e) => update({ inStock: e.target.checked })} />
          {s("filter.inStock", "In stock only")}
        </label>
      </fieldset>
    </div>
  );
}

export default function ProductListing() {
  const reduce = useReducedMotion();
  const { s, cat } = useShopT();
  const { data, loading, error, reload } = useAsync(getProducts, []);
  const [filters, update] = useFilters();
  const [shown, setShown] = useState(PAGE);
  const [drawer, setDrawer] = useState(false);
  const [q, setQ] = useState(filters.q);

  useEffect(() => setQ(filters.q), [filters.q]);
  // debounce the search box into the URL
  useEffect(() => {
    const t = setTimeout(() => q !== filters.q && update({ q }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const key = JSON.stringify(filters);
  useEffect(() => setShown(PAGE), [key]);

  const all = data ?? [];
  const results = useMemo(() => queryProducts(all, filters), [all, key]); // eslint-disable-line react-hooks/exhaustive-deps
  const counts = useMemo(() => {
    const base = queryProducts(all, { ...filters, categories: [] });
    return base.reduce((m, p) => ({ ...m, [p.category]: (m[p.category] ?? 0) + 1 }), {});
  }, [all, key]); // eslint-disable-line react-hooks/exhaustive-deps

  const single = filters.categories.length === 1 ? cat(categoryBySlug(filters.categories[0])) : null;
  const title = filters.q ? s("list.results", "Results for “{{q}}”", { q: filters.q }) : single ? single.name : filters.sort === "newest" ? s("home.arrivals", "New arrivals") : filters.sort === "popular" ? s("home.best", "Best sellers") : s("title.all", "All products");
  const chips = [
    ...filters.categories.map((s) => ({ label: cat(categoryBySlug(s))?.name ?? s, clear: () => update({ categories: filters.categories.filter((c) => c !== s) }) })),
    ...(filters.min > PRICE_BOUNDS.min || filters.max < PRICE_BOUNDS.max ? [{ label: `${formatINR(filters.min)} – ${formatINR(filters.max)}`, clear: () => update({ min: PRICE_BOUNDS.min, max: PRICE_BOUNDS.max }) }] : []),
    ...(filters.inStock ? [{ label: s("filter.inStockChip", "In stock"), clear: () => update({ inStock: false }) }] : []),
    ...(filters.q ? [{ label: `“${filters.q}”`, clear: () => update({ q: "" }) }] : []),
  ];
  const clearAll = () => update({ categories: [], q: "", min: PRICE_BOUNDS.min, max: PRICE_BOUNDS.max, inStock: false });

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-8 sm:px-8 lg:px-12">
      <Breadcrumbs items={[{ label: s("crumb.shop", "Shop"), to: "/shop" }, { label: title }]} />
      <header className="mt-6 flex flex-col gap-3 border-b border-gj-brown/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="gj-display text-[clamp(2.6rem,5vw,4.4rem)]">{title}</h1>
          <p className="mt-2 max-w-xl text-gj-brown/70">{single ? single.blurb : s("list.blurb", "Books, art, devotional objects and handmade pieces from the GEO Jainism collection.")}</p>
        </div>
        <p className="text-sm text-gj-brown/60" aria-live="polite">
          {loading ? s("common.loading", "Loading…") : results.length === 1 ? s("list.one", "1 product") : s("list.many", "{{count}} products", { count: results.length })}
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[250px_1fr] xl:gap-14">
        <aside className="hidden lg:block" aria-label={s("filter.title", "Filters")}>
          <div className="sticky top-[100px]">
            <Filters filters={filters} update={update} counts={counts} />
            {chips.length > 0 && (
              <button type="button" onClick={clearAll} className="gj-link mt-9 text-sm text-gj-maroon">
                {s("filter.clearAll", "Clear all filters")}
              </button>
            )}
          </div>
        </aside>

        <div>
          {/* toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative min-w-[200px] flex-1">
              <span className="sr-only">{s("search.aria", "Search products")}</span>
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gj-brown/50" />
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={s("list.searchPh", "Search within the shop")} className="gj-input !pl-10" />
            </label>
            <button type="button" onClick={() => setDrawer(true)} className="gj-btn gj-btn--outline lg:hidden">
              <SlidersHorizontal size={15} /> {s("filter.title", "Filters")}{chips.length ? ` (${chips.length})` : ""}
            </button>
            <label className="flex items-center gap-2">
              <span className="sr-only sm:not-sr-only sm:text-sm sm:text-gj-brown/70">{s("sort.label", "Sort")}</span>
              <select className="gj-input !w-auto" value={filters.sort} onChange={(e) => update({ sort: e.target.value })}>
                {SORTS.map((so) => (
                  <option key={so.id} value={so.id}>
                    {s(`sort.${so.id}`, so.label)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {chips.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={s("filter.active", "Active filters")}>
              {chips.map((c) => (
                <li key={c.label}>
                  <button type="button" onClick={c.clear} className="inline-flex items-center gap-1.5 bg-gj-beige px-3 py-1.5 text-xs text-gj-charcoal transition-colors hover:bg-gj-sand" aria-label={s("filter.remove", "Remove filter {{label}}", { label: c.label })}>
                    {c.label} <X size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* results */}
          {error ? (
            <div className="mt-10">
              <EmptyState icon={PackageSearch} title={s("list.errTitle", "We couldn’t load the collection")} body={s("list.errBody", "Please check your connection and try again.")} action={<Button onClick={reload}>{s("common.retry", "Try again")}</Button>} />
            </div>
          ) : loading ? (
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="mt-10">
              <EmptyState icon={PackageSearch} title={s("list.noneTitle", "Nothing matches — yet")} body={s("list.noneBody", "Try removing a filter or searching for something broader.")} action={<Button onClick={clearAll}>{s("filter.clear", "Clear filters")}</Button>} />
            </div>
          ) : (
            <>
              <motion.ul layout={!reduce} className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {results.slice(0, shown).map((p, i) => (
                    <motion.li
                      key={p.id}
                      layout={!reduce}
                      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, delay: reduce ? 0 : Math.min(i, 8) * 0.03 }}
                    >
                      <ProductCard product={p} priority={i < 3} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
              {shown < results.length && (
                <div className="mt-14 flex flex-col items-center gap-3">
                  <p className="text-sm text-gj-brown/60">
                    {s("list.showing", "Showing {{shown}} of {{total}}", { shown, total: results.length })}
                  </p>
                  <Button variant="outline" onClick={() => setShown((s) => s + PAGE)}>
                    {s("list.more", "Load more")}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Overlay open={drawer} onClose={() => setDrawer(false)} label={s("filter.title", "Filters")} variant="left">
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-7">
          <p className="gj-display mb-8 text-3xl">{s("filter.title", "Filters")}</p>
          <Filters filters={filters} update={update} counts={counts} />
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-gj-brown/15 p-5">
          <Button variant="outline" onClick={clearAll}>
            {s("filter.clearShort", "Clear")}
          </Button>
          <Button onClick={() => setDrawer(false)}>{s("filter.show", "Show {{count}}", { count: results.length })}</Button>
        </div>
      </Overlay>
    </div>
  );
}
