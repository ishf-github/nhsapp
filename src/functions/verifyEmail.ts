import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client
const supabaseUrl = 'https://kyomjfxvtqrejvvyyvbc.supabase.co';
const supabaseKey = 'process.env.SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Set SendGrid API key
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

export default async (req: any, res: any) => {
  const { email } = req.body;

  // Check if the email already exists in the 'providers' table
  const { data: existingProvider, error: providerError } = await supabase
    .from('providers')
    .select('email')
    .eq('email', email)
    .single();

  if (providerError) {
    return res.status(500).json({ error: providerError.message });
  }

  if (existingProvider) {
    return res.status(409).json({ message: "Email already registered." });
  }

  // Generate a new provider ID and verification code
  const newProviderId = uuidv4();
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Insert the new verification entry
  const { data, error } = await supabase
    .from('provider-verification')
    .insert([{
      provider_id: newProviderId,
      verification_code: verificationCode,
      expiry_timestamp: new Date(new Date().getTime() + 10 * 60000),
      verified: false,
      created_at: new Date()
    }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Send verification email
  const msg = {
    to: email,
    from: 'your-email@example.com',
    subject: 'Verify Your Email',
    text: `Your verification code is ${verificationCode}`,
    html: `<strong>Your verification code is ${verificationCode}</strong>`,
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ message: "Verification email sent successfully!" });
  } catch (error) {
    console.error('Email sending error:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unknown error occurred." });
  }
};
