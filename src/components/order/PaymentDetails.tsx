
import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentMethod, validatePaymentDetails } from '@/services/paymentService';

// Import refactored components
import PaymentMethodSelector from './payment/PaymentMethodSelector';
import EFTDetails from './payment/EFTDetails';
import PaymentErrorDisplay from './payment/PaymentErrorDisplay';
import PaymentSummary from './payment/PaymentSummary';
import YocoProcessor from './payment/YocoProcessor';

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

  // Use the YocoProcessor hook
  const { processYocoPayment, loadingYoco } = YocoProcessor({
    totalAmount,
    onPaymentSuccess: (token) => {
      setYocoToken(token);
      handleSubmit(null, token);
    },
    isProcessing,
    setValidationError
  });

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
            {/* Error display component */}
            <PaymentErrorDisplay error={error || validationError} />
            
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
            
            {/* Payment Method Selector Component */}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
              disabled={isProcessing}
            />
            
            {/* EFT Details Component (conditionally rendered) */}
            {paymentMethod === 'eft' && (
              <EFTDetails
                reference={reference}
                onReferenceChange={setReference}
                disabled={isProcessing}
              />
            )}
            
            <Separator />
            
            {/* Payment Summary Component */}
            <PaymentSummary
              totalAmount={totalAmount}
              isProcessing={isProcessing}
              loadingYoco={loadingYoco}
              onPay={processYocoPayment}
              paymentMethod={paymentMethod}
            />
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default PaymentDetails;
