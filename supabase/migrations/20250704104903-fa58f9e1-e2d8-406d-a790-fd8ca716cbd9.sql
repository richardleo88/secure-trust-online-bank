-- Update profiles table to have random balance between $3500-$12500 for new users
ALTER TABLE public.profiles 
ALTER COLUMN balance 
SET DEFAULT (3500 + random() * 9000)::numeric(10,2);

-- Update existing users to have random balances between $3500-$12500
UPDATE public.profiles 
SET balance = (3500 + random() * 9000)::numeric(10,2)
WHERE balance IS NULL OR balance = 0.00;

-- Create function to generate random balance for new users
CREATE OR REPLACE FUNCTION public.generate_initial_balance()
RETURNS numeric
LANGUAGE sql
STABLE
AS $$
  SELECT (3500 + random() * 9000)::numeric(10,2);
$$;

-- Update the default to use the function
ALTER TABLE public.profiles 
ALTER COLUMN balance 
SET DEFAULT generate_initial_balance();