import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Verify that environment variables are set
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('Missing EMAIL_USER or EMAIL_PASS in environment variables.');
}

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // App password for Gmail
  },
});

// Function to send an email
export const sendEmail = async (to, subject, html) => {
  try {
    // Send the email
    const info = await transporter.sendMail({
      from: `"Aditya" <${process.env.EMAIL_USER}>`, // Sender's name and email
      to, // Recipient(s)
      subject, // Subject line
      html, // HTML content
    });

    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error.message);
    // Optional: Additional error handling logic
    throw new Error('Failed to send email. Please try again later.');
  }
};

// Optional: Verify the SMTP configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error with SMTP configuration:', error);
  } else {
    console.log('SMTP server is ready to send emails.');
  }
});
