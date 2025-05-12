
import React from 'react';
import { motion } from 'framer-motion';
import { Alert } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EFTDetailsProps {
  reference: string;
  onReferenceChange: (reference: string) => void;
  disabled: boolean;
}

const EFTDetails: React.FC<EFTDetailsProps> = ({
  reference,
  onReferenceChange,
  disabled
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Alert>
        <div className="space-y-2">
          <p className="text-sm font-medium">Bank Transfer Details:</p>
          <p className="text-sm">Bank: First National Bank</p>
          <p className="text-sm">Account: Everything Hooked</p>
          <p className="text-sm">Acc #: 123456789</p>
          <p className="text-sm">Branch: 250655</p>
          
          <div className="pt-2">
            <Label htmlFor="reference" className="text-sm">Your Reference</Label>
            <Input 
              id="reference"
              className="mt-1"
              placeholder="e.g., Your Name / Order"
              value={reference}
              onChange={(e) => onReferenceChange(e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
      </Alert>
    </motion.div>
  );
};

export default EFTDetails;
