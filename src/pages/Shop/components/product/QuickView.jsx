import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useShop } from "../../store/ShopStore";
import { ALL_PRODUCTS } from "../../services/catalog";
import Overlay from "../common/Overlay";
import Gallery from "./Gallery";
import PurchasePanel from "./PurchasePanel";
import { useShopT } from "../../i18n";

export default function QuickView() {
  const { quickView, setQuickView } = useShop();
  const product = quickView ? ALL_PRODUCTS.find((p) => p.slug === quickView) : null;
  const close = () => setQuickView(null);
  const { s } = useShopT();

  return (
    <Overlay open={!!product} onClose={close} label={product ? s("quick.label", "Quick view: {{name}}", { name: product.name }) : s("quick.title", "Quick view")} variant="center">
      {product && (
        <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[1.05fr_1fr] md:gap-10">
          <Gallery product={product} />
          <div className="flex flex-col pr-0 md:pr-6 md:pt-6">
            <PurchasePanel product={product} compact onNavigate={close} />
            <p className="mt-6 leading-relaxed text-gj-brown/80">{product.description}</p>
            <Link to={`/shop/product/${product.slug}`} onClick={close} className="gj-link mt-6 inline-flex items-center gap-2 self-start text-sm font-medium text-gj-maroon">
              {s("quick.details", "View full details")} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </Overlay>
  );
}
