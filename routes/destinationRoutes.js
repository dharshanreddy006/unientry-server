const express = require('express');
const router = express.Router();
const { 
  getDestinations, 
  getAllDestinations, 
  createDestination, 
  updateDestination, 
  deleteDestination 
} = require('../controllers/destinationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getDestinations);
router.get('/admin', protect, getAllDestinations);
router.post('/', protect, createDestination);
router.put('/:id', protect, updateDestination);
router.delete('/:id', protect, deleteDestination);

module.exports = router;
