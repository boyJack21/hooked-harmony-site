
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { OrderFormData } from '@/types/order';
import { createPayment, calculateOrderAmount } from '@/services/paymentService';
import { CreditCard, Loader2, Shield, Clock } from 'lucide-react';

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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { toast } = useToast();

  // Calculate amount dynamically and log for debugging
  const amount = calculateOrderAmount(formData);
  const displayAmount = (amount / 100).toFixed(2);

  // Log the calculation for mobile debugging
  console.log('PaymentForm - Form data:', formData);
  console.log('PaymentForm - Calculated amount:', amount, 'cents');
  console.log('PaymentForm - Display amount: R' + displayAmount);

  useEffect(() => {
    // Check if Yoco SDK is already loaded
    if (window.YocoSDK) {
      console.log('Yoco SDK already available');
      setYocoLoaded(true);
      setLoadingProgress(100);
      return;
    }

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    // Load Yoco SDK
    const script = document.createElement('script');
    script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Yoco SDK loaded successfully');
      setYocoLoaded(true);
      setSdkError(null);
      setLoadingProgress(100);
      clearInterval(progressInterval);
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Yoco SDK:', error);
      setSdkError('Failed to load payment system. Please check your internet connection.');
      setYocoLoaded(false);
      setLoadingProgress(0);
      clearInterval(progressInterval);
    };
    
    document.head.appendChild(script);

    return () => {
      clearInterval(progressInterval);
      // Only remove if we added it
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    console.log('handlePayment called - checking prerequisites');
    console.log('yocoLoaded:', yocoLoaded);
    console.log('window.YocoSDK:', !!window.YocoSDK);
    
    if (!yocoLoaded || !window.YocoSDK) {
      console.log('Payment system not ready, showing error');
      onPaymentError('Payment system not ready. Please wait a moment and try again.');
      return;
    }

    console.log('Starting payment process');
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
            title: "Payment Successful! 🎉",
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
      <div className="mt-4 md:mt-6 p-4 md:p-6 border rounded-lg bg-red-50 border-red-200">
        <div className="text-red-600 text-center space-y-3">
          <div className="flex items-center justify-center">
            <Clock className="h-5 w-5 mr-2" />
            <p className="font-medium text-sm md:text-base">Payment System Error</p>
          </div>
          <p className="text-xs md:text-sm">{sdkError}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-100"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 md:mt-6 p-4 md:p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center mb-4">
        <Shield className="h-5 w-5 text-green-600 mr-2" />
        <h3 className="text-lg md:text-xl font-semibold">Secure Payment</h3>
      </div>
      
      {!yocoLoaded && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Loading payment system...</span>
            <span>{loadingProgress}%</span>
          </div>
          <Progress value={loadingProgress} className="h-2" />
        </div>
      )}
      
      <div className="space-y-3 mb-4 text-sm md:text-base">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-muted-foreground">Item:</span>
          <span className="font-medium">{formData.item}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-muted-foreground">Quantity:</span>
          <span className="font-medium">{formData.quantity}</span>
        </div>
        {formData.size && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-muted-foreground">Size:</span>
            <span className="font-medium uppercase">{formData.size}</span>
          </div>
        )}
        {formData.color && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-muted-foreground">Color:</span>
            <span className="font-medium">{formData.color}</span>
          </div>
        )}
        <div className="flex justify-between items-center font-semibold text-lg md:text-xl pt-3 border-t-2 border-gray-200">
          <span>Total:</span>
          <span className="text-green-600">R{displayAmount}</span>
        </div>
      </div>

      <Button 
        onClick={handlePayment}
        disabled={isProcessing || !yocoLoaded}
        className="w-full text-sm md:text-base bg-green-600 hover:bg-green-700 transition-all duration-200"
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
            Pay R{displayAmount} Securely
          </div>
        )}
      </Button>

      <div className="mt-3 flex items-center justify-center text-xs text-muted-foreground">
        <Shield className="h-3 w-3 mr-1" />
        <span>Secure payment powered by Yoco • SSL encrypted</span>
      </div>
    </div>
  );
};
