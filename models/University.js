const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const University = sequelize.define('University', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  universityName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tuitionFees: {
    type: DataTypes.STRING(100),
    defaultValue: 'Contact for details',
  },
  hostelFees: {
    type: DataTypes.STRING(100),
    defaultValue: 'Contact for details',
  },
  livingCost: {
    type: DataTypes.STRING(100),
    defaultValue: 'Contact for details',
  },
  duration: {
    type: DataTypes.STRING(50),
    defaultValue: '4 Years',
  },
  degreeType: {
    type: DataTypes.ENUM('Undergraduate', 'Postgraduate', 'Doctorate', 'Diploma'),
    defaultValue: 'Undergraduate',
  },
  courses: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('courses');
      try { return JSON.parse(val); } catch { return []; }
    },
    set(val) {
      this.setDataValue('courses', JSON.stringify(val));
    },
  },
  eligibilityMarks: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  eligibilityIelts: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  eligibilityToefl: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  eligibilityDocuments: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('eligibilityDocuments');
      try { return JSON.parse(val); } catch { return []; }
    },
    set(val) {
      this.setDataValue('eligibilityDocuments', JSON.stringify(val));
    },
  },
  coverImageUrl: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  uniCheatsUrl: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  uniCheats: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('uniCheats');
      try { return JSON.parse(val); } catch { return []; }
    },
    set(val) {
      this.setDataValue('uniCheats', JSON.stringify(val));
    },
  },
  referAndEarn: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  coverImagePublicId: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  images: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('images');
      try { return JSON.parse(val); } catch { return []; }
    },
    set(val) {
      this.setDataValue('images', JSON.stringify(val));
    },
  },
  whatsappNumber: {
    type: DataTypes.STRING(20),
    defaultValue: '',
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  ranking: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  website: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  resourcePrice: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'universities',
  timestamps: true,
});

module.exports = University;
