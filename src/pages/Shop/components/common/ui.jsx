import { forwardRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, Star } from "lucide-react";
import { formatINR, unitPrice, discountPct } from "../../services/pricing";
import { img, imgSm } from "../../data/media";
import { useShopT } from "../../i18n";

/** Button / link with the shop's variants: primary · gold · outline · light. */
export const Button = forwardRef(function Button({ variant = "primary", size, to, href, className = "", children, ...rest }, ref) {
  const cls = `gj-btn gj-btn--${variant} ${size === "sm" ? "gj-btn--sm" : ""} ${className}`;
  if (to)
    return (
      <Link ref={ref} to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  if (href)
    return (
      <a ref={ref} href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  return (
    <button ref={ref} type={rest.type || "button"} className={cls} {...rest}>
      {children}
    </button>
  );
});

/** Selling price, with struck-through MRP and % off when discounted. */
export function Price({ product, size = "md", className = "" }) {
  const sell = unitPrice(product);
  const off = discountPct(product);
  const big = size === "lg";
  const { s } = useShopT();
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2.5 gap-y-1 ${className}`}>
      <span className={`${big ? "text-3xl" : "text-[0.98rem]"} font-medium tabular-nums text-gj-charcoal`}>{formatINR(sell)}</span>
      {off > 0 && (
        <>
          <span className={`${big ? "text-lg" : "text-sm"} tabular-nums text-gj-brown/50 line-through`}>
            <span className="sr-only">{s("price.mrp", "MRP")} </span>
            {formatINR(product.price)}
          </span>
          <span className={`${big ? "text-sm" : "text-xs"} font-medium text-gj-maroon`}>{s("price.off", "{{pct}}% off", { pct: off })}</span>
        </>
      )}
    </p>
  );
}

export function Rating({ value, count, className = "" }) {
  const { s } = useShopT();
  return (
    <p className={`flex items-center gap-1.5 text-xs text-gj-brown/70 ${className}`} aria-label={s("rating.aria", "Rated {{value}} out of 5 from {{count}} reviews", { value, count })}>
      <Star size={13} className="fill-gj-gold text-gj-gold" aria-hidden="true" />
      <span className="font-medium text-gj-charcoal tabular-nums">{value.toFixed(1)}</span>
      <span aria-hidden="true">({count})</span>
    </p>
  );
}

export function QtyStepper({ value, onChange, max = 10, min = 1, size = "md", label }) {
  const { s } = useShopT();
  label = label ?? s("qty.label", "Quantity");
  const h = size === "sm" ? "h-9" : "h-12";
  return (
    <div className={`inline-flex ${h} items-stretch border border-gj-brown/25 bg-gj-paper`} role="group" aria-label={label}>
      <button type="button" className="grid w-10 place-items-center text-gj-brown transition-colors hover:bg-gj-beige disabled:opacity-30" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={s("qty.less", "Decrease quantity")}>
        <Minus size={14} />
      </button>
      <span className="grid w-10 place-items-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" className="grid w-10 place-items-center text-gj-brown transition-colors hover:bg-gj-beige disabled:opacity-30" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={s("qty.more", "Increase quantity")}>
        <Plus size={14} />
      </button>
    </div>
  );
}

/** Lazy image that fades in once decoded, over a sand placeholder. */
export function ShopImage({ k, alt = "", className = "", sizes = "(min-width: 1024px) 25vw, 50vw", eager = false, small = false, imgClassName = "" }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span className={`block bg-gj-sand ${className}`}>
      <img
        src={small ? imgSm(k) : img(k)}
        srcSet={small ? undefined : `${imgSm(k)} 640w, ${img(k)} 1600w`}
        sizes={small ? undefined : sizes}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`gj-img h-full w-full object-cover ${loaded ? "is-loaded" : ""} ${imgClassName}`}
      />
    </span>
  );
}

/** Fade-and-rise on first view. */
export function Reveal({ children, delay = 0, y = 28, className = "", as = "div" }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

export function SectionHeader({ eyebrow, title, action, className = "" }) {
  return (
    <div className={`flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div>
        {eyebrow && <p className="gj-eyebrow mb-3">{eyebrow}</p>}
        <h2 className="gj-display text-[clamp(2.2rem,4.4vw,3.8rem)] text-gj-charcoal">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="gj-paper flex flex-col items-center px-6 py-20 text-center">
      {Icon && (
        <span className="mb-6 grid h-16 w-16 place-items-center rounded-full border border-gj-gold/50 text-gj-gold-deep">
          <Icon size={26} strokeWidth={1.25} />
        </span>
      )}
      <h2 className="gj-display text-4xl">{title}</h2>
      {body && <p className="mt-3 max-w-md text-gj-brown/70">{body}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

export const Skeleton = ({ className = "" }) => <span className={`gj-skeleton block ${className}`} aria-hidden="true" />;

export function CardSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="mt-4 h-3 w-1/3" />
      <Skeleton className="mt-3 h-5 w-4/5" />
      <Skeleton className="mt-3 h-4 w-1/4" />
    </div>
  );
}

export const Breadcrumbs = ({ items }) => (
  <nav aria-label="Breadcrumb" className="text-xs text-gj-brown/60" dir="auto">
    <ol className="flex flex-wrap items-center gap-2">
      {items.map((it, i) => (
        <li key={it.label} className="flex items-center gap-2">
          {it.to ? (
            <Link to={it.to} className="gj-link hover:text-gj-charcoal">
              {it.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-gj-charcoal">
              {it.label}
            </span>
          )}
          {i < items.length - 1 && <span aria-hidden="true">/</span>}
        </li>
      ))}
    </ol>
  </nav>
);
