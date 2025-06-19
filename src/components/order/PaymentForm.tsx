
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { OrderFormData } from '@/types/order';
import { createPayment, calculateOrderAmount } from '@/services/paymentService';
import { CreditCard, Loader2 } from 'lucide-react';

interface PaymentFormProps {
  formData: OrderFormData;
  onPaymentSuccess: (orderId: string) => void;
  onPaymentError: (error: string) => void;
}

declare global {
  interface Window {
    YocoSDK: any;
  }
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  formData,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [yocoLoaded, setYocoLoaded] = useState(false);
  const { toast } = useToast();

  const amount = calculateOrderAmount(formData);
  const displayAmount = (amount / 100).toFixed(2);

  useEffect(() => {
    // Load Yoco SDK
    const script = document.createElement('script');
    script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
    script.onload = () => setYocoLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Yoco SDK');
      onPaymentError('Failed to load payment system');
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [onPaymentError]);

  const handlePayment = async () => {
    if (!yocoLoaded || !window.YocoSDK) {
      onPaymentError('Payment system not ready');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Creating payment for order:', formData);
      
      // Create order and get public key
      const paymentResponse = await createPayment({
        orderData: formData,
        amount
      });

      console.log('Payment response received:', paymentResponse);

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.error || 'Failed to create payment');
      }

      const { public_key, order_id } = paymentResponse;

      if (!public_key) {
        throw new Error('Missing public key in payment response');
      }

      if (!order_id) {
        throw new Error('Missing order ID in payment response');
      }

      console.log('Initializing Yoco SDK with public key');

      // Initialize Yoco SDK
      const yoco = new window.YocoSDK({
        publicKey: public_key
      });

      // Open Yoco popup
      yoco.showPopup({
        amountInCents: amount,
        currency: 'ZAR',
        name: 'Everything Hooked',
        description: `Order for ${formData.item}`,
        metadata: {
          order_id: order_id,
          customer_email: formData.email,
          customer_name: formData.name
        }
      }, (result: any) => {
        if (result.error) {
          console.error('Yoco payment error:', result.error);
          onPaymentError(result.error.message || 'Payment failed');
        } else {
          console.log('Payment successful:', result);
          toast({
            title: "Payment Successful!",
            description: `Your order #${order_id.slice(-6)} has been paid for successfully.`,
          });
          onPaymentSuccess(order_id);
        }
        setIsProcessing(false);
      });

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      onPaymentError(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span>Item:</span>
          <span>{formData.item}</span>
        </div>
        <div className="flex justify-between">
          <span>Quantity:</span>
          <span>{formData.quantity}</span>
        </div>
        <div className="flex justify-between">
          <span>Size:</span>
          <span>{formData.size}</span>
        </div>
        <div className="flex justify-between">
          <span>Color:</span>
          <span>{formData.color}</span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total:</span>
          <span>R{displayAmount}</span>
        </div>
      </div>

      <Button 
        onClick={handlePayment}
        disabled={isProcessing || !yocoLoaded}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Pay R{displayAmount}
          </div>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground mt-2">
        Secure payment powered by Yoco
      </p>
    </div>
  );
};
