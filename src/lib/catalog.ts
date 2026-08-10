import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";

export type FeaturedProduct = Product & {
  heroImage: string;
  blurb: string;
  price: number;
};

type ProductsState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  featuredProduct: FeaturedProduct | null;
};

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

export function useProducts(): ProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/api/products`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Products request failed with ${response.status}`);
        }

        const data = (await response.json()) as Product[];
        setProducts(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  const featuredProduct = useMemo(() => {
    const product =
      products.find((p) => p.slug === "pink-ruffle-hat") ??
      products.find((p) => p.slug === "classic-crochet-bag") ??
      products[0];

    if (!product) return null;

    return {
      ...product,
      heroImage: product.image,
      blurb:
        "Handcrafted with premium materials, this piece adds a touch of crochet charm to any outfit.",
      price: product.basePrice,
    };
  }, [products]);

  return { products, loading, error, featuredProduct };
}

export function productsByCategory(products: Product[], name: string) {
  return products.filter((p) => p.category === name);
}

export function findProduct(products: Product[], slug: string) {
  return products.find((p) => p.slug === slug);
}
