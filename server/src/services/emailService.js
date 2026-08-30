import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } from '../config/env.js';

let transporter = null;

// Initialize transporter if configured
if (SMTP_HOST && SMTP_USER && SMTP_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: parseInt(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
  console.log('Email Service Initialized with SMTP config');
} else {
  console.log('Email Service warning: SMTP credentials not fully configured. Falling back to console logging.');
}

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    console.log(`[EMAIL FALLBACK LOGGER]
To: ${to}
Subject: ${subject}
Content: ${text}
------------------------------------------------`);
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: `"College Complaint System" <${SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Email send failed:', error.message);
    // Don't crash the application, return false or true to proceed
    return false;
  }
};
