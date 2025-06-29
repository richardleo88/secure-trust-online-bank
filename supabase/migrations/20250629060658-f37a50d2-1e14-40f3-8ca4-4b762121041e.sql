
-- Update the handle_new_user function to handle cases where full_name might be null or missing
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
