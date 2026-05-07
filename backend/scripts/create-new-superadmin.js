require('dotenv').config();
const bcrypt = require('bcryptjs');
const { initializeFirebase, getDb } = require('../config/firebase');

const createNewSuperAdmin = async () => {
  try {
    console.log('🔐 Creating New Super Admin User\n');

    initializeFirebase();
    
    const db = getDb();
    
    if (!db) {
      console.error('❌ Firebase database not initialized');
      process.exit(1);
    }

    // New Super Admin Details
    const newSuperAdmin = {
      name: 'M Sravani',
      email: 'sravani@company.com',
      password: 'Sravani@2024',
      phone: '9876543210',
      address: '',
      role: 'superadmin'
    };

    // Check if email already exists
    const existingUser = await db.collection('users').where('email', '==', newSuperAdmin.email).get();
    
    if (!existingUser.empty) {
      console.error('❌ User with this email already exists!');
      console.log('💡 Try using a different email address.');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(newSuperAdmin.password, 10);

    // Create Super Admin user
    const userRef = await db.collection('users').add({
      name: newSuperAdmin.name,
      email: newSuperAdmin.email,
      password: hashedPassword,
      phone: newSuperAdmin.phone,
      address: newSuperAdmin.address,
      role: newSuperAdmin.role,
      createdAt: new Date()
    });

    // Create salary document
    await db.collection('salaries').doc(userRef.id).set({
      userId: userRef.id,
      monthlySalary: 0,
      finalSalary: 0,
      daysPresent: 0,
      daysAbsent: 0
    });

    console.log('✅ Super Admin created successfully!\n');
    console.log('👑 New Super Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Name:     ${newSuperAdmin.name}`);
    console.log(`   Email:    ${newSuperAdmin.email}`);
    console.log(`   Password: ${newSuperAdmin.password}`);
    console.log(`   Phone:    ${newSuperAdmin.phone}`);
    console.log(`   Role:     Super Admin`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 You can now login at: http://localhost:5175/');

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create super admin:', error.message);
    process.exit(1);
  }
};

createNewSuperAdmin();
