const express = require('express');
const router = express.Router();
const {
  getUniversities,
  getFeaturedUniversities,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} = require('../controllers/universityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getUniversities);
router.get('/featured', getFeaturedUniversities);
router.get('/:id', getUniversityById);

router.post('/', protect, createUniversity);
router.put('/:id', protect, updateUniversity);
router.delete('/:id', protect, deleteUniversity);

module.exports = router;
