
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ModeToggle";
import { useWishlist } from "@/contexts/WishlistContext";

const MobileNav = () => {
  const navigate = useNavigate();
  const { wishlistItems } = useWishlist();
  
  return (
    <div className="flex flex-col h-full py-6">
      <div className="flex items-center mb-8">
        <ModeToggle />
        <span className="ml-3 text-lg font-medium">Theme</span>
      </div>
      
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="text-lg font-medium py-2 px-4 hover:bg-accent rounded-md transition-colors">
          Home
        </Link>
        <Link to="/#featured" className="text-lg font-medium py-2 px-4 hover:bg-accent rounded-md transition-colors">
          Shop
        </Link>
        <Link to="/#about" className="text-lg font-medium py-2 px-4 hover:bg-accent rounded-md transition-colors">
          About
        </Link>
        <Link to="/#faq" className="text-lg font-medium py-2 px-4 hover:bg-accent rounded-md transition-colors">
          FAQ
        </Link>
        <Link to="/#contact" className="text-lg font-medium py-2 px-4 hover:bg-accent rounded-md transition-colors">
          Contact
        </Link>
      </nav>
      
      <Separator className="my-6" />
      
      <div className="flex flex-col space-y-4">
        <Link 
          to="/wishlist" 
          className="flex items-center text-lg font-medium py-2 px-4 hover:bg-accent rounded-md transition-colors"
        >
          <Heart className="mr-2 h-5 w-5" />
          Wishlist
          {wishlistItems.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full">
              {wishlistItems.length}
            </span>
          )}
        </Link>
        <Link 
          to="/order" 
          className="flex items-center text-lg font-medium py-2 px-4 hover:bg-accent rounded-md transition-colors"
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Place an Order
        </Link>
      </div>
      
      <div className="mt-auto pt-6">
        <div className="text-sm text-muted-foreground text-center">
          Everything Hooked
          <br />
          Handcrafted Crochet Creations
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
