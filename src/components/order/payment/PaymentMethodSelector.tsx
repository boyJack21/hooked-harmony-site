
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PaymentMethod } from '@/services/paymentService';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  disabled: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  disabled
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Payment Method</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Select how you would like to pay
        </p>
      </div>
      
      <RadioGroup
        value={selectedMethod}
        onValueChange={(value) => onMethodChange(value as PaymentMethod)}
        disabled={disabled}
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
    </div>
  );
};

export default PaymentMethodSelector;
