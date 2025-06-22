
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/ui/lazy-image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useAuth } from '@/contexts/AuthContext';

const RecentlyViewed = () => {
  const { items, loading } = useRecentlyViewed();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || items.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <LoadingSpinner size="md" className="h-32" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recently Viewed
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {items.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer group"
                  onClick={() => navigate(`/product/${item.product_id}`, {
                    state: { 
                      product: {
                        id: item.product_id,
                        title: item.product_title,
                        imageSrc: item.product_image,
                        category: item.product_category,
                      }
                    }
                  })}
                >
                  <div className="aspect-square mb-2">
                    <LazyImage
                      src={item.product_image}
                      alt={item.product_title}
                      className="w-full h-full rounded-md group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  
                  <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {item.product_title}
                  </h4>
                </div>
              ))}
            </div>
            
            {items.length > 6 && (
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RecentlyViewed;
