
import React, { useState } from 'react';
import { OrderFormData } from '@/types/order';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface CustomerInfoFormProps {
  formData: OrderFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors: Record<string, string>;
}

export const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({ formData, handleChange, errors }) => {
  const [fieldStatus, setFieldStatus] = useState<Record<string, 'valid' | 'invalid' | 'neutral'>>({
    name: 'neutral',
    email: 'neutral',
    phone: 'neutral'
  });

  const validateField = (name: string, value: string) => {
    let isValid = false;
    
    switch (name) {
      case 'name':
        isValid = value.trim().length >= 2;
        break;
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case 'phone':
        isValid = value === '' || /^\+?[0-9\s\-\(\)]{7,20}$/.test(value);
        break;
      default:
        isValid = true;
    }
    
    setFieldStatus(prev => ({
      ...prev,
      [name]: isValid ? 'valid' : 'invalid'
    }));
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    validateField(e.target.name, e.target.value);
  };

  const getFieldIcon = (fieldName: string) => {
    const status = fieldStatus[fieldName];
    if (status === 'valid') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status === 'invalid') {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getFieldBorderClass = (fieldName: string) => {
    if (errors[fieldName]) return 'border-red-500 focus:ring-red-500';
    if (fieldStatus[fieldName] === 'valid') return 'border-green-500 focus:ring-green-500';
    if (fieldStatus[fieldName] === 'invalid') return 'border-red-500 focus:ring-red-500';
    return 'border-secondary/30 focus:ring-secondary';
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block font-medium mb-2 text-sm md:text-base">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleFieldChange}
            required
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 border ${getFieldBorderClass('name')} rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 pr-10`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getFieldIcon('name')}
          </div>
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.name}
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block font-medium mb-2 text-sm md:text-base">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleFieldChange}
            required
            placeholder="your.email@example.com"
            className={`w-full px-4 py-3 border ${getFieldBorderClass('email')} rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 pr-10`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getFieldIcon('email')}
          </div>
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.email}
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="phone" className="block font-medium mb-2 text-sm md:text-base">
          Phone Number <span className="text-gray-400 text-sm">(Optional)</span>
        </label>
        <div className="relative">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleFieldChange}
            placeholder="+27 123 456 7890"
            className={`w-full px-4 py-3 border ${getFieldBorderClass('phone')} rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 pr-10`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getFieldIcon('phone')}
          </div>
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.phone}
          </p>
        )}
      </div>
    </div>
  );
};
