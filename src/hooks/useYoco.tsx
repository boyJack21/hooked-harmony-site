import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    YocoSDK: any;
  }
}

export const useYoco = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if SDK is already loaded
    if (window.YocoSDK) {
      setIsLoaded(true);
      return;
    }

    setIsLoading(true);

    // Load Yoco SDK
    const script = document.createElement('script');
    script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
    script.async = true;
    
    script.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };
    
    script.onerror = () => {
      setIsLoading(false);
      toast({
        title: "Payment Error",
        description: "Failed to load payment system",
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

  const processPayment = (
    amount: number,
    currency: string,
    metadata: any,
    onSuccess: (result: any) => void,
    onError: (error: any) => void
  ) => {
    if (!window.YocoSDK || !isLoaded) {
      toast({
        title: "Payment Error",
        description: "Payment system not ready",
        variant: "destructive",
      });
      return;
    }

    try {
      const yoco = new window.YocoSDK({
        publicKey: 'pk_test_ed3c54a6gOol69qa7f45', // Test key - replace with live key for production
      });

      yoco.showPopup({
        amountInCents: amount,
        currency: currency,
        name: 'Elite Hair Studio',
        description: `Order: ${metadata.item}`,
        metadata: metadata,
        callback: function(result: any) {
          if (result.error) {
            console.error('Payment error:', result.error);
            onError(result.error);
          } else {
            console.log('Payment success:', result);
            onSuccess(result);
          }
        }
      });
    } catch (error) {
      console.error('Yoco error:', error);
      onError(error);
    }
  };

  return {
    isLoaded,
    isLoading,
    processPayment,
  };
};