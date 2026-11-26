import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useShop } from "../../store/ShopStore";
import { ALL_PRODUCTS } from "../../services/catalog";
import Overlay from "../common/Overlay";
import Gallery from "./Gallery";
import PurchasePanel from "./PurchasePanel";
import { useShopT } from "../../i18n";

/**
 * Gallery stage `sizes` inside the quick-view modal (max 1040px wide, 16px page margin; padding 20px / 32px from 640px). From 768px the
 * modal is a 1.05fr/1fr grid (gap 40px) and, from 1024px, the gallery also holds an 80px thumbnail column + 16px gap. Times the 1.9x zoom.
 */
const QUICK_STAGE_SIZES =
  "(min-width: 1024px) calc(((min(100vw - 32px, 1040px) - 64px - 40px) * 1.05 / 2.05 - 96px) * 1.9), (min-width: 768px) calc(((100vw - 32px - 64px - 40px) * 1.05 / 2.05) * 1.9), (min-width: 640px) calc((100vw - 96px) * 1.9), calc((100vw - 72px) * 1.9)";

export default function QuickView() {
  const { quickView, setQuickView } = useShop();
  const product = quickView ? ALL_PRODUCTS.find((p) => p.slug === quickView) : null;
  const close = () => setQuickView(null);
  const { s } = useShopT();

  return (
    <Overlay open={!!product} onClose={close} label={product ? s("quick.label", "Quick view: {{name}}", { name: product.name }) : s("quick.title", "Quick view")} variant="center">
      {product && (
        <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[1.05fr_1fr] md:gap-10">
          <Gallery product={product} stageSizes={QUICK_STAGE_SIZES} />
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
