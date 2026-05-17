const RentAndRide = require('../models/RentAndRide');
const University = require('../models/University');

exports.getAll = async (req, res) => {
  try {
    const { universityId } = req.query;
    let where = {};
    if (universityId) where.universityId = universityId;

    const vehicles = await RentAndRide.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    // Check expiration dynamically
    const updatedVehicles = vehicles.map(v => {
      let isAvailable = v.status === 'Available';
      if (v.availableFrom && v.availableHours > 0) {
        const expiresAt = new Date(v.availableFrom.getTime() + v.availableHours * 60 * 60 * 1000);
        if (new Date() > expiresAt) {
          isAvailable = false;
        }
      }
      return {
        ...v.toJSON(),
        isAvailable
      };
    });

    res.json({ success: true, data: updatedVehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const vehicle = await RentAndRide.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (data.status === 'Available') {
      data.availableFrom = new Date();
    }
    const vehicle = await RentAndRide.create(data);
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const vehicle = await RentAndRide.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Not found' });

    const data = req.body;
    if (data.status === 'Available' && vehicle.status !== 'Available') {
      data.availableFrom = new Date();
    }

    await vehicle.update(data);
    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const vehicle = await RentAndRide.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Not found' });

    await vehicle.destroy();
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
