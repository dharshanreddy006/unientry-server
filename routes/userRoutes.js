const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getMe,
  googleLogin,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword
} = require('../controllers/userAuthController');
const { protectUser } = require('../middleware/userAuthMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protectUser, getMe);

module.exports = router;
