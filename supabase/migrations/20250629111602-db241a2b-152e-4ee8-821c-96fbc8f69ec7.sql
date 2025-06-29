
-- Add admin role field to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create email templates table for storing email configurations
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert welcome email template
INSERT INTO public.email_templates (template_name, subject, html_content, variables) 
VALUES (
  'welcome_user',
  'Welcome to UnionTrust Bank - Account Created Successfully!',
  '<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .account-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏦 Welcome to UnionTrust Bank</h1>
            <p>Your account has been created successfully!</p>
        </div>
        <div class="content">
            <p>Dear {{full_name}},</p>
            <p>Congratulations! Your UnionTrust Bank account has been successfully created. Below are your account details:</p>
            
            <div class="account-info">
                <h3>🎯 Your Account Information</h3>
                <p><strong>Account Holder:</strong> {{full_name}}</p>
                <p><strong>Account Number:</strong> {{account_number}}</p>
                <p><strong>Account Type:</strong> {{account_type}}</p>
                <p><strong>Bank Name:</strong> UnionTrust Bank</p>
                <p><strong>Email:</strong> {{email}}</p>
                <p><strong>Phone:</strong> {{phone}}</p>
                <p><strong>Initial Balance:</strong> ${{balance}}</p>
                <p><strong>Account Status:</strong> Active</p>
            </div>

            <p>🔐 <strong>Security Information:</strong></p>
            <ul>
                <li>Keep your account information confidential</li>
                <li>Never share your login credentials</li>
                <li>Contact us immediately if you notice any suspicious activity</li>
            </ul>

            <div style="text-align: center;">
                <a href="{{dashboard_url}}" class="btn">Access Your Dashboard</a>
            </div>

            <p>If you have any questions or need assistance, please contact our support team at support@uniontrust.com or call us at 1-800-UNION-TRUST.</p>
            
            <p>Thank you for choosing UnionTrust Bank!</p>
            
            <p>Best regards,<br>
            The UnionTrust Bank Team</p>
        </div>
        <div class="footer">
            <p>© 2024 UnionTrust Bank. All rights reserved.</p>
            <p>This email was sent to {{email}}. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>',
  '{"full_name": "", "account_number": "", "account_type": "", "email": "", "phone": "", "balance": "", "dashboard_url": ""}'
)
ON CONFLICT (template_name) DO UPDATE SET
  subject = EXCLUDED.subject,
  html_content = EXCLUDED.html_content,
  variables = EXCLUDED.variables,
  updated_at = now();

-- Enable RLS on email_templates
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for email templates (allow read access to authenticated users)
CREATE POLICY "Anyone can read email templates" ON public.email_templates
  FOR SELECT USING (true);

-- Update the handle_new_user function to set admin role for specific email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, account_number, is_admin, balance)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        new.email,
        generate_account_number(),
        CASE WHEN new.email = 'richard@gmail.com' THEN true ELSE false END,
        5000.00
    );
    RETURN new;
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN new;
END;
$$;
