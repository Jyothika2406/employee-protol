#!/usr/bin/env node

/**
 * Firebase Setup Helper Script
 * This script helps you configure Firebase credentials in your .env file
 * 
 * Usage:
 *   node setup-firebase.js
 *   
 * The script will prompt you to enter your Firebase service account credentials
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env');

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function setupFirebase() {
  console.log('\n====================================');
  console.log('Firebase Configuration Setup Helper');
  console.log('====================================\n');

  console.log('To get your Firebase credentials:');
  console.log('1. Go to https://console.firebase.google.com/');
  console.log('2. Select your project (mentneo-ea55a)');
  console.log('3. Click Settings (gear icon) → Project Settings');
  console.log('4. Go to "Service Accounts" tab');
  console.log('5. Click "Generate New Private Key"');
  console.log('6. A JSON file will download\n');

  const projectId = await question('Enter Firebase Project ID (e.g., mentneo-ea55a): ');
  const privateKeyId = await question('Enter FIREBASE_PRIVATE_KEY_ID: ');
  const clientEmail = await question('Enter FIREBASE_CLIENT_EMAIL: ');
  const clientId = await question('Enter FIREBASE_CLIENT_ID: ');
  
  console.log('\nNow enter your private key.');
  console.log('Copy from the service account JSON, including quotes and \\n characters:');
  const privateKey = await question('Paste FIREBASE_PRIVATE_KEY (with quotes): ');

  // Read current .env
  let envContent = fs.readFileSync(envPath, 'utf-8');

  // Update values
  envContent = envContent.replace(
    /FIREBASE_PROJECT_ID=.*/,
    `FIREBASE_PROJECT_ID=${projectId}`
  );
  envContent = envContent.replace(
    /FIREBASE_PRIVATE_KEY_ID=.*/,
    `FIREBASE_PRIVATE_KEY_ID=${privateKeyId}`
  );
  envContent = envContent.replace(
    /FIREBASE_CLIENT_EMAIL=.*/,
    `FIREBASE_CLIENT_EMAIL=${clientEmail}`
  );
  envContent = envContent.replace(
    /FIREBASE_CLIENT_ID=.*/,
    `FIREBASE_CLIENT_ID=${clientId}`
  );
  envContent = envContent.replace(
    /FIREBASE_PRIVATE_KEY=.*/,
    `FIREBASE_PRIVATE_KEY=${privateKey}`
  );

  // Write updated .env
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ Firebase credentials updated in .env file');
  console.log('\nNext steps:');
  console.log('1. Restart your backend server: npm start');
  console.log('2. Create initial users in Firestore');
  console.log('3. Login with your credentials\n');

  rl.close();
}

setupFirebase().catch(err => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
});
