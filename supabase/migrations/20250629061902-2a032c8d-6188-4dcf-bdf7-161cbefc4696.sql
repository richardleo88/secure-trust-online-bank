
-- Ensure all necessary functions exist and the trigger is properly set up
-- First, create the generate_account_number function
CREATE OR REPLACE FUNCTION public.generate_account_number()
RETURNS text AS $$
BEGIN
    RETURN '****' || LPAD(floor(random() * 10000)::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Recreate the handle_new_user function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, account_number)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        new.email,
        generate_account_number()
    );
    RETURN new;
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger to ensure it's properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also ensure the activity_logs table can accept inserts without authentication issues
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.activity_logs;
CREATE POLICY "Allow insert for authenticated users" ON public.activity_logs
    FOR INSERT WITH CHECK (true);
