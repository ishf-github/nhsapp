import nodemailer from 'nodemailer';
import { json } from '@sveltejs/kit';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false, 
  auth: {
    user: '', 
    pass: ''  
  }
});

/**
 * POST handler to send emails using Nodemailer
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function POST({ request }) {
  // Parse the request body to get email details
  const { to, subject, text, html } = await request.json();

  // Email options
  const mailOptions = {
    from: '"MyNHS" <noreply@mynhs.com>', 
    to, 
    subject, 
    text, 
    html 
  };

  // Try to send the email using the transporter
  try {
    await transporter.sendMail(mailOptions);
    return json({ success: true });
  } catch (error) {
    // Handle errors if the email could not be sent
    return json({ error: 'Error sending email' }, { status: 500 });
  }
}
