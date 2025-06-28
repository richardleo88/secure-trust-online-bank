
-- Create users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    email text,
    phone text,
    date_of_birth date,
    address jsonb,
    account_number text UNIQUE,
    account_type text DEFAULT 'checking',
    balance decimal(15,2) DEFAULT 0.00,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Create transactions table
CREATE TABLE public.transactions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_type text NOT NULL, -- 'wire', 'ach', 'local', 'western_union', 'deposit', 'withdrawal'
    recipient_name text,
    recipient_account text,
    amount decimal(15,2) NOT NULL,
    fee decimal(15,2) DEFAULT 0.00,
    status text NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
    reference_number text UNIQUE NOT NULL,
    description text,
    metadata jsonb, -- Store additional transaction details
    ip_address inet,
    user_agent text,
    device_info jsonb,
    created_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    PRIMARY KEY (id)
);

-- Create activity logs table for audit trails
CREATE TABLE public.activity_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action text NOT NULL, -- 'login', 'logout', 'profile_update', 'transaction_create', etc.
    resource_type text, -- 'user', 'transaction', 'account', etc.
    resource_id text, -- ID of the affected resource
    old_values jsonb, -- Previous state for updates
    new_values jsonb, -- New state for updates
    ip_address inet,
    user_agent text,
    device_info jsonb, -- Browser, OS, device type
    location_info jsonb, -- Geolocation if available
    session_id text,
    success boolean DEFAULT true,
    error_message text,
    metadata jsonb, -- Additional context
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Create user sessions table for device management
CREATE TABLE public.user_sessions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token text UNIQUE NOT NULL,
    device_name text,
    device_type text, -- 'desktop', 'mobile', 'tablet'
    browser text,
    os text,
    ip_address inet,
    location jsonb, -- City, country, etc.
    is_active boolean DEFAULT true,
    last_activity timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone,
    PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON public.transactions
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for activity logs
CREATE POLICY "Users can view own activity logs" ON public.activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activity logs" ON public.activity_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user sessions
CREATE POLICY "Users can view own sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.user_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON public.user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to generate account numbers
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS text AS $$
BEGIN
    RETURN '****' || LPAD(floor(random() * 10000)::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to generate reference numbers
CREATE OR REPLACE FUNCTION generate_reference_number(transaction_type text)
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

-- Create trigger to auto-create profile on user signup
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

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create trigger to log profile updates
CREATE OR REPLACE FUNCTION log_profile_changes()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.activity_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        created_at
    ) VALUES (
        NEW.id,
        'profile_update',
        'profile',
        NEW.id::text,
        to_jsonb(OLD),
        to_jsonb(NEW),
        now()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for profile updates
CREATE TRIGGER profile_changes_trigger
    AFTER UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION log_profile_changes();

-- Create trigger to log transaction changes
CREATE OR REPLACE FUNCTION log_transaction_changes()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.activity_logs (
            user_id,
            action,
            resource_type,
            resource_id,
            new_values,
            created_at
        ) VALUES (
            NEW.user_id,
            'transaction_create',
            'transaction',
            NEW.id::text,
            to_jsonb(NEW),
            now()
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.activity_logs (
            user_id,
            action,
            resource_type,
            resource_id,
            old_values,
            new_values,
            created_at
        ) VALUES (
            NEW.user_id,
            'transaction_update',
            'transaction',
            NEW.id::text,
            to_jsonb(OLD),
            to_jsonb(NEW),
            now()
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for transaction changes
CREATE TRIGGER transaction_changes_trigger
    AFTER INSERT OR UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION log_transaction_changes();

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON public.user_sessions(is_active);
