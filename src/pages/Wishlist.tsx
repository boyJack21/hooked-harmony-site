import ProductCard from "@/components/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { useShop } from "@/lib/shop";
import { products } from "@/data/products";

export default function Wishlist() {
  const { wishlist } = useShop();
  const saved = products.filter((p) => wishlist.includes(p.slug));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Your wishlist</h1>

      {saved.length === 0 ? (
        <div className="mt-8">
          <p className="text-muted-foreground">
            You haven't saved anything yet. Tap the heart on any piece to keep it here.
          </p>
          <ButtonLink to="/shop" size="lg" className="mt-8">
            Browse the collection
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
