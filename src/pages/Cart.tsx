import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, Check, CreditCard, Minus, Plus, Trash2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useShop } from "@/lib/shop";
import { CONTACT_EMAIL, formatRand } from "@/data/products";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

export default function Cart() {
  const { cart, setQty, removeFromCart, cartTotal, clearCart } = useShop();
  const [params] = useSearchParams();
  const paymentStatus = params.get("payment");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

  async function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckoutError("");
    setCheckingOut(true);

    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${API_URL}/api/yoco/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name: data.get("name"),
            email: data.get("email"),
            phone: data.get("phone"),
            deliveryAddress: data.get("deliveryAddress"),
          },
          cart,
        }),
      });

      const checkout = await response.json();

      if (!response.ok || !checkout.redirectUrl) {
        throw new Error(checkout.message ?? "Could not start checkout.");
      }

      window.location.href = checkout.redirectUrl;
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Could not start checkout. Please try again.",
      );
      setCheckingOut(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-4xl font-bold">Your cart is empty</h1>
        <p className="mt-4 text-muted-foreground">
          Browse the collection and add your favourite pieces.
        </p>
        <ButtonLink to="/shop" size="lg" className="mt-8">
          Start shopping
        </ButtonLink>
      </div>
    );
  }

  const orderBody = encodeURIComponent(
    `Hi EverythingHooked,\n\nI'd like to order:\n\n${cart
      .map(
        (i) =>
          `• ${i.name} — ${i.color}, ${i.size} x ${i.qty} = ${formatRand(i.price * i.qty)}`
      )
      .join("\n")}\n\nTotal: ${formatRand(cartTotal)}\n\nMy details:\nName:\nPhone:\nDelivery address:\n`
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Your cart</h1>

      {paymentStatus === "success" && (
        <div className="mt-6 flex gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            Payment submitted. We'll confirm your order as soon as Yoco verifies
            the payment.
          </p>
        </div>
      )}

      {(paymentStatus === "cancelled" || paymentStatus === "failed") && (
        <div className="mt-6 flex gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p>
            Payment was not completed. You can try again or send the order by email.
          </p>
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <ul className="space-y-4">
          {cart.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-card"
            >
              <Link to={`/product/${item.slug}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 rounded-xl object-cover"
                />
              </Link>
              <div className="flex-1">
                <h2 className="font-display text-lg font-semibold">
                  <Link to={`/product/${item.slug}`} className="hover:text-primary">
                    {item.name}
                  </Link>
                </h2>
                <p className="text-sm text-muted-foreground">
                  {item.color} · {item.size}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    aria-label="Remove item"
                    onClick={() => removeFromCart(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="font-semibold text-primary">
                {formatRand(item.price * item.qty)}
              </p>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xl font-bold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-semibold">{formatRand(cartTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="font-semibold">On confirmation</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{formatRand(cartTotal)}</span>
          </div>

          <form onSubmit={handleCheckout} className="mt-6 space-y-3">
            <Input name="name" placeholder="Full name" required />
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="phone" placeholder="Phone / WhatsApp" />
            <textarea
              name="deliveryAddress"
              rows={4}
              required
              placeholder="Delivery address"
              className="w-full rounded-2xl border border-input bg-card px-5 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            />

            {checkoutError && (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-xs text-destructive">
                {checkoutError}
              </p>
            )}

            <Button type="submit" className="w-full shadow-glow" disabled={checkingOut}>
              <CreditCard className="h-4 w-4" />
              {checkingOut ? "Opening Yoco..." : "Pay with Yoco"}
            </Button>
          </form>

          <a
            href={`mailto:${CONTACT_EMAIL}?subject=New%20order%20from%20EverythingHooked&body=${orderBody}`}
            className="mt-3 flex h-11 w-full items-center justify-center rounded-full border border-border text-sm font-semibold hover:bg-muted"
          >
            Email order instead
          </a>
          <p className="mt-3 text-xs text-muted-foreground">
            Yoco opens a secure hosted payment page. Orders are confirmed after
            payment verification.
          </p>
          <Button variant="ghost" className="mt-3 w-full" onClick={clearCart}>
            Clear cart
          </Button>
        </aside>
      </div>
    </div>
  );
}
