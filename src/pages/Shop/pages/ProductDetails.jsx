import { lazy, Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, PackageSearch } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getProduct, getRelated } from "../services/catalog";
import { categoryBySlug } from "../data/categories";
import { FREE_SHIPPING_FROM, formatINR, unitPrice } from "../services/pricing";
import { useAsync } from "../hooks/useAsync";
import { useShop } from "../store/ShopStore";
import { Breadcrumbs, Button, CardSkeleton, EmptyState, Reveal, SectionHeader, Skeleton } from "../components/common/ui";
import Gallery from "../components/product/Gallery";
import PurchasePanel from "../components/product/PurchasePanel";
import ProductCard from "../components/product/ProductCard";
import { useShopT } from "../i18n";

// Three.js loads only when a shopper opens the 3D tab of a suitable product.
const ProductStage3D = lazy(() => import("../components/three/ProductStage3D"));

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gj-brown/15">
      <button type="button" className="flex w-full items-center justify-between py-5 text-left" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="gj-display text-2xl">{title}</span>
        <ChevronDown size={18} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <div className="pb-6 text-[0.95rem] leading-relaxed text-gj-brown/85">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:px-12" aria-busy="true">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="space-y-4 pt-6">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-12 w-4/5" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="mt-8 h-8 w-40" />
        <Skeleton className="mt-8 h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

function StickyBuyBar({ product }) {
  const { addToCart } = useShop();
  const { s } = useShopT();
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-gj-brown/15 bg-gj-ivory/95 px-5 py-3 backdrop-blur lg:hidden">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="text-sm tabular-nums text-gj-brown/75">{formatINR(unitPrice(product))}</p>
      </div>
      <Button size="sm" onClick={() => addToCart(product)} disabled={product.stock <= 0}>
        {product.stock <= 0 ? s("card.soldOut", "Sold out") : s("card.add", "Add to bag")}
      </Button>
    </div>
  );
}

export default function ProductDetails() {
  const { slug } = useParams();
  const { data: product, loading, error } = useAsync(() => getProduct(slug), [slug]);
  const related = useAsync(() => (product ? getRelated(product) : Promise.resolve([])), [product?.id]);
  const { s, cat: tc } = useShopT();

  if (loading) return <DetailSkeleton />;
  if (error || !product)
    return (
      <div className="mx-auto max-w-3xl px-5 py-20">
        <EmptyState icon={PackageSearch} title={s("pdp.missTitle", "We couldn’t find that piece")} body={s("pdp.missBody", "It may have sold out or moved. Browse the full collection instead.")} action={<Button to="/shop/products">{s("pdp.browse", "Browse the collection")}</Button>} />
      </div>
    );

  const cat = tc(categoryBySlug(product.category));
  const stage =
    product.model != null ? (
      <Suspense fallback={<Skeleton className="h-full w-full" />}>
        <ProductStage3D product={product} cover={`/shop-assets/covers/${product.slug}.webp`} art={`/shop-assets/art/${product.slug}.webp`} />
      </Suspense>
    ) : null;

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-8 sm:px-8 lg:px-12 lg:pb-24">
        <Breadcrumbs items={[{ label: s("crumb.shop", "Shop"), to: "/shop" }, { label: cat?.name ?? s("crumb.products", "Products"), to: `/shop/products?category=${product.category}` }, { label: product.name }]} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-[100px] lg:self-start">
            <Gallery key={product.id} product={product} extra={stage} />
          </div>

          <div>
            <PurchasePanel key={product.id} product={product} />

            <div className="mt-10 border-t border-gj-brown/15">
              <Accordion title={s("pdp.details", "Details & specifications")} defaultOpen>
                <dl className="grid grid-cols-[minmax(120px,auto)_1fr] gap-x-6 gap-y-3">
                  {product.maker && (
                    <>
                      <dt className="text-gj-brown/60">{s(`maker.${product.maker.label}`, product.maker.label)}</dt>
                      <dd className="text-gj-charcoal">{product.maker.name}</dd>
                    </>
                  )}
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-gj-brown/60">{s(`spec.${k}`, k)}</dt>
                      <dd className="text-gj-charcoal">{v}</dd>
                    </div>
                  ))}
                  <dt className="text-gj-brown/60">{s("pdp.origin", "Origin")}</dt>
                  <dd className="text-gj-charcoal">{product.origin}</dd>
                  <dt className="text-gj-brown/60">{s("pdp.sku", "SKU")}</dt>
                  <dd className="text-gj-charcoal tabular-nums">GJ-{product.id.toUpperCase()}</dd>
                </dl>
              </Accordion>
              <Accordion title={s("pdp.shipping", "Shipping")}>
                <p>{s("pdp.shipBody", "Ships within 2 working days from Chennai. Standard delivery (4–7 working days) is free on orders over {{free}}, otherwise {{std}}. Express delivery (1–3 working days) is {{exp}}.", { free: formatINR(FREE_SHIPPING_FROM), std: formatINR(99), exp: formatINR(249) })}</p>
                <p className="mt-3">{s("pdp.packing", "Fragile pieces are packed in recycled paper and cotton wadding — no plastic fillers.")}</p>
              </Accordion>
              <Accordion title={s("pdp.returns", "Returns")}>
                <p>{s("pdp.returnsBody", "Return unused items in their original packaging within 7 days of delivery for a full refund. Prints, books and hampers can be returned only if they arrive damaged — send us a photo and we’ll replace them.")}</p>
              </Accordion>
            </div>
          </div>
        </div>

        <section className="mt-24">
          <Reveal>
            <SectionHeader eyebrow={s("pdp.alsoLike", "You may also like")} title={s("pdp.same", "From the same collection")} />
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
            {related.loading ? Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />) : (related.data ?? []).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
      <StickyBuyBar product={product} />
    </>
  );
}
