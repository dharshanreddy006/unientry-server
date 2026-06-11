const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'unientry_jwt_secret_2024');
      req.admin = await Admin.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });
      if (!req.admin) {
        return res.status(401).json({ success: false, message: 'Not authorized: Admin not found' });
      }
      next();
    } catch (error) {
      console.error('JWT Verification failed:', error);
      return res.status(401).json({ success: false, message: `Token invalid or expired: ${error.message}` });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
