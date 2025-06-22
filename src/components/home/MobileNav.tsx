
import React from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingCart, User, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { wishlistItems } = useWishlist();
  const { user, signOut } = useAuth();
  const { getTotalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Menu</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-4">
          <Link 
            to="/" 
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
            onClick={onClose}
          >
            <Home className="h-5 w-5" />
            Home
          </Link>
          
          <Link 
            to="/wishlist" 
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
            onClick={onClose}
          >
            <Heart className="h-5 w-5" />
            Wishlist ({wishlistItems.length})
          </Link>
          
          <Link 
            to="/cart" 
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
            onClick={onClose}
          >
            <ShoppingCart className="h-5 w-5" />
            Cart ({user ? getTotalItems() : 0})
          </Link>
          
          {user ? (
            <div className="space-y-2">
              <div className="p-2 text-sm text-gray-600">
                Signed in as {user.email}
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start p-2"
                onClick={() => {
                  signOut();
                  onClose();
                }}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
              onClick={onClose}
            >
              <User className="h-5 w-5" />
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
