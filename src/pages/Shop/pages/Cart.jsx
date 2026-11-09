import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../store/ShopStore";
import { Breadcrumbs, Button, EmptyState } from "../components/common/ui";
import { CartLine, FreeShippingMeter, SummaryRows } from "../components/cart/CartParts";
import { useShopT } from "../i18n";

export default function Cart() {
  const { lines, totals, clearCart } = useShop();
  const { s } = useShopT();

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-8 sm:px-8 lg:px-12">
      <Breadcrumbs items={[{ label: s("crumb.shop", "Shop"), to: "/shop" }, { label: s("drawer.title", "Your bag") }]} />
      <h1 className="gj-display mt-6 text-[clamp(2.6rem,5vw,4.4rem)]">{s("drawer.title", "Your bag")}</h1>

      {lines.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={ShoppingBag} title={s("drawer.empty", "Your bag is empty")} body={s("cart.emptyBody", "When you add something, it will wait for you here — even if you close the tab.")} action={<Button to="/shop/products">{s("common.explore", "Explore the collection")}</Button>} />
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
          <section aria-label={s("cart.items", "Items in your bag")}>
            <div className="flex items-center justify-between border-b border-gj-brown/15 pb-4 text-sm text-gj-brown/70">
              <span>
                {totals.count === 1 ? s("cart.one", "1 item") : s("cart.many", "{{count}} items", { count: totals.count })}
              </span>
              <button type="button" onClick={clearCart} className="gj-link hover:text-gj-maroon">
                {s("cart.removeAll", "Remove all")}
              </button>
            </div>
            <ul className="divide-y divide-gj-brown/10">
              {lines.map((l) => (
                <CartLine key={l.id} line={l} />
              ))}
            </ul>
            <Link to="/shop/products" className="gj-link mt-6 inline-flex items-center gap-2 text-sm font-medium text-gj-maroon">
              <ArrowLeft size={15} /> {s("cart.continue", "Continue shopping")}
            </Link>
          </section>

          <aside className="gj-paper h-fit p-6 sm:p-8 lg:sticky lg:top-[100px]" aria-label={s("sum.title", "Order summary")}>
            <h2 className="gj-display mb-6 text-3xl">{s("cart.summary", "Summary")}</h2>
            <FreeShippingMeter totals={totals} />
            <div className="mt-6">
              <SummaryRows totals={totals} shippingLabel={s("cart.shipEst", "Shipping estimate")} />
            </div>
            <Button to="/shop/checkout" className="mt-8 w-full">
              {s("drawer.checkout", "Proceed to checkout")}
            </Button>
            <p className="mt-4 text-center text-xs text-gj-brown/60">{s("cart.express", "Express delivery can be chosen at checkout.")}</p>
          </aside>
        </div>
      )}
    </div>
  );
}
