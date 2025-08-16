import nodemailer from 'nodemailer';
import { config } from '../config';

// Create transporter for Ethereal Email (development)
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: config.email.host,
    port: config.email.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
};

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Dairy Farm Management" <${config.email.user}>`,
      to,
      subject,
      text,
      html: html || text,
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (config.nodeEnv === 'development') {
      console.log('Email sent:', info.messageId);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  
  const subject = 'Password Reset Request';
  const text = `
    You requested a password reset for your Dairy Farm Management account.
    
    Click the following link to reset your password:
    ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request this, please ignore this email.
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your Dairy Farm Management account.</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;
  
  await sendEmail(email, subject, text, html);
};

export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const subject = 'Welcome to Dairy Farm Management';
  const text = `
    Welcome ${name}!
    
    Your account has been created successfully.
    You can now log in to the Dairy Farm Management system.
    
    Best regards,
    Dairy Farm Management Team
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Dairy Farm Management!</h2>
      <p>Hello ${name},</p>
      <p>Your account has been created successfully.</p>
      <p>You can now log in to the Dairy Farm Management system and start managing your dairy operations.</p>
      <p>Best regards,<br>Dairy Farm Management Team</p>
    </div>
  `;
  
  await sendEmail(email, subject, text, html);
};
