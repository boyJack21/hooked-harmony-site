import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  qty: number;
};

type ShopState = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  cartCount: number;
  cartTotal: number;
};

const ShopContext = createContext<ShopState | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => read("eh:cart", []));
  const [wishlist, setWishlist] = useState<string[]>(() => read("eh:wishlist", []));

  useEffect(() => {
    localStorage.setItem("eh:cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("eh:wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = useCallback((item: Omit<CartItem, "id">) => {
    const id = `${item.slug}-${item.size}-${item.color}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + item.qty } : i));
      }
      return [...prev, { ...item, id }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const value = useMemo<ShopState>(() => {
    return {
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      toggleWishlist,
      isWishlisted: (slug: string) => wishlist.includes(slug),
      cartCount: cart.reduce((n, i) => n + i.qty, 0),
      cartTotal: cart.reduce((n, i) => n + i.qty * i.price, 0),
    };
  }, [cart, wishlist, addToCart, removeFromCart, setQty, clearCart, toggleWishlist]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}

export function defaultVariant(product: Product) {
  const first = product.sizes?.[0];
  return { size: first?.size ?? "One size", price: first?.price ?? product.basePrice };
}
