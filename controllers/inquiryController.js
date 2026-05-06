const Inquiry = require('../models/Inquiry');

// Helper: transform for frontend
function transformInquiry(inq) {
  const plain = inq.toJSON ? inq.toJSON() : inq;
  return { _id: plain.id, ...plain };
}

// POST /api/inquiry/create
exports.createInquiry = async (req, res) => {
  try {
    const { studentName, email, phone, interestedUniversity, message } = req.body;

    if (!studentName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and phone number',
      });
    }

    const inquiry = await Inquiry.create({
      studentName,
      email,
      phone,
      interestedUniversity,
      message,
    });

    res.status(201).json({ success: true, data: transformInquiry(inquiry) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/inquiry/all (admin)
exports.getAllInquiries = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const inquiries = await Inquiry.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: inquiries.map(transformInquiry) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/inquiry/:id (admin)
exports.updateInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    await inquiry.update(req.body);
    res.json({ success: true, data: transformInquiry(inquiry) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/inquiry/:id (admin)
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    await inquiry.destroy();
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
