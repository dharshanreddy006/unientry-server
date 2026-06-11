const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/userAuthController');
const { protectUser } = require('../middleware/userAuthMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protectUser, getMe);

module.exports = router;
