const express = require('express');
const router = express.Router();
const ResourceAccess = require('../models/ResourceAccess');
const University = require('../models/University');
const { protect } = require('../middleware/authMiddleware');

// Check if email has access
router.post('/check-access', async (req, res) => {
  const { email, universityId } = req.body;
  try {
    const access = await ResourceAccess.findOne({ where: { email, universityId, status: 'granted' } });
    res.json({ success: true, hasAccess: !!access });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Request access (initial entry)
router.post('/request-access', async (req, res) => {
  const { email, universityId } = req.body;
  try {
    const [access, created] = await ResourceAccess.findOrCreate({
      where: { email, universityId },
      defaults: { status: 'pending' }
    });
    res.json({ success: true, access });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN: List all requests
router.get('/admin/requests', protect, async (req, res) => {
  try {
    const requests = await ResourceAccess.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN: Grant access
router.post('/admin/grant', protect, async (req, res) => {
  const { email, universityId } = req.body;
  try {
    const access = await ResourceAccess.findOne({ where: { email, universityId } });
    if (access) {
      access.status = 'granted';
      await access.save();
    } else {
      await ResourceAccess.create({ email, universityId, status: 'granted' });
    }
    res.json({ success: true, message: 'Access granted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN: Revoke access
router.post('/admin/revoke', protect, async (req, res) => {
  const { email, universityId } = req.body;
  try {
    await ResourceAccess.destroy({ where: { email, universityId } });
    res.json({ success: true, message: 'Access revoked successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
