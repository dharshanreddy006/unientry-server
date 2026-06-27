const getBaseHtml = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UniEntry Global</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f9fafb;
      padding: 40px 0;
    }
    .container {
      max-width: 540px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #ededed;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
    }
    .header {
      background-color: #000000;
      padding: 32px;
      text-align: center;
    }
    .header img {
      height: 36px;
      display: inline-block;
    }
    .header-text {
      color: #ffffff;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.15em;
      margin-top: 10px;
      text-transform: uppercase;
    }
    .content {
      padding: 40px 32px;
    }
    h1 {
      font-size: 20px;
      font-weight: 700;
      color: #111111;
      margin-top: 0;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }
    p {
      font-size: 14px;
      line-height: 24px;
      color: #444444;
      margin-top: 0;
      margin-bottom: 24px;
    }
    .button-container {
      margin: 32px 0;
      text-align: center;
    }
    .btn {
      display: inline-block;
      background-color: #000000;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 14px 32px;
      border-radius: 0px;
      transition: background-color 0.2s ease;
    }
    .footer {
      padding: 32px;
      background-color: #fafafa;
      border-top: 1px solid #ededed;
      text-align: center;
    }
    .footer p {
      font-size: 11px;
      color: #888888;
      line-height: 18px;
      margin: 0;
    }
    .footer a {
      color: #000000;
      text-decoration: underline;
    }
    .divider {
      height: 1px;
      background-color: #ededed;
      margin: 24px 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="header-text">UniEntry Global</div>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} UniEntry Global. All rights reserved.</p>
        <p style="margin-top: 8px;">If you have any questions, contact us at <a href="mailto:support@unientry.online">support@unientry.online</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const getVerificationEmailHtml = (name, verificationUrl) => {
  return getBaseHtml(`
    <h1>Verify your email address</h1>
    <p>Hi ${name || 'there'},</p>
    <p>Thank you for creating an account with UniEntry Global. Before you can access your account, we need to verify your email address. Please click the button below to confirm your registration:</p>
    <div class="button-container">
      <a href="${verificationUrl}" class="btn" target="_blank">Verify Email</a>
    </div>
    <p style="font-size: 12px; color: #666666;">This verification link will expire in <strong>24 hours</strong>. If you did not register for a UniEntry Global account, please ignore this email.</p>
    <div class="divider"></div>
    <p style="font-size: 12px; color: #888888; word-break: break-all;">If the button above does not work, copy and paste this URL into your browser:<br/><a href="${verificationUrl}">${verificationUrl}</a></p>
  `);
};

const getPasswordResetEmailHtml = (name, resetUrl) => {
  return getBaseHtml(`
    <h1>Reset your password</h1>
    <p>Hi ${name || 'there'},</p>
    <p>We received a request to reset your password for your UniEntry Global account. Click the button below to choose a new password:</p>
    <div class="button-container">
      <a href="${resetUrl}" class="btn" target="_blank">Reset Password</a>
    </div>
    <p style="font-size: 12px; color: #666666;">This link is secure and will expire in <strong>30 minutes</strong>. If you did not make this request, your password will remain unchanged.</p>
    <div class="divider"></div>
    <p style="font-size: 12px; color: #888888; word-break: break-all;">If the button above does not work, copy and paste this URL into your browser:<br/><a href="${resetUrl}">${resetUrl}</a></p>
  `);
};

const getPasswordChangedEmailHtml = (name) => {
  return getBaseHtml(`
    <h1>Password changed successfully</h1>
    <p>Hi ${name || 'there'},</p>
    <p>This is a confirmation that the password for your UniEntry Global account has been successfully changed.</p>
    <p>If you did not change your password, please contact our support team immediately at <a href="mailto:support@unientry.online">support@unientry.online</a> to secure your account.</p>
  `);
};

module.exports = {
  getVerificationEmailHtml,
  getPasswordResetEmailHtml,
  getPasswordChangedEmailHtml
};
