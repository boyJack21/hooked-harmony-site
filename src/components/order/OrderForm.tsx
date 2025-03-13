
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
}

export const OrderForm: React.FC<OrderFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  submitting
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <CustomerInfoForm formData={formData} handleChange={handleChange} />
        <OrderDetailsForm formData={formData} handleChange={handleChange} />
      </div>
      
      <div className="mt-8">
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 px-6 rounded-md transition-colors flex items-center justify-center"
        >
          {submitting ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            <>
              <Heart className="mr-2 h-5 w-5" />
              Place Order
            </>
          )}
        </button>
      </div>
    </form>
  );
};
