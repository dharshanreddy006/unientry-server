const dotenv = require('dotenv');
dotenv.config();

const { connectDB, sequelize } = require('./config/db');
const University = require('./models/University');
const Internship = require('./models/Internship');
const Inquiry = require('./models/Inquiry');
const Admin = require('./models/Admin');
const SiteSettings = require('./models/SiteSettings');

const universities = [
  {
    universityName: 'Technical University of Munich',
    country: 'Germany',
    city: 'Munich',
    description: 'The Technical University of Munich (TUM) is one of the top universities in Europe, known for its excellence in engineering, technology, and natural sciences. TUM consistently ranks among the best technical universities worldwide.',
    tuitionFees: '€300/semester',
    hostelFees: '€400-600/month',
    livingCost: '€900/month',
    duration: '4 Years',
    degreeType: 'Undergraduate',
    courses: ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Mathematics', 'Physics', 'Architecture'],
    eligibilityMarks: '75%',
    eligibilityIelts: '6.5',
    eligibilityToefl: '88',
    eligibilityDocuments: ['Transcripts', 'Passport', 'SOP', 'LOR', 'IELTS/TOEFL', 'CV'],
    coverImageUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800',
    featured: true,
    ranking: '#1 in Germany',
    website: 'https://www.tum.de',
  },
  {
    universityName: 'University of Oxford',
    country: 'UK',
    city: 'Oxford',
    description: 'The University of Oxford is the oldest university in the English-speaking world, with evidence of teaching dating back to 1096. It is consistently ranked among the top universities globally.',
    tuitionFees: '£9,250-£44,240/year',
    hostelFees: '£7,500/year',
    livingCost: '£1,200/month',
    duration: '3-4 Years',
    degreeType: 'Undergraduate',
    courses: ['Law', 'Medicine', 'Philosophy', 'Computer Science', 'Economics', 'Engineering'],
    eligibilityMarks: '85%',
    eligibilityIelts: '7.0',
    eligibilityToefl: '100',
    eligibilityDocuments: ['Transcripts', 'Passport', 'Personal Statement', 'Academic References', 'IELTS/TOEFL'],
    coverImageUrl: 'https://images.unsplash.com/photo-1580491934900-8dd4abdfc7cc?w=800',
    featured: true,
    ranking: '#1 in UK',
    website: 'https://www.ox.ac.uk',
  },
  {
    universityName: 'Massachusetts Institute of Technology',
    country: 'USA',
    city: 'Cambridge',
    description: 'MIT is a world-renowned institution of higher learning known for its cutting-edge research and innovative education. MIT has played a key role in the development of many areas of modern technology and science.',
    tuitionFees: '$57,986/year',
    hostelFees: '$12,000/year',
    livingCost: '$2,000/month',
    duration: '4 Years',
    degreeType: 'Undergraduate',
    courses: ['Computer Science', 'AI & ML', 'Robotics', 'Electrical Engineering', 'Mathematics', 'Physics'],
    eligibilityMarks: '90%',
    eligibilityIelts: '7.0',
    eligibilityToefl: '100',
    eligibilityDocuments: ['Transcripts', 'Passport', 'SOP', 'LOR', 'SAT/ACT', 'IELTS/TOEFL'],
    coverImageUrl: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800',
    featured: true,
    ranking: '#1 in USA',
    website: 'https://www.mit.edu',
  },
  {
    universityName: 'University of Toronto',
    country: 'Canada',
    city: 'Toronto',
    description: 'The University of Toronto is a globally top-ranked public research university in Toronto, Ontario, Canada. It is one of the most prestigious universities in the world.',
    tuitionFees: 'CAD $58,160/year',
    hostelFees: 'CAD $15,000/year',
    livingCost: 'CAD $1,500/month',
    duration: '4 Years',
    degreeType: 'Undergraduate',
    courses: ['Data Science', 'Business Analytics', 'Engineering', 'Medicine', 'Law', 'Computer Science'],
    eligibilityMarks: '80%',
    eligibilityIelts: '6.5',
    eligibilityToefl: '89',
    eligibilityDocuments: ['Transcripts', 'Passport', 'SOP', 'LOR', 'IELTS/TOEFL'],
    coverImageUrl: 'https://images.unsplash.com/photo-1569389397653-c04fe624e663?w=800',
    featured: true,
    ranking: '#1 in Canada',
    website: 'https://www.utoronto.ca',
  },
  {
    universityName: 'University of Melbourne',
    country: 'Australia',
    city: 'Melbourne',
    description: 'The University of Melbourne is a public research university located in Melbourne, Victoria, Australia. It is the second oldest university in Australia and the oldest in Victoria.',
    tuitionFees: 'AUD $45,000/year',
    hostelFees: 'AUD $12,000/year',
    livingCost: 'AUD $1,800/month',
    duration: '3 Years',
    degreeType: 'Undergraduate',
    courses: ['Data Science', 'Architecture', 'Environmental Science', 'Law', 'Medicine', 'Business'],
    eligibilityMarks: '78%',
    eligibilityIelts: '6.5',
    eligibilityToefl: '79',
    eligibilityDocuments: ['Transcripts', 'Passport', 'SOP', 'IELTS/TOEFL', 'CV'],
    coverImageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    featured: true,
    ranking: '#1 in Australia',
    website: 'https://www.unimelb.edu.au',
  },
  {
    universityName: 'Ludwig Maximilian University',
    country: 'Germany',
    city: 'Munich',
    description: 'LMU Munich is one of the leading universities in Europe, with a tradition spanning over 500 years. It offers a wide range of programs across various disciplines.',
    tuitionFees: '€150/semester',
    hostelFees: '€350-550/month',
    livingCost: '€850/month',
    duration: '3 Years',
    degreeType: 'Postgraduate',
    courses: ['Business Administration', 'Economics', 'Psychology', 'Political Science', 'Biology', 'Chemistry'],
    eligibilityMarks: '70%',
    eligibilityIelts: '6.5',
    eligibilityToefl: '85',
    eligibilityDocuments: ['Transcripts', 'Passport', 'SOP', 'LOR', 'IELTS/TOEFL'],
    coverImageUrl: 'https://images.unsplash.com/photo-1597131628347-c769fc631754?w=800',
    featured: false,
    ranking: '#2 in Germany',
    website: 'https://www.lmu.de',
  },
];

const internships = [
  {
    companyName: 'Google',
    role: 'Software Engineering Intern',
    duration: '3 Months',
    stipend: '$8,000/month',
    description: 'Join Google as a Software Engineering Intern and work on cutting-edge technology projects. You\'ll collaborate with world-class engineers on products used by billions.',
    skills: ['Python', 'Java', 'Data Structures', 'Algorithms', 'System Design'],
    location: 'Mountain View, CA',
    type: 'On-site',
    active: true,
  },
  {
    companyName: 'Microsoft',
    role: 'Data Science Intern',
    duration: '6 Months',
    stipend: '$7,500/month',
    description: 'Work on real-world data science projects at Microsoft. Apply machine learning and AI techniques to solve complex business problems.',
    skills: ['Python', 'Machine Learning', 'SQL', 'Azure', 'TensorFlow'],
    location: 'Redmond, WA',
    type: 'Hybrid',
    active: true,
  },
  {
    companyName: 'Amazon',
    role: 'Cloud Engineering Intern',
    duration: '3 Months',
    stipend: '$7,000/month',
    description: 'Help build and maintain AWS cloud infrastructure. Work with cutting-edge cloud technologies and contribute to products used by millions.',
    skills: ['AWS', 'Linux', 'Docker', 'Kubernetes', 'Python'],
    location: 'Seattle, WA',
    type: 'On-site',
    active: true,
  },
  {
    companyName: 'Deloitte',
    role: 'Business Analyst Intern',
    duration: '6 Months',
    stipend: '₹40,000/month',
    description: 'Work with Deloitte\'s consulting team on real business transformation projects. Gain exposure to industry-leading methodologies and frameworks.',
    skills: ['Excel', 'SQL', 'PowerBI', 'Communication', 'Problem Solving'],
    location: 'Mumbai, India',
    type: 'Hybrid',
    active: true,
  },
  {
    companyName: 'Siemens',
    role: 'Mechanical Engineering Intern',
    duration: '4 Months',
    stipend: '€1,500/month',
    description: 'Join Siemens Engineering team and work on industrial automation and manufacturing projects. Get hands-on experience with world-class engineering.',
    skills: ['CAD/CAM', 'SolidWorks', 'AutoCAD', 'MATLAB', 'Project Management'],
    location: 'Munich, Germany',
    type: 'On-site',
    active: true,
  },
  {
    companyName: 'TCS',
    role: 'Full Stack Developer Intern',
    duration: '3 Months',
    stipend: '₹25,000/month',
    description: 'Develop web applications using modern technologies at TCS. Work on real client projects and gain industry experience.',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
    location: 'Remote',
    type: 'Remote',
    active: true,
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Inquiry.destroy({ where: {} });
    await Internship.destroy({ where: {} });
    await University.destroy({ where: {} });
    await Admin.destroy({ where: {} });
    await SiteSettings.destroy({ where: {} });

    console.log('🎓 Seeding universities...');
    await University.bulkCreate(universities);

    console.log('💼 Seeding internships...');
    await Internship.bulkCreate(internships);

    console.log('👤 Creating admin user...');
    await Admin.create({
      email: 'admin@unientry.com',
      password: 'admin123',
      role: 'superadmin',
    });

    console.log('⚙️  Creating site settings...');
    await SiteSettings.create({
      whatsappNumber: '919876543210',
      phone: '+91 98765 43210',
      email: 'info@unientry.com',
      address: 'UniEntry Education Consultancy, Mumbai, Maharashtra, India',
      socialLinks: {
        facebook: 'https://facebook.com/unientry',
        instagram: 'https://instagram.com/unientry',
        twitter: 'https://twitter.com/unientry',
        linkedin: 'https://linkedin.com/company/unientry',
        youtube: 'https://youtube.com/unientry',
      },
      heroTitle: 'Your Gateway to Global Education',
      heroSubtitle: 'Discover top universities worldwide. Get expert guidance for admissions, visas, and scholarships — all in one place.',
      aboutText: 'UniEntry is a trusted educational consultancy helping students achieve their dream of studying at top universities worldwide.',
      founderName: 'Dr. Jane Smith',
      founderRole: 'Founder & CEO, UniEntry',
      founderMessage: 'Education is the passport to the future, for tomorrow belongs to those who prepare for it today. We started UniEntry to bridge the gap between talented students and world-class education.',
      founderImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
    });

    console.log('\n✅ Database seeded successfully!');
    console.log('📊 Summary:');
    console.log(`   • ${universities.length} Universities`);
    console.log(`   • ${internships.length} Internships`);
    console.log('   • 1 Admin (admin@unientry.com / admin123)');
    console.log('   • 1 Site Settings\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
