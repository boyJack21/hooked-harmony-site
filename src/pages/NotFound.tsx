
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-6xl font-bold mb-6 text-primary">404</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Link 
            to="/" 
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
