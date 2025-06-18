
-- Create orders table to store order information
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  item TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  color TEXT,
  size TEXT,
  special_instructions TEXT,
  total_amount INTEGER NOT NULL, -- Amount in cents
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, cancelled
  yoco_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table to track payment attempts
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) NOT NULL,
  yoco_payment_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'ZAR',
  status TEXT NOT NULL, -- pending, successful, failed
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access for order creation and payment processing
-- (since customers may not be authenticated users)
CREATE POLICY "Allow public to insert orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public to view orders by email" 
  ON public.orders 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public to update orders" 
  ON public.orders 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public to insert payments" 
  ON public.payments 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public to view payments" 
  ON public.payments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public to update payments" 
  ON public.payments 
  FOR UPDATE 
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_orders_email ON public.orders(customer_email);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_yoco_id ON public.payments(yoco_payment_id);
