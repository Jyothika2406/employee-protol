require('dotenv').config();
const bcrypt = require('bcryptjs');
const { initializeFirebase, getDb } = require('../config/firebase');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const addSuperAdmin = async () => {
  try {
    console.log('🔐 Creating New Super Admin User\n');

    initializeFirebase();
    
    const db = getDb();
    
    if (!db) {
      console.error('❌ Firebase database not initialized');
      process.exit(1);
    }

    // Get user input
    const name = await question('Enter Full Name: ');
    const email = await question('Enter Email: ');
    const password = await question('Enter Password: ');
    const phone = await question('Enter Phone Number: ');

    // Validate inputs
    if (!name || !email || !password) {
      console.error('❌ Name, email, and password are required!');
      process.exit(1);
    }

    // Check if email already exists
    const existingUser = await db.collection('users').where('email', '==', email).get();
    
    if (!existingUser.empty) {
      console.error('❌ User with this email already exists!');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Super Admin user
    const userRef = await db.collection('users').add({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone || '',
      address: '',
      role: 'superadmin',
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

    console.log('\n✅ Super Admin created successfully!');
    console.log('👑 Super Admin Details:');
    console.log(`   Name: ${name}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Phone: ${phone || 'Not provided'}`);
    console.log(`   Role: Super Admin`);
    console.log('\n🎉 You can now login with these credentials!');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create super admin:', error);
    rl.close();
    process.exit(1);
  }
};

addSuperAdmin();
