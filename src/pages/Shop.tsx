import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";
import { useProducts } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const active = params.get("category") ?? "all";
  const { products, loading, error } = useProducts();

  const visible = useMemo(() => {
    if (active === "all") return products;
    const match = categories.find((c) => c.slug === active);
    return match ? products.filter((p) => p.category === match.name) : products;
  }, [active, products]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold">Shop the collection</h1>
        <p className="mt-4 text-muted-foreground">
          Cardigans, shirts, tops, beanies and more — all handmade to order.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        {[{ name: "All", slug: "all" }, ...categories].map((c) => (
          <button
            key={c.slug}
            onClick={() =>
              setParams(c.slug === "all" ? {} : { category: c.slug }, { replace: true })
            }
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active === c.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-primary"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading && <p className="mt-10 text-sm text-muted-foreground">Loading products...</p>}
      {!loading && !error && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
