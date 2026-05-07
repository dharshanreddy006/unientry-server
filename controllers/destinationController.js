const Destination = require('../models/Destination');

// GET /api/destinations
exports.getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.findAll({
      where: { active: true },
      order: [['order', 'ASC'], ['createdAt', 'DESC']],
    });
    res.json({ success: true, data: destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/destinations/admin (all including inactive)
exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.findAll({
      order: [['order', 'ASC'], ['createdAt', 'DESC']],
    });
    res.json({ success: true, data: destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/destinations
exports.createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/destinations/:id
exports.updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    await destination.update(req.body);
    res.json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/destinations/:id
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    await destination.destroy();
    res.json({ success: true, message: 'Destination deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
