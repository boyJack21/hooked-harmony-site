import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useShop } from "@/lib/shop";
import { CONTACT_EMAIL, formatRand } from "@/data/products";

export default function Cart() {
  const { cart, setQty, removeFromCart, cartTotal, clearCart } = useShop();

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

          <a
            href={`mailto:${CONTACT_EMAIL}?subject=New%20order%20from%20EverythingHooked&body=${orderBody}`}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-glow hover:bg-primary/90"
          >
            Send my order
          </a>
          <p className="mt-3 text-xs text-muted-foreground">
            We'll confirm sizing, delivery and payment by email before we start hooking.
          </p>
          <Button variant="ghost" className="mt-3 w-full" onClick={clearCart}>
            Clear cart
          </Button>
        </aside>
      </div>
    </div>
  );
}
