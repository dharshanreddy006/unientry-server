const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER || 'infounientry@gmail.com';
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || 'UniEntry GLOBAL <infounientry@gmail.com>';

  // If App Password is not configured, print info to Railway logs and throw an error to alert the user
  if (!pass) {
    console.log('\n========================================');
    console.log('📧 EMAIL SIMULATION (SMTP_PASS is missing)');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${text || html}`);
    console.log('To send real emails from infounientry@gmail.com, please add SMTP_PASS to your Railway Env variables.');
    console.log('========================================\n');
    return { success: true, simulated: true };
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
      }
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
    throw error;
  }
};

module.exports = sendEmail;

