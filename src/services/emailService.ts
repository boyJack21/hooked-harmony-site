
import emailjs from '@emailjs/browser';

interface OrderData {
  name: string;
  email: string;
  phone: string;
  item: string;
  quantity: number;
  color: string;
  size: string;
  specialInstructions: string;
}

export const sendOrderEmail = async (orderData: OrderData): Promise<boolean> => {
  // Using the provided EmailJS credentials
  const serviceId = 'service_vx09dhj';
  const templateId = 'template_m4nkif1';
  const publicKey = 'WHVqM-qv55tJYHvid';
  
  try {
    // Create a template parameters object
    const templateParams = {
      from_name: orderData.name,
      from_email: orderData.email,
      reply_to: orderData.email,
      to_email: 'everythinghooked09@gmail.com', // Adding recipient email directly
      subject: `New Order from ${orderData.name}`,
      customer_name: orderData.name,
      customer_email: orderData.email,
      customer_phone: orderData.phone,
      item_ordered: orderData.item, // Renamed to be more explicit
      item_quantity: orderData.quantity.toString(), // Convert to string and renamed
      item_color: orderData.color, // Renamed to be more explicit
      item_size: orderData.size, // Adding size field
      special_instructions: orderData.specialInstructions,
      message: `
        New Order from Website:
        
        Customer: ${orderData.name}
        Email: ${orderData.email}
        Phone: ${orderData.phone}
        
        Item: ${orderData.item}
        Quantity: ${orderData.quantity}
        Color: ${orderData.color}
        Size: ${orderData.size}
        Special Instructions: ${orderData.specialInstructions}
      `
    };

    console.log('Sending email with params:', templateParams);
    console.log('Using EmailJS config - Service ID:', serviceId, 'Template ID:', templateId);

    // Send the email directly using emailjs-com
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );
    
    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email. Details:', error);
    
    // More detailed error logging to help diagnose the issue
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    } else if (typeof error === 'object' && error !== null) {
      console.error('Error object:', JSON.stringify(error));
    }
    
    return false;
  }
};
