import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Search, ShoppingBag } from "lucide-react";
import { useShop } from "../../store/ShopStore";
import { useShopT } from "../../i18n";

function Count({ n }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.span
          key={n}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gj-gold px-1 text-[0.62rem] font-semibold text-gj-charcoal tabular-nums"
        >
          {n}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/**
 * The shop lives inside GEO Jainism and uses the shared site header only.
 * Search, wishlist and bag are reached from this small floating dock
 * (bottom-right), plus ⌘K / Ctrl+K for search.
 */
export default function ShopDock() {
  const { totals, wishlist, setDrawerOpen, setSearchOpen } = useShop();
  const { pathname } = useLocation();
  const { s } = useShopT();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  // sits above the site-wide theme toggle (fixed at right 20px / bottom 70px); not needed during checkout
  if (pathname.startsWith("/shop/checkout")) return null;

  const btn = "relative grid h-12 w-12 place-items-center text-gj-ivory transition-colors hover:bg-white/10";
  return (
    <nav aria-label={s("dock.label", "Shop")} className="gj-keep fixed bottom-[128px] right-[19px] z-40 flex flex-col overflow-visible rounded-full bg-gj-charcoal/95 py-1 shadow-[0_18px_40px_-16px_rgba(36,33,30,0.6)]">
      <button type="button" className={`${btn} rounded-full`} onClick={() => setSearchOpen(true)} aria-label={s("dock.search", "Search the shop")}>
        <Search size={19} strokeWidth={1.5} />
      </button>
      <Link to="/shop/wishlist" className={`${btn} rounded-full`} aria-label={s("dock.wishlist", "Wishlist, {{count}} saved", { count: wishlist.length })}>
        <Heart size={19} strokeWidth={1.5} />
        <Count n={wishlist.length} />
      </Link>
      <button type="button" className={`${btn} rounded-full`} onClick={() => setDrawerOpen(true)} aria-label={s("dock.bag", "Shopping bag, {{count}} in bag", { count: totals.count })}>
        <ShoppingBag size={19} strokeWidth={1.5} />
        <Count n={totals.count} />
      </button>
    </nav>
  );
}
