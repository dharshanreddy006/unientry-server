const SiteSettings = require('../models/SiteSettings');
const University = require('../models/University');
const Accommodation = require('../models/Accommodation');
const Inquiry = require('../models/Inquiry');

// GET /api/settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    const plain = settings.toJSON ? settings.toJSON() : settings;
    if (plain.founderImageUrl) {
      plain.founderImageUrl = plain.founderImageUrl.replace('http://unientry-server-production.up.railway.app', 'https://unientry-server-production.up.railway.app');
    }
    if (plain.coFounderImageUrl) {
      plain.coFounderImageUrl = plain.coFounderImageUrl.replace('http://unientry-server-production.up.railway.app', 'https://unientry-server-production.up.railway.app');
    }
    res.json({ success: true, data: plain });
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
    const totalAccommodations = await Accommodation.count();
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
        totalAccommodations,
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
