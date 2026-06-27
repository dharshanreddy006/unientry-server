const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');
const Otp = require('../models/Otp');
const sendEmail = require('../utils/sendEmail');

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
    if (!email && !phone) {
      return res.status(400).json({ success: false, message: 'Email or phone number is required' });
    }

    // Check if user already exists
    const whereClause = [];
    if (email) whereClause.push({ email });
    if (phone) whereClause.push({ phone });

    const existing = await User.findOne({ where: { [Op.or]: whereClause } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Account already exists with this email or phone' });
    }

    const user = await User.create({
      name,
      email: email || null,
      phone: phone || null,
      password,
      role: role || 'student',
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
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
    console.error('Signup error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
};

// POST /api/users/login
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Email/phone and password are required' });
    }

    // Find by email or phone
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { phone: identifier },
        ],
      },
    });

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
      attributes: { exclude: ['password'] },
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
      // User exists, check if active
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Account is deactivated. Contact support.' });
      }

      // If user exists but didn't have googleId or profilePicture previously, update it
      let needsUpdate = false;
      if (!user.googleId) {
        user.googleId = googleId;
        needsUpdate = true;
      }
      if (profilePicture && !user.profilePicture) {
        user.profilePicture = profilePicture;
        needsUpdate = true;
      }
      if (needsUpdate) {
        await user.save();
      }
    } else {
      // User doesn't exist, create a new one!
      user = await User.create({
        googleId,
        name: name || 'Google User',
        email,
        profilePicture: profilePicture || null,
        role: role || 'student',
      });
    }

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

// POST /api/users/send-otp
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    // Generate a 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Upsert OTP in DB
    const [otpRecord, created] = await Otp.findOrCreate({
      where: { email },
      defaults: { otp: otpCode, expiresAt, verified: false }
    });

    if (!created) {
      otpRecord.otp = otpCode;
      otpRecord.expiresAt = expiresAt;
      otpRecord.verified = false;
      await otpRecord.save();
    }

    // Send email
    const subject = `Your UniEntry Verification Code: ${otpCode}`;
    const text = `Hi,\n\nYour verification code is ${otpCode}. It is valid for 10 minutes.\n\nBest regards,\nUniEntry Team`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #1a56db; text-align: center;">UniEntry GLOBAL</h2>
        <p>Hi,</p>
        <p>Thank you for signing in with UniEntry. Use the following security verification code to complete your login/signup:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; text-align: center; color: #1e293b; background-color: #f8fafc; padding: 15px; margin: 20px 0; border-radius: 8px;">
          ${otpCode}
        </div>
        <p style="color: #64748b; font-size: 13px;">This code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="text-align: center; font-size: 11px; color: #94a3b8;">© ${new Date().getFullYear()} UniEntry GLOBAL. All rights reserved.</p>
      </div>
    `;

    await sendEmail({ to: email, subject, text, html });

    res.json({ success: true, message: 'Verification code sent to your email.' });
  } catch (error) {
    console.error('Send OTP error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send verification code. Please try again.' });
  }
};

// POST /api/users/verify-otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp, name, role } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and verification code are required' });
    }

    // Find the OTP record
    const otpRecord = await Otp.findOne({
      where: {
        email,
        otp,
        verified: false,
        expiresAt: { [Op.gt]: new Date() } // expiry in future
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Check if user exists
    let user = await User.findOne({ where: { email } });

    if (user) {
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Account is deactivated. Contact support.' });
      }
    } else {
      // Create new user (signup on the fly)
      const defaultName = name || email.split('@')[0];
      user = await User.create({
        name: defaultName,
        email,
        role: role || 'student',
        isActive: true
      });
    }

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
    console.error('Verify OTP error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during verification' });
  }
};

module.exports = { signup, login, getMe, googleLogin, sendOtp, verifyOtp };
