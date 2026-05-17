const express = require('express');
const router = express.Router();
const rentAndRideController = require('../controllers/rentAndRideController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', rentAndRideController.getAll);
router.get('/:id', rentAndRideController.getById);

// Admin only routes
router.post('/', protect, rentAndRideController.create);
router.put('/:id', protect, rentAndRideController.update);
router.delete('/:id', protect, rentAndRideController.delete);

module.exports = router;
