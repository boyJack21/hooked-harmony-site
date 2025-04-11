
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { Analytics } from "@vercel/analytics/react";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Index from "./pages/Index";
import Order from "./pages/Order";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <WishlistProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/order" element={<Order />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/wishlist" element={<Wishlist />} />
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Analytics />
        </TooltipProvider>
      </WishlistProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
