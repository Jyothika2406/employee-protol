# Employee Management & Telecaller Reporting System - Backend

Complete backend API for the Employee Portal system using Node.js, Express, and Firebase.

## 🚀 Features

✅ **Authentication** - JWT-based login with role-based access control  
✅ **Employee Management** - Add, edit, delete employees (Admin only)  
✅ **Attendance Tracking** - Mark and view attendance records  
✅ **Reports System** - Employees submit daily reports (leads, calls, revenue, etc.)  
✅ **Salary Calculation** - Auto-calculated based on attendance  
✅ **Bank Details** - Store and manage bank information (Admin only)  
✅ **Activity Logs** - Track all system changes (Super Admin only)  
✅ **Firebase Integration** - Firestore database with real-time updates  

---

## 📋 Prerequisites

- Node.js 14+ 
- npm or yarn
- Firebase Project (Firestore database)

---

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Go to **Settings** → **Service Accounts** → **Generate New Private Key**
4. Download the JSON file

### 3. Environment Variables

Create `.env` file in the backend folder:

```bash
cp .env.example .env
```

Fill in your Firebase credentials from the downloaded JSON file:

```
PORT=5000
NODE_ENV=development

JWT_SECRET=your_secret_key_here

FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_email@your_project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com

FRONTEND_URL=http://localhost:5174
```

### 4. Seed Database

```bash
npm run seed
```

This creates predefined users:
- **Admin**: admin@company.com / Admin@123
- **Super Admin**: superadmin@company.com / Super@123

### 5. Start Backend Server

```bash
npm start
```

Server runs on `http://localhost:5000`

---

## 📡 API Endpoints

### 🔐 Authentication

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: { id, name, email, role, phone }
```

---

### 👥 Employees (Admin Only)

#### Add Employee
```
POST /api/employees
Headers: Authorization: Bearer {token}
Body: { name, email, phone, salary }
```

#### Get All Employees
```
GET /api/employees
Headers: Authorization: Bearer {token}
```

#### Get Single Employee
```
GET /api/employees/:id
Headers: Authorization: Bearer {token}
```

#### Update Employee
```
PUT /api/employees/:id
Headers: Authorization: Bearer {token}
Body: { name, phone, address }
```

#### Delete Employee
```
DELETE /api/employees/:id
Headers: Authorization: Bearer {token}
```

---

### 📊 Reports

#### Add Report
```
POST /api/reports
Headers: Authorization: Bearer {token}
Body: {
  date,
  leads,
  calls,
  conversations,
  conversions,
  revenue,
  notes
}
```

#### Get My Reports
```
GET /api/reports/my?range=all&startDate=2024-01-01&endDate=2024-01-31
Headers: Authorization: Bearer {token}
Response: { reports, totals }
```

#### Get All Reports (Admin)
```
GET /api/reports/all?userId=xxx&range=daily
Headers: Authorization: Bearer {token}
```

#### Update Report
```
PUT /api/reports/:id
Headers: Authorization: Bearer {token}
Body: { leads, calls, conversations, conversions, revenue, notes }
```

#### Delete Report
```
DELETE /api/reports/:id
Headers: Authorization: Bearer {token}
```

---

### 🕒 Attendance

#### Mark Attendance
```
POST /api/attendance
Headers: Authorization: Bearer {token}
Body: { date, status } // status: present, absent, half-day
```

#### Get Attendance
```
GET /api/attendance?startDate=2024-01-01&endDate=2024-01-31
Headers: Authorization: Bearer {token}
```

#### Get All Attendance (Admin)
```
GET /api/attendance/all
Headers: Authorization: Bearer {token}
```

---

### 💰 Salary

#### Get Salary Details
```
GET /api/salary/:userId
Headers: Authorization: Bearer {token}
Response: {
  monthlySalary,
  perDaySalary,
  daysPresent,
  daysAbsent,
  finalSalary,
  totalDeduction
}
```

#### Set Monthly Salary (Admin)
```
POST /api/salary/set
Headers: Authorization: Bearer {token}
Body: { userId, monthlySalary }
```

---

### 🏦 Bank Details

#### Get Bank Details
```
GET /api/bank/:userId
Headers: Authorization: Bearer {token}
```

#### Update Bank Details (Admin)
```
PUT /api/bank
Headers: Authorization: Bearer {token}
Body: {
  userId,
  accountNumber,
  ifsc,
  bankName,
  branch
}
```

---

### 📋 Activity Logs (Super Admin Only)

#### Get Activity Logs
```
GET /api/logs?startDate=2024-01-01&endDate=2024-01-31&userId=xxx
Headers: Authorization: Bearer {token}
```

---

## 🗄️ Firebase Collections

The system uses the following Firestore collections:

- **users** - User accounts with roles
- **salaries** - Salary information
- **attendance** - Attendance records
- **reports** - Daily work reports
- **bankDetails** - Bank account information
- **activityLogs** - System activity tracking

---

## 🔑 User Roles & Permissions

### Employee
- View own profile, attendance, salary, reports
- Add/edit own reports
- Mark own attendance

### Admin
- Manage all employees
- View all reports
- Manage attendance
- Set salaries
- Update bank details

### Super Admin
- Full system access
- View activity logs
- Monitor all actions

---

## 🛡️ Security Features

✅ JWT authentication  
✅ Password hashing with bcrypt  
✅ Role-based access control (RBAC)  
✅ Protected API routes  
✅ Firebase security rules  

---

## 📝 Project Structure

```
/backend
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables
├── /config
│   └── firebase.js        # Firebase configuration
├── /middleware
│   └── auth.js            # JWT & role verification
├── /controllers           # Business logic
│   ├── authController.js
│   ├── employeeController.js
│   ├── reportController.js
│   ├── attendanceController.js
│   ├── salaryController.js
│   ├── bankController.js
│   └── logController.js
├── /routes                # API routes
│   ├── auth.js
│   ├── employee.js
│   ├── report.js
│   ├── attendance.js
│   ├── salary.js
│   ├── bank.js
│   └── logs.js
└── /scripts
    └── seed.js            # Database seeding
```

---

## 🚀 Running the Backend

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

---

## 🧪 Testing with Postman

1. Import the API endpoints above
2. Get token from `/api/auth/login`
3. Add token to Authorization header: `Bearer {token}`
4. Test each endpoint

---

## 🐛 Troubleshooting

### Firebase Connection Issues
- Check Firebase credentials in `.env`
- Verify Firestore database is created
- Check Firebase security rules

### Token Errors
- Ensure token is in header: `Authorization: Bearer {token}`
- Token may have expired (7 days)
- Verify JWT_SECRET is correct

### CORS Issues
- Check FRONTEND_URL in `.env`
- Ensure frontend is making requests to correct backend URL

---

## 📞 Support

For issues or questions, contact the development team.

---

## 📄 License

MIT License

---

## 🎯 Next Steps

1. ✅ Backend is ready
2. 🔄 Connect frontend to backend APIs
3. 📊 Test all workflows
4. 🚀 Deploy to production

**Happy coding! 🎉**
