import { useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Check, PackageSearch } from "lucide-react";
import { getOrder } from "../services/orders";
import { PAYMENT_METHODS } from "../services/payments";
import { formatINR } from "../services/pricing";
import { useAsync } from "../hooks/useAsync";
import { Button, EmptyState, ShopImage, Skeleton } from "../components/common/ui";
import { SummaryRows } from "../components/cart/CartParts";
import { useShopT } from "../i18n";

export default function OrderConfirmation() {
  const { id } = useParams();
  const reduce = useReducedMotion();
  const { data: order, loading } = useAsync(() => getOrder(id), [id]);
  const { s, locale } = useShopT();

  if (loading)
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-5 py-20">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="mx-auto h-10 w-2/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );

  if (!order)
    return (
      <div className="mx-auto max-w-3xl px-5 py-20">
        <EmptyState icon={PackageSearch} title={s("oc.missTitle", "Order not found")} body={s("oc.missBody", "We couldn’t find that order on this device.")} action={<Button to="/shop">{s("common.backToShop", "Back to the shop")}</Button>} />
      </div>
    );

  const placed = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short" }).format(new Date(order.placedAt));
  const payM = PAYMENT_METHODS.find((m) => m.id === order.paymentMethod);
  const pay = payM && s(`pay.${payM.id}.label`, payM.label);
  const first = order.customer.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-12 sm:px-8">
      <div className="flex flex-col items-center text-center">
        <motion.span
          className="grid h-20 w-20 place-items-center rounded-full bg-gj-maroon text-gj-ivory"
          initial={reduce ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <Check size={34} strokeWidth={1.5} />
        </motion.span>
        <p className="gj-eyebrow mt-8">{s("title.order", "Order confirmed")}</p>
        <h1 className="gj-display mt-3 text-[clamp(2.6rem,5vw,4.2rem)]">{s("oc.thanks", "Thank you, {{name}}.", { name: first })}</h1>
        <p className="mt-4 max-w-lg text-gj-brown/75">
          {s("oc.lead", "Your order summary is below. In the live store, a confirmation would be emailed to {{email}}.", { email: order.customer.email })}
        </p>
        <p className="mt-6 inline-flex items-center gap-3 border border-gj-brown/20 bg-gj-paper px-5 py-3 text-sm">
          {s("oc.number", "Order number")} <span className="font-medium tabular-nums tracking-wider text-gj-maroon">{order.id}</span>
        </p>
        <p className="mt-3 text-xs text-gj-brown/55">{s("oc.demo", "Demonstration order — no payment was taken.")}</p>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        <section className="gj-paper p-6 sm:p-8">
          <h2 className="gj-display text-2xl">{s("co.delivery", "Delivery")}</h2>
          <address className="mt-4 not-italic leading-relaxed text-gj-brown/85">
            {order.customer.name}
            <br />
            {order.address.line1}
            {order.address.line2 && (
              <>
                <br />
                {order.address.line2}
              </>
            )}
            <br />
            {order.address.city}, {order.address.state} {order.address.pincode}
            <br />
            {order.customer.phone}
          </address>
          <p className="mt-5 text-sm">
            <span className="font-medium">{s(`ship.${order.delivery.id}.label`, order.delivery.label)}</span> · <span className="text-gj-brown/70">{s("oc.arrives", "arrives in {{eta}}", { eta: s(`ship.${order.delivery.id}.eta`, order.delivery.eta) })}</span>
          </p>
          <p className="mt-2 text-sm text-gj-brown/70">
            {s("oc.payment", "Payment")}: {pay}
            {order.payment.status === "pending-cod" ? ` — ${s("oc.cod", "pay on delivery")}` : ""}
          </p>
          <p className="mt-2 text-xs text-gj-brown/55">{s("oc.placed", "Placed {{date}}", { date: placed })}</p>
        </section>

        <section className="gj-paper p-6 sm:p-8">
          <h2 className="gj-display text-2xl">{s("oc.pieces", "Your pieces")}</h2>
          <ul className="mt-4 space-y-4">
            {order.items.map((it) => (
              <li key={it.id} className="flex items-center gap-4">
                <span className="w-14 shrink-0">
                  <ShopImage k={it.image} small className="aspect-[4/5] overflow-hidden" />
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block truncate">{it.name}</span>
                  <span className="text-gj-brown/60">{s("oc.qty", "Qty {{n}}", { n: it.qty })}</span>
                </span>
                <span className="text-sm tabular-nums">{formatINR(it.unit * it.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-gj-brown/15 pt-5">
            <SummaryRows totals={order.totals} shippingLabel={s(`ship.${order.delivery.id}.label`, order.delivery.label)} />
          </div>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Button to="/shop/products">{s("cart.continue", "Continue shopping")}</Button>
        <Button to="/shop" variant="outline">
          {s("oc.home", "Back to shop home")}
        </Button>
      </div>
    </div>
  );
}
