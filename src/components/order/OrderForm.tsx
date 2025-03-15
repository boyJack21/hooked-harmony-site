
import React from 'react';
import { CustomerInfoForm } from './CustomerInfoForm';
import { OrderDetailsForm } from './OrderDetailsForm';
import { Heart } from 'lucide-react';
import { OrderFormData } from '@/types/order';

interface OrderFormProps {
  formData: OrderFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  errors: Record<string, string>;
  orderCount?: number;
  maxOrders?: number;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  submitting,
  errors,
  orderCount = 0,
  maxOrders = 2
}) => {
  const isLimitReached = orderCount >= maxOrders;
  
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <CustomerInfoForm formData={formData} handleChange={handleChange} errors={errors} />
        <OrderDetailsForm formData={formData} handleChange={handleChange} errors={errors} />
      </div>
      
      <div className="mt-8">
        <button
          type="submit"
          disabled={submitting || isLimitReached}
          className={`w-full ${isLimitReached ? 'bg-gray-400 cursor-not-allowed' : 'bg-secondary hover:bg-secondary/90'} text-white py-3 px-6 rounded-md transition-colors flex items-center justify-center`}
        >
          {submitting ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : isLimitReached ? (
            <>
              Order Limit Reached
            </>
          ) : (
            <>
              <Heart className="mr-2 h-5 w-5" />
              Place Order
            </>
          )}
        </button>
        
        {isLimitReached && (
          <p className="mt-2 text-xs text-center text-amber-600">
            You've reached the maximum of {maxOrders} orders. Please contact us via WhatsApp for additional orders.
          </p>
        )}
      </div>
    </form>
  );
};
