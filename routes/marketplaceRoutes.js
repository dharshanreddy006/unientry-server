const express = require('express');
const router = express.Router();
const Marketplace = require('../models/Marketplace');
const { protect } = require('../middleware/authMiddleware');

// GET /api/marketplace?universityId=...&type=sell
router.get('/', async (req, res) => {
  try {
    const { universityId, type } = req.query;
    const where = { status: 'active' };
    if (universityId) where.universityId = universityId;
    if (type) where.type = type;

    const listings = await Marketplace.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/marketplace/admin/all (admin - all listings)
router.get('/admin/all', protect, async (req, res) => {
  try {
    const listings = await Marketplace.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/marketplace (admin creates listing)
router.post('/', protect, async (req, res) => {
  try {
    const listing = await Marketplace.create(req.body);
    res.status(201).json({ success: true, data: listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/marketplace/:id (admin updates)
router.put('/:id', protect, async (req, res) => {
  try {
    const listing = await Marketplace.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    await listing.update(req.body);
    res.json({ success: true, data: listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/marketplace/:id (admin removes)
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Marketplace.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    await listing.destroy();
    res.json({ success: true, message: 'Listing removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
