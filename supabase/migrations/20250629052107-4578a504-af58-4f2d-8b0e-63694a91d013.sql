
-- Ensure the generate_account_number function exists
CREATE OR REPLACE FUNCTION public.generate_account_number()
RETURNS text AS $$
BEGIN
    RETURN '****' || LPAD(floor(random() * 10000)::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Ensure the generate_reference_number function exists
CREATE OR REPLACE FUNCTION public.generate_reference_number(transaction_type text)
RETURNS text AS $$
BEGIN
    CASE transaction_type
        WHEN 'wire' THEN
            RETURN 'WIRE-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(floor(random() * 100000)::text, 5, '0');
        WHEN 'ach' THEN
            RETURN 'ACH-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(floor(random() * 100000)::text, 5, '0');
        WHEN 'local' THEN
            RETURN 'LOCAL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(floor(random() * 100000)::text, 5, '0');
        WHEN 'western_union' THEN
            RETURN 'WU-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(floor(random() * 100000)::text, 5, '0');
        ELSE
            RETURN 'TXN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(floor(random() * 100000)::text, 5, '0');
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Recreate the handle_new_user function to ensure it works properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, account_number)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.email,
        generate_account_number()
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Drop existing policy if it exists and recreate it
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.activity_logs;
CREATE POLICY "Allow insert for authenticated users" ON public.activity_logs
    FOR INSERT WITH CHECK (true);
