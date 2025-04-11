
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ModeToggle";
import MobileNav from "./MobileNav";
import WishlistButton from "@/components/WishlistButton";

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-primary/90 dark:bg-gray-900/90 backdrop-blur-sm transition-all duration-300 ${scrolled ? 'shadow-md py-2' : 'py-4'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold font-playfair text-primary-foreground dark:text-white">
            Everything Hooked
          </Link>

          <nav className="hidden md:flex items-center space-x-6 ml-10">
            <Link to="/" className="text-primary-foreground dark:text-white hover:text-secondary transition-colors">
              Home
            </Link>
            <Link to="/#featured" className="text-primary-foreground dark:text-white hover:text-secondary transition-colors">
              Shop
            </Link>
            <Link to="/#about" className="text-primary-foreground dark:text-white hover:text-secondary transition-colors">
              About
            </Link>
            <Link to="/#faq" className="text-primary-foreground dark:text-white hover:text-secondary transition-colors">
              FAQ
            </Link>
            <Link to="/#contact" className="text-primary-foreground dark:text-white hover:text-secondary transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-2">
            <ModeToggle />
            <WishlistButton />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/order')}>
                  Place an Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
              <MobileNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
