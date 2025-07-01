
-- Insert admin user into admin_users table
-- First, get the user_id for richard@gmail.com from auth.users
-- Then insert into admin_users table with super_admin role

INSERT INTO public.admin_users (user_id, admin_role, is_active, assigned_at)
SELECT 
  id as user_id,
  'super_admin'::admin_role,
  true,
  now()
FROM auth.users 
WHERE email = 'richard@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  admin_role = 'super_admin'::admin_role,
  is_active = true,
  assigned_at = now();

-- Also ensure the profile has is_admin set to true
UPDATE public.profiles 
SET is_admin = true 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'richard@gmail.com'
);
