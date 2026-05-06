const SiteSettings = require('../models/SiteSettings');
const University = require('../models/University');
const Internship = require('../models/Internship');
const Inquiry = require('../models/Inquiry');

// GET /api/settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/settings (admin)
exports.updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      await settings.update(req.body);
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/settings/stats (admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUniversities = await University.count();
    const totalInternships = await Internship.count();
    const totalInquiries = await Inquiry.count();
    const newInquiries = await Inquiry.count({ where: { status: 'new' } });

    const recentInquiries = await Inquiry.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    res.json({
      success: true,
      data: {
        totalUniversities,
        totalInternships,
        totalInquiries,
        newInquiries,
        recentInquiries: recentInquiries.map((inq) => {
          const plain = inq.toJSON();
          return { _id: plain.id, ...plain };
        }),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
