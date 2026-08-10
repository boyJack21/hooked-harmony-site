import { useRoutes, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Patterns from "@/pages/Patterns";
import PatternDetail from "@/pages/PatternDetail";
import Tutorials from "@/pages/Tutorials";
import Makers from "@/pages/Makers";
import Contact from "@/pages/Contact";

function App() {
  return useRoutes([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/patterns", element: <Patterns /> },
        { path: "/patterns/:slug", element: <PatternDetail /> },
        { path: "/tutorials", element: <Tutorials /> },
        { path: "/makers", element: <Makers /> },
        { path: "/contact", element: <Contact /> },
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
  ]);
}

export default App;
