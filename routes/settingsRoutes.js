const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, getDashboardStats } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getSettings);
router.put('/', protect, updateSettings);
router.get('/stats', protect, getDashboardStats);

module.exports = router;
