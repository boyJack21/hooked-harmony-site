
import React, { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface YocoProcessorProps {
  totalAmount: number;
  onPaymentSuccess: (token: string) => void;
  isProcessing: boolean;
  setValidationError: (error: string | null) => void;
}

const YocoProcessor: React.FC<YocoProcessorProps> = ({
  totalAmount,
  onPaymentSuccess,
  isProcessing,
  setValidationError
}) => {
  const [yocoLoaded, setYocoLoaded] = useState(false);
  const [loadingYoco, setLoadingYoco] = useState(false);

  // Initialize Yoco SDK
  useEffect(() => {
    if (!window.yoco && !loadingYoco) {
      setLoadingYoco(true);
      
      const script = document.createElement('script');
      script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Yoco SDK loaded successfully');
        setYocoLoaded(true);
        setLoadingYoco(false);
      };
      
      script.onerror = () => {
        console.error('Failed to load Yoco SDK');
        setValidationError('Failed to load payment processor. Please try again later.');
        setLoadingYoco(false);
      };
      
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [loadingYoco, setValidationError]);

  const processYocoPayment = () => {
    // Clear any previous validation errors
    setValidationError(null);
    
    if (!window.yoco) {
      setValidationError('Payment processor not loaded. Please refresh the page.');
      toast({
        title: "Payment Error",
        description: "Payment processor not loaded. Please try refreshing the page.",
        variant: "destructive",
      });
      return;
    }

    window.yoco.showPopup({
      amountInCents: Math.round(totalAmount * 100),
      currency: 'ZAR',
      name: 'Everything Hooked',
      description: 'Online Order Payment',
      publicKey: 'pk_live_3400a58b1W4z8Wd00594',
      callback: (result: any) => {
        if (result.error) {
          setValidationError(result.error.message);
          toast({
            title: "Payment Error",
            description: result.error.message,
            variant: "destructive",
          });
        } else {
          onPaymentSuccess(result.id);
        }
      }
    });
  };

  return {
    processYocoPayment,
    yocoLoaded,
    loadingYoco
  };
};

// Add TypeScript declaration for Yoco SDK
declare global {
  interface Window {
    yoco: {
      showPopup: (options: {
        amountInCents: number;
        currency: string;
        name: string;
        description: string;
        publicKey: string;
        callback: (result: { error?: { message: string }; id?: string }) => void;
      }) => void;
    };
  }
}

export default YocoProcessor;
