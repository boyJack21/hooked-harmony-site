
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, AlertCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentMethod, validatePaymentDetails } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';

interface PaymentDetailsProps {
  onPaymentSubmit: (paymentDetails: {
    method: PaymentMethod;
    email: string;
    reference?: string;
    yocoToken?: string;
  }) => void;
  isProcessing: boolean;
  error?: string | null;
  totalAmount: number;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ 
  onPaymentSubmit, 
  isProcessing,
  error,
  totalAmount
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [email, setEmail] = useState('');
  const [reference, setReference] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [yocoToken, setYocoToken] = useState<string | null>(null);
  const [yocoLoaded, setYocoLoaded] = useState(false);
  const [loadingYoco, setLoadingYoco] = useState(false);
  const { toast } = useToast();

  // Initialize Yoco SDK
  useEffect(() => {
    if (paymentMethod === 'credit_card' && !window.yoco && !loadingYoco) {
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
  }, [paymentMethod, loadingYoco]);

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
          setYocoToken(result.id);
          handleSubmit(null, result.id);
        }
      }
    });
  };

  const handleSubmit = (e?: React.FormEvent, token?: string) => {
    if (e) e.preventDefault();
    
    const paymentDetails = {
      method: paymentMethod,
      email,
      reference: reference || undefined,
      yocoToken: token || undefined
    };
    
    // Validate payment details
    const error = validatePaymentDetails(paymentDetails);
    if (error) {
      setValidationError(error);
      return;
    }
    
    // Clear any validation errors
    setValidationError(null);
    
    // Submit payment details to parent component
    onPaymentSubmit(paymentDetails);
  };

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={20} /> Payment Details
          </CardTitle>
          <CardDescription>
            Choose your preferred payment method to complete your order.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {(error || validationError) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error || validationError}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <Label htmlFor="payment-email">Email for Receipt</Label>
              <Input
                id="payment-email"
                placeholder="your.email@example.com"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isProcessing}
                required
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Payment Method</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Select how you would like to pay
                </p>
              </div>
              
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                disabled={isProcessing}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center cursor-pointer">
                    Credit Card (Yoco)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="eft" id="eft" />
                  <Label htmlFor="eft" className="flex items-center cursor-pointer">
                    EFT / Bank Transfer
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mobile_payment" id="mobile_payment" />
                  <Label htmlFor="mobile_payment" className="flex items-center cursor-pointer">
                    Mobile Payment
                  </Label>
                </div>
              </RadioGroup>
              
              {paymentMethod === 'eft' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Bank Transfer Details:</p>
                      <p className="text-sm">Bank: First National Bank</p>
                      <p className="text-sm">Account: Everything Hooked</p>
                      <p className="text-sm">Acc #: 123456789</p>
                      <p className="text-sm">Branch: 250655</p>
                      
                      <div className="pt-2">
                        <Label htmlFor="reference" className="text-sm">Your Reference</Label>
                        <Input 
                          id="reference"
                          className="mt-1"
                          placeholder="e.g., Your Name / Order"
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                  </Alert>
                </motion.div>
              )}
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-xl font-semibold">R{totalAmount.toFixed(2)}</p>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {paymentMethod === 'credit_card' ? (
                  <Button 
                    type="button" 
                    size="lg"
                    disabled={isProcessing || loadingYoco}
                    onClick={processYocoPayment}
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Processing...
                      </span>
                    ) : loadingYoco ? (
                      <span className="flex items-center">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Loading payment provider...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Pay with Card <CheckCircle className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Complete Payment <CheckCircle className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                )}
              </motion.div>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
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

export default PaymentDetails;
