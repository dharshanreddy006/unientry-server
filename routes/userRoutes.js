const express = require('express');
const router = express.Router();
const { signup, login, getMe, googleLogin, sendOtp, verifyOtp } = require('../controllers/userAuthController');
const { protectUser } = require('../middleware/userAuthMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', protectUser, getMe);

module.exports = router;
