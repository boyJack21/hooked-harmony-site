import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Shield, Lock } from 'lucide-react';
import { OrderFormData } from '@/types/order';

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
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load Yoco SDK
    const script = document.createElement('script');
    script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
    script.async = true;
    script.onload = () => {
      setSdkLoaded(true);
    };
    script.onerror = () => {
      toast({
        title: "Payment System Error",
        description: "Failed to load payment system. Please refresh and try again.",
        variant: "destructive",
      });
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [toast]);

  const handlePayment = async () => {
    if (!sdkLoaded || !window.YocoSDK) {
      toast({
        title: "Payment System Not Ready",
        description: "Please wait for the payment system to load and try again.",
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
          orderData: paymentOrderData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const { payment_id, checkout_url } = await response.json();

      // Initialize Yoco checkout
      const yoco = new window.YocoSDK({
        publicKey: process.env.REACT_APP_YOCO_PUBLIC_KEY || 'pk_test_ed3c54a6gOol69qa7f45',
      });

      yoco.showPopup({
        amountInCents: amount * 100,
        currency: 'ZAR',
        name: orderData.name,
        description: `Order: ${orderData.item}`,
        metadata: {
          order_data: JSON.stringify(orderData)
        },
        callback: function(result: any) {
          if (result.error) {
            console.error('Yoco payment error:', result.error);
            onPaymentError(result.error.message || 'Payment failed');
            setIsLoading(false);
          } else {
            console.log('Payment successful:', result);
            onPaymentSuccess(result.id, payment_id);
            setIsLoading(false);
          }
        }
      });

    } catch (error) {
      console.error('Payment initialization error:', error);
      onPaymentError('Failed to initialize payment. Please try again.');
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

        <Button
          onClick={handlePayment}
          disabled={isLoading || !sdkLoaded}
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