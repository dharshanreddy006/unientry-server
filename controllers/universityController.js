const { Op } = require('sequelize');
const University = require('../models/University');

// GET /api/universities
exports.getUniversities = async (req, res) => {
  try {
    const { search, country, degreeType, page = 1, limit = 12 } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { universityName: { [Op.like]: `%${search}%` } },
        { country: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (country) where.country = country;
    if (degreeType) where.degreeType = degreeType;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await University.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    // Transform rows to match frontend expectations
    const data = rows.map(transformUniversity);

    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(count / parseInt(limit)),
        total: count,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/universities/featured
exports.getFeaturedUniversities = async (req, res) => {
  try {
    const universities = await University.findAll({
      where: { featured: true },
      limit: 6,
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: universities.map(transformUniversity) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/universities/:id
exports.getUniversityById = async (req, res) => {
  try {
    const university = await University.findByPk(req.params.id);
    if (!university) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }
    res.json({ success: true, data: transformUniversity(university) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/universities
exports.createUniversity = async (req, res) => {
  try {
    const data = flattenUniversityInput(req.body);
    const university = await University.create(data);
    res.status(201).json({ success: true, data: transformUniversity(university) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/universities/:id
exports.updateUniversity = async (req, res) => {
  try {
    const university = await University.findByPk(req.params.id);
    if (!university) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }

    const data = flattenUniversityInput(req.body);
    await university.update(data);
    res.json({ success: true, data: transformUniversity(university) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/universities/:id
exports.deleteUniversity = async (req, res) => {
  try {
    const university = await University.findByPk(req.params.id);
    if (!university) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }
    await university.destroy();
    res.json({ success: true, message: 'University deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper: flatten nested frontend format to flat MySQL columns
function flattenUniversityInput(body) {
  const data = { ...body };

  // Flatten fees
  if (body.fees) {
    data.tuitionFees = body.fees.tuition || '';
    data.hostelFees = body.fees.hostel || '';
    data.livingCost = body.fees.livingCost || '';
    delete data.fees;
  }

  // Flatten eligibility
  if (body.eligibility) {
    data.eligibilityMarks = body.eligibility.marks || '';
    data.eligibilityIelts = body.eligibility.ielts || '';
    data.eligibilityToefl = body.eligibility.toefl || '';
    data.eligibilityDocuments = body.eligibility.documents || [];
    delete data.eligibility;
  }

  // Flatten coverImage
  if (body.coverImage) {
    data.coverImageUrl = body.coverImage.url || '';
    data.coverImagePublicId = body.coverImage.publicId || '';
    delete data.coverImage;
  }

  if (body.uniCheatsUrl !== undefined) {
    data.uniCheatsUrl = body.uniCheatsUrl || '';
  }

  if (body.referAndEarn !== undefined) {
    data.referAndEarn = body.referAndEarn || '';
  }

  // Remove _id if sent from frontend
  delete data._id;

  return data;
}

// Helper: transform flat MySQL row to nested format for frontend
function transformUniversity(uni) {
  const plain = uni.toJSON ? uni.toJSON() : uni;
  return {
    _id: plain.id,
    id: plain.id,
    universityName: plain.universityName,
    country: plain.country,
    city: plain.city,
    description: plain.description,
    duration: plain.duration,
    degreeType: plain.degreeType,
    courses: plain.courses,
    featured: plain.featured,
    ranking: plain.ranking,
    website: plain.website,
    whatsappNumber: plain.whatsappNumber,
    fees: {
      tuition: plain.tuitionFees,
      hostel: plain.hostelFees,
      livingCost: plain.livingCost,
    },
    eligibility: {
      marks: plain.eligibilityMarks,
      ielts: plain.eligibilityIelts,
      toefl: plain.eligibilityToefl,
      documents: plain.eligibilityDocuments,
    },
    coverImage: {
      url: plain.coverImageUrl ? plain.coverImageUrl.replace('http://unientry-server-production.up.railway.app', 'https://unientry-server-production.up.railway.app') : '',
      publicId: plain.coverImagePublicId,
    },
    uniCheatsUrl: plain.uniCheatsUrl ? plain.uniCheatsUrl.replace('http://unientry-server-production.up.railway.app', 'https://unientry-server-production.up.railway.app') : '',
    referAndEarn: plain.referAndEarn || '',
    images: plain.images,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}
