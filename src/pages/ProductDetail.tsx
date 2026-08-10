import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Heart, ShoppingBag } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import { useShop } from "@/lib/shop";
import { colorOptions, findProduct, formatRand, products } from "@/data/products";

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const product = findProduct(slug);
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [sizeIndex, setSizeIndex] = useState(0);
  const [color, setColor] = useState(colorOptions[0]);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl font-bold">Product not found</h1>
        <p className="mt-4 text-muted-foreground">That piece isn't in the collection.</p>
        <ButtonLink to="/shop" className="mt-8">
          Back to shop
        </ButtonLink>
      </div>
    );
  }

  const sizes = product.sizes ?? [{ size: "One size", price: product.basePrice }];
  const selected = sizes[Math.min(sizeIndex, sizes.length - 1)];
  const liked = isWishlisted(product.slug);
  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-border bg-muted shadow-card">
          <img src={product.image} alt={product.alt} className="h-full w-full object-cover" />
        </div>

        <div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            {product.category}
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold">{product.name}</h1>
          <p className="mt-4 text-muted-foreground">{product.description}</p>
          <p className="mt-6 text-3xl font-bold text-primary">{formatRand(selected.price)}</p>

          <div className="mt-8">
            <h2 className="text-sm font-semibold">Colour</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    color === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:text-primary"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold">Size</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {sizes.map((s, i) => (
                <button
                  key={s.size}
                  onClick={() => setSizeIndex(i)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    sizeIndex === i
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:text-primary"
                  )}
                >
                  {s.size} · {formatRand(s.price)}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Need a different fit? Request a custom size on the{" "}
              <Link to="/order" className="text-primary hover:underline">
                custom order
              </Link>{" "}
              page.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="shadow-glow"
              onClick={() => {
                addToCart({
                  slug: product.slug,
                  name: product.name,
                  image: product.image,
                  size: selected.size,
                  color,
                  price: selected.price,
                  qty: 1,
                });
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              }}
            >
              {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              {added ? "Added to cart" : "Add to Cart"}
            </Button>
            <Button size="lg" variant="outline" onClick={() => toggleWishlist(product.slug)}>
              <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
              {liked ? "Saved" : "Save for later"}
            </Button>
          </div>

          <dl className="mt-10 grid gap-4 rounded-2xl border border-border bg-card p-6 text-sm shadow-card sm:grid-cols-2">
            <div>
              <dt className="font-semibold">Made to order</dt>
              <dd className="mt-1 text-muted-foreground">3–7 working days</dd>
            </div>
            <div>
              <dt className="font-semibold">Delivery</dt>
              <dd className="mt-1 text-muted-foreground">2–4 days nationwide</dd>
            </div>
            <div>
              <dt className="font-semibold">Materials</dt>
              <dd className="mt-1 text-muted-foreground">Premium acrylic &amp; cotton yarn</dd>
            </div>
            <div>
              <dt className="font-semibold">Care</dt>
              <dd className="mt-1 text-muted-foreground">Hand wash cool, dry flat</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold">More in {product.category}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
