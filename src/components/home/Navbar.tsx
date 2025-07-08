
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/ModeToggle';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import MobileNav from './MobileNav';

interface NavbarProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  showSearch?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  searchTerm = '', 
  onSearchChange,
  showSearch = false 
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(showSearch);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { wishlistItems } = useWishlist();
  const { user, signOut } = useAuth();
  const { getTotalItems } = useCart();

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen && onSearchChange) {
      onSearchChange('');
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="font-playfair text-xl font-bold hidden sm:block">
                EverythingHooked
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            {isSearchOpen && onSearchChange && (
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for handmade treasures..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 pr-4"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={handleSearchToggle}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Right side icons */}
            <div className="flex items-center space-x-2">
              {/* Search toggle - only show if onSearchChange is provided */}
              {onSearchChange && !isSearchOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSearchToggle}
                  className="hidden md:flex"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}

              {/* Wishlist */}
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistItems.length > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {wishlistItems.length}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Shopping Cart */}
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {user && getTotalItems() > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {getTotalItems()}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* User Account */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/cart">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Cart ({getTotalItems()})
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist">
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist ({wishlistItems.length})
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}

              {/* Theme Toggle */}
              <ModeToggle />

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && onSearchChange && (
            <div className="md:hidden pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for handmade treasures..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Navbar;
