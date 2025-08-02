import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InventoryItem {
  id: string;
  product_id: string;
  product_name: string;
  stock_quantity: number;
  price_cents: number;
  created_at: string;
  updated_at: string;
}

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('product_name');

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getProductStock = (productId: string): number => {
    const item = inventory.find(i => i.product_id === productId);
    return item?.stock_quantity || 0;
  };

  const getProductPrice = (productId: string): number => {
    const item = inventory.find(i => i.product_id === productId);
    return item?.price_cents || 0;
  };

  const isInStock = (productId: string, quantity: number = 1): boolean => {
    const stock = getProductStock(productId);
    return stock >= quantity;
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Listen for real-time inventory updates
  useEffect(() => {
    // Create unique channel name to avoid subscription conflicts
    const channelName = `inventory-changes-${Math.random().toString(36).substr(2, 9)}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory'
        },
        () => {
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    inventory,
    loading,
    getProductStock,
    getProductPrice,
    isInStock,
    refetch: fetchInventory,
  };
};