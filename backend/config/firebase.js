const admin = require('firebase-admin');

let db;
let auth;

const initializeFirebase = () => {
  try {
    // Check if Firebase credentials are configured
    if (!process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY.includes('your_private_key_here')) {
      console.log('⚠️  Firebase credentials not configured. Configure .env with your Firebase service account credentials.');
      console.log('📝 See backend/QUICKSTART.md or SETUP_GUIDE.md for Firebase setup instructions.');
      return;
    }

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

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });

    db = admin.firestore();
    auth = admin.auth();

    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization error (API calls will fail until configured):', error.message);
  }
};

module.exports = { 
  initializeFirebase, 
  getDb: () => db,
  getAuth: () => auth,
  db,
  auth
};
