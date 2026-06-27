const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const {
  getVerificationEmailHtml,
  getPasswordResetEmailHtml,
  getPasswordChangedEmailHtml
} = require('../utils/emailTemplates');

const JWT_SECRET = process.env.JWT_SECRET || 'unientry_jwt_secret_2024';

const generateToken = (id) => {
  return jwt.sign({ id, type: 'user' }, JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/users/signup
const signup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !password) {
      return res.status(400).json({ success: false, message: 'Name and password are required' });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    // Check if user already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Account already exists with this email' });
    }

    // Generate secure email verification token (expires in 24 hours)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      phone: phone || null,
      password,
      role: role || 'student',
      email_verified: false,
      verificationToken,
      verificationTokenExpires,
    });

    // Send verification email
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const verificationUrl = `${clientUrl}/verify-email?token=${verificationToken}`;
    
    const subject = 'Verify your email address - UniEntry Global';
    const html = getVerificationEmailHtml(user.name, verificationUrl);
    const text = `Hi ${user.name},\n\nPlease verify your email by clicking the following link: ${verificationUrl}\n\nThank you,\nUniEntry Global`;

    await sendEmail({ to: user.email, subject, html, text });

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
};

// POST /api/users/login
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email: identifier } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact support.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check email verification status
    if (!user.email_verified) {
      return res.status(403).json({
        success: false,
        unverified: true,
        message: 'Please verify your email before logging in.',
      });
    }

    // Update last login timestamp
    user.last_login = new Date();
    await user.save();

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// GET /api/users/me
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'verificationToken', 'verificationTokenExpires', 'resetPasswordToken', 'resetPasswordExpires'] },
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/users/google-login
const googleLogin = async (req, res) => {
  try {
    const { googleId, name, email, profilePicture, role } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({ success: false, message: 'Google ID and email are required' });
    }

    // Find user by googleId OR email
    let user = await User.findOne({
      where: {
        [Op.or]: [
          { googleId },
          { email }
        ]
      }
    });

    if (user) {
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Account is deactivated. Contact support.' });
      }

      let needsUpdate = false;
      if (!user.googleId) {
        user.googleId = googleId;
        needsUpdate = true;
      }
      if (profilePicture && !user.profilePicture) {
        user.profilePicture = profilePicture;
        needsUpdate = true;
      }
      // Google-login automatically verifies email
      if (!user.email_verified) {
        user.email_verified = true;
        needsUpdate = true;
      }
      if (needsUpdate) {
        await user.save();
      }
    } else {
      user = await User.create({
        googleId,
        name: name || 'Google User',
        email,
        profilePicture: profilePicture || null,
        role: role || 'student',
        email_verified: true, // Google accounts are pre-verified
      });
    }

    user.last_login = new Date();
    await user.save();

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error('Google login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during Google login' });
  }
};

// POST /api/users/verify-email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Verification token is required' });
    }

    const user = await User.findOne({
      where: {
        verificationToken: token,
        verificationTokenExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }

    user.email_verified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    user.last_login = new Date();
    await user.save();

    const sessionToken = generateToken(user.id);

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: sessionToken,
      }
    });
  } catch (error) {
    console.error('Verify email error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during verification' });
  }
};

// POST /api/users/resend-verification
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    if (user.email_verified) {
      return res.status(400).json({ success: false, message: 'Email address is already verified' });
    }

    // Generate new token
    const token = crypto.randomBytes(32).toString('hex');
    user.verificationToken = token;
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const verificationUrl = `${clientUrl}/verify-email?token=${token}`;

    const subject = 'Verify your email address - UniEntry Global';
    const html = getVerificationEmailHtml(user.name, verificationUrl);
    const text = `Hi ${user.name},\n\nPlease verify your email by clicking the following link: ${verificationUrl}\n\nThank you,\nUniEntry Global`;

    await sendEmail({ to: user.email, subject, html, text });

    res.json({ success: true, message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Resend verification error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/users/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Return success anyway for security / email privacy
      return res.json({ success: true, message: 'If the email exists, a password reset link has been sent' });
    }

    // Generate reset token (expires in 30 minutes)
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${clientUrl}/reset-password?token=${token}`;

    const subject = 'Reset your password - UniEntry Global';
    const html = getPasswordResetEmailHtml(user.name, resetUrl);
    const text = `Hi ${user.name},\n\nPlease reset your password by clicking the following link: ${resetUrl}\n\nThank you,\nUniEntry Global`;

    await sendEmail({ to: user.email, subject, html, text });

    res.json({ success: true, message: 'If the email exists, a password reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/users/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Send confirmation email
    const subject = 'Password changed successfully - UniEntry Global';
    const html = getPasswordChangedEmailHtml(user.name);
    const text = `Hi ${user.name},\n\nYour password has been changed successfully.\n\nThank you,\nUniEntry Global`;

    await sendEmail({ to: user.email, subject, html, text });

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  googleLogin,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword
};
