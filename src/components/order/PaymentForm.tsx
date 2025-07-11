
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { OrderFormData } from '@/types/order';
import { createPayment, calculateOrderAmount } from '@/services/paymentService';
import { CreditCard, Loader2, Shield } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

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

  // Calculate amount
  const amount = calculateOrderAmount(formData);
  const displayAmount = (amount / 100).toFixed(2);

  console.log('PaymentForm initialized - Amount:', amount, 'Display:', displayAmount);

  useEffect(() => {
    const loadYocoSDK = async () => {
      try {
        // Check if already loaded
        if (window.YocoSDK) {
          console.log('Yoco SDK already available');
          setYocoLoaded(true);
          return;
        }

        console.log('Loading Yoco SDK...');
        
        // Check if script already exists
        const existingScript = document.querySelector('script[src*="yoco-sdk-web.js"]');
        if (existingScript) {
          console.log('Yoco script already exists in DOM');
          // Wait for it to load
          if (window.YocoSDK) {
            setYocoLoaded(true);
            return;
          }
        }
        
        // Load Yoco SDK
        const script = document.createElement('script');
        script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
        script.async = true;
        
        const loadPromise = new Promise((resolve, reject) => {
          script.onload = () => {
            console.log('Yoco SDK script loaded');
            // Check if SDK is actually available
            setTimeout(() => {
              if (window.YocoSDK) {
                console.log('Yoco SDK is now available');
                setYocoLoaded(true);
                resolve(true);
              } else {
                console.error('Yoco SDK script loaded but window.YocoSDK is undefined');
                reject(new Error('Yoco SDK not available after script load'));
              }
            }, 100);
          };
          
          script.onerror = (error) => {
            console.error('Failed to load Yoco SDK script:', error);
            reject(new Error('Failed to load payment system'));
          };
        });
        
        if (!existingScript) {
          document.head.appendChild(script);
        }
        await loadPromise;
        
      } catch (error) {
        console.error('Error loading Yoco SDK:', error);
        onPaymentError('Failed to load payment system. Please check your internet connection and disable ad blockers, then refresh and try again.');
      }
    };

    loadYocoSDK();
  }, [onPaymentError]);

  const handlePayment = async () => {
    if (!yocoLoaded || !window.YocoSDK) {
      onPaymentError('Payment system not ready. Please wait and try again.');
      return;
    }

    setIsProcessing(true);
    console.log('Starting payment process...');

    try {
      // Create payment order
      console.log('Creating payment order...');
      const paymentResponse = await createPayment({
        orderData: formData,
        amount
      });

      console.log('Payment response:', paymentResponse);

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.error || 'Failed to create payment order');
      }

      const { public_key, order_id } = paymentResponse;

      if (!public_key || !order_id) {
        throw new Error('Missing payment configuration');
      }

      console.log('Initializing Yoco checkout with public key:', public_key);

      // Validate public key format
      if (!public_key.startsWith('pk_')) {
        throw new Error('Invalid Yoco public key format');
      }

      // Initialize Yoco SDK
      let yoco;
      try {
        yoco = new window.YocoSDK({
          publicKey: public_key
        });
        console.log('Yoco SDK initialized successfully');
      } catch (sdkError) {
        console.error('Failed to initialize Yoco SDK:', sdkError);
        throw new Error('Failed to initialize payment system');
      }

      // Set a timeout to prevent infinite processing
      const paymentTimeout = setTimeout(() => {
        console.warn('Payment timeout - checking order status...');
        setIsProcessing(false);
        // Don't immediately error - the payment might have succeeded but callback failed
        toast({
          title: "Payment Processing...",
          description: "Checking payment status. Please wait a moment.",
        });
        
        // Give it a bit more time then check order status or prompt user
        setTimeout(() => {
          onPaymentError('Payment is taking longer than expected. Please check your bank account or try again.');
        }, 5000);
      }, 45000); // 45 second timeout
      
      // Show payment popup with better error handling
      try {
        console.log('Attempting to show Yoco popup...');
        
        // Get current origin for redirect URLs
        const origin = window.location.origin;
        
        yoco.showPopup({
          amountInCents: amount,
          currency: 'ZAR',
          name: 'EverythingHooked',
          description: `${formData.item} - Qty: ${formData.quantity}`,
          // Add redirect URLs for 3D Secure handling
          successUrl: `${origin}/order?payment=success&order_id=${order_id}`,
          cancelUrl: `${origin}/order?payment=cancelled&order_id=${order_id}`,
          failureUrl: `${origin}/order?payment=failed&order_id=${order_id}`,
          metadata: {
            order_id,
            customer_email: formData.email,
            customer_name: formData.name,
            item: formData.item
          }
        }, async (result: any) => {
        clearTimeout(paymentTimeout);
        console.log('Payment callback triggered with result:', JSON.stringify(result, null, 2));
        
        // Always reset processing state
        setIsProcessing(false);
        
        // Check for different possible result structures
        if (result && result.error) {
          console.error('Payment failed with error:', result.error);
          onPaymentError(`Payment failed: ${result.error.message || result.error || 'Unknown error'}`);
        } else if (result && (result.id || result.payment_id || result.token)) {
          // Payment appears successful - verify with backend
          console.log('Payment callback successful, verifying...', result.id || result.payment_id || result.token);
          
          try {
            const { data, error } = await supabase.functions.invoke('verify-payment', {
              body: { orderId: order_id }
            });

            if (error) throw error;

            if (data.status === 'successful') {
              toast({
                title: "Payment Successful! 🎉",
                description: `Order #${order_id.slice(-6)} has been processed successfully.`,
              });
              onPaymentSuccess(order_id);
            } else {
              onPaymentError(`Payment verification failed: ${data.status}`);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onPaymentError('Payment verification failed. Please contact support with your order reference.');
          }
        } else if (result === null || result === undefined) {
          // User likely cancelled or closed popup
          console.log('Payment cancelled or popup closed');
          onPaymentError('Payment was cancelled. Please try again if you wish to complete your order.');
        } else {
          // Unexpected result structure - try to verify anyway
          console.warn('Unexpected payment result structure, attempting verification:', result);
          
          try {
            const { data, error } = await supabase.functions.invoke('verify-payment', {
              body: { orderId: order_id }
            });

            if (error) throw error;

            if (data.status === 'successful') {
              toast({
                title: "Payment Successful! 🎉",
                description: `Order #${order_id.slice(-6)} has been processed successfully.`,
              });
              onPaymentSuccess(order_id);
            } else {
              onPaymentError('Payment status unclear. Please contact support with your order reference.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onPaymentError('Payment verification failed. Please contact support with your order reference.');
          }
        }
      });
      
      console.log('Yoco popup should now be visible to user');
      
    } catch (popupError) {
      clearTimeout(paymentTimeout);
      console.error('Error showing payment popup:', popupError);
      setIsProcessing(false);
      onPaymentError('Failed to open payment window. Please ensure popups are enabled and try again.');
    }

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      onPaymentError(errorMessage);
      setIsProcessing(false);
    }
  };

  if (!yocoLoaded) {
    return (
      <div className="mt-6 p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center justify-center">
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          <span>Loading secure payment system...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center mb-4">
        <Shield className="h-5 w-5 text-green-600 mr-2" />
        <h3 className="text-xl font-semibold">Secure Payment</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between py-2 border-b">
          <span className="text-muted-foreground">Item:</span>
          <span className="font-medium">{formData.item}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="text-muted-foreground">Quantity:</span>
          <span className="font-medium">{formData.quantity}</span>
        </div>
        {formData.size && (
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Size:</span>
            <span className="font-medium uppercase">{formData.size}</span>
          </div>
        )}
        {formData.color && (
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Color:</span>
            <span className="font-medium">{formData.color}</span>
          </div>
        )}
        <div className="flex justify-between items-center font-semibold text-xl pt-3 border-t-2">
          <span>Total:</span>
          <span className="text-green-600">R{displayAmount}</span>
        </div>
      </div>

      <Button 
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
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
            Pay R{displayAmount} Now
          </div>
        )}
      </Button>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <Shield className="inline h-3 w-3 mr-1" />
        Powered by Yoco • Secure SSL Encryption
      </div>
    </div>
  );
};
