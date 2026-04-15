# Firebase Setup & Configuration Guide

## Overview
This application uses Firebase Firestore as the database. To use the application with real data, you must configure Firebase credentials.

## Prerequisites
- Firebase Project created at https://console.firebase.google.com/
- Node.js and npm installed
- Backend and frontend servers ready

## Step 1: Get Your Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (mentneo-ea55a)
3. Click **Settings** (gear icon) → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. A JSON file will download - **keep this file secure**

## Step 2: Extract Firebase Credentials

Open the downloaded JSON file, you'll see this structure:
```json
{
  "type": "service_account",
  "project_id": "mentneo-ea55a",
  "private_key_id": "key123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

## Step 3: Update Backend .env File

Edit `/backend/.env` and replace with your credentials:

```env
# Server
PORT=5000
NODE_ENV=development

# JWT (change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Firebase Configuration (from service account JSON)
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=mentneo-ea55a
FIREBASE_PRIVATE_KEY_ID=<copy from JSON>
FIREBASE_PRIVATE_KEY="<copy full private_key from JSON, keep the \n characters>"
FIREBASE_CLIENT_EMAIL=<copy from JSON>
FIREBASE_CLIENT_ID=<copy from JSON>
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_DATABASE_URL=https://mentneo-ea55a.firebaseio.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## Step 4: Create Firestore Collections

The app requires these Firestore collections:

### Users Collection
```
users/
├── {userId}
│   ├── name: "Admin User"
│   ├── email: "admin@company.com"
│   ├── password: "<bcrypt hash>"
│   ├── role: "admin" | "employee" | "superadmin"
│   ├── phone: "1234567890"
│   ├── address: ""
│   └── createdAt: timestamp
```

### Salaries Collection
```
salaries/
├── {userId}
│   ├── userId: "{userId}"
│   ├── monthlySalary: 50000
│   ├── finalSalary: 48000
│   ├── daysPresent: 25
│   └── daysAbsent: 2
```

### Reports Collection
```
reports/
├── {reportId}
│   ├── userId: "{userId}"
│   ├── date: timestamp
│   ├── calls: 150
│   ├── leads: 30
│   ├── conversions: 5
│   └── notes: ""
```

### Attendance Collection
```
attendance/
├── {attendanceId}
│   ├── userId: "{userId}"
│   ├── date: timestamp
│   ├── status: "present" | "absent" | "leave"
│   └── notes: ""
```

### Logs Collection
```
logs/
├── {logId}
│   ├── userId: "{userId}"
│   ├── action: "Created new employee"
│   ├── timestamp: timestamp
│   └── details: {}
```

## Step 5: Set Up Initial Users

You need to create at least one admin user. Use this Node.js script:

```javascript
// Script to create initial admin user
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function createAdminUser() {
  const password = await bcrypt.hash('Admin@123', 10);
  
  const userRef = await db.collection('users').add({
    name: 'Admin User',
    email: 'admin@company.com',
    password: password,
    role: 'admin',
    phone: '1234567890',
    address: 'Company Address',
    createdAt: new Date()
  });

  console.log('Admin user created with ID:', userRef.id);
  process.exit(0);
}

createAdminUser().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
```

## Step 6: Restart Servers

```bash
# Terminal 1: Start Backend
cd backend
npm start

# Terminal 2: Start Frontend
cd ..
npm run dev
```

## Step 7: Test Login

1. Open http://localhost:5173
2. Login with:
   - Email: admin@company.com
   - Password: Admin@123
3. You should see the dashboard

## Troubleshooting

### "Database not configured" Error
- Check that .env file has all Firebase credentials
- Restart the backend server after updating .env
- Verify FIREBASE_PRIVATE_KEY has proper line breaks

### "Invalid email or password"
- Make sure user exists in Firestore
- Verify password was hashed with bcrypt when creating user
- Check email is exact match (case-sensitive)

### Connection Refused
- Make sure both backend and frontend servers are running
- Check ports: Backend on 5000, Frontend on 5173
- No firewall blocking localhost connections

### Firestore Rules Error
- Go to Firebase Console → Firestore → Rules
- Set rules to allow read/write (for development):
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if request.auth != null;
      }
    }
  }
  ```

## Next Steps
1. Create additional users through admin panel
2. Add employees through the application
3. Submit reports and track attendance
4. View salaries and employee data

For more help, check Firebase documentation: https://firebase.google.com/docs
