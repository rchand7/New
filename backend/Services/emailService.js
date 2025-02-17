import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Gmail, change if using a different email provider
  auth: {
    user: process.env.EMAIL_USER, // The email address
    pass: process.env.EMAIL_PASS, // App-specific password or your email password
  },
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address
    to,                      // Recipient's email
    subject,                 // Subject of the email
    text,                    // Text body
    html,                    // HTML body
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};

export default sendEmail;
