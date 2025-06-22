
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RecentlyViewedItem {
  id: string;
  product_id: string;
  product_title: string;
  product_image: string;
  product_category?: string;
  viewed_at: string;
}

export const useRecentlyViewed = () => {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRecentlyViewed();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchRecentlyViewed = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('recently_viewed')
        .select('*')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching recently viewed:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToRecentlyViewed = async (item: {
    product_id: string;
    product_title: string;
    product_image: string;
    product_category?: string;
  }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('recently_viewed')
        .upsert({
          user_id: user.id,
          ...item,
          viewed_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      // Refresh the list
      fetchRecentlyViewed();
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
    }
  };

  return {
    items,
    loading,
    addToRecentlyViewed,
  };
};
