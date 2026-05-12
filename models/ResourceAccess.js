const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ResourceAccess = sequelize.define('ResourceAccess', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  universityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'granted'),
    defaultValue: 'pending',
  },
  paymentScreenshot: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
}, {
  tableName: 'resource_access',
  timestamps: true,
});

module.exports = ResourceAccess;
