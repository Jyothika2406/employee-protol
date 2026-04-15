# 🚀 Complete Setup Guide - Employee Portal System

## Step-by-Step Implementation Guide

This guide walks you through setting up the complete Employee Management System with backend and frontend.

---

## 📝 Part 1: Firebase Setup (Critical!)

### 1.1 Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add Project"**
3. Enter project name: `employee-portal`
4. Choose region (closest to you)
5. Click **Create Project**

### 1.2 Create Firestore Database

1. In Firebase Console → **Build** → **Firestore Database**
2. Click **Create Database**
3. Choose: **Start in production mode**
4. Select location (same as project)
5. Click **Enable**

### 1.3 Get Service Account Key

1. Go to **Settings** (⚙️ icon) → **Project Settings**
2. Click **Service Accounts** tab
3. Click **Generate New Private Key**
4. A JSON file downloads → **Keep it safe!**

### 1.4 Copy Your Firebase Credentials

Open the downloaded JSON file. You'll see:

```json
{
  "type": "service_account",
  "project_id": "employee-portal-xxxxx",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nxxxxx\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@employee-portal-xxxxx.iam.gserviceaccount.com",
  "client_id": "xxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

---

## 💻 Part 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Create .env File

Create file: `backend/.env`

Paste this and fill with your Firebase data:

```
PORT=5000
NODE_ENV=development
JWT_SECRET=MySecureJWTSecret12345

FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=[FROM JSON: project_id]
FIREBASE_PRIVATE_KEY_ID=[FROM JSON: private_key_id]
FIREBASE_PRIVATE_KEY="[FROM JSON: private_key]"
FIREBASE_CLIENT_EMAIL=[FROM JSON: client_email]
FIREBASE_CLIENT_ID=[FROM JSON: client_id]
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_DATABASE_URL=https://[PROJECT_ID].firebaseio.com

FRONTEND_URL=http://localhost:5174
```

### 2.3 Seed Database (Create Admin Users)

```bash
npm run seed
```

You should see:
```
✅ Seeding completed successfully!
👤 Admin: admin@company.com / Admin@123
👑 Super Admin: superadmin@company.com / Super@123
```

### 2.4 Start Backend Server

```bash
npm start
```

You should see:
```
🚀 Server running on port 5000
✅ Firebase initialized successfully
```

---

## 🎨 Part 3: Frontend Integration

### 3.1 Update Frontend to Use Backend

Update your React `App.tsx` to include login and API integration.

Create `src/api/client.ts`:

```typescript
const API_URL = 'http://localhost:5000/api';

export const client = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async getMe(token: string) {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async getEmployees(token: string) {
    const res = await fetch(`${API_URL}/employees`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async getReports(token: string, range = 'all') {
    const res = await fetch(`${API_URL}/reports/my?range=${range}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async addReport(token: string, data: any) {
    const res = await fetch(`${API_URL}/reports`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async markAttendance(token: string, date: string, status: string) {
    const res = await fetch(`${API_URL}/attendance`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date, status })
    });
    return res.json();
  },

  async getSalary(token: string, userId: string) {
    const res = await fetch(`${API_URL}/salary/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};
```

### 3.2 Create Login Component

Create `src/components/LoginPage.tsx`:

```typescript
import React, { useState } from 'react';
import { client } from '../api/client';

export default function LoginPage({ onLogin }: { onLogin: (token: string, user: any) => void }) {
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await client.login(email, password);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.token, data.user);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err: any) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '100px auto',
      padding: '40px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Employee Portal</h1>
      
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '20px', fontSize: '12px', color: '#6b7280' }}>
        Demo: admin@company.com / Admin@123
      </p>
    </div>
  );
}
```

### 3.3 Update Main App.tsx

```typescript
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard'; // Your existing dashboard

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Dashboard user={user} token={token} onLogout={handleLogout} />
  );
}
```

---

## ✅ Part 4: Testing

### 4.1 Test Backend APIs with Postman

1. Download [Postman](https://www.postman.com/downloads/)

2. Create login request:
   ```
   POST http://localhost:5000/api/auth/login
   Body: { "email": "admin@company.com", "password": "Admin@123" }
   ```

3. Copy the token from response

4. Use token for other requests:
   ```
   GET http://localhost:5000/api/employees
   Header: Authorization: Bearer {token}
   ```

### 4.2 Test Frontend

1. Start frontend:
   ```bash
   cd frontend (or EP folder)
   npm run dev
   ```

2. Visit `http://localhost:5174`

3. Login with:
   - Email: `admin@company.com`
   - Password: `Admin@123`

---

## 🎯 Test Users

### Create Test Employee (as Admin)

```
POST http://localhost:5000/api/employees
Authorization: Bearer {admin_token}
Body: {
  "name": "John Doe",
  "email": "john@company.com",
  "phone": "9876543210",
  "salary": 30000
}
```

Response includes temporary password. Employee can login with it.

---

## 📊 Sample Workflows

### Employee Workflow

1. Login with credentials
2. Mark attendance
3. Add daily report
4. View salary
5. View own reports

### Admin Workflow

1. Login as admin
2. View all employees
3. View all reports
4. Set employee salary
5. Update bank details

### Super Admin Workflow

1. Login as superadmin
2. View activity logs
3. Monitor all actions

---

## 🐛 Common Issues & Fixes

### Issue: "Firebase initialization failed"
**Fix**: Check `.env` file has correct credentials

### Issue: "CORS error"
**Fix**: Ensure backend is running on port 5000, frontend on 5174

### Issue: "Token invalid"
**Fix**: Login again to get fresh token

### Issue: "Permission denied"
**Fix**: Ensure user has correct role for that action

---

## 📦 Project Structure After Setup

```
employee-portal/
├── backend/                    # Node.js Express API
│   ├── node_modules/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── scripts/
│   ├── server.js
│   ├── package.json
│   ├── .env                    # Your Firebase credentials
│   └── README.md
└── EP/ (or frontend/)          # React Frontend
    ├── src/
    ├── index.html
    └── package.json
```

---

## 🚀 Next Steps

1. ✅ Setup Firebase project
2. ✅ Install backend
3. ✅ Seed database
4. ✅ Start backend server
5. ✅ Integrate frontend with backend APIs
6. ✅ Test login workflow
7. ✅ Test all features
8. 🎉 Deploy!

---

## 📞 Quick Commands Reference

### Backend
```bash
cd backend
npm install          # Install dependencies
npm run seed        # Create admin users
npm start           # Start server
npm run dev         # Start with auto-reload
```

### Frontend
```bash
npm run dev         # Start dev server
npm run build       # Build for production
```

---

## 🎉 You're All Set!

Your Employee Management System is ready to use!

**Happy coding! 💻**

---

For more help, refer to:
- Backend README: `backend/README.md`
- Firebase Docs: https://firebase.google.com/docs
- Node.js Docs: https://nodejs.org/en/docs/
