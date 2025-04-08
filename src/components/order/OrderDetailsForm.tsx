
import React from 'react';
import { OrderFormData } from '@/types/order';
import { Plus, Minus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  
  // Use React.useEffect to set the initial size when the component mounts
  React.useEffect(() => {
    if (initialSize && !formData.size) {
      // Create a synthetic event object that mimics the standard onChange event
      const event = {
        target: {
          name: 'size',
          value: initialSize
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(event);
    }
  }, [initialSize, formData.size, handleChange]);

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

  // Custom handler for size radio buttons
  const handleSizeChange = (value: string) => {
    const event = {
      target: {
        name: 'size',
        value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(event);
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
        <div className="block font-medium mb-2">Size</div>
        <RadioGroup 
          value={formData.size} 
          onValueChange={handleSizeChange}
          className="flex gap-6 mb-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="S" id="size-s" />
            <Label htmlFor="size-s">Small</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="M" id="size-m" />
            <Label htmlFor="size-m">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="L" id="size-l" />
            <Label htmlFor="size-l">Large</Label>
          </div>
        </RadioGroup>
        {errors.size && (
          <p className="mt-1 text-sm text-red-500">{errors.size}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="specialInstructions" className="block font-medium mb-1">Special Instructions</label>
        <textarea
          id="specialInstructions"
          name="specialInstructions"
          value={formData.specialInstructions}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-2 border ${errors.specialInstructions ? 'border-red-500' : 'border-secondary/30'} rounded-md focus:outline-none focus:ring-1 focus:ring-secondary`}
        ></textarea>
        {errors.specialInstructions && (
          <p className="mt-1 text-sm text-red-500">{errors.specialInstructions}</p>
        )}
      </div>
    </>
  );
};
