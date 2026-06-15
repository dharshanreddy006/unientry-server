const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

// Separate multer instance for chunks (no fileFilter or extension check on intermediate chunks)
const tempUpload = multer({ dest: path.join(__dirname, '..', 'uploads', 'temp') });

// Ensure chunks directory exists
const chunksDir = path.join(__dirname, '..', 'uploads', 'chunks');
if (!fs.existsSync(chunksDir)) {
  fs.mkdirSync(chunksDir, { recursive: true });
}

// POST /api/upload — upload a single image
router.post('/', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), (req, res) => {
  try {
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

// POST /api/upload/chunk — upload a chunk of a file
router.post('/chunk', protect, tempUpload.single('chunk'), async (req, res) => {
  try {
    const file = req.file;
    const { filename, chunkIndex, totalChunks } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No chunk uploaded' });
    }

    const idx = parseInt(chunkIndex, 10);
    const total = parseInt(totalChunks, 10);

    // Sanitize and create directory for this upload session
    const safeFilename = path.basename(filename);
    const fileChunksDir = path.join(chunksDir, safeFilename);
    if (!fs.existsSync(fileChunksDir)) {
      fs.mkdirSync(fileChunksDir, { recursive: true });
    }

    // Move chunk to directory with its index as the filename
    const tempPath = file.path;
    const chunkPath = path.join(fileChunksDir, idx.toString());
    fs.renameSync(tempPath, chunkPath);

    // Check if we have received all chunks
    const files = fs.readdirSync(fileChunksDir);
    if (files.length === total) {
      // Generate a unique final name
      const finalFileName = Date.now() + '-' + safeFilename;
      const finalPath = path.join(__dirname, '..', 'uploads', finalFileName);
      
      const writeStream = fs.createWriteStream(finalPath);
      
      for (let i = 0; i < total; i++) {
        const currentChunkPath = path.join(fileChunksDir, i.toString());
        const data = fs.readFileSync(currentChunkPath);
        writeStream.write(data);
        fs.unlinkSync(currentChunkPath); // Delete chunk after writing
      }
      
      writeStream.end();
      
      // Clean up the temporary folder
      fs.rmdirSync(fileChunksDir);

      let baseUrl = `${req.protocol}://${req.get('host')}`;
      if (req.get('host').includes('railway.app')) {
        baseUrl = `https://${req.get('host')}`;
      }
      const finalUrl = `${baseUrl}/uploads/${finalFileName}`;

      return res.json({
        success: true,
        data: {
          url: finalUrl,
          filename: finalFileName,
        },
      });
    }

    res.json({ success: true, message: `Chunk ${idx + 1}/${total} uploaded` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
