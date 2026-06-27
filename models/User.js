const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  profilePicture: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('student', 'business', 'university_official'),
    defaultValue: 'student',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verificationTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Virtual mappings for database specifications
  full_name: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.name;
    },
    set(value) {
      this.setDataValue('name', value);
    }
  },
  password_hash: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.password;
    },
    set(value) {
      this.setDataValue('password', value);
    }
  },
  profile_photo: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.profilePicture;
    },
    set(value) {
      this.setDataValue('profilePicture', value);
    }
  },
  phone_number: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.phone;
    },
    set(value) {
      this.setDataValue('phone', value);
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password') && user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
});

User.prototype.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;

