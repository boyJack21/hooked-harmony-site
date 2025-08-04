// Pricing configuration for products
export const PRODUCT_PRICES: Record<string, number> = {
  // Hats
  'Pink Ruffle Hat': 20000, // R200.00 in cents
  'Elegant Black Hat': 25000, // R250.00 in cents
  'Summer Straw Hat': 18000, // R180.00 in cents
  'Classic Fedora': 22000, // R220.00 in cents
  'Vintage Beret': 19000, // R190.00 in cents
  
  // Default pricing for other items
  'Custom Hat': 20000, // R200.00 in cents
  'Special Order': 25000, // R250.00 in cents
};

export const getProductPrice = (productName: string): number => {
  // Clean up the product name to match our pricing keys
  const cleanName = productName.trim();
  
  // Try exact match first
  if (PRODUCT_PRICES[cleanName]) {
    return PRODUCT_PRICES[cleanName];
  }
  
  // Try partial matches for flexibility
  const matchingKey = Object.keys(PRODUCT_PRICES).find(key => 
    cleanName.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(cleanName.toLowerCase())
  );
  
  if (matchingKey) {
    return PRODUCT_PRICES[matchingKey];
  }
  
  // Default price if no match found
  return PRODUCT_PRICES['Custom Hat'];
};

export const formatPrice = (amountInCents: number): string => {
  return `R${(amountInCents / 100).toFixed(2)}`;
};

export const addSizeUpcharge = (basePrice: number, size: string): number => {
  const upcharges: Record<string, number> = {
    'XL': 500, // R5.00 extra
    'XXL': 1000, // R10.00 extra
  };
  
  return basePrice + (upcharges[size] || 0);
};