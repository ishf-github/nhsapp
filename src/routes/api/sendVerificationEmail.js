import nodemailer from 'nodemailer';
import { json } from '@sveltejs/kit';

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false, // true for 465, false for other ports
  auth: {
    user: '', // leave empty for MailHog
    pass: ''  // leave empty for MailHog
  }
});

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function POST({ request }) {
  const { to, subject, text, html } = await request.json();

  const mailOptions = {
    from: '"MyNHS" <noreply@mynhs.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html // html body
  };

  try {
    await transporter.sendMail(mailOptions);
    return json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return json({ error: 'Error sending email' }, { status: 500 });
  }
}
