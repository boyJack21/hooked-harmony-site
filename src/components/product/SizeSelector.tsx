
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type SizeOption = 'S' | 'M' | 'L';

interface SizeSelectorProps {
  selectedSize: SizeOption | null;
  onSizeChange: (size: SizeOption) => void;
  availableSizes?: SizeOption[];
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ 
  selectedSize, 
  onSizeChange,
  availableSizes = ['S', 'M', 'L']
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold dark:text-white">Select Size</h3>
      <ToggleGroup 
        type="single" 
        value={selectedSize || undefined}
        onValueChange={(value) => {
          if (value && (value === 'S' || value === 'M' || value === 'L')) {
            onSizeChange(value as SizeOption);
          }
        }}
        className="justify-start bg-gray-50 dark:bg-gray-800 p-1 rounded-md"
      >
        {availableSizes.map((size) => (
          <ToggleGroupItem 
            key={size} 
            value={size}
            aria-label={`Size ${size}`}
            className="px-6 py-2 data-[state=on]:bg-white dark:data-[state=on]:bg-gray-700 data-[state=on]:shadow-sm"
          >
            {size}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default SizeSelector;
