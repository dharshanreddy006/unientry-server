const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Internship = sequelize.define('Internship', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  companyName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  stipend: {
    type: DataTypes.STRING(100),
    defaultValue: 'Unpaid',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  skills: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('skills');
      try { return JSON.parse(val); } catch { return []; }
    },
    set(val) {
      this.setDataValue('skills', JSON.stringify(val));
    },
  },
  location: {
    type: DataTypes.STRING(255),
    defaultValue: 'Remote',
  },
  type: {
    type: DataTypes.ENUM('Remote', 'On-site', 'Hybrid'),
    defaultValue: 'Remote',
  },
  applyLink: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  companyLogoUrl: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'internships',
  timestamps: true,
});

module.exports = Internship;
