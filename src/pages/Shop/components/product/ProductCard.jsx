import { memo } from "react";
import { Link } from "react-router-dom";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { useShop } from "../../store/ShopStore";
import { categoryBySlug } from "../../data/categories";
import { discountPct } from "../../services/pricing";
import { Price, Rating, ShopImage } from "../common/ui";
import { useShopT } from "../../i18n";

/**
 * Editorial product card: 4:5 image that cross-fades to the second shot on
 * hover, with wishlist, quick view and add-to-bag. On touch devices the
 * actions stay visible.
 */
function ProductCard({ product, priority = false, size = "md" }) {
  const { addToCart, toggleWishlist, inWishlist, setQuickView } = useShop();
  const saved = inWishlist(product.id);
  const soldOut = product.stock <= 0;
  const off = discountPct(product);
  const to = `/shop/product/${product.slug}`;
  const { s, cat } = useShopT();

  return (
    <article className="gj-card group relative flex flex-col">
      <div className="gj-card__media relative aspect-[4/5] overflow-hidden bg-gj-sand">
        <Link to={to} className="absolute inset-0" aria-label={product.name}>
          <ShopImage k={product.images[0]} eager={priority} className="absolute inset-0" sizes={size === "lg" ? "(min-width: 1024px) 33vw, 80vw" : "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"} />
          {product.images[1] && <ShopImage k={product.images[1]} className="gj-card__alt absolute inset-0 !bg-transparent" small />}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {soldOut && <span className="bg-gj-charcoal px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-gj-ivory">{s("card.soldOut", "Sold out")}</span>}
          {!soldOut && product.newArrival && <span className="bg-gj-ivory px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-gj-charcoal">{s("card.new", "New")}</span>}
          {!soldOut && off > 0 && <span className="bg-gj-maroon px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-gj-ivory">−{off}%</span>}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-gj-ivory/90 backdrop-blur transition-colors hover:bg-gj-ivory ${saved ? "text-gj-maroon" : "text-gj-charcoal"}`}
          aria-pressed={saved}
          aria-label={saved ? s("card.unsave", "Remove {{name}} from wishlist", { name: product.name }) : s("card.save", "Save {{name}} to wishlist", { name: product.name })}
        >
          <Heart size={17} strokeWidth={1.6} className={saved ? "fill-gj-maroon" : ""} />
        </button>

        <div className="gj-card__actions absolute inset-x-3 bottom-3 flex gap-2">
          <button
            type="button"
            onClick={() => addToCart(product)}
            disabled={soldOut}
            className="flex h-11 flex-1 items-center justify-center gap-2 bg-gj-charcoal text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-gj-ivory transition-colors hover:bg-gj-maroon disabled:bg-gj-charcoal/50"
          >
            <ShoppingBag size={15} strokeWidth={1.6} />
            {soldOut ? s("card.soldOut", "Sold out") : s("card.add", "Add to bag")}
          </button>
          <button
            type="button"
            onClick={() => setQuickView(product.slug)}
            className="hidden h-11 w-11 shrink-0 place-items-center bg-gj-ivory text-gj-charcoal transition-colors hover:bg-gj-beige sm:grid"
            aria-label={s("card.quick", "Quick view {{name}}", { name: product.name })}
          >
            <Eye size={17} strokeWidth={1.6} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="gj-eyebrow !text-[0.62rem] !tracking-[0.2em]">{cat(categoryBySlug(product.category))?.short}</p>
        <h3 className="mt-1.5 text-[1.02rem] font-medium leading-snug text-gj-charcoal">
          <Link to={to} className="gj-link">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gj-brown/70">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <Price product={product} />
          <Rating value={product.rating} count={product.reviews} />
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
