import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CartSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
}

export const CartSuccessModal: React.FC<CartSuccessModalProps> = ({
  isOpen,
  onClose,
  productTitle,
}) => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    onClose();
  };

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            Added to Cart!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            <strong>{productTitle}</strong> has been added to your cart.
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={handleCheckout}
              className="w-full"
              size="lg"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Go to Checkout
            </Button>
            
            <Button
              onClick={handleContinueShopping}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};