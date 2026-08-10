import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShop } from "@/lib/shop";
import type { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted } = useShop();
  const liked = isWishlisted(product.slug);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-transform duration-300 hover:-translate-y-1">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <button
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => toggleWishlist(product.slug)}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur transition-colors hover:bg-background"
      >
        <Heart
          className={cn("h-4 w-4", liked ? "text-primary" : "text-muted-foreground")}
          fill={liked ? "currentColor" : "none"}
        />
      </button>

      <div className="space-y-2 p-4">
        <h3 className="font-display text-lg font-semibold leading-tight">
          <Link to={`/product/${product.slug}`} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
        <p className="pt-1 text-sm font-semibold text-primary">{product.priceLabel}</p>
      </div>
    </article>
  );
}
