const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SiteSettings = sequelize.define('SiteSettings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  whatsappNumber: {
    type: DataTypes.STRING(20),
    defaultValue: '919876543210',
  },
  phone: {
    type: DataTypes.STRING(20),
    defaultValue: '+91 98765 43210',
  },
  email: {
    type: DataTypes.STRING(255),
    defaultValue: 'info@unientry.com',
  },
  address: {
    type: DataTypes.TEXT,
    defaultValue: 'UniEntry Education Consultancy',
  },
  socialLinks: {
    type: DataTypes.TEXT,
    defaultValue: '{}',
    get() {
      const val = this.getDataValue('socialLinks');
      try { return JSON.parse(val); } catch { return {}; }
    },
    set(val) {
      this.setDataValue('socialLinks', JSON.stringify(val));
    },
  },
  heroTitle: {
    type: DataTypes.STRING(500),
    defaultValue: 'Your Gateway to Global Education',
  },
  heroSubtitle: {
    type: DataTypes.TEXT,
    defaultValue: 'Discover top universities worldwide. Get expert guidance for admissions, visas, and scholarships — all in one place.',
  },
  heroBannerUrl: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  logoUrl: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  faviconUrl: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  aboutText: {
    type: DataTypes.TEXT,
    defaultValue: 'UniEntry is a trusted educational consultancy helping students achieve their dream of studying at top universities worldwide.',
  },
  testimonials: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('testimonials');
      try { return JSON.parse(val); } catch { return []; }
    },
    set(val) {
      this.setDataValue('testimonials', JSON.stringify(val));
    },
  },
  founderName: {
    type: DataTypes.STRING(255),
    defaultValue: 'Dr. Jane Smith',
  },
  founderRole: {
    type: DataTypes.STRING(255),
    defaultValue: 'Founder & CEO, UniEntry',
  },
  founderMessage: {
    type: DataTypes.TEXT,
    defaultValue: 'Education is the passport to the future, for tomorrow belongs to those who prepare for it today. We started UniEntry to bridge the gap between talented students and world-class education.',
  },
  founderImageUrl: {
    type: DataTypes.TEXT,
    defaultValue: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
  },
  coFounderName: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  coFounderRole: {
    type: DataTypes.STRING(255),
    defaultValue: 'Co-Founder',
  },
  coFounderImageUrl: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  aboutMission: {
    type: DataTypes.TEXT,
    defaultValue: 'To democratize access to quality international education by providing expert guidance, comprehensive support, and transparent information to every aspiring student, regardless of their background.',
  },
  aboutVision: {
    type: DataTypes.TEXT,
    defaultValue: 'To become the most trusted and comprehensive education consultancy platform, connecting students with the best universities worldwide and shaping the future leaders of tomorrow.',
  },
  stats: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('stats');
      try { return JSON.parse(val); } catch { return [
        { number: "5000+", label: "Students Guided" },
        { number: "200+", label: "Partner Universities" },
        { number: "15+", label: "Countries" },
        { number: "95%", label: "Visa Success Rate" }
      ]; }
    },
    set(val) {
      this.setDataValue('stats', JSON.stringify(val));
    },
  },
  team: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('team');
      try { return JSON.parse(val); } catch { return [
        { name: "Dr. Rajesh Kumar", role: "Founder & CEO", initials: "RK" },
        { name: "Anita Desai", role: "Head of Admissions", initials: "AD" },
        { name: "Michael Chen", role: "Visa Counselor", initials: "MC" },
        { name: "Sarah Wilson", role: "Career Advisor", initials: "SW" }
      ]; }
    },
    set(val) {
      this.setDataValue('team', JSON.stringify(val));
    },
  },
  smtpHost: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  smtpPort: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  smtpUser: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  smtpPass: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  smtpFrom: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'site_settings',
  timestamps: true,
});

module.exports = SiteSettings;
