
-- Create a table for lemonade orders
CREATE TABLE public.lemonade_orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.lemonade_orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read orders (for admin panel)
CREATE POLICY "Anyone can view orders" 
  ON public.lemonade_orders 
  FOR SELECT 
  USING (true);

-- Create policy to allow anyone to insert orders (for customer form)
CREATE POLICY "Anyone can create orders" 
  ON public.lemonade_orders 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow anyone to delete orders (for admin panel)
CREATE POLICY "Anyone can delete orders" 
  ON public.lemonade_orders 
  FOR DELETE 
  USING (true);
