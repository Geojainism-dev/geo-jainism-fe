import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { toast } from "sonner";
import { st } from "../i18n";
import { productById } from "../services/catalog";
import { cartTotals, unitPrice } from "../services/pricing";

/**
 * Shop state: cart + wishlist (persisted to localStorage, synced across
 * tabs) and transient UI state (cart drawer, quick view, search overlay).
 * The project has no global store library, so this uses Context +
 * useReducer instead of adding one. Only product ids are persisted; lines
 * are re-hydrated from the catalogue, so prices are never stale.
 */
const KEY = "gj-shop-v1";
const MAX_QTY = 10;

const load = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    return { cart: Array.isArray(v?.cart) ? v.cart : [], wishlist: Array.isArray(v?.wishlist) ? v.wishlist : [] };
  } catch {
    return { cart: [], wishlist: [] };
  }
};

function reducer(state, a) {
  switch (a.type) {
    case "add": {
      const p = productById(a.id);
      if (!p || p.stock <= 0) return state;
      const cap = Math.min(MAX_QTY, p.stock);
      const found = state.cart.find((l) => l.id === a.id);
      const cart = found
        ? state.cart.map((l) => (l.id === a.id ? { ...l, qty: Math.min(cap, l.qty + a.qty) } : l))
        : [...state.cart, { id: a.id, qty: Math.min(cap, a.qty) }];
      return { ...state, cart };
    }
    case "qty": {
      const p = productById(a.id);
      const cap = Math.min(MAX_QTY, p?.stock ?? MAX_QTY);
      if (a.qty <= 0) return { ...state, cart: state.cart.filter((l) => l.id !== a.id) };
      return { ...state, cart: state.cart.map((l) => (l.id === a.id ? { ...l, qty: Math.min(cap, a.qty) } : l)) };
    }
    case "remove":
      return { ...state, cart: state.cart.filter((l) => l.id !== a.id) };
    case "clear":
      return { ...state, cart: [] };
    case "wish":
      return { ...state, wishlist: state.wishlist.includes(a.id) ? state.wishlist.filter((x) => x !== a.id) : [...state.wishlist, a.id] };
    case "hydrate":
      return a.state;
    default:
      return state;
  }
}

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickView, setQuickView] = useState(null); // product slug
  const [searchOpen, setSearchOpen] = useState(false);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* blocked storage: state still works for this session */
    }
  }, [state]);

  // keep multiple tabs in sync
  useEffect(() => {
    const onStorage = (e) => e.key === KEY && dispatch({ type: "hydrate", state: load() });
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const lines = useMemo(
    () =>
      state.cart
        .map((l) => ({ ...l, product: productById(l.id) }))
        .filter((l) => l.product)
        .map((l) => ({ ...l, unit: unitPrice(l.product) })),
    [state.cart]
  );
  const totals = useMemo(() => cartTotals(lines), [lines]);
  const wishlist = useMemo(() => state.wishlist.map(productById).filter(Boolean), [state.wishlist]);

  const addToCart = useCallback((product, qty = 1, { openDrawer = true, silent = false } = {}) => {
    if (product.stock <= 0) {
      toast.error(st("toast.soldOut", "{{name}} is sold out", { name: product.name }));
      return;
    }
    dispatch({ type: "add", id: product.id, qty });
    if (openDrawer) setDrawerOpen(true);
    if (!silent) toast.success(st("toast.added", "Added to your bag"), { description: `${qty} × ${product.name}` });
  }, []);

  const toggleWishlist = useCallback(
    (product) => {
      const had = state.wishlist.includes(product.id);
      dispatch({ type: "wish", id: product.id });
      toast(had ? st("toast.unsaved", "Removed from wishlist") : st("toast.saved", "Saved to wishlist"), { description: product.name });
    },
    [state.wishlist]
  );

  const value = useMemo(
    () => ({
      lines,
      totals,
      wishlist,
      inWishlist: (id) => state.wishlist.includes(id),
      qtyInCart: (id) => state.cart.find((l) => l.id === id)?.qty ?? 0,
      addToCart,
      setQty: (id, qty) => dispatch({ type: "qty", id, qty }),
      removeFromCart: (product) => {
        dispatch({ type: "remove", id: product.id });
        toast(st("toast.removed", "Removed from bag"), { description: product.name, action: { label: st("toast.undo", "Undo"), onClick: () => dispatch({ type: "add", id: product.id, qty: 1 }) } });
      },
      clearCart: () => dispatch({ type: "clear" }),
      toggleWishlist,
      drawerOpen,
      setDrawerOpen,
      quickView,
      setQuickView,
      searchOpen,
      setSearchOpen,
      maxQty: (p) => Math.min(MAX_QTY, p.stock),
    }),
    [lines, totals, wishlist, state.wishlist, state.cart, addToCart, toggleWishlist, drawerOpen, quickView, searchOpen]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}
