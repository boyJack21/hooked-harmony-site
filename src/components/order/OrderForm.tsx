import React from 'react';
import { CustomerInfoForm } from './CustomerInfoForm';
import { OrderDetailsForm } from './OrderDetailsForm';
import { Heart } from 'lucide-react';
import { OrderFormData } from '@/types/order';
import { hasValidPricing } from '@/services/paymentService';

interface OrderFormProps {
  formData: OrderFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  errors: Record<string, string>;
  orderCount?: number;
  maxOrders?: number;
  initialSize?: string;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  submitting,
  errors,
  orderCount = 0,
  maxOrders = 2,
  initialSize
}) => {
  const isLimitReached = orderCount >= maxOrders;
  const hasPrice = hasValidPricing(formData);
  const isDisabled = submitting || isLimitReached || !hasPrice;
  
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <CustomerInfoForm formData={formData} handleChange={handleChange} errors={errors} />
        <OrderDetailsForm 
          formData={formData} 
          handleChange={handleChange} 
          errors={errors} 
          initialSize={initialSize}
        />
      </div>
      
      {!hasPrice && formData.item && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
            <strong>Contact EverythingHooked for price</strong><br />
            This item requires a custom quote. Please reach out to us for pricing information.
          </p>
        </div>
      )}
      
      <div className="mt-8">
        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-secondary hover:bg-secondary/90'} text-white py-3 px-6 rounded-md transition-colors flex items-center justify-center`}
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
          ) : !hasPrice && formData.item ? (
            <>
              Contact for Pricing
            </>
          ) : (
            <>
              <Heart className="mr-2 h-5 w-5" />
              Continue to Payment
            </>
          )}
        </button>
        
        {isLimitReached && (
          <p className="mt-2 text-xs text-center text-amber-600">
            You've reached the maximum of {maxOrders} orders. Please contact us via WhatsApp for additional orders.
          </p>
        )}
        
        {!hasPrice && formData.item && (
          <p className="mt-2 text-xs text-center text-yellow-600 dark:text-yellow-400">
            Please contact EverythingHooked for pricing on this item.
          </p>
        )}
      </div>
    </form>
  );
};