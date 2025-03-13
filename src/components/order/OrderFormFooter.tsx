
import React from 'react';
import { AlertCircle, Mail } from 'lucide-react';

export const OrderFormFooter: React.FC = () => {
  return (
    <>
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-primary-foreground/60">
        <Mail className="h-4 w-4" />
        <p>Order notifications will be sent to everythinghooked09@gmail.com</p>
      </div>
      
      <p className="mt-4 text-sm text-center text-primary-foreground/60 flex items-center justify-center">
        <AlertCircle className="h-4 w-4 mr-1" />
        We'll contact you with pricing and timeline after receiving your order details.
      </p>
    </>
  );
};
