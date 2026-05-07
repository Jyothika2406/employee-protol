require('dotenv').config();
const bcrypt = require('bcryptjs');
const { initializeFirebase, getDb } = require('../config/firebase');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    initializeFirebase();
    
    // Get db instance after initialization
    const db = getDb();
    
    if (!db) {
      console.error('❌ Firebase database not initialized');
      process.exit(1);
    }

    // Check if users already exist
    const adminCheck = await db.collection('users').where('email', '==', 'admin@company.com').get();
    
    if (!adminCheck.empty) {
      console.log('✅ Predefined users already exist');
      process.exit(0);
    }

    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const superAdminPassword = await bcrypt.hash('Super@123', 10);

    // Create Admin user
    const adminRef = await db.collection('users').add({
      name: 'Admin User',
      email: 'admin@company.com',
      password: adminPassword,
      phone: '1234567890',
      address: '',
      role: 'admin',
      createdAt: new Date()
    });

    // Create Super Admin user
    const superAdminRef = await db.collection('users').add({
      name: 'Super Admin User',
      email: 'superadmin@company.com',
      password: superAdminPassword,
      phone: '0987654321',
      address: '',
      role: 'superadmin',
      createdAt: new Date()
    });

    // Create salary documents for admin users
    await db.collection('salaries').doc(adminRef.id).set({
      userId: adminRef.id,
      monthlySalary: 0,
      finalSalary: 0,
      daysPresent: 0,
      daysAbsent: 0
    });

    await db.collection('salaries').doc(superAdminRef.id).set({
      userId: superAdminRef.id,
      monthlySalary: 0,
      finalSalary: 0,
      daysPresent: 0,
      daysAbsent: 0
    });

    console.log('✅ Seeding completed successfully!');
    console.log('👤 Admin: admin@company.com / Admin@123');
    console.log('👑 Super Admin: superadmin@company.com / Super@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
