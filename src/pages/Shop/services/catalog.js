import { PRODUCTS } from "../data/products";
import { CATEGORIES } from "../data/categories";
import { unitPrice } from "./pricing";

/**
 * Catalogue service. Today it reads the local dummy data with a small
 * artificial latency (so loading states are exercised); later, replace the
 * bodies with fetch() calls that return the same shapes.
 */
const LATENCY = 280;
const wait = (ms = LATENCY) => new Promise((r) => setTimeout(r, ms));

export const PRICE_BOUNDS = {
  min: 0,
  max: Math.ceil(Math.max(...PRODUCTS.map((p) => unitPrice(p))) / 500) * 500,
};

export const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "popular", label: "Most popular" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/** Pure filter + sort, shared by the listing page and the search overlay. */
export function queryProducts(products, { q = "", categories = [], min = 0, max = Infinity, inStock = false, sort = "featured" } = {}) {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  let list = products.filter((p) => {
    if (categories.length && !categories.includes(p.category)) return false;
    const price = unitPrice(p);
    if (price < min || price > max) return false;
    if (inStock && p.stock <= 0) return false;
    if (terms.length) {
      const cat = CATEGORIES.find((c) => c.slug === p.category)?.name ?? "";
      const hay = norm([p.name, p.subtitle, p.description, p.maker?.name, cat].join(" "));
      return terms.every((t) => hay.includes(t));
    }
    return true;
  });
  const by = {
    featured: (a, b) => Number(b.featured) - Number(a.featured) || Number(b.bestseller) - Number(a.bestseller) || b.sold - a.sold,
    popular: (a, b) => b.sold - a.sold,
    newest: (a, b) => new Date(b.addedAt) - new Date(a.addedAt),
    "price-asc": (a, b) => unitPrice(a) - unitPrice(b),
    "price-desc": (a, b) => unitPrice(b) - unitPrice(a),
  }[sort];
  if (by) list = [...list].sort(by);
  return list;
}

export async function getProducts() {
  await wait();
  return PRODUCTS;
}

export async function getProduct(slug) {
  await wait(220);
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) throw new Error("not-found");
  return product;
}

export async function getRelated(product, limit = 4) {
  await wait(160);
  const same = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category);
  const others = PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category).sort((a, b) => b.sold - a.sold);
  return [...same, ...others].slice(0, limit);
}

/** Synchronous lookup for cart/wishlist hydration (ids are stored, not objects). */
export const productById = (id) => PRODUCTS.find((p) => p.id === id);
export const ALL_PRODUCTS = PRODUCTS;
