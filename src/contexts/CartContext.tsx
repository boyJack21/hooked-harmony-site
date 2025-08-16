
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  product_id: string;
  product_title: string;
  product_image: string;
  product_price: string;
  size?: string;
  color?: string;
  quantity: number;
  isLocal?: boolean; // Flag for local cart items
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null); // Simple user state without auth dependency
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      syncLocalCartToDatabase();
      fetchCartItems();
    } else {
      loadLocalCart();
    }
  }, [user]);

  const loadLocalCart = () => {
    try {
      const localCart = localStorage.getItem('cart_items');
      if (localCart) {
        const parsedCart = JSON.parse(localCart);
        setItems(parsedCart.map((item: any) => ({ ...item, isLocal: true })));
      }
    } catch (error) {
      console.error('Error loading local cart:', error);
    }
  };

  const saveLocalCart = (cartItems: CartItem[]) => {
    try {
      const localItems = cartItems.filter(item => item.isLocal);
      localStorage.setItem('cart_items', JSON.stringify(localItems));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  };

  const syncLocalCartToDatabase = async () => {
    if (!user) return;
    
    try {
      const localCart = localStorage.getItem('cart_items');
      if (localCart) {
        const localItems = JSON.parse(localCart);
        
        for (const item of localItems) {
          const { id, isLocal, ...itemData } = item;
          await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              ...itemData,
            });
        }
        
        // Clear local cart after syncing
        localStorage.removeItem('cart_items');
      }
    } catch (error) {
      console.error('Error syncing local cart:', error);
    }
  };

  const fetchCartItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Merge database items with any remaining local items
      const localCart = localStorage.getItem('cart_items');
      let localItems: CartItem[] = [];
      if (localCart) {
        localItems = JSON.parse(localCart).map((item: any) => ({ ...item, isLocal: true }));
      }
      
      setItems([...(data || []), ...localItems]);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    try {
      // Check if item already exists in cart
      const existingItem = items.find(
        (cartItem) => 
          cartItem.product_id === item.product_id && 
          cartItem.size === item.size && 
          cartItem.color === item.color
      );

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + item.quantity);
        return;
      }

      if (user) {
        // Add to database if user is signed in
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            ...item,
          })
          .select()
          .single();

        if (error) throw error;
        setItems(prev => [data, ...prev]);
      } else {
        // Add to local cart if user is not signed in
        const localItem: CartItem = {
          id: `local_${Date.now()}_${Math.random()}`,
          ...item,
          isLocal: true,
        };
        
        const updatedItems = [localItem, ...items];
        setItems(updatedItems);
        saveLocalCart(updatedItems);
      }

      toast({
        title: "Added to Cart",
        description: `${item.product_title} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    try {
      const item = items.find(item => item.id === id);
      
      if (item?.isLocal) {
        // Update local cart item
        const updatedItems = items.map(item => 
          item.id === id ? { ...item, quantity } : item
        );
        setItems(updatedItems);
        saveLocalCart(updatedItems);
      } else {
        // Update database item
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', id);

        if (error) throw error;

        setItems(prev => 
          prev.map(item => 
            item.id === id ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      const item = items.find(item => item.id === id);
      
      if (item?.isLocal) {
        // Remove from local cart
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
        saveLocalCart(updatedItems);
      } else {
        // Remove from database
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setItems(prev => prev.filter(item => item.id !== id));
      }

      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      }

      // Clear local cart as well
      localStorage.removeItem('cart_items');
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      // Extract price from stored string format like "R200.00"
      const priceMatch = item.product_price.match(/[\d.]+/);
      const price = priceMatch ? parseFloat(priceMatch[0]) : 0;
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalItems,
      getTotalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
};
