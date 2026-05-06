const { Op } = require('sequelize');
const Internship = require('../models/Internship');

// Helper: transform for frontend
function transformInternship(intern) {
  const plain = intern.toJSON ? intern.toJSON() : intern;
  return {
    _id: plain.id,
    id: plain.id,
    companyName: plain.companyName,
    role: plain.role,
    duration: plain.duration,
    stipend: plain.stipend,
    description: plain.description,
    skills: plain.skills,
    location: plain.location,
    type: plain.type,
    applyLink: plain.applyLink,
    companyLogoUrl: plain.companyLogoUrl,
    active: plain.active,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

// GET /api/internships (public — active only)
exports.getInternships = async (req, res) => {
  try {
    const { search, type } = req.query;
    const where = { active: true };

    if (search) {
      where[Op.or] = [
        { companyName: { [Op.like]: `%${search}%` } },
        { role: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (type) where.type = type;

    const internships = await Internship.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: internships.map(transformInternship) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/internships/all (admin — all)
exports.getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: internships.map(transformInternship) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/internships/:id
exports.getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    res.json({ success: true, data: transformInternship(internship) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/internships
exports.createInternship = async (req, res) => {
  try {
    const internship = await Internship.create(req.body);
    res.status(201).json({ success: true, data: transformInternship(internship) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/internships/:id
exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    await internship.update(req.body);
    res.json({ success: true, data: transformInternship(internship) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/internships/:id
exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    await internship.destroy();
    res.json({ success: true, message: 'Internship deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
