const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Marketplace = sequelize.define('Marketplace', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  price: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  imageUrl: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  category: {
    type: DataTypes.STRING(100),
    defaultValue: 'General',
  },
  universityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  universityName: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  sellerName: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  type: {
    type: DataTypes.ENUM('sell', 'buy'),
    defaultValue: 'sell',
  },
  status: {
    type: DataTypes.ENUM('active', 'sold', 'removed'),
    defaultValue: 'active',
  },
}, {
  tableName: 'marketplace_listings',
  timestamps: true,
});

module.exports = Marketplace;
