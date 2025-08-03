import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { OrderFormData } from '@/types/order';
import { supabase } from '@/integrations/supabase/client';

interface PayPalButtonProps {
  orderData: OrderFormData;
  amount: number;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({
  orderData,
  amount,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load PayPal SDK
    if (!window.paypal) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb'}&currency=USD&intent=capture`;
      script.onload = () => {
        setIsLoading(false);
        renderPayPalButton();
      };
      script.onerror = () => {
        setIsLoading(false);
        onError('Failed to load PayPal SDK');
      };
      document.body.appendChild(script);
    } else {
      setIsLoading(false);
      renderPayPalButton();
    }
  }, []);

  const renderPayPalButton = () => {
    if (!window.paypal) return;

    window.paypal.Buttons({
      createOrder: async () => {
        try {
          setIsProcessing(true);
          
          const { data, error } = await supabase.functions.invoke('create-paypal-order', {
            body: {
              amount: amount,
              orderData: orderData,
            },
          });

          if (error) throw error;
          return data.orderID;
        } catch (error) {
          console.error('Error creating PayPal order:', error);
          onError('Failed to create payment order');
          setIsProcessing(false);
          throw error;
        }
      },

      onApprove: async (data: any) => {
        try {
          const { data: captureData, error } = await supabase.functions.invoke('capture-paypal-order', {
            body: {
              orderID: data.orderID,
              orderData: orderData,
            },
          });

          if (error) throw error;

          if (captureData.success) {
            onSuccess(captureData.transactionId);
            toast({
              title: "Payment Successful!",
              description: "Your order has been processed successfully.",
            });
          } else {
            throw new Error(captureData.error || 'Payment capture failed');
          }
        } catch (error) {
          console.error('Error capturing PayPal payment:', error);
          onError(error instanceof Error ? error.message : 'Payment processing failed');
        } finally {
          setIsProcessing(false);
        }
      },

      onError: (err: any) => {
        console.error('PayPal error:', err);
        onError('Payment failed. Please try again.');
        setIsProcessing(false);
      },

      onCancel: () => {
        toast({
          title: "Payment Cancelled",
          description: "You cancelled the payment process.",
          variant: "destructive",
        });
        setIsProcessing(false);
      },

      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal',
        height: 45,
      },
    }).render('#paypal-button-container');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
        <span className="ml-2 text-sm text-muted-foreground">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isProcessing && (
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner />
          <span className="ml-2 text-sm text-muted-foreground">Processing payment...</span>
        </div>
      )}
      <div id="paypal-button-container" className={isProcessing ? 'opacity-50 pointer-events-none' : ''}></div>
    </div>
  );
};