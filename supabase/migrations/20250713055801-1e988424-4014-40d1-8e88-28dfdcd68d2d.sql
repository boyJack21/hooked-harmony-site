-- Add inventory management table
CREATE TABLE public.inventory (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id text NOT NULL UNIQUE,
  product_name text NOT NULL,
  stock_quantity integer NOT NULL DEFAULT 0,
  price_cents integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Allow public read access to inventory
CREATE POLICY "Allow public to view inventory" 
ON public.inventory 
FOR SELECT 
USING (true);

-- Allow service role to update inventory
CREATE POLICY "Allow service role to update inventory" 
ON public.inventory 
FOR UPDATE 
USING (true);

-- Allow service role to insert inventory
CREATE POLICY "Allow service role to insert inventory" 
ON public.inventory 
FOR INSERT 
WITH CHECK (true);

-- Add environment mode to payments table
ALTER TABLE public.payments ADD COLUMN environment text DEFAULT 'live';

-- Add cart_data to orders table for better tracking
ALTER TABLE public.orders ADD COLUMN cart_data jsonb;

-- Create function to update inventory after successful payment
CREATE OR REPLACE FUNCTION public.update_inventory_on_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only update inventory when payment status changes to completed
  IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
    -- Get order details
    DECLARE
      order_rec record;
    BEGIN
      SELECT * INTO order_rec FROM public.orders WHERE id = NEW.order_id;
      
      -- Update inventory if order exists
      IF order_rec.id IS NOT NULL THEN
        UPDATE public.inventory 
        SET 
          stock_quantity = stock_quantity - order_rec.quantity,
          updated_at = now()
        WHERE product_id = order_rec.item;
      END IF;
    END;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for inventory updates
CREATE TRIGGER update_inventory_on_payment_completed
  AFTER UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_inventory_on_payment();

-- Create function to get cart total
CREATE OR REPLACE FUNCTION public.calculate_cart_total(cart_items jsonb)
RETURNS integer
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  total integer := 0;
  item jsonb;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(cart_items)
  LOOP
    total := total + ((item->>'price_cents')::integer * (item->>'quantity')::integer);
  END LOOP;
  
  RETURN total;
END;
$$;