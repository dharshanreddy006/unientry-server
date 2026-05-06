const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Inquiry = sequelize.define('Inquiry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  interestedUniversity: {
    type: DataTypes.STRING(255),
    defaultValue: 'General Inquiry',
  },
  message: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  status: {
    type: DataTypes.ENUM('new', 'contacted', 'resolved'),
    defaultValue: 'new',
  },
}, {
  tableName: 'inquiries',
  timestamps: true,
});

module.exports = Inquiry;
