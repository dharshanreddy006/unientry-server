const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  // Lazily require model to avoid circular dependency issues
  const SiteSettings = require('../models/SiteSettings');
  
  let settings = null;
  try {
    settings = await SiteSettings.findOne();
  } catch (err) {
    console.error('⚠️ Failed to load SMTP settings from DB:', err.message);
  }

  const host = (settings && settings.smtpHost) || process.env.SMTP_HOST || 'mail.unientry.online';
  const port = (settings && settings.smtpPort) || process.env.SMTP_PORT || 587;
  const user = (settings && settings.smtpUser) || process.env.SMTP_USER || 'noreply@unientry.online';
  const pass = (settings && settings.smtpPass) || process.env.SMTP_PASS;
  const from = (settings && settings.smtpFrom) || process.env.SMTP_FROM || 'UniEntry Global <noreply@unientry.online>';

  // If App Password/SMTP_PASS is not configured, print info to console logs and throw error
  if (!pass) {
    const errorMsg = 'SMTP_PASS is not configured. To send real emails from noreply@unientry.online, please configure SMTP credentials in the Admin Dashboard Settings or set SMTP_PASS in the server environment variables.';
    console.log('\n========================================');
    console.log('📧 EMAIL SIMULATION (SMTP_PASS is missing)');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${text || html}`);
    console.log(errorMsg);
    console.log('========================================\n');
    throw new Error(errorMsg);
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: parseInt(port) === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000, // 10 seconds connection timeout
      greetingTimeout: 10000,   // 10 seconds greeting timeout
      socketTimeout: 10000,     // 10 seconds socket timeout
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log(`📧 Email sent successfully to ${to}: ${info.messageId}`);
    return { success: true, info };
  } catch (error) {
    console.error('❌ Error sending email via SMTP:', error.message);
    throw new Error(`SMTP Error: ${error.message}`);
  }
};

module.exports = sendEmail;

