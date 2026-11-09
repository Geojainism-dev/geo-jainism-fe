import { ShoppingBag } from "lucide-react";
import { useShop } from "../../store/ShopStore";
import Overlay from "../common/Overlay";
import { Button } from "../common/ui";
import { CartLine, FreeShippingMeter, SummaryRows } from "./CartParts";
import { useShopT } from "../../i18n";

export default function CartDrawer() {
  const { drawerOpen, setDrawerOpen, lines, totals } = useShop();
  const close = () => setDrawerOpen(false);
  const { s } = useShopT();

  return (
    <Overlay open={drawerOpen} onClose={close} label={s("drawer.label", "Shopping bag")} variant="right">
      <header className="border-b border-gj-brown/15 px-6 pb-5 pt-6">
        <h2 className="gj-display text-3xl">
          {s("drawer.title", "Your bag")} <span className="font-gj-sans text-base text-gj-brown/60">({totals.count})</span>
        </h2>
      </header>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="mb-5 grid h-16 w-16 place-items-center rounded-full border border-gj-gold/50 text-gj-gold-deep">
            <ShoppingBag size={24} strokeWidth={1.3} />
          </span>
          <p className="gj-display text-3xl">{s("drawer.empty", "Your bag is empty")}</p>
          <p className="mt-2 text-sm text-gj-brown/70">{s("drawer.emptyBody", "Discover books, art and handmade objects from the GEO Jainism collection.")}</p>
          <Button to="/shop/products" className="mt-8" onClick={close} data-autofocus>
            {s("common.explore", "Explore the collection")}
          </Button>
        </div>
      ) : (
        <>
          <div className="px-6 pt-5">
            <FreeShippingMeter totals={totals} />
          </div>
          <ul className="flex-1 divide-y divide-gj-brown/10 overflow-y-auto px-6" data-lenis-prevent>
            {lines.map((l) => (
              <CartLine key={l.id} line={l} compact onNavigate={close} />
            ))}
          </ul>
          {/* a <div>, not <footer>: the shared footer.css styles every <footer> */}
          <div className="gj-paper border-t border-gj-brown/15 px-6 py-6">
            <SummaryRows totals={totals} shippingLabel={s("drawer.shipStd", "Shipping (standard)")} />
            <div className="mt-6 grid gap-3">
              <Button to="/shop/checkout" onClick={close} data-autofocus>
                {s("drawer.checkout", "Proceed to checkout")}
              </Button>
              <Button to="/shop/cart" variant="outline" onClick={close}>
                {s("drawer.full", "View full bag")}
              </Button>
            </div>
          </div>
        </>
      )}
    </Overlay>
  );
}
