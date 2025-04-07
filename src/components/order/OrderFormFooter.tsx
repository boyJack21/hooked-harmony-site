
import React from 'react';
import { AlertCircle, Mail, Truck, Clock } from 'lucide-react';

export const OrderFormFooter: React.FC = () => {
  return (
    <>
      <div className="mt-6 flex flex-col space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm text-primary-foreground/60">
          <Mail className="h-4 w-4" />
          <p>Order notifications will be sent to everythinghooked09@gmail.com</p>
        </div>
        
        <a 
          href="https://wa.me/27608581873" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-4 w-4"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
          </svg>
          WhatsApp us: 060 858 1873
        </a>
        
        <div className="flex items-center justify-center gap-2 text-sm text-primary-foreground/60">
          <Truck className="h-4 w-4" />
          <p>Local delivery available across South Africa</p>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm text-primary-foreground/60">
          <Clock className="h-4 w-4" />
          <p>Orders typically take 2-4 weeks to complete depending on the item and current order volume</p>
        </div>
      </div>
      
      <p className="mt-4 text-sm text-center text-primary-foreground/60 flex items-center justify-center">
        <AlertCircle className="h-4 w-4 mr-1" />
        We'll contact you with pricing and timeline after receiving your order details.
      </p>
      
      <div className="mt-3 text-xs text-center text-amber-600">
        <p>Limited to 2 orders per session to ensure we can serve everyone.</p>
      </div>
    </>
  );
};
