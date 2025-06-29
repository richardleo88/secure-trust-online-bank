
-- Add additional columns to profiles table for comprehensive user data
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS middle_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ssn_last_four TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employment_status TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS annual_income NUMERIC;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employer_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS document_type TEXT; -- 'drivers_license', 'passport', 'national_id'
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS document_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS document_expiry_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS document_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending'; -- 'pending', 'verified', 'rejected'
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS citizenship_status TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state_of_birth TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mother_maiden_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS secondary_phone TEXT;

-- Create storage bucket for profile pictures and documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for storage
CREATE POLICY "Users can upload their own profile pictures" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-pictures' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own profile pictures" ON storage.objects
FOR SELECT USING (
  bucket_id = 'profile-pictures' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public can view profile pictures" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND 
  public.is_admin(auth.uid(), 'moderator')
);

-- Update the admin user with new credentials
-- First, we need to update the existing admin user if it exists
UPDATE public.admin_users 
SET admin_role = 'super_admin', is_active = true
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'Richard@gmail.com'
);

-- Insert admin user entry if it doesn't exist (will be created after user signs up)
-- This will be handled in the application code after user registration
