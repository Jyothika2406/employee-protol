# Employee Management & Telecaller Reporting System - Production Setup

## Project Overview

This is a complete **Employee Management & Telecaller Reporting System** built with:
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Firebase Firestore
- **Database**: Google Firebase (Firestore)
- **Authentication**: JWT + bcrypt

## Features

✅ **Employee Management**
- Add, edit, delete employees
- Manage employee details and roles
- Track employee status

✅ **Reporting System**
- Daily report submission
- Track calls, leads, conversions
- View historical reports

✅ **Attendance & Salary**
- Mark attendance
- Track salary information
- View salary history

✅ **User Roles**
- Admin (full access)
- Super Admin (system access)
- Employee (limited access)

✅ **Activity Logging**
- Track all actions
- Audit trail
- User activity log

## Prerequisites

- **Node.js** v16+ and npm
- **Firebase Project** - Create at https://console.firebase.google.com/
- **Git** for cloning repository

## Installation & Setup

### Step 1: Configure Firebase

Follow the complete guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) to:
1. Get your Firebase service account credentials
2. Update backend `.env` file with credentials
3. Create Firestore collections
4. Set up initial users

### Step 2: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 3: Run Setup Scripts

```bash
# Configure Firebase credentials (interactive)
cd backend
node setup-firebase.js

# Seed database with initial users
node scripts/seed-database.js

cd ..
```

### Step 4: Start Servers

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
# Server will run on http://localhost:5000
```

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
# Frontend will run on http://localhost:5173
```

### Step 5: Access Application

Open http://localhost:5173 in your browser

**Default Credentials:**
- Email: `admin@company.com`
- Password: `Admin@123`

## Project Structure

```
EP/
├── src/                          # Frontend React code
│   ├── app/
│   │   └── App.tsx              # Main React component
│   ├── api/
│   │   └── client.ts            # API client with all endpoints
│   └── config/
│       └── firebaseConfig.js     # Firebase web config
├── backend/                      # Express backend
│   ├── controllers/              # Business logic
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── reportController.js
│   │   ├── attendanceController.js
│   │   ├── salaryController.js
│   │   ├── bankController.js
│   │   └── logController.js
│   ├── routes/                   # API routes
│   ├── middleware/               # Express middleware
│   ├── config/                   # Configuration files
│   ├── server.js                 # Express server entry
│   ├── .env                      # Environment variables
│   └── package.json
├── FIREBASE_SETUP.md             # Firebase configuration guide
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Add new employee
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Reports
- `GET /api/reports` - Get user's reports
- `GET /api/reports/all` - Get all reports (admin)
- `POST /api/reports` - Submit new report
- `DELETE /api/reports/:id` - Delete report

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/:userId` - Get attendance history

### Salary
- `GET /api/salary/:userId` - Get salary info
- `POST /api/salary/:userId` - Set salary

### Bank Details
- `GET /api/bank/:userId` - Get bank info
- `PUT /api/bank/:userId` - Update bank info

### Logs
- `GET /api/logs` - Get activity logs (admin)

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key

# Firebase (from service account)
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_DATABASE_URL=your-database-url

FRONTEND_URL=http://localhost:5173
```

## Database Schema

### Users Collection
```
{
  name: string
  email: string (unique)
  password: string (bcrypt hashed)
  role: "admin" | "superadmin" | "employee"
  phone: string
  address: string
  createdAt: timestamp
}
```

### Salaries Collection
```
{
  userId: string
  monthlySalary: number
  finalSalary: number
  daysPresent: number
  daysAbsent: number
}
```

### Reports Collection
```
{
  userId: string
  date: timestamp
  calls: number
  leads: number
  conversions: number
  notes: string
}
```

### Attendance Collection
```
{
  userId: string
  date: timestamp
  status: "present" | "absent" | "leave"
  notes: string
}
```

## Troubleshooting

### "Database not configured" Error
- Ensure `.env` file has all Firebase credentials
- Restart backend server after updating `.env`
- Check private key has proper line breaks

### "Invalid email or password"
- Verify user exists in Firestore Users collection
- Check password was created with seed script
- Try with default credentials from seed

### Connection Refused
- Backend not running? Check port 5000
- Frontend not running? Check port 5173
- Run servers in separate terminals

### Firestore Permission Denied
- Update security rules in Firebase Console
- For development, allow read/write for authenticated users
- See FIREBASE_SETUP.md for security rules

## Development

### Start Development Servers
```bash
# Terminal 1
cd backend
npm start

# Terminal 2
npm run dev
```

### Make API Calls
All API requests must include JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

### Add New Endpoints
1. Create controller in `backend/controllers/`
2. Create routes in `backend/routes/`
3. Add route to `backend/server.js`
4. Mount route in Express app

### Build for Production
```bash
npm run build
# Creates dist/ folder with optimized build
```

## Deployment

### Frontend (Static Hosting)
```bash
npm run build
# Upload dist/ folder to Netlify, Vercel, or Firebase Hosting
```

### Backend (Server)
```bash
cd backend
npm install --production
NODE_ENV=production npm start
# Deploy to Heroku, AWS, DigitalOcean, etc.
```

## Security Notes

⚠️ **Important for Production:**
- Change `JWT_SECRET` to a random strong key
- Never commit `.env` file with real credentials
- Use HTTPS in production
- Set proper CORS origins
- Enable Firestore security rules
- Regularly rotate service account keys
- Use environment variables for all secrets

## Support & Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Firestore Documentation](https://cloud.google.com/firestore/docs)

## License

This project is proprietary. All rights reserved.

---

**For complete Firebase setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**
