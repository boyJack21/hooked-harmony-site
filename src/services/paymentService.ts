
import { OrderFormData } from '@/types/order';

// Calculate order total based on item and quantity
export function calculateOrderTotal(orderData: OrderFormData): number {
  // This is a simplified pricing model - in a real app, this would likely
  // call an API or use data from a database
  const itemPrices: Record<string, number> = {
    'Beanie': 150,
    'Bucket Hat': 150,
    'Polo Shirt': 320,
    'Crop Cardigan': 400,
    'Color Block Cardigan': 540,
    'Cardigan': 450,
    'Long Cardigan': 520,
    'Ruffled Crop Top': 250,
    'Bikini Set': 200
  };
  
  // Get base price - default to 300 if item not found in price list
  let basePrice = 300;
  
  // Try to match item name with our price list
  for (const [itemName, price] of Object.entries(itemPrices)) {
    if (orderData.item.toLowerCase().includes(itemName.toLowerCase())) {
      basePrice = price;
      break;
    }
  }
  
  // Adjust for size if applicable
  if (orderData.size) {
    switch(orderData.size) {
      case 'S':
        // Small size uses the base price
        break;
      case 'M':
        // Medium size costs 10% more
        basePrice *= 1.1;
        break;
      case 'L':
        // Large size costs 20% more
        basePrice *= 1.2;
        break;
      case 'XL':
        // XL size costs 30% more
        basePrice *= 1.3;
        break;
    }
  }
  
  // Multiply by quantity
  const total = basePrice * (orderData.quantity || 1);
  
  // Round to 2 decimal places
  return Math.round(total * 100) / 100;
}
