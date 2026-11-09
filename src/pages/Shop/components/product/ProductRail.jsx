import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useShopT } from "../../i18n";

/** Horizontally scrolling, snap-aligned product showcase with arrow controls. */
export default function ProductRail({ products, label }) {
  const ref = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const { s } = useShopT();

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [products]);

  const step = (dir) => {
    const el = ref.current;
    const card = el.querySelector("[data-rail-item]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 24) * 2, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-6 flex justify-end gap-2">
        <button type="button" className="gj-icon-btn border border-gj-brown/20 disabled:opacity-30" onClick={() => step(-1)} disabled={edge.start} aria-label={s("rail.prev", "Scroll {{label}} left", { label })}>
          <ArrowLeft size={17} strokeWidth={1.5} />
        </button>
        <button type="button" className="gj-icon-btn border border-gj-brown/20 disabled:opacity-30" onClick={() => step(1)} disabled={edge.end} aria-label={s("rail.next", "Scroll {{label}} right", { label })}>
          <ArrowRight size={17} strokeWidth={1.5} />
        </button>
      </div>
      <div ref={ref} onScroll={update} className="gj-rail -mx-5 flex scroll-px-5 gap-6 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:-mx-12 lg:scroll-px-12 lg:px-12" role="list" aria-label={label}>
        {products.map((p) => (
          <div key={p.id} data-rail-item role="listitem" className="w-[72vw] shrink-0 sm:w-[44vw] md:w-[31vw] lg:w-[23vw] xl:w-[19vw]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
