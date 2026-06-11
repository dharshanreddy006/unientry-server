const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Accommodation = sequelize.define('Accommodation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  propertyName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  roomType: {
    type: DataTypes.STRING(255),
    allowNull: false, // Single, Shared, Studio, etc.
  },
  price: {
    type: DataTypes.STRING(100),
    defaultValue: 'Contact for Price',
  },
  distance: {
    type: DataTypes.STRING(100),
    defaultValue: 'Near University',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  amenities: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('amenities');
      try { return JSON.parse(val); } catch { return []; }
    },
    set(val) {
      this.setDataValue('amenities', JSON.stringify(val));
    },
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  universityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.TEXT,
    defaultValue: '',
    get() {
      const val = this.getDataValue('imageUrl');
      if (!val) return [];
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
        return [val];
      } catch {
        if (val.includes(',')) {
          return val.split(',').map(s => s.trim()).filter(Boolean);
        }
        return [val];
      }
    },
    set(val) {
      if (Array.isArray(val)) {
        this.setDataValue('imageUrl', JSON.stringify(val));
      } else {
        this.setDataValue('imageUrl', val || '');
      }
    },
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'accommodations',
  timestamps: true,
});

module.exports = Accommodation;
