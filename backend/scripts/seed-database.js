#!/usr/bin/env node

/**
 * Seed Database Script
 * Creates initial admin and demo users in Firebase Firestore
 * 
 * Usage:
 *   node scripts/seed-database.js
 */

require('dotenv').config();
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
} catch (err) {
  console.log('Firebase already initialized');
}

const db = admin.firestore();

async function seedDatabase() {
  console.log('\n====================================');
  console.log('Seeding Firestore Database');
  console.log('====================================\n');

  try {
    // Users to create
    const users = [
      {
        name: 'Admin User',
        email: 'admin@company.com',
        password: 'Admin@123',
        role: 'admin',
        phone: '1234567890',
        address: 'Company Address'
      },
      {
        name: 'Super Admin',
        email: 'superadmin@company.com',
        password: 'Super@123',
        role: 'superadmin',
        phone: '0987654321',
        address: 'Company Address'
      },
      {
        name: 'Employee User',
        email: 'employee@company.com',
        password: 'Employee@123',
        role: 'employee',
        phone: '5551234567',
        address: 'Employee Address'
      }
    ];

    for (const user of users) {
      try {
        // Check if user exists
        const snapshot = await db.collection('users').where('email', '==', user.email).get();
        
        if (!snapshot.empty) {
          console.log(`⏭️  User ${user.email} already exists, skipping...`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Create user
        const userRef = await db.collection('users').add({
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          phone: user.phone,
          address: user.address,
          createdAt: new Date()
        });

        console.log(`✅ Created user: ${user.email} (ID: ${userRef.id})`);

        // Create salary record
        await db.collection('salaries').doc(userRef.id).set({
          userId: userRef.id,
          monthlySalary: user.role === 'admin' ? 100000 : 50000,
          finalSalary: 0,
          daysPresent: 0,
          daysAbsent: 0,
          createdAt: new Date()
        });

        console.log(`✅ Created salary record for ${user.email}`);
      } catch (err) {
        console.error(`❌ Error creating user ${user.email}:`, err.message);
      }
    }

    console.log('\n====================================');
    console.log('✅ Database seeding completed!');
    console.log('====================================\n');

    console.log('You can now login with:');
    console.log('  Email: admin@company.com');
    console.log('  Password: Admin@123\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seedDatabase();
