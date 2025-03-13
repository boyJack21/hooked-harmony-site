
import { OrderFormData } from "@/types/order";

interface ValidationErrors {
  [key: string]: string;
}

export const validateOrderForm = (data: OrderFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate name
  if (!data.name.trim()) {
    errors.name = "Name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Validate phone (optional but if provided, must be valid)
  if (data.phone && data.phone.trim()) {
    const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
    if (!phoneRegex.test(data.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
  }

  // Validate item
  if (!data.item.trim()) {
    errors.item = "Item name is required";
  }

  // Validate quantity
  if (!data.quantity || data.quantity < 1) {
    errors.quantity = "Quantity must be at least 1";
  } else if (data.quantity > 100) {
    errors.quantity = "Quantity cannot exceed 100";
  }

  return errors;
};
