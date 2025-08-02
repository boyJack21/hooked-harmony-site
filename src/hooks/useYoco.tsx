import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    YocoSDK: any;
  }
}

interface PaymentOptions {
  amount: number;
  currency: string;
  metadata: any;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
}

export const useYoco = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const processPayment = useCallback(({
    amount,
    currency,
    metadata,
    onSuccess,
    onError,
    onCancel
  }: PaymentOptions) => {
    if (!window.YocoSDK || !isLoaded) {
      toast({
        title: "Payment Error",
        description: "Payment system not ready. Please try again.",
        variant: "destructive",
      });
      onError?.(new Error('Payment system not ready'));
      return;
    }

    if (isProcessing) {
      toast({
        title: "Payment in Progress",
        description: "Please wait for the current payment to complete.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const yoco = new window.YocoSDK({
        publicKey: 'pk_test_ed3c54a6gOol69qa7f45', // Test key - replace with live key for production
      });

      yoco.showPopup({
        amountInCents: amount,
        currency: currency,
        name: 'Elite Hair Studio',
        description: `Order: ${metadata.item || 'Purchase'}`,
        metadata: metadata,
        callback: function(result: any) {
          setIsProcessing(false);
          
          if (result.error) {
            console.error('Payment error:', result.error);
            
            // Enhanced error handling
            const errorMessage = getErrorMessage(result.error);
            toast({
              title: "Payment Failed",
              description: errorMessage,
              variant: "destructive",
            });
            
            onError(result.error);
          } else {
            console.log('Payment success:', result);
            
            toast({
              title: "Payment Successful!",
              description: "Your payment has been processed successfully.",
            });
            
            onSuccess(result);
          }
        },
        onCancel: function() {
          setIsProcessing(false);
          onCancel?.();
        }
      });
    } catch (error) {
      setIsProcessing(false);
      console.error('Yoco initialization error:', error);
      
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment system. Please try again.",
        variant: "destructive",
      });
      
      onError(error);
    }
  }, [isLoaded, isProcessing, toast]);

  // Enhanced error message handling
  const getErrorMessage = (error: any): string => {
    if (!error) return 'Unknown payment error occurred';
    
    const errorCode = error.code || error.type;
    const errorMessage = error.message || error.description;
    
    // Common Yoco error codes and user-friendly messages
    switch (errorCode) {
      case 'card_declined':
        return 'Your card was declined. Please try a different card or contact your bank.';
      case 'insufficient_funds':
        return 'Insufficient funds. Please check your account balance.';
      case 'expired_card':
        return 'Your card has expired. Please use a different card.';
      case 'invalid_cvc':
        return 'Invalid security code. Please check your card details.';
      case 'processing_error':
        return 'Payment processing error. Please try again.';
      case 'network_error':
        return 'Network error. Please check your connection and try again.';
      default:
        return errorMessage || 'Payment failed. Please try again or contact support.';
    }
  };

  // Get supported card types
  const getSupportedCardTypes = () => {
    return ['visa', 'mastercard', 'american_express', 'diners_club'];
  };

  // Validate card number format (basic)
  const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
  };

  return {
    isLoaded,
    isLoading,
    isProcessing,
    processPayment,
    getSupportedCardTypes,
    validateCardNumber,
    getErrorMessage,
  };
};