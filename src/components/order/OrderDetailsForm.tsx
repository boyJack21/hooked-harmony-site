
import React from 'react';
import { OrderFormData } from '@/types/order';
import { Plus, Minus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

interface OrderDetailsFormProps {
  formData: OrderFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors: Record<string, string>;
  initialSize?: string;
}

export const OrderDetailsForm: React.FC<OrderDetailsFormProps> = ({ 
  formData, 
  handleChange, 
  errors,
  initialSize
}) => {
  const isMobile = useIsMobile();

  // Custom handler for quantity changes with buttons
  const handleQuantityChange = (newValue: number) => {
    // Create a synthetic event object that mimics the standard onChange event
    const event = {
      target: {
        name: 'quantity',
        value: newValue.toString()
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(event);
  };

  // Price information for the placeholder
  const getPriceInfo = () => {
    return `
Include your size (S, M, L) and select from our pricing:
- Beanie/Bucket Hat: R150
- Polo Shirt: S=R280, M=R320, L=R360
- Crop Cardigan: S=R350, M=R400
- Cardigan: S=R400, M=R450, L=R500
- Long Cardigan: S=R450, M=R520, L=R600
- Ruffled Crop Top: S=R200, M=R250, L=R280
- Bikini Set: S=R170, M=R200, L=R230
    `;
  };

  return (
    <>
      <div>
        <label htmlFor="item" className="block font-medium mb-1">Item</label>
        <input
          type="text"
          id="item"
          name="item"
          value={formData.item}
          onChange={handleChange}
          required
          placeholder="e.g., Blanket, Hat, Amigurumi"
          className={`w-full px-4 py-2 border ${errors.item ? 'border-red-500' : 'border-secondary/30'} rounded-md focus:outline-none focus:ring-1 focus:ring-secondary`}
        />
        {errors.item && (
          <p className="mt-1 text-sm text-red-500">{errors.item}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantity" className="block font-medium mb-1">Quantity</label>
          <div className="flex items-center">
            <button 
              type="button"
              onClick={() => handleQuantityChange(Math.max(1, Number(formData.quantity) - 1))}
              className="px-3 py-2 bg-secondary/10 rounded-l-md border border-secondary/30 hover:bg-secondary/20"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.quantity}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border-y border-secondary/30 focus:outline-none focus:ring-1 focus:ring-secondary ${errors.quantity ? 'border-red-500' : ''} text-center`}
              style={{ 
                WebkitAppearance: 'none', 
                MozAppearance: 'textfield',
                appearance: 'textfield'
              }}
            />
            <button 
              type="button"
              onClick={() => handleQuantityChange(Number(formData.quantity) + 1)}
              className="px-3 py-2 bg-secondary/10 rounded-r-md border border-secondary/30 hover:bg-secondary/20"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="color" className="block font-medium mb-1">Color Preference</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.color ? 'border-red-500' : 'border-secondary/30'} rounded-md focus:outline-none focus:ring-1 focus:ring-secondary`}
          />
          {errors.color && (
            <p className="mt-1 text-sm text-red-500">{errors.color}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="specialInstructions" className="block font-medium mb-1">Special Instructions</label>
        <div className="relative">
          <textarea
            id="specialInstructions"
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleChange}
            rows={6}
            placeholder={getPriceInfo()}
            className={`w-full px-4 py-2 border ${errors.specialInstructions ? 'border-red-500' : 'border-secondary/30'} rounded-md focus:outline-none focus:ring-1 focus:ring-secondary`}
          ></textarea>
        </div>
        {errors.specialInstructions && (
          <p className="mt-1 text-sm text-red-500">{errors.specialInstructions}</p>
        )}
      </div>
    </>
  );
};
