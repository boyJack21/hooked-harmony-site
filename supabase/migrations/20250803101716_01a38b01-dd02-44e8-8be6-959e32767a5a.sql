-- Create payments table to store PayPal transaction history
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT UNIQUE NOT NULL,
  paypal_order_id TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  item_description TEXT NOT NULL,
  item_size TEXT,
  item_color TEXT,
  quantity INTEGER DEFAULT 1,
  special_instructions TEXT,
  payment_method TEXT DEFAULT 'paypal',
  captured_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments table
CREATE POLICY "Allow public read access to payments" 
ON public.payments 
FOR SELECT 
USING (true);

CREATE POLICY "Allow service role to insert payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow service role to update payments" 
ON public.payments 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_payments_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_payments_transaction_id ON public.payments(transaction_id);
CREATE INDEX idx_payments_customer_email ON public.payments(customer_email);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_created_at ON public.payments(created_at);