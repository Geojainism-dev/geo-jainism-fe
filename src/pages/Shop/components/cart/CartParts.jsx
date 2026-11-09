import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useShop } from "../../store/ShopStore";
import { formatINR } from "../../services/pricing";
import { QtyStepper, ShopImage } from "../common/ui";
import { useShopT } from "../../i18n";

/** One cart line: thumbnail, name, unit price, quantity controls, line total, remove. */
export function CartLine({ line, compact = false, onNavigate }) {
  const { setQty, removeFromCart, maxQty } = useShop();
  const { product, qty, unit } = line;
  const to = `/shop/product/${product.slug}`;
  const { s } = useShopT();
  return (
    <li className="flex gap-4 py-5">
      <Link to={to} onClick={onNavigate} className={`${compact ? "w-20" : "w-24 sm:w-28"} shrink-0`}>
        <ShopImage k={product.images[0]} small className="aspect-[4/5] overflow-hidden" alt={product.name} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={to} onClick={onNavigate} className="gj-link font-medium leading-snug text-gj-charcoal">
              {product.name}
            </Link>
            <p className="mt-1 text-sm text-gj-brown/65 tabular-nums">
              {formatINR(unit)}
              {unit < product.price && <span className="ml-2 line-through opacity-60">{formatINR(product.price)}</span>}
            </p>
          </div>
          <p className="shrink-0 font-medium tabular-nums">{formatINR(unit * qty)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QtyStepper size="sm" value={qty} max={maxQty(product)} onChange={(q) => setQty(product.id, q)} label={s("cart.qtyOf", "Quantity of {{name}}", { name: product.name })} />
          <button type="button" onClick={() => removeFromCart(product)} className="inline-flex items-center gap-1.5 text-xs text-gj-brown/70 hover:text-gj-maroon" aria-label={s("cart.removeName", "Remove {{name}}", { name: product.name })}>
            <Trash2 size={14} strokeWidth={1.5} /> {s("cart.remove", "Remove")}
          </button>
        </div>
      </div>
    </li>
  );
}

/** Subtotal / discount / shipping / total block. */
export function SummaryRows({ totals, shippingLabel }) {
  const { s } = useShopT();
  shippingLabel = shippingLabel ?? s("sum.shipping", "Shipping");
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-gj-brown/75">{s("sum.items", "Items ({{count}})", { count: totals.count })}</dt>
        <dd className="tabular-nums">{formatINR(totals.mrp)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between text-gj-maroon">
          <dt>{s("sum.discount", "Discount")}</dt>
          <dd className="tabular-nums">−{formatINR(totals.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-gj-brown/75">{s("sum.subtotal", "Subtotal")}</dt>
        <dd className="tabular-nums">{formatINR(totals.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-gj-brown/75">{shippingLabel}</dt>
        <dd className="tabular-nums">{totals.shipping === 0 ? s("sum.free", "Free") : formatINR(totals.shipping)}</dd>
      </div>
      <div className="flex justify-between border-t border-gj-brown/15 pt-4 text-base">
        <dt className="font-medium">{s("sum.total", "Total")}</dt>
        <dd className="text-xl font-medium tabular-nums">{formatINR(totals.total)}</dd>
      </div>
    </dl>
  );
}

/** Progress bar towards free shipping. */
export function FreeShippingMeter({ totals }) {
  const { s } = useShopT();
  const pct = Math.min(100, Math.round((totals.subtotal / (totals.subtotal + totals.toFreeShipping || 1)) * 100));
  return (
    <div>
      <p className="text-sm text-gj-brown/80">
        {totals.toFreeShipping > 0 ? (
          <>
            {s("meter.add", "Add {{amt}} more for free shipping", { amt: formatINR(totals.toFreeShipping) })}
          </>
        ) : (
          <span className="text-gj-green">{s("meter.free", "Your order ships free")}</span>
        )}
      </p>
      <div className="mt-2 h-1 overflow-hidden bg-gj-beige" aria-hidden="true">
        <div className="h-full bg-gj-gold transition-[width] duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
