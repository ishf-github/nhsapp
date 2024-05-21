// src/mailer.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false, // true for 465, false for other ports
  auth: {
    user: '', // leave empty for MailHog
    pass: ''  // leave empty for MailHog
  }
});

export const sendMail = async (to, subject, text, html) => {
  const mailOptions = {
    from: '"MyNHS" <noreply@mynhs.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html // html body
  };

  await transporter.sendMail(mailOptions);
};
