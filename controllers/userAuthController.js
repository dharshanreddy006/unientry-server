const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');

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

module.exports = { signup, login, getMe };
