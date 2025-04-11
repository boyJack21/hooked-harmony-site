
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/contexts/WishlistContext';

interface WishlistButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  variant = "ghost", 
  size = "icon" 
}) => {
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  
  return (
    <Button 
      variant={variant} 
      size={size}
      className="relative"
      onClick={() => navigate('/wishlist')}
      aria-label="View wishlist"
    >
      <Heart className="h-5 w-5" />
      {wishlistItems.length > 0 && (
        <Badge 
          className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white border-none rounded-full"
          variant="destructive"
        >
          {wishlistItems.length}
        </Badge>
      )}
    </Button>
  );
};

export default WishlistButton;
