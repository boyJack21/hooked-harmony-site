
import emailjs from '@emailjs/browser';

interface OrderData {
  name: string;
  email: string;
  phone: string;
  item: string;
  quantity: number;
  color: string;
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
      to_name: 'Everything Hooked',
      to_email: 'everythinghooked09@gmail.com', // Explicit setting of recipient
      recipient: 'everythinghooked09@gmail.com', // Adding an additional recipient field that EmailJS might be looking for
      reply_to: orderData.email,
      subject: `New Order from ${orderData.name}`,
      customer_name: orderData.name,
      customer_email: orderData.email,
      customer_phone: orderData.phone,
      item: orderData.item,
      quantity: orderData.quantity,
      color: orderData.color,
      special_instructions: orderData.specialInstructions,
      message: `
        New Order from Website:
        
        Customer: ${orderData.name}
        Email: ${orderData.email}
        Phone: ${orderData.phone}
        
        Item: ${orderData.item}
        Quantity: ${orderData.quantity}
        Color: ${orderData.color}
        Special Instructions: ${orderData.specialInstructions}
      `
    };

    console.log('Sending email with params:', templateParams);

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
    console.error('Failed to send email:', error);
    return false;
  }
};
