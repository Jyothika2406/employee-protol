# 🚀 Backend Setup - Quick Start

## Files Created

Your backend project structure:

```
backend/
├── server.js                      # Main express server
├── package.json                   # Dependencies
├── .env                          # Environment variables (CONFIGURE THIS!)
├── .env.example                  # Example env file
├── .gitignore                    # Git ignore rules
├── README.md                     # Full API documentation
├── config/
│   └── firebase.js              # Firebase configuration
├── middleware/
│   └── auth.js                  # JWT & role verification
├── controllers/
│   ├── authController.js        # Login logic
│   ├── employeeController.js    # Employee management
│   ├── reportController.js      # Reports system
│   ├── attendanceController.js  # Attendance tracking
│   ├── salaryController.js      # Salary calculation
│   ├── bankController.js        # Bank details
│   └── logController.js         # Activity logging
├── routes/
│   ├── auth.js                  # /api/auth/*
│   ├── employee.js              # /api/employees/*
│   ├── report.js                # /api/reports/*
│   ├── attendance.js            # /api/attendance/*
│   ├── salary.js                # /api/salary/*
│   ├── bank.js                  # /api/bank/*
│   └── logs.js                  # /api/logs/*
└── scripts/
    └── seed.js                  # Database seeding script
```

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Setup Firebase (CRITICAL!)
1. Go to https://console.firebase.google.com
2. Create new project
3. Enable Firestore Database
4. Get Service Account key (Settings → Service Accounts → Generate Key)

### Step 3: Configure .env

Edit `backend/.env` and add your Firebase credentials:

```
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_PRIVATE_KEY_ID=your_key_id_here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_email@project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id_here
```

See SETUP_GUIDE.md for detailed Firebase setup instructions.

### Step 4: Seed the Database
```bash
npm run seed
```

Creates admin users:
- Admin: admin@company.com / Admin@123
- Super Admin: superadmin@company.com / Super@123

### Step 5: Start Backend
```bash
npm start
```

Server runs on: `http://localhost:5000`

---

## 📡 Test the APIs

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "Admin@123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "xxx",
    "name": "Admin User",
    "email": "admin@company.com",
    "role": "admin"
  }
}
```

### Get My Profile
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 Key API Routes

All protected routes require: `Authorization: Bearer {token}`

**Authentication**
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

**Employees (Admin Only)**
- POST `/api/employees` - Add employee
- GET `/api/employees` - Get all employees
- PUT `/api/employees/:id` - Update employee
- DELETE `/api/employees/:id` - Delete employee

**Reports (All Users)**
- POST `/api/reports` - Add report
- GET `/api/reports/my` - Get my reports
- GET `/api/reports/all` - Get all reports (Admin)
- PUT `/api/reports/:id` - Update report
- DELETE `/api/reports/:id` - Delete report

**Attendance**
- POST `/api/attendance` - Mark attendance
- GET `/api/attendance` - Get my attendance
- GET `/api/attendance/all` - Get all attendance (Admin)

**Salary**
- GET `/api/salary/:userId` - Get salary details
- POST `/api/salary/set` - Set salary (Admin)

**Bank**
- GET `/api/bank/:userId` - Get bank details
- PUT `/api/bank` - Update bank details (Admin)

**Logs (Super Admin Only)**
- GET `/api/logs` - View activity logs

---

## 🔑 User Roles

### Employee
- Own profile only
- Own reports only
- Own attendance only
- Own salary (read-only)

### Admin
- All employees
- All reports
- Set salaries
- Manage bank details

### Super Admin
- Everything admin can do
- View activity logs
- Monitor all actions

---

## ✅ Production Checklist

Before deploying:

- [ ] Change JWT_SECRET in .env
- [ ] Use strong FIREBASE credentials
- [ ] Enable Firebase Security Rules
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS only
- [ ] Add rate limiting
- [ ] Setup error logging
- [ ] Configure CORS properly
- [ ] Use environment variables for all secrets
- [ ] Test all APIs thoroughly

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Firebase error | Check .env credentials, verify Firestore is enabled |
| Login fails | Ensure admin user was seeded (`npm run seed`) |
| CORS error | Check FRONTEND_URL in .env |
| Token invalid | Token expired after 7 days, login again |
| Permission denied | User doesn't have required role |
| Database empty | Run `npm run seed` to create tables |

---

## 📞 Support

See full documentation:
- Backend API Docs: `backend/README.md`
- Setup Guide: `SETUP_GUIDE.md`
- Frontend Integration: Check setup guide for React examples

---

## 🎉 Next Steps

1. ✅ Backend is setup and running
2. 🔄 Integrate frontend with API endpoints
3. 📊 Test all workflows
4. 🚀 Deploy to production

**Backend is ready! Start integrating with frontend.** 💻
