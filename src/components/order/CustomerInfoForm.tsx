
import React from 'react';
import { OrderFormData } from '@/types/order';

interface CustomerInfoFormProps {
  formData: OrderFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors: Record<string, string>;
}

export const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({ formData, handleChange, errors }) => {
  return (
    <>
      <div>
        <label htmlFor="name" className="block font-medium mb-1">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-secondary/30'} rounded-md focus:outline-none focus:ring-1 focus:ring-secondary`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block font-medium mb-1">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-secondary/30'} rounded-md focus:outline-none focus:ring-1 focus:ring-secondary`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="phone" className="block font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-secondary/30'} rounded-md focus:outline-none focus:ring-1 focus:ring-secondary`}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>
    </>
  );
};
