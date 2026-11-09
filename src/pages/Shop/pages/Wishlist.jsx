import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useShop } from "../store/ShopStore";
import { Breadcrumbs, Button, EmptyState, Price, ShopImage } from "../components/common/ui";
import { StockNote } from "../components/product/PurchasePanel";
import { useShopT } from "../i18n";

export default function Wishlist() {
  const reduce = useReducedMotion();
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const available = wishlist.filter((p) => p.stock > 0);
  const { s } = useShopT();

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-8 sm:px-8 lg:px-12">
      <Breadcrumbs items={[{ label: s("crumb.shop", "Shop"), to: "/shop" }, { label: s("title.wishlist", "Wishlist") }]} />
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="gj-display text-[clamp(2.6rem,5vw,4.4rem)]">{s("title.wishlist", "Wishlist")}</h1>
          <p className="mt-2 text-gj-brown/70">{wishlist.length ? (wishlist.length === 1 ? s("wish.one", "1 saved piece, kept on this device.") : s("wish.many", "{{count}} saved pieces, kept on this device.", { count: wishlist.length })) : s("wish.none", "Pieces you save will appear here.")}</p>
        </div>
        {available.length > 1 && (
          <Button variant="outline" onClick={() => available.forEach((p, i) => addToCart(p, 1, { openDrawer: i === available.length - 1, silent: i !== available.length - 1 }))}>
            <ShoppingBag size={15} /> {s("wish.addAll", "Add all available to bag")}
          </Button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={Heart} title={s("wish.emptyTitle", "Nothing saved yet")} body={s("wish.emptyBody", "Tap the heart on any product to keep it here for later.")} action={<Button to="/shop/products">{s("wish.discover", "Discover the collection")}</Button>} />
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {wishlist.map((p) => (
              <motion.li key={p.id} layout={!reduce} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }} className="flex gap-5 border border-gj-brown/12 bg-gj-paper p-4">
                <Link to={`/shop/product/${p.slug}`} className="w-28 shrink-0 sm:w-32">
                  <ShopImage k={p.images[0]} small className="aspect-[4/5] overflow-hidden" alt={p.name} />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/shop/product/${p.slug}`} className="gj-link font-medium leading-snug">
                      {p.name}
                    </Link>
                    <button type="button" onClick={() => toggleWishlist(p)} className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center text-gj-brown/60 hover:text-gj-maroon" aria-label={s("card.unsave", "Remove {{name}} from wishlist", { name: p.name })}>
                      <X size={16} />
                    </button>
                  </div>
                  <Price product={p} className="mt-2" />
                  <div className="mt-2">
                    <StockNote product={p} />
                  </div>
                  <Button size="sm" className="mt-auto w-full" onClick={() => addToCart(p)} disabled={p.stock <= 0}>
                    {p.stock <= 0 ? s("card.soldOut", "Sold out") : s("card.add", "Add to bag")}
                  </Button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
