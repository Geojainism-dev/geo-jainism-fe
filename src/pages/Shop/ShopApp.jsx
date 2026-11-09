import { Route, Routes, useLocation, useParams } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Navbar, Footer } from "@/components/layout";
import "./styles/shop.css";
import { ShopProvider } from "./store/ShopStore";
import { categoryBySlug } from "./data/categories";
import { ALL_PRODUCTS } from "./services/catalog";
import ShopDock from "./components/layout/ShopDock";
import ShopFooter from "./components/layout/ShopFooter";
import SearchOverlay from "./components/layout/SearchOverlay";
import CartDrawer from "./components/cart/CartDrawer";
import QuickView from "./components/product/QuickView";
import ShopHome from "./pages/ShopHome";
import ProductListing from "./pages/ProductListing";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import { Button, EmptyState } from "./components/common/ui";
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/common";
import { useShopT } from "./i18n";

/**
 * GEO Jainism Shop — self-contained module mounted at /shop/* (see App.jsx).
 *
 *   /shop                    homepage
 *   /shop/products           catalogue (?category=&q=&min=&max=&stock=&sort=)
 *   /shop/product/:slug      product detail
 *   /shop/cart               bag
 *   /shop/wishlist           wishlist
 *   /shop/checkout           demo checkout
 *   /shop/order/:id          order confirmation
 *
 * It renders the shared GEO Jainism header and footer around its own shop
 * bar, footer and overlays; nothing outside src/pages/Shop depends on it.
 */

function Page({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function Title({ k, children }) {
  const { s } = useShopT();
  return (
    <Helmet>
      <title>{`${k ? s(`title.${k}`, children) : children} | ${s("title.suffix", "GEO Jainism Shop")}`}</title>
    </Helmet>
  );
}

function ProductTitle() {
  const { slug } = useParams();
  const p = ALL_PRODUCTS.find((x) => x.slug === slug);
  const { s } = useShopT();
  const suffix = s("title.suffix", "GEO Jainism Shop");
  return (
    <Helmet>
      <title>{p ? `${p.name} | ${suffix}` : `${s("title.product", "Product")} | ${suffix}`}</title>
      {p && <meta name="description" content={p.description} />}
    </Helmet>
  );
}

function ListingTitle() {
  const { search } = useLocation();
  const cat = new URLSearchParams(search).get("category");
  const { cat: tc } = useShopT();
  const c = cat && !cat.includes(",") ? tc(categoryBySlug(cat)) : null;
  return c ? <Title>{c.name}</Title> : <Title k="all">All products</Title>;
}

function NotFound() {
  const { s } = useShopT();
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <EmptyState title={s("notFound.title", "This page has wandered off")} body={s("notFound.body", "The link may be old. Let’s get you back to the collection.")} action={<Button to="/shop">{s("common.backToShop", "Back to the shop")}</Button>} />
    </div>
  );
}

export default function ShopApp() {
  const location = useLocation();
  // site-wide light/dark theme — same hook + toggle as Landing, About and Tamil Jain
  const { theme, toggleTheme } = useTheme();

  return (
    <ShopProvider>
      <MotionConfig reducedMotion="user">
        <Helmet>
          <meta name="theme-color" content={theme === "dark" ? "#171310" : "#F8F5EF"} />
        </Helmet>
        <div className="gj-shop" data-theme={theme}>
          <Navbar />
          <main id="main">
            <AnimatePresence mode="wait" initial={false}>
              <Routes location={location} key={location.pathname}>
                {/* no <Title> here: /shop uses the global SEO title from config/seo.js (prerender waits on it) */}
                <Route index element={<Page><ShopHome /></Page>} />
                <Route path="products" element={<Page><ListingTitle /><ProductListing /></Page>} />
                <Route path="product/:slug" element={<Page><ProductTitle /><ProductDetails /></Page>} />
                <Route path="cart" element={<Page><Title k="bag">Your bag</Title><Cart /></Page>} />
                <Route path="wishlist" element={<Page><Title k="wishlist">Wishlist</Title><Wishlist /></Page>} />
                <Route path="checkout" element={<Page><Title k="checkout">Checkout</Title><Checkout /></Page>} />
                <Route path="order/:id" element={<Page><Title k="order">Order confirmed</Title><OrderConfirmation /></Page>} />
                <Route path="*" element={<Page><Title k="notFound">Not found</Title><NotFound /></Page>} />
              </Routes>
            </AnimatePresence>
          </main>
          <ShopFooter />
          <Footer />
        </div>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <ShopDock />
        <CartDrawer />
        <QuickView />
        <SearchOverlay />
      </MotionConfig>
    </ShopProvider>
  );
}
