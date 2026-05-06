const express = require('express');
const router = express.Router();
const {
  getInternships,
  getAllInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
} = require('../controllers/internshipController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getInternships);
router.get('/all', protect, getAllInternships);
router.get('/:id', getInternshipById);

router.post('/', protect, createInternship);
router.put('/:id', protect, updateInternship);
router.delete('/:id', protect, deleteInternship);

module.exports = router;
