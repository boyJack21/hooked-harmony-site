import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { OrderFormData } from '@/types/order';

interface YocoButtonProps {
  orderData: OrderFormData;
  amount: number; // Amount in cents
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    YocoSDK: any;
  }
}

export const YocoButton: React.FC<YocoButtonProps> = ({
  orderData,
  amount,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load Yoco SDK
    if (!window.YocoSDK) {
      const script = document.createElement('script');
      script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
      script.onload = () => {
        setIsLoading(false);
      };
      script.onerror = () => {
        setIsLoading(false);
        onError('Failed to load Yoco SDK');
      };
      document.head.appendChild(script);
    } else {
      setIsLoading(false);
    }
  }, [onError]);

  const handlePayment = async () => {
    if (!window.YocoSDK) {
      onError('Yoco SDK not loaded');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order first
      const { data: orderResponse, error: orderError } = await supabase.functions
        .invoke('create-yoco-payment', {
          body: { orderData, amount }
        });

      if (orderError || !orderResponse.success) {
        throw new Error(orderResponse?.error || 'Failed to create order');
      }

      // Initialize Yoco popup
      const yoco = new window.YocoSDK({
        publicKey: 'pk_test_ed3c54a6gOol69qa7f45', // Use your actual public key
      });

      yoco.showPopup({
        amountInCents: amount,
        currency: 'ZAR',
        name: orderData.name,
        description: `${orderData.item} - Size: ${orderData.size}, Quantity: ${orderData.quantity}`,
        metadata: {
          orderId: orderResponse.orderId,
        },
        callback: async (result: any) => {
          if (result.error) {
            console.error('Yoco payment error:', result.error);
            onError(result.error.message || 'Payment failed');
            setIsProcessing(false);
            return;
          }

          try {
            // Verify payment with our backend
            const { data: verifyData, error: verifyError } = await supabase.functions
              .invoke('verify-yoco-payment', {
                body: { 
                  paymentId: result.id,
                  orderId: orderResponse.orderId 
                }
              });

            if (verifyError || !verifyData.success) {
              throw new Error(verifyData?.error || 'Payment verification failed');
            }

            if (verifyData.payment.status === 'successful') {
              onSuccess(result.id);
            } else {
              onError('Payment was not successful');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onError(error instanceof Error ? error.message : 'Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        }
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
      onError(error instanceof Error ? error.message : 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="sm" />
        <span className="ml-2">Loading Yoco...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-[#00d4ff] hover:bg-[#00c4ef] text-white"
        size="lg"
      >
        {isProcessing ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Processing...
          </>
        ) : (
          `Pay R${(amount / 100).toFixed(2)} with Yoco`
        )}
      </Button>
      
      {isProcessing && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Please complete your payment in the popup window
        </div>
      )}
    </div>
  );
};