import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Info, Loader2, Lock, ShoppingBag } from "lucide-react";
import { useShop } from "../store/ShopStore";
import { cartTotals, DELIVERY_METHODS, formatINR } from "../services/pricing";
import { PAYMENT_METHODS, isDemoPayments } from "../services/payments";
import { placeOrder } from "../services/orders";
import { Breadcrumbs, Button, EmptyState, ShopImage } from "../components/common/ui";
import { SummaryRows } from "../components/cart/CartParts";
import { useShopT, st } from "../i18n";

const STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const EMPTY = { name: "", email: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" };

const RULES = {
  name: (v) => (v.trim().length >= 2 ? "" : st("err.name", "Please enter your full name.")),
  email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? "" : st("err.email", "Enter a valid email for your order updates.")),
  phone: (v) => (/^[6-9]\d{9}$/.test(v.replace(/\D/g, "").slice(-10)) ? "" : st("err.phone", "Enter a 10-digit Indian mobile number.")),
  line1: (v) => (v.trim().length >= 4 ? "" : st("err.line1", "Please enter your street address.")),
  city: (v) => (v.trim() ? "" : st("err.city", "Please enter your city.")),
  state: (v) => (v ? "" : st("err.state", "Please choose a state.")),
  pincode: (v) => (/^[1-9]\d{5}$/.test(v) ? "" : st("err.pincode", "PIN code should be 6 digits.")),
};

function Section({ n, title, children }) {
  return (
    <section className="border-t border-gj-brown/15 pt-8" aria-labelledby={`step-${n}`}>
      <h2 id={`step-${n}`} className="flex items-baseline gap-4">
        <span className="font-gj-display text-2xl italic text-gj-gold-deep">{n}</span>
        <span className="gj-display text-3xl">{title}</span>
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function Checkout() {
  const { lines, clearCart } = useShop();
  const navigate = useNavigate();
  const { s } = useShopT();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("upi");
  const [placing, setPlacing] = useState(false);
  const totals = useMemo(() => cartTotals(lines, delivery), [lines, delivery]);

  const field = (key, label, { type = "text", autoComplete, inputMode, className = "", placeholder } = {}) => (
    <div className={className}>
      <label htmlFor={`co-${key}`} className="gj-label">
        {label}
      </label>
      <input
        id={`co-${key}`}
        type={type}
        value={form[key]}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        onBlur={() => RULES[key] && setErrors((er) => ({ ...er, [key]: RULES[key](form[key]) }))}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `co-${key}-err` : undefined}
        className="gj-input"
      />
      {errors[key] && (
        <p id={`co-${key}-err`} className="gj-error">
          {errors[key]}
        </p>
      )}
    </div>
  );

  const submit = async (e) => {
    e.preventDefault();
    const next = Object.fromEntries(Object.entries(RULES).map(([k, rule]) => [k, rule(form[k])]));
    setErrors(next);
    const firstBad = Object.keys(next).find((k) => next[k]);
    if (firstBad) {
      document.getElementById(`co-${firstBad}`)?.focus();
      return;
    }
    setPlacing(true);
    try {
      const method = DELIVERY_METHODS.find((d) => d.id === delivery);
      const order = await placeOrder({
        lines,
        totals,
        customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() },
        address: { line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode },
        delivery: { id: method.id, label: method.label, eta: method.eta },
        paymentMethod: payment,
      });
      clearCart();
      navigate(`/shop/order/${order.id}`, { replace: true });
    } catch {
      setPlacing(false);
      setErrors((er) => ({ ...er, form: st("err.form", "Something went wrong placing your order. Please try again.") }));
    }
  };

  if (!lines.length && !placing)
    return (
      <div className="mx-auto max-w-3xl px-5 py-20">
        <EmptyState icon={ShoppingBag} title={s("co.emptyTitle", "Nothing to check out")} body={s("co.emptyBody", "Your bag is empty. Add a few pieces first.")} action={<Button to="/shop/products">{s("common.explore", "Explore the collection")}</Button>} />
      </div>
    );

  return (
    <div className="mx-auto max-w-[1300px] px-5 pb-24 pt-8 sm:px-8 lg:px-12">
      <Breadcrumbs items={[{ label: s("crumb.shop", "Shop"), to: "/shop" }, { label: s("crumb.bag", "Bag"), to: "/shop/cart" }, { label: s("title.checkout", "Checkout") }]} />
      <h1 className="gj-display mt-6 text-[clamp(2.6rem,5vw,4.4rem)]">{s("title.checkout", "Checkout")}</h1>

      {isDemoPayments && (
        <p className="mt-6 flex items-start gap-3 border border-gj-gold/40 bg-gj-gold/10 px-4 py-3 text-sm text-gj-brown">
          <Info size={17} className="mt-0.5 shrink-0 text-gj-gold-deep" />
          {s("co.demo", "This is a demonstration checkout. No payment is taken and no order is shipped — placing an order just shows the confirmation flow.")}
        </p>
      )}

      <form onSubmit={submit} noValidate className="mt-10 grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
        <div className="min-w-0 space-y-12">
          <Section n="1" title={s("co.contact", "Contact")}>
            <div className="grid gap-5 sm:grid-cols-2">
              {field("name", s("co.name", "Full name"), { autoComplete: "name", className: "sm:col-span-2" })}
              {field("email", s("co.email", "Email"), { type: "email", autoComplete: "email" })}
              {field("phone", s("co.phone", "Mobile number"), { type: "tel", autoComplete: "tel", inputMode: "numeric", placeholder: s("co.phonePh", "10-digit number") })}
            </div>
          </Section>

          <Section n="2" title={s("co.address", "Shipping address")}>
            <div className="grid gap-5 sm:grid-cols-2">
              {field("line1", s("co.line1", "Address"), { autoComplete: "address-line1", className: "sm:col-span-2", placeholder: s("co.line1Ph", "House number, street") })}
              {field("line2", s("co.line2", "Apartment, landmark (optional)"), { autoComplete: "address-line2", className: "sm:col-span-2" })}
              {field("city", s("co.city", "City"), { autoComplete: "address-level2" })}
              <div>
                <label htmlFor="co-state" className="gj-label">
                  {s("co.state", "State")}
                </label>
                <select
                  id="co-state"
                  value={form.state}
                  autoComplete="address-level1"
                  onChange={(e) => {
                    setForm((f) => ({ ...f, state: e.target.value }));
                    setErrors((er) => ({ ...er, state: RULES.state(e.target.value) }));
                  }}
                  aria-invalid={!!errors.state}
                  aria-describedby={errors.state ? "co-state-err" : undefined}
                  className="gj-input"
                >
                  <option value="">{s("co.statePh", "Select a state")}</option>
                  {STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {errors.state && (
                  <p id="co-state-err" className="gj-error">
                    {errors.state}
                  </p>
                )}
              </div>
              {field("pincode", s("co.pincode", "PIN code"), { autoComplete: "postal-code", inputMode: "numeric" })}
            </div>
          </Section>

          <Section n="3" title={s("co.delivery", "Delivery")}>
            <fieldset className="grid gap-3">
              <legend className="sr-only">{s("co.deliveryMethod", "Delivery method")}</legend>
              {DELIVERY_METHODS.map((d) => {
                const cost = d.cost(totals.subtotal);
                return (
                  <label key={d.id} className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors ${delivery === d.id ? "border-gj-charcoal bg-gj-paper" : "border-gj-brown/20 hover:border-gj-brown/45"}`}>
                    <input type="radio" name="delivery" className="gj-radio" checked={delivery === d.id} onChange={() => setDelivery(d.id)} />
                    <span className="flex-1">
                      <span className="block font-medium">{s(`ship.${d.id}.label`, d.label)}</span>
                      <span className="block text-sm text-gj-brown/65">{s(`ship.${d.id}.eta`, d.eta)}</span>
                    </span>
                    <span className="font-medium tabular-nums">{cost === 0 ? s("sum.free", "Free") : formatINR(cost)}</span>
                  </label>
                );
              })}
            </fieldset>
          </Section>

          <Section n="4" title={s("co.payment", "Payment")}>
            <fieldset className="grid gap-3">
              <legend className="sr-only">{s("co.paymentMethod", "Payment method")}</legend>
              {PAYMENT_METHODS.map((m) => (
                <label key={m.id} className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors ${payment === m.id ? "border-gj-charcoal bg-gj-paper" : "border-gj-brown/20 hover:border-gj-brown/45"}`}>
                  <input type="radio" name="payment" className="gj-radio" checked={payment === m.id} onChange={() => setPayment(m.id)} />
                  <span>
                    <span className="block font-medium">{s(`pay.${m.id}.label`, m.label)}</span>
                    <span className="block text-sm text-gj-brown/65">{s(`pay.${m.id}.note`, m.note)}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <p className="mt-4 flex items-center gap-2 text-xs text-gj-brown/60">
              <Lock size={13} /> {isDemoPayments ? s("co.demoPay", "Demo mode — card and UPI details are never requested.") : s("co.securePay", "Payments are processed securely by our payment partner.")}
            </p>
          </Section>
        </div>

        <aside className="h-fit min-w-0 lg:sticky lg:top-[100px]" aria-label={s("sum.title", "Order summary")}>
          <div className="gj-paper p-6 sm:p-8">
            <h2 className="gj-display text-3xl">{s("sum.title", "Order summary")}</h2>
            <ul className="mt-6 max-h-[320px] space-y-4 overflow-y-auto pr-1">
              {lines.map((l) => (
                <li key={l.id} className="flex items-center gap-4">
                  <span className="relative w-14 shrink-0">
                    <ShopImage k={l.product.images[0]} small className="aspect-[4/5] overflow-hidden" />
                    <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-gj-charcoal px-1 text-[0.65rem] text-gj-ivory">{l.qty}</span>
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm">{l.product.name}</span>
                  <span className="text-sm tabular-nums">{formatINR(l.unit * l.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-gj-brown/15 pt-6">
              <SummaryRows totals={totals} shippingLabel={s(`ship.${delivery}.label`, DELIVERY_METHODS.find((d) => d.id === delivery).label)} />
            </div>
            {errors.form && <p className="gj-error mt-4">{errors.form}</p>}
            <Button type="submit" className="mt-8 w-full" disabled={placing}>
              {placing ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> {s("co.placing", "Placing order…")}
                </>
              ) : (
                <>{s("co.place", "Place order · {{amt}}", { amt: formatINR(totals.total) })}</>
              )}
            </Button>
            <Link to="/shop/cart" className="gj-link mx-auto mt-4 block w-fit text-sm text-gj-brown/70">
              {s("co.backBag", "Back to bag")}
            </Link>
          </div>
        </aside>
      </form>
    </div>
  );
}
