
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface PaymentSummaryProps {
  totalAmount: number;
  isProcessing: boolean;
  loadingYoco?: boolean;
  onPay: () => void;
  paymentMethod: string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  totalAmount,
  isProcessing,
  loadingYoco,
  onPay,
  paymentMethod
}) => {
  return (
    <div className="flex justify-between items-center pt-2">
      <div>
        <p className="text-sm text-muted-foreground">Total Amount</p>
        <p className="text-xl font-semibold">R{totalAmount.toFixed(2)}</p>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {paymentMethod === 'credit_card' ? (
          <Button 
            type="button" 
            size="lg"
            disabled={isProcessing || loadingYoco}
            onClick={onPay}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Processing...
              </span>
            ) : loadingYoco ? (
              <span className="flex items-center">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Loading payment provider...
              </span>
            ) : (
              <span className="flex items-center">
                Pay with Card <CheckCircle className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        ) : (
          <Button 
            type="submit" 
            size="lg"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                Complete Payment <CheckCircle className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSummary;
