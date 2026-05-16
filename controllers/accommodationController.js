const Accommodation = require('../models/Accommodation');
const University = require('../models/University');

function transformAccommodation(item) {
  const plain = item.toJSON ? item.toJSON() : item;
  return { ...plain, _id: plain.id };
}

exports.getAccommodations = async (req, res) => {
  try {
    const { universityId, search } = req.query;
    let where = { active: true };
    
    if (universityId) {
      where.universityId = universityId;
    }

    const items = await Accommodation.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: items.map(transformAccommodation) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllAccommodations = async (req, res) => {
  try {
    const items = await Accommodation.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: items.map(transformAccommodation) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAccommodationById = async (req, res) => {
  try {
    const item = await Accommodation.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Accommodation not found' });
    }
    res.json({ success: true, data: transformAccommodation(item) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAccommodation = async (req, res) => {
  try {
    const item = await Accommodation.create(req.body);
    res.status(201).json({ success: true, data: transformAccommodation(item) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAccommodation = async (req, res) => {
  try {
    const item = await Accommodation.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Accommodation not found' });
    }
    await item.update(req.body);
    res.json({ success: true, data: transformAccommodation(item) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAccommodation = async (req, res) => {
  try {
    const item = await Accommodation.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Accommodation not found' });
    }
    await item.destroy();
    res.json({ success: true, message: 'Accommodation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
