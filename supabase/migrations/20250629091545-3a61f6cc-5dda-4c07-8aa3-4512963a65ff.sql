
-- Create admin roles enum
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'admin', 'moderator', 'support');

-- Create admin_users table for role management
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  admin_role admin_role NOT NULL DEFAULT 'support',
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create website_content table for CMS
CREATE TABLE public.website_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL, -- 'banner', 'blog_post', 'announcement', 'rate'
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create kyc_verifications table
CREATE TABLE public.kyc_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  document_type TEXT NOT NULL, -- 'passport', 'drivers_license', 'national_id'
  document_url TEXT,
  verification_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'needs_review'
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create fraud_alerts table
CREATE TABLE public.fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  alert_type TEXT NOT NULL, -- 'suspicious_login', 'large_transaction', 'multiple_failed_attempts'
  severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active', -- 'active', 'investigated', 'resolved', 'false_positive'
  investigated_by UUID REFERENCES auth.users(id),
  investigated_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin roles
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID, _min_role admin_role DEFAULT 'support')
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = _user_id 
    AND is_active = true
    AND (
      admin_role = 'super_admin' OR
      (_min_role = 'admin' AND admin_role IN ('super_admin', 'admin')) OR
      (_min_role = 'moderator' AND admin_role IN ('super_admin', 'admin', 'moderator')) OR
      (_min_role = 'support' AND admin_role IN ('super_admin', 'admin', 'moderator', 'support'))
    )
  );
$$;

-- RLS Policies for admin tables
CREATE POLICY "Admin users can manage admin_users" ON public.admin_users
  FOR ALL USING (public.is_admin(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage website content" ON public.website_content
  FOR ALL USING (public.is_admin(auth.uid(), 'moderator'));

CREATE POLICY "Support can view tickets" ON public.support_tickets
  FOR SELECT USING (public.is_admin(auth.uid(), 'support'));

CREATE POLICY "Support can update tickets" ON public.support_tickets
  FOR UPDATE USING (public.is_admin(auth.uid(), 'support'));

CREATE POLICY "Admins can manage tickets" ON public.support_tickets
  FOR ALL USING (public.is_admin(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage KYC" ON public.kyc_verifications
  FOR ALL USING (public.is_admin(auth.uid(), 'moderator'));

CREATE POLICY "Admins can manage fraud alerts" ON public.fraud_alerts
  FOR ALL USING (public.is_admin(auth.uid(), 'moderator'));

-- Create indexes for performance
CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX idx_website_content_type ON public.website_content(content_type);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_kyc_verifications_user_id ON public.kyc_verifications(user_id);
CREATE INDEX idx_fraud_alerts_user_id ON public.fraud_alerts(user_id);
CREATE INDEX idx_fraud_alerts_status ON public.fraud_alerts(status);
