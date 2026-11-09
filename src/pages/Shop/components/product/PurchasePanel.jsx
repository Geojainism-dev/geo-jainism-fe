import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { useShop } from "../../store/ShopStore";
import { categoryBySlug } from "../../data/categories";
import { FREE_SHIPPING_FROM, formatINR } from "../../services/pricing";
import { Button, Price, QtyStepper, Rating } from "../common/ui";
import { useShopT } from "../../i18n";

export function StockNote({ product }) {
  const { s } = useShopT();
  if (product.stock <= 0) return <p className="text-sm font-medium text-gj-maroon">{s("stock.out", "Sold out — check back soon")}</p>;
  if (product.stock <= 10)
    return (
      <p className="flex items-center gap-2 text-sm text-gj-maroon">
        <span className="h-1.5 w-1.5 rounded-full bg-gj-maroon" /> {s("stock.few", "Only {{n}} left", { n: product.stock })}
      </p>
    );
  return (
    <p className="flex items-center gap-2 text-sm text-gj-green">
      <span className="h-1.5 w-1.5 rounded-full bg-gj-green" /> {s("stock.in", "In stock, ready to ship")}
    </p>
  );
}

/** Title, price, stock, quantity and the three purchase actions. Used on the product page and in quick view. */
export default function PurchasePanel({ product, compact = false, onNavigate }) {
  const { addToCart, toggleWishlist, inWishlist, maxQty, qtyInCart } = useShop();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const soldOut = product.stock <= 0;
  const saved = inWishlist(product.id);
  const remaining = Math.max(0, maxQty(product) - qtyInCart(product.id));
  const { s, cat: tc } = useShopT();
  const cat = tc(categoryBySlug(product.category));
  const Title = compact ? "h2" : "h1";

  const buyNow = () => {
    addToCart(product, qty, { openDrawer: false, silent: true });
    onNavigate?.();
    navigate("/shop/checkout");
  };

  return (
    <div className="flex flex-col">
      <Link to={`/shop/products?category=${product.category}`} className="gj-eyebrow gj-link self-start" onClick={onNavigate}>
        {cat?.name}
      </Link>
      <Title className={`gj-display mt-3 ${compact ? "text-4xl" : "text-[clamp(2.4rem,4vw,3.6rem)]"} text-gj-charcoal`}>{product.name}</Title>
      {product.subtitle && <p className="mt-2 text-lg text-gj-brown/75">{product.subtitle}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Rating value={product.rating} count={product.reviews} className="!text-sm" />
        {product.maker && (
          <p className="text-sm text-gj-brown/70">
            {s(`maker.${product.maker.label}`, product.maker.label)}: <span className="text-gj-charcoal">{product.maker.name}</span>
          </p>
        )}
      </div>

      <Price product={product} size="lg" className="mt-6" />
      <p className="mt-1 text-xs text-gj-brown/55">{s("price.tax", "Inclusive of all taxes")}</p>

      <div className="mt-6">
        <StockNote product={product} />
      </div>

      {!compact && <p className="mt-6 max-w-xl leading-[1.8] text-gj-brown/85">{product.story}</p>}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <QtyStepper value={qty} onChange={setQty} max={Math.max(1, remaining)} />
        <Button className="min-w-[140px] flex-1" onClick={() => addToCart(product, qty)} disabled={soldOut || remaining <= 0}>
          {soldOut ? s("card.soldOut", "Sold out") : remaining <= 0 ? s("buy.max", "Max in bag") : s("card.add", "Add to bag")}
        </Button>
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-pressed={saved}
          aria-label={saved ? s("buy.unsave", "Remove from wishlist") : s("buy.save", "Save to wishlist")}
          className={`grid h-12 w-12 place-items-center border transition-colors ${saved ? "border-gj-maroon bg-gj-maroon text-gj-ivory" : "border-gj-brown/25 text-gj-charcoal hover:border-gj-charcoal"}`}
        >
          <Heart size={18} strokeWidth={1.6} className={saved ? "fill-current" : ""} />
        </button>
      </div>
      <Button variant="outline" className="mt-3 w-full" onClick={buyNow} disabled={soldOut || remaining <= 0}>
        {s("buy.now", "Buy now")}
      </Button>

      {!compact && (
        <ul className="mt-8 grid gap-3 border-t border-gj-brown/15 pt-6 text-sm text-gj-brown/80 sm:grid-cols-3">
          <li className="flex items-start gap-2.5">
            <Truck size={17} strokeWidth={1.4} className="mt-0.5 shrink-0 text-gj-gold-deep" /> {s("perk.ship", "Free shipping over {{amt}}", { amt: formatINR(FREE_SHIPPING_FROM) })}
          </li>
          <li className="flex items-start gap-2.5">
            <RotateCcw size={17} strokeWidth={1.4} className="mt-0.5 shrink-0 text-gj-gold-deep" /> {s("perk.returns", "7-day easy returns")}
          </li>
          <li className="flex items-start gap-2.5">
            <ShieldCheck size={17} strokeWidth={1.4} className="mt-0.5 shrink-0 text-gj-gold-deep" /> {s("perk.care", "Handled with care")}
          </li>
        </ul>
      )}
    </div>
  );
}
