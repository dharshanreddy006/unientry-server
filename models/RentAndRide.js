const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const RentAndRide = sequelize.define('RentAndRide', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  vehicleName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  vehicleType: {
    type: DataTypes.ENUM('Bike', 'Car'),
    allowNull: false,
    defaultValue: 'Bike',
  },
  universityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  price: {
    type: DataTypes.STRING(100),
    defaultValue: 'Contact for Price',
  },
  availableHours: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of hours the vehicle is available for rent',
  },
  availableFrom: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp when the vehicle was marked available',
  },
  status: {
    type: DataTypes.ENUM('Available', 'Not Available'),
    defaultValue: 'Not Available',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
}, {
  tableName: 'rent_and_rides',
  timestamps: true,
});

module.exports = RentAndRide;
