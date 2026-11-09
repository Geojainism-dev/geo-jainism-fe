/** Money + pricing rules in one place, so cart, checkout and cards agree. */

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const formatINR = (n) => inr.format(Math.round(n));

/** Price the customer actually pays for one unit. */
export const unitPrice = (p) => (p.discountPrice != null && p.discountPrice < p.price ? p.discountPrice : p.price);
export const discountPct = (p) => (unitPrice(p) < p.price ? Math.round((1 - unitPrice(p) / p.price) * 100) : 0);

export const FREE_SHIPPING_FROM = 999;

/** Delivery options shown at checkout. `cost(subtotal)` returns ₹. */
export const DELIVERY_METHODS = [
  { id: "standard", label: "Standard delivery", eta: "4–7 working days", cost: (sub) => (sub >= FREE_SHIPPING_FROM ? 0 : 99) },
  { id: "express", label: "Express delivery", eta: "1–3 working days", cost: () => 249 },
];

/**
 * Totals for a list of { product, qty } lines.
 * mrp = sum at MRP, discount = MRP − selling price, shipping by delivery method.
 */
export function cartTotals(lines, deliveryId = "standard") {
  const mrp = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + unitPrice(l.product) * l.qty, 0);
  const method = DELIVERY_METHODS.find((d) => d.id === deliveryId) ?? DELIVERY_METHODS[0];
  const shipping = lines.length ? method.cost(subtotal) : 0;
  return {
    mrp,
    discount: mrp - subtotal,
    subtotal,
    shipping,
    total: subtotal + shipping,
    count: lines.reduce((s, l) => s + l.qty, 0),
    toFreeShipping: Math.max(0, FREE_SHIPPING_FROM - subtotal),
  };
}
