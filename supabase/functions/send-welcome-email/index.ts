
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId }: WelcomeEmailRequest = await req.json();

    // Get user profile data
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error(`Profile not found: ${profileError?.message}`);
    }

    // Get email template
    const { data: template, error: templateError } = await supabaseClient
      .from('email_templates')
      .select('*')
      .eq('template_name', 'welcome_user')
      .single();

    if (templateError || !template) {
      throw new Error(`Email template not found: ${templateError?.message}`);
    }

    // Replace template variables
    let htmlContent = template.html_content;
    const dashboardUrl = `${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '')}/dashboard` || 'https://your-app-url.com/dashboard';
    
    const replacements = {
      '{{full_name}}': profile.full_name || 'Valued Customer',
      '{{account_number}}': profile.account_number || 'N/A',
      '{{account_type}}': (profile.account_type || 'checking').charAt(0).toUpperCase() + (profile.account_type || 'checking').slice(1),
      '{{email}}': profile.email || 'N/A',
      '{{phone}}': profile.phone || 'Not provided',
      '{{balance}}': profile.balance ? profile.balance.toLocaleString() : '5,000.00',
      '{{dashboard_url}}': dashboardUrl
    };

    Object.entries(replacements).forEach(([key, value]) => {
      htmlContent = htmlContent.replace(new RegExp(key, 'g'), value);
    });

    // Send email
    const emailResponse = await resend.emails.send({
      from: "UnionTrust Bank <onboarding@resend.dev>",
      to: [profile.email],
      subject: template.subject,
      html: htmlContent,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
