const express = require('express');
const router = express.Router();
const { createInquiry, getAllInquiries, updateInquiry, deleteInquiry } = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', createInquiry);
router.get('/all', protect, getAllInquiries);
router.put('/:id', protect, updateInquiry);
router.delete('/:id', protect, deleteInquiry);

module.exports = router;
