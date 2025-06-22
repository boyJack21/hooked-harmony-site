
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { Analytics } from "@vercel/analytics/react";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Order from "./pages/Order";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Enhanced404 from "./pages/Enhanced404";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/order" element={<Order />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />
                  {/* Catch-all route for 404 */}
                  <Route path="*" element={<Enhanced404 />} />
                </Routes>
              </BrowserRouter>
              <Analytics />
            </TooltipProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
