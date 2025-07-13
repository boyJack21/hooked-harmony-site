import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Shield, Lock, AlertCircle } from 'lucide-react';
import { OrderFormData } from '@/types/order';
import { useYocoSDK } from '@/hooks/useYocoSDK';
import { useInventory } from '@/hooks/useInventory';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentFormProps {
  orderData: OrderFormData;
  amount: number;
  onPaymentSuccess: (paymentId: string, orderId: string) => void;
  onPaymentError: (error: string) => void;
}

interface PaymentOrderData {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  item: string;
  quantity: number;
  color?: string;
  size?: string;
  special_instructions?: string;
}

declare global {
  interface Window {
    YocoSDK: any;
  }
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  orderData,
  amount,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isInStock, getProductPrice } = useInventory();
  
  // Determine environment - you can make this configurable
  const environment: 'test' | 'live' = 'test'; // Change to 'live' for production
  
  const { isLoaded, initializePayment } = useYocoSDK({
    publicKey: environment === 'test' 
      ? 'pk_test_ed3c54a6gOol69qa7f45' 
      : 'pk_live_your_live_key', // Replace with actual live key
    environment
  });

  // Check inventory before allowing payment
  const productInStock = isInStock(orderData.item, orderData.quantity);

  const handlePayment = async () => {
    if (!isLoaded) {
      toast({
        title: "Payment System Not Ready",
        description: "Please wait for the payment system to load and try again.",
        variant: "destructive",
      });
      return;
    }

    if (!productInStock) {
      toast({
        title: "Product Out of Stock",
        description: "Sorry, this item is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Transform orderData to match backend interface
      const paymentOrderData: PaymentOrderData = {
        customer_name: orderData.name,
        customer_email: orderData.email,
        customer_phone: orderData.phone,
        item: orderData.item,
        quantity: orderData.quantity,
        color: orderData.color,
        size: orderData.size,
        special_instructions: orderData.specialInstructions,
      };

      // Create payment intent using Supabase functions
      const response = await fetch(`https://idgsbwbioxdnjazmtedc.supabase.co/functions/v1/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZ3Nid2Jpb3hkbmphem10ZWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNjA5NDcsImV4cCI6MjA2MjYzNjk0N30.xine9hv3iCLsRBIikcvI21FeYX7VKfRrc1C-bBKGPwg`,
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency: 'ZAR',
          environment,
          orderData: paymentOrderData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment');
      }

      const { payment_id, order_id } = await response.json();

      // Use the custom hook for payment initialization
      initializePayment({
        amountInCents: amount * 100,
        currency: 'ZAR',
        name: orderData.name,
        description: `Order: ${orderData.item}`,
        metadata: {
          order_id,
          environment,
          order_data: JSON.stringify(orderData)
        },
        callback: function(result: any) {
          if (result.error) {
            console.error('Yoco payment error:', result.error);
            onPaymentError(result.error.message || 'Payment failed');
            setIsLoading(false);
          } else {
            console.log('Payment successful:', result);
            onPaymentSuccess(result.id, order_id);
            setIsLoading(false);
          }
        }
      });

    } catch (error) {
      console.error('Payment initialization error:', error);
      onPaymentError(error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Order Total:</span>
            <span className="text-lg font-bold">R{amount.toFixed(2)}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {orderData.item} (Qty: {orderData.quantity})
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Secured by Yoco</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span>Your payment information is encrypted and secure</span>
        </div>

        {!productInStock && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This item is currently out of stock and cannot be purchased.
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handlePayment}
          disabled={isLoading || !isLoaded || !productInStock}
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing Payment...
            </div>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay R{amount.toFixed(2)}
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          By proceeding, you agree to our terms and conditions.
        </div>
      </CardContent>
    </Card>
  );
};