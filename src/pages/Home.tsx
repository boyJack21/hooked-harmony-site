import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Heart, ShoppingBag, Sparkles, Star } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Button, ButtonLink } from "@/components/ui/Button";
import {
  categories,
  formatRand,
} from "@/data/products";
import { productsByCategory, useProducts } from "@/lib/catalog";
import { useShop } from "@/lib/shop";

export default function Home() {
  const { addToCart } = useShop();
  const { products, loading, error, featuredProduct } = useProducts();
  const categoryProducts = featuredProduct
    ? products.filter((product) => product.slug !== featuredProduct.slug)
    : products;

  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
        <div className="mx-auto w-full max-w-4xl px-4 py-20 text-center sm:px-6">
          <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium shadow-card backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            Handcrafted with Love
            <Star className="h-4 w-4 text-primary" fill="currentColor" />
          </span>

          <h1 className="mt-8 animate-fade-up font-display text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">
            Everything
            <br />
            <span className="text-accent">Hooked</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl animate-fade-up text-lg text-muted-foreground">
            Discover unique crochet pieces crafted with premium materials and
            attention to every stitch
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink to="/shop" size="lg" className="shadow-glow">
              <Heart className="h-4 w-4" fill="currentColor" />
              Shop Our Creations
            </ButtonLink>
            <ButtonLink to="/order" size="lg" variant="outline" className="bg-background">
              <ShoppingBag className="h-4 w-4" />
              Custom Order
            </ButtonLink>
          </div>

          <a
            href="#collection"
            className="mt-16 inline-flex flex-col items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            Explore Collection
            <span className="flex h-9 w-6 items-start justify-center rounded-full border border-border pt-1">
              <ChevronDown className="h-4 w-4 animate-float" />
            </span>
          </a>
        </div>
      </section>

      {/* Collections */}
      <section id="collection" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold">Our Collections</h2>
          <p className="mt-4 text-muted-foreground">
            Every piece is made to order — choose your colour, choose your size, and
            we'll hook it up just for you.
          </p>
        </header>

        <div className="mt-14 space-y-16">
          {loading && <p className="text-center text-sm text-muted-foreground">Loading products...</p>}
          {!loading && !error && categories.map((category) => {
            const items = productsByCategory(categoryProducts, category.name);
            if (!items.length) return null;
            return (
              <div key={category.slug}>
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-2xl font-bold">{category.name}</h3>
                    {category.badge && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {category.badge}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/shop?category=${category.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.slice(0, 3).map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      {featuredProduct && (
      <section className="bg-muted/40 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-border shadow-card">
            <img
              src={featuredProduct.heroImage}
              alt={featuredProduct.alt}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Featured piece
            </span>
            <h2 className="mt-5 font-display text-4xl font-bold">
              {featuredProduct.name}
            </h2>
            <p className="mt-4 text-muted-foreground">{featuredProduct.blurb}</p>
            <p className="mt-6 text-3xl font-bold text-primary">
              {formatRand(featuredProduct.price)}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="shadow-glow"
                onClick={() =>
                  addToCart({
                    slug: featuredProduct.slug,
                    name: featuredProduct.name,
                    image: featuredProduct.image,
                    size: "One size",
                    color: "Pink",
                    price: featuredProduct.price,
                    qty: 1,
                  })
                }
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </Button>
              <ButtonLink
                to={`/product/${featuredProduct.slug}`}
                size="lg"
                variant="outline"
              >
                View Details
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Why us */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              title: "Handmade to order",
              body: "Nothing sits in a warehouse. Your piece is hooked from scratch once you order.",
            },
            {
              title: "Premium yarn",
              body: "Soft, durable yarns chosen to hold their shape and colour wash after wash.",
            },
            {
              title: "Made your way",
              body: "Pick your colour and size, or send us a custom design and we'll make it real.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-card p-8 shadow-card"
            >
              <h3 className="font-display text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
