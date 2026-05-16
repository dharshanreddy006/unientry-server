const express = require('express');
const router = express.Router();
const {
  getAccommodations,
  getAllAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
} = require('../controllers/accommodationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAccommodations);
router.get('/all', protect, getAllAccommodations);
router.get('/:id', getAccommodationById);
router.post('/', protect, createAccommodation);
router.put('/:id', protect, updateAccommodation);
router.delete('/:id', protect, deleteAccommodation);

module.exports = router;
