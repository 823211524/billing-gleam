import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateTemporaryPassword = () => {
  return Math.random().toString(36).slice(-8);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    const temporaryPassword = generateTemporaryPassword();

    // Create Supabase client with service role key
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Check if user exists in our users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, is_enabled')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!userData.is_enabled) {
      return new Response(
        JSON.stringify({ error: 'User account is disabled' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email with temporary credentials
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'WeBill System <onboarding@resend.dev>',
        to: [email],
        subject: 'Your Temporary Login Credentials',
        html: `
          <h2>WeBill System - Temporary Login Credentials</h2>
          <p>Here are your temporary login credentials:</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
          <p>Please use these credentials to log in to the system. For security reasons, we recommend changing your password after logging in.</p>
          <p>This is an automated message, please do not reply.</p>
        `,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to send email');
    }

    // Update user's password in Supabase Auth
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      email,
      { password: temporaryPassword }
    );

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ message: 'Temporary credentials sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);