const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

// POST /api/upload — upload a single image
// Accepts both 'image' and 'file' field names for compatibility
router.post('/', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), (req, res) => {
  try {
    // Get the file regardless of which field name was used
    const file = (req.files && (req.files['image']?.[0] || req.files['file']?.[0])) || req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    let baseUrl = `${req.protocol}://${req.get('host')}`;
    if (req.get('host').includes('railway.app')) {
      baseUrl = `https://${req.get('host')}`;
    }
    const imageUrl = `${baseUrl}/uploads/${file.filename}`;

    res.json({
      success: true,
      data: {
        url: imageUrl,
        filename: file.filename,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
