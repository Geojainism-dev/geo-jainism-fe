import { processPayment } from "./payments";

/**
 * Mock order service. Orders are kept in localStorage so the confirmation
 * page survives a refresh. Replace with POST /orders + GET /orders/:id.
 */
const KEY = "gj-shop-orders-v1";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
};

const write = (orders) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(orders));
  } catch {
    /* storage full or blocked — the order still shows for this session */
  }
};

/** GJ-YYMMDD-XXXX, e.g. GJ-261106-7QK4 */
function newOrderId() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  return `GJ-${ymd}-${rand}`;
}

let memory = {};

export async function placeOrder({ lines, totals, customer, address, delivery, paymentMethod }) {
  const id = newOrderId();
  const payment = await processPayment({ amount: totals.total, currency: "INR", method: paymentMethod, order: id, customer });
  const order = {
    id,
    placedAt: new Date().toISOString(),
    items: lines.map((l) => ({ id: l.product.id, slug: l.product.slug, name: l.product.name, image: l.product.images[0], qty: l.qty, unit: l.unit })),
    totals,
    customer,
    address,
    delivery,
    paymentMethod,
    payment,
  };
  memory = { ...memory, [id]: order };
  write({ ...read(), [id]: order });
  return order;
}

export async function getOrder(id) {
  await new Promise((r) => setTimeout(r, 150));
  return memory[id] ?? read()[id] ?? null;
}
