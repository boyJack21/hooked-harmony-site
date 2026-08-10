import { useRoutes, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ShopProvider } from "@/lib/shop";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Wishlist from "@/pages/Wishlist";
import CustomOrder from "@/pages/CustomOrder";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

function App() {
  const routes = useRoutes([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/shop", element: <Shop /> },
        { path: "/product/:slug", element: <ProductDetail /> },
        { path: "/cart", element: <Cart /> },
        { path: "/wishlist", element: <Wishlist /> },
        { path: "/order", element: <CustomOrder /> },
        { path: "/about", element: <About /> },
        { path: "/contact", element: <Contact /> },
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
  ]);

  return <ShopProvider>{routes}</ShopProvider>;
}

export default App;
