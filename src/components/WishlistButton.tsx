
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { ProductItem } from '@/components/home/FeaturedItem';

interface WishlistButtonProps {
  item: ProductItem;
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ item, className }) => {
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  
  const isInWishlist = wishlistItems.some(wishlistItem => wishlistItem.id === item.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`p-2 bg-white/80 hover:bg-white/90 ${className}`}
      onClick={handleToggle}
    >
      <Heart 
        className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
      />
    </Button>
  );
};

export default WishlistButton;
