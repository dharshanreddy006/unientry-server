const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config({ path: path.join(__dirname, '.env') });

const { connectDB } = require('./config/db');

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware - More permissive CORS for production stability
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', require('./routes/authRoutes'));
app.use('/api/universities', require('./routes/universityRoutes'));
app.use('/api/internships', require('./routes/internshipRoutes'));
app.use('/api/inquiry', require('./routes/inquiryRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'UniEntry API is running 🚀' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Auto-seed if database is empty
const autoSeed = async () => {
  try {
    const University = require('./models/University');
    const Internship = require('./models/Internship');
    const Admin = require('./models/Admin');
    const SiteSettings = require('./models/SiteSettings');
    const Destination = require('./models/Destination');

    // Seed Admin
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      await Admin.create({ email: 'admin@unientry.com', password: 'admin123', role: 'superadmin' });
      console.log('🌱 Admin seeded');
    }

    // Seed SiteSettings
    const settingsCount = await SiteSettings.count();
    if (settingsCount === 0) {
      await SiteSettings.create({
        whatsappNumber: '919876543210',
        phone: '+91 98765 43210',
        email: 'info@unientry.com',
        address: 'UniEntry Education Consultancy, Mumbai, India',
        socialLinks: { facebook: 'https://facebook.com/unientry', instagram: 'https://instagram.com/unientry', twitter: 'https://twitter.com/unientry', linkedin: 'https://linkedin.com/company/unientry', youtube: 'https://youtube.com/unientry' },
        heroTitle: 'Your Gateway to Global Education',
        heroSubtitle: 'Discover top universities worldwide. Get expert guidance for admissions, visas, and scholarships.',
        aboutText: 'UniEntry is a trusted educational consultancy helping students achieve their dream of studying at top universities worldwide.',
        founderName: 'Dr. Jane Smith',
        founderRole: 'Founder & CEO, UniEntry',
        founderMessage: 'Education is the passport to the future, for tomorrow belongs to those who prepare for it today. We started UniEntry to bridge the gap between talented students and world-class education.',
        founderImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
      });
      console.log('🌱 SiteSettings seeded');
    }

    // Seed Universities
    const uniCount = await University.count();
    if (uniCount === 0) {
      await University.bulkCreate([
        { universityName: 'Technical University of Munich', country: 'Germany', city: 'Munich', description: 'The Technical University of Munich (TUM) is one of the top universities in Europe, known for its excellence in engineering, technology, and natural sciences.', tuitionFees: '€300/semester', hostelFees: '€400-600/month', livingCost: '€900/month', duration: '4 Years', degreeType: 'Undergraduate', courses: ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Mathematics', 'Physics', 'Architecture'], eligibilityMarks: '75%', eligibilityIelts: '6.5', eligibilityToefl: '88', eligibilityDocuments: ['Transcripts', 'Passport', 'SOP', 'LOR', 'IELTS/TOEFL', 'CV'], coverImageUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800', featured: true, ranking: '#1 in Germany', website: 'https://www.tum.de' },
        { universityName: 'University of Oxford', country: 'UK', city: 'Oxford', description: 'The University of Oxford is the oldest university in the English-speaking world, consistently ranked among the top universities globally.', tuitionFees: '£9,250-£44,240/year', hostelFees: '£7,500/year', livingCost: '£1,200/month', duration: '3-4 Years', degreeType: 'Undergraduate', courses: ['Law', 'Medicine', 'Philosophy', 'Computer Science', 'Economics', 'Engineering'], eligibilityMarks: '85%', eligibilityIelts: '7.0', eligibilityToefl: '100', eligibilityDocuments: ['Transcripts', 'Passport', 'Personal Statement', 'Academic References', 'IELTS/TOEFL'], coverImageUrl: 'https://images.unsplash.com/photo-1580491934900-8dd4abdfc7cc?w=800', featured: true, ranking: '#1 in UK', website: 'https://www.ox.ac.uk' },
        { universityName: 'Massachusetts Institute of Technology', country: 'USA', city: 'Cambridge', description: 'MIT is a world-renowned institution known for its cutting-edge research and innovative education.', tuitionFees: '$57,986/year', hostelFees: '$12,000/year', livingCost: '$2,000/month', duration: '4 Years', degreeType: 'Undergraduate', courses: ['Computer Science', 'AI & ML', 'Robotics', 'Electrical Engineering', 'Mathematics', 'Physics'], eligibilityMarks: '90%', eligibilityIelts: '7.0', eligibilityToefl: '100', eligibilityDocuments: ['Transcripts', 'Passport', 'SOP', 'LOR', 'SAT/ACT', 'IELTS/TOEFL'], coverImageUrl: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800', featured: true, ranking: '#1 in USA', website: 'https://www.mit.edu' },
        { universityName: 'University of Toronto', country: 'Canada', city: 'Toronto', description: 'The University of Toronto is a globally top-ranked public research university.', tuitionFees: 'CAD $58,160/year', hostelFees: 'CAD $15,000/year', livingCost: 'CAD $1,500/month', duration: '4 Years', degreeType: 'Undergraduate', courses: ['Data Science', 'Business Analytics', 'Engineering', 'Medicine', 'Law', 'Computer Science'], eligibilityMarks: '80%', eligibilityIelts: '6.5', eligibilityToefl: '89', eligibilityDocuments: ['Transcripts', 'Passport', 'SOP', 'LOR', 'IELTS/TOEFL'], coverImageUrl: 'https://images.unsplash.com/photo-1569389397653-c04fe624e663?w=800', featured: true, ranking: '#1 in Canada', website: 'https://www.utoronto.ca' },
        { universityName: 'University of Melbourne', country: 'Australia', city: 'Melbourne', description: 'The University of Melbourne is a public research university, the oldest in Victoria.', tuitionFees: 'AUD $45,000/year', hostelFees: 'AUD $12,000/year', livingCost: 'AUD $1,800/month', duration: '3 Years', degreeType: 'Undergraduate', courses: ['Data Science', 'Architecture', 'Environmental Science', 'Law', 'Medicine', 'Business'], eligibilityMarks: '78%', eligibilityIelts: '6.5', eligibilityToefl: '79', eligibilityDocuments: ['Transcripts', 'Passport', 'SOP', 'IELTS/TOEFL', 'CV'], coverImageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800', featured: true, ranking: '#1 in Australia', website: 'https://www.unimelb.edu.au' },
        { universityName: 'Ludwig Maximilian University', country: 'Germany', city: 'Munich', description: 'LMU Munich is one of the leading universities in Europe, with a tradition spanning over 500 years.', tuitionFees: '€150/semester', hostelFees: '€350-550/month', livingCost: '€850/month', duration: '3 Years', degreeType: 'Postgraduate', courses: ['Business Administration', 'Economics', 'Psychology', 'Political Science', 'Biology', 'Chemistry'], eligibilityMarks: '70%', eligibilityIelts: '6.5', eligibilityToefl: '85', eligibilityDocuments: ['Transcripts', 'Passport', 'SOP', 'LOR', 'IELTS/TOEFL'], coverImageUrl: 'https://images.unsplash.com/photo-1597131628347-c769fc631754?w=800', featured: false, ranking: '#2 in Germany', website: 'https://www.lmu.de' },
      ]);
      console.log('🌱 Universities seeded');
    }

    // Seed Internships
    const internshipCount = await Internship.count();
    if (internshipCount === 0) {
      await Internship.bulkCreate([
        { companyName: 'Google', role: 'Software Engineering Intern', duration: '3 Months', stipend: '$8,000/month', description: 'Join Google as a Software Engineering Intern and work on cutting-edge technology projects.', skills: ['Python', 'Java', 'Data Structures', 'Algorithms', 'System Design'], location: 'Mountain View, CA', type: 'On-site', active: true },
        { companyName: 'Microsoft', role: 'Data Science Intern', duration: '6 Months', stipend: '$7,500/month', description: 'Work on real-world data science projects at Microsoft.', skills: ['Python', 'Machine Learning', 'SQL', 'Azure', 'TensorFlow'], location: 'Redmond, WA', type: 'Hybrid', active: true },
        { companyName: 'Amazon', role: 'Cloud Engineering Intern', duration: '3 Months', stipend: '$7,000/month', description: 'Help build and maintain AWS cloud infrastructure.', skills: ['AWS', 'Linux', 'Docker', 'Kubernetes', 'Python'], location: 'Seattle, WA', type: 'On-site', active: true },
        { companyName: 'Deloitte', role: 'Business Analyst Intern', duration: '6 Months', stipend: '₹40,000/month', description: 'Work with Deloitte consulting team on business transformation projects.', skills: ['Excel', 'SQL', 'PowerBI', 'Communication', 'Problem Solving'], location: 'Mumbai, India', type: 'Hybrid', active: true },
        { companyName: 'Siemens', role: 'Mechanical Engineering Intern', duration: '4 Months', stipend: '€1,500/month', description: 'Join Siemens Engineering team on industrial automation projects.', skills: ['CAD/CAM', 'SolidWorks', 'AutoCAD', 'MATLAB', 'Project Management'], location: 'Munich, Germany', type: 'On-site', active: true },
        { companyName: 'TCS', role: 'Full Stack Developer Intern', duration: '3 Months', stipend: '₹25,000/month', description: 'Develop web applications using modern technologies at TCS.', skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'], location: 'Remote', type: 'Remote', active: true },
      ]);
      console.log('🌱 Internships seeded');
    }

    // Seed Destinations
    const destCount = await Destination.count();
    if (destCount === 0) {
      await Destination.bulkCreate([
        { name: 'Germany', flag: '🇩🇪', imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600', description: 'Low tuition fees, world-class engineering programs, and post-study work opportunities.', order: 1 },
        { name: 'UK', flag: '🇬🇧', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600', description: 'Prestigious universities, shorter degree programs, and diverse cultural experience.', order: 2 },
        { name: 'USA', flag: '🇺🇸', imageUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=600', description: 'Top-ranked universities, extensive research opportunities, and campus life like no other.', order: 3 },
        { name: 'Canada', flag: '🇨🇦', imageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600', description: 'Affordable education, welcoming immigration policies, and excellent quality of life.', order: 4 },
        { name: 'Australia', flag: '🇦🇺', imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600', description: 'Innovative universities, vibrant lifestyle, and strong support for international students.', order: 5 },
        { name: 'India', flag: '🇮🇳', imageUrl: 'https://images.unsplash.com/photo-1524492707947-2f85a64b67ad?w=600', description: 'Rapidly growing education sector, diverse culture, and emerging opportunities in tech and research.', order: 6 },
      ]);
      console.log('🌱 Destinations seeded');
    }

    console.log('✅ Database check/seed completed!');
  } catch (err) {
    console.error('⚠️ Auto-seed error:', err.message);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await autoSeed();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 UniEntry API Server running on port ${PORT}`);
    console.log(`📡 API: http://0.0.0.0:${PORT}/api`);
    console.log(`💾 Database: MySQL (${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || 'unientry'})\n`);
  });
});
