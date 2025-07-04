-- Create 3 mock users with authentication and profiles
-- Note: In production, passwords should be properly hashed using auth functions

-- Insert mock users into auth.users table
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role
) VALUES 
(
  gen_random_uuid(),
  'john.doe@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "John Doe"}',
  'authenticated'
),
(
  gen_random_uuid(),
  'jane.smith@example.com', 
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Jane Smith"}',
  'authenticated'
),
(
  gen_random_uuid(),
  'mike.johnson@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Mike Johnson"}',
  'authenticated'
);

-- Create profiles for the mock users with credit balances
WITH mock_users AS (
  SELECT id, email, raw_user_meta_data->>'full_name' as full_name
  FROM auth.users 
  WHERE email IN ('john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com')
)
INSERT INTO public.profiles (
  id,
  full_name,
  email,
  account_number,
  balance,
  verification_status,
  is_admin,
  created_at,
  updated_at
)
SELECT 
  mu.id,
  mu.full_name,
  mu.email,
  generate_account_number(),
  generate_initial_balance(),
  'approved',
  false,
  now(),
  now()
FROM mock_users mu
ON CONFLICT (id) DO NOTHING;