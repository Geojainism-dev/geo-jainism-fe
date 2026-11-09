/**
 * Payment adapter.
 *
 * DEMO ONLY — no payment is taken. `processPayment` simulates an approval so
 * the checkout flow can be exercised end to end.
 *
 * To integrate Razorpay (or another gateway) later, add a provider with the
 * same `process({ amount, currency, order, customer })` signature that:
 *   1. asks your backend to create a gateway order (amount in paise),
 *   2. opens the gateway checkout (e.g. new window.Razorpay({...}).open()),
 *   3. sends the signed response back to your backend for verification,
 * and resolves { status: "paid", reference } only after verification.
 * Then point ACTIVE_PROVIDER at it.
 */
export const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", note: "Google Pay, PhonePe, Paytm or any UPI app" },
  { id: "card", label: "Credit / debit card", note: "Visa, Mastercard, RuPay" },
  { id: "cod", label: "Cash on delivery", note: "Pay when your order arrives" },
];

const demoProvider = {
  id: "demo",
  async process({ method }) {
    await new Promise((r) => setTimeout(r, 900));
    return { status: method === "cod" ? "pending-cod" : "paid", reference: `DEMO-${Date.now().toString(36).toUpperCase()}` };
  },
};

const ACTIVE_PROVIDER = demoProvider;

export const processPayment = (args) => ACTIVE_PROVIDER.process(args);
export const isDemoPayments = ACTIVE_PROVIDER.id === "demo";
