import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    YocoSDK: any;
  }
}

interface YocoSDKConfig {
  publicKey: string;
  environment: 'test' | 'live';
}

export const useYocoSDK = (config: YocoSDKConfig) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (window.YocoSDK) {
      setIsLoaded(true);
      return;
    }

    setIsLoading(true);

    // Create script element for Yoco SDK
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

  const initializePayment = (paymentData: {
    amountInCents: number;
    currency: string;
    name: string;
    description: string;
    metadata?: any;
    callback: (result: any) => void;
  }) => {
    if (!window.YocoSDK || !isLoaded) {
      toast({
        title: "Payment System Not Ready",
        description: "Please wait for the payment system to load and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const yoco = new window.YocoSDK({
        publicKey: config.publicKey,
      });

      yoco.showPopup(paymentData);
    } catch (error) {
      console.error('Yoco initialization error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    isLoaded,
    isLoading,
    initializePayment,
  };
};