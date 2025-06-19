
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
  const [sdkError, setSdkError] = useState<string | null>(null);
  const { toast } = useToast();

  const amount = calculateOrderAmount(formData);
  const displayAmount = (amount / 100).toFixed(2);

  useEffect(() => {
    // Check if Yoco SDK is already loaded
    if (window.YocoSDK) {
      console.log('Yoco SDK already available');
      setYocoLoaded(true);
      return;
    }

    // Load Yoco SDK
    const script = document.createElement('script');
    script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Yoco SDK loaded successfully');
      setYocoLoaded(true);
      setSdkError(null);
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Yoco SDK:', error);
      setSdkError('Failed to load payment system. Please check your internet connection.');
      setYocoLoaded(false);
    };
    
    document.head.appendChild(script);

    return () => {
      // Only remove if we added it
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!yocoLoaded || !window.YocoSDK) {
      onPaymentError('Payment system not ready. Please wait a moment and try again.');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Creating payment for order:', formData);
      console.log('Calculated amount:', amount, 'cents (R' + displayAmount + ')');
      
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
        console.error('Missing public key in response:', paymentResponse);
        throw new Error('Payment configuration error. Please contact support.');
      }

      if (!order_id) {
        console.error('Missing order ID in response:', paymentResponse);
        throw new Error('Order creation failed. Please try again.');
      }

      console.log('Initializing Yoco SDK with public key');

      // Initialize Yoco SDK
      const yoco = new window.YocoSDK({
        publicKey: public_key
      });

      console.log('Opening Yoco payment popup');

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
        console.log('Yoco popup result:', result);
        
        if (result.error) {
          console.error('Yoco payment error:', result.error);
          onPaymentError(result.error.message || 'Payment failed. Please try again.');
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
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed. Please try again.';
      onPaymentError(errorMessage);
      setIsProcessing(false);
    }
  };

  if (sdkError) {
    return (
      <div className="mt-6 p-4 border rounded-lg bg-red-50 border-red-200">
        <div className="text-red-600 text-center">
          <p className="font-medium">Payment System Error</p>
          <p className="text-sm mt-1">{sdkError}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

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
        {formData.size && (
          <div className="flex justify-between">
            <span>Size:</span>
            <span>{formData.size}</span>
          </div>
        )}
        {formData.color && (
          <div className="flex justify-between">
            <span>Color:</span>
            <span>{formData.color}</span>
          </div>
        )}
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
        ) : !yocoLoaded ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading Payment System...
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
