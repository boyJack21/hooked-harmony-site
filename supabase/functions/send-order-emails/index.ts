import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderData: {
    item: string;
    quantity: number;
    size: string;
    color: string;
    specialInstructions?: string;
  };
  amount: number;
  orderId: string;
  paymentId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Send order emails function called');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      customerName, 
      customerEmail, 
      orderData, 
      amount, 
      orderId, 
      paymentId 
    }: OrderEmailData = await req.json();

    console.log('Sending emails for order:', orderId);

    const formattedAmount = `R${(amount / 100).toFixed(2)}`;

    // Customer confirmation email
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Confirmed! 🎉</h1>
        <p>Hi ${customerName},</p>
        <p>Thank you for your order! Your payment of <strong>${formattedAmount}</strong> was successful.</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Order Details</h3>
          <p><strong>Order Number:</strong> ${orderId}</p>
          <p><strong>Item:</strong> ${orderData.item}</p>
          <p><strong>Quantity:</strong> ${orderData.quantity}</p>
          <p><strong>Size:</strong> ${orderData.size}</p>
          <p><strong>Color:</strong> ${orderData.color}</p>
          ${orderData.specialInstructions ? `<p><strong>Special Instructions:</strong> ${orderData.specialInstructions}</p>` : ''}
          <p><strong>Total Paid:</strong> ${formattedAmount}</p>
          ${paymentId ? `<p><strong>Payment ID:</strong> ${paymentId}</p>` : ''}
        </div>
        
        <p>We'll start working on your order right away and will keep you updated on the progress.</p>
        <p>If you have any questions, feel free to contact us.</p>
        
        <p>Best regards,<br>Your Team</p>
      </div>
    `;

    // Business owner notification email
    const ownerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Order Received! 💰</h1>
        
        <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Order Details</h3>
          <p><strong>Order Number:</strong> ${orderId}</p>
          <p><strong>Item:</strong> ${orderData.item}</p>
          <p><strong>Quantity:</strong> ${orderData.quantity}</p>
          <p><strong>Size:</strong> ${orderData.size}</p>
          <p><strong>Color:</strong> ${orderData.color}</p>
          ${orderData.specialInstructions ? `<p><strong>Special Instructions:</strong> ${orderData.specialInstructions}</p>` : ''}
          <p><strong>Total Paid:</strong> ${formattedAmount}</p>
          ${paymentId ? `<p><strong>Payment ID:</strong> ${paymentId}</p>` : ''}
        </div>
        
        <p>A new order has been placed and paid for. Please process this order.</p>
      </div>
    `;

    // Send customer email
    const customerEmailResponse = await resend.emails.send({
      from: "Your Store <onboarding@resend.dev>", // Change this to your verified domain
      to: [customerEmail],
      subject: `Order Confirmed - ${orderId}`,
      html: customerEmailHtml,
    });

    console.log("Customer email sent:", customerEmailResponse);

    // Send owner notification email
    const ownerEmailResponse = await resend.emails.send({
      from: "Your Store <onboarding@resend.dev>", // Change this to your verified domain
      to: ["owner@yourstore.com"], // Change this to your email
      subject: `New Order: ${orderId} - ${formattedAmount}`,
      html: ownerEmailHtml,
    });

    console.log("Owner email sent:", ownerEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        customerEmail: customerEmailResponse,
        ownerEmail: ownerEmailResponse 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);