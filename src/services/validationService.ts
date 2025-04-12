
import { OrderFormData } from '@/types/order';

export const validateOrderForm = (data: OrderFormData) => {
  const errors: Record<string, string> = {};
  
  // Required fields
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required';
  } else {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
  }
  
  if (!data.item || data.item.trim() === '') {
    errors.item = 'Item description is required';
  }
  
  if (!data.quantity || data.quantity < 1) {
    errors.quantity = 'Quantity must be at least 1';
  }
  
  if (!data.size || data.size.trim() === '') {
    errors.size = 'Please select a size';
  }
  
  // Optional but with format validation
  if (data.phone && data.phone.trim() !== '') {
    // Basic phone validation - allows various formats
    const phoneRegex = /^\+?[0-9\s\-\(\)]{7,20}$/;
    if (!phoneRegex.test(data.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
  }
  
  return errors;
};
