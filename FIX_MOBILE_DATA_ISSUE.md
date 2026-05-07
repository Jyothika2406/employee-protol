# Fix: Data Not Showing on Mobile

## 🔍 Problem

**Issue**: Data shows on laptop but not on mobile device.

**Root Cause**: The app currently uses **localStorage** (browser storage) which is device-specific. Each device has its own separate storage, so data added on laptop won't appear on mobile.

## ✅ Solution

You need to deploy the **backend server** so data is stored in a central database (Firebase) that all devices can access.

---

## 🚀 Quick Fix Options

### Option 1: Deploy Backend to Render (Free & Easy) ⭐

**Render** offers free hosting for Node.js backends.

#### Step 1: Create Render Account
1. Go to: https://render.com/
2. Sign up with GitHub

#### Step 2: Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Jyothika2406/employee-protol`
3. Configure:
   - **Name**: `employee-portal-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` or `node server.js`
   - **Plan**: Free

#### Step 3: Add Environment Variables
In Render dashboard, add these environment variables:
```
PORT=5000
NODE_ENV=production
FIREBASE_PROJECT_ID=mentneo-ea55a
```

Also add all Firebase credentials from your `backend/.env` file.

#### Step 4: Deploy
Click **"Create Web Service"**

Wait 2-3 minutes for deployment. You'll get a URL like:
`https://employee-portal-backend.onrender.com`

#### Step 5: Update Frontend
Update `employee-protol/.env.production`:
```
VITE_API_URL=https://employee-portal-backend.onrender.com/api
```

#### Step 6: Rebuild and Redeploy Frontend
```bash
npm run build
firebase deploy --only hosting
```

✅ **Done!** Now data will sync across all devices!

---

### Option 2: Deploy Backend to Railway (Easy)

#### Step 1: Create Railway Account
1. Go to: https://railway.app/
2. Sign up with GitHub

#### Step 2: Deploy
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: `Jyothika2406/employee-protol`
4. Select **"backend"** folder
5. Railway will auto-detect Node.js and deploy

#### Step 3: Add Environment Variables
Add all variables from `backend/.env`

#### Step 4: Get URL
Railway will give you a URL like:
`https://employee-portal-backend.up.railway.app`

#### Step 5: Update Frontend
Update `.env.production` with the Railway URL and redeploy.

---

### Option 3: Use ngrok (Temporary Testing)

**ngrok** creates a public URL for your local backend (good for testing).

#### Step 1: Install ngrok
1. Download from: https://ngrok.com/download
2. Extract and run: `ngrok.exe`

#### Step 2: Expose Backend
```bash
# In terminal, run:
ngrok http 5001
```

You'll get a URL like: `https://abc123.ngrok.io`

#### Step 3: Update Frontend
Update `.env.production`:
```
VITE_API_URL=https://abc123.ngrok.io/api
```

#### Step 4: Rebuild and Redeploy
```bash
npm run build
firebase deploy --only hosting
```

⚠️ **Note**: ngrok URLs expire when you close the terminal. This is only for testing!

---

### Option 4: Deploy Backend to Firebase Functions

#### Step 1: Initialize Functions
```bash
cd backend
firebase init functions
```

Select:
- JavaScript
- Install dependencies: Yes

#### Step 2: Move Backend Code
Copy your backend code to `functions/` folder:
```bash
cp -r controllers functions/
cp -r routes functions/
cp -r config functions/
cp -r middleware functions/
cp server.js functions/index.js
```

#### Step 3: Update functions/index.js
```javascript
const functions = require('firebase-functions');
const express = require('express');
// ... your existing server code ...

exports.api = functions.https.onRequest(app);
```

#### Step 4: Deploy
```bash
firebase deploy --only functions
```

You'll get a URL like:
`https://us-central1-mentneo-ea55a.cloudfunctions.net/api`

#### Step 5: Update Frontend
Update `.env.production` with the Functions URL and redeploy.

---

## 📱 Testing on Mobile

After deploying backend:

1. **Open mobile browser**
2. **Go to**: https://mentneo-ea55a.web.app
3. **Login** with your credentials
4. **Add test data** (employee, report, etc.)
5. **Open on laptop** - data should appear!
6. **Open on another mobile** - data should appear!

---

## 🔧 Current Setup (Before Fix)

```
Laptop Browser
    ↓
localStorage (laptop only)
    ↓
Data stored locally
    ↓
❌ Not accessible from mobile
```

## ✅ After Fix

```
Any Device (Laptop/Mobile/Tablet)
    ↓
Frontend (Firebase Hosting)
    ↓
Backend API (Render/Railway/Functions)
    ↓
Firebase Database
    ↓
✅ Data accessible from all devices
```

---

## 🎯 Recommended Solution

**Use Render (Option 1)** because:
- ✅ Free tier available
- ✅ Easy to set up
- ✅ Auto-deploys from GitHub
- ✅ Always online (unlike ngrok)
- ✅ SSL certificate included
- ✅ No credit card required

---

## 📋 Step-by-Step: Deploy to Render

### 1. Prepare Backend

Make sure `backend/package.json` has:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### 2. Create Render Account

Go to https://render.com/ and sign up with GitHub.

### 3. Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect GitHub: `Jyothika2406/employee-protol`
3. Fill in:
   ```
   Name: employee-portal-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: node server.js
   Plan: Free
   ```

### 4. Add Environment Variables

Click **"Environment"** tab and add:

```
PORT=5000
NODE_ENV=production
FIREBASE_PROJECT_ID=mentneo-ea55a
FIREBASE_PRIVATE_KEY=<from backend/.env>
FIREBASE_CLIENT_EMAIL=<from backend/.env>
FIREBASE_DATABASE_URL=<from backend/.env>
```

Copy all values from your `backend/.env` file.

### 5. Deploy

Click **"Create Web Service"**

Wait 2-3 minutes. You'll see:
```
✅ Deploy successful
Your service is live at https://employee-portal-backend.onrender.com
```

### 6. Test Backend

Open in browser:
```
https://employee-portal-backend.onrender.com/api/health
```

You should see:
```json
{"status": "Backend is running!"}
```

### 7. Update Frontend

Edit `employee-protol/.env.production`:
```
VITE_API_URL=https://employee-portal-backend.onrender.com/api
```

### 8. Rebuild Frontend

```bash
npm run build
```

### 9. Redeploy to Firebase

```bash
firebase deploy --only hosting
```

### 10. Test on Mobile

1. Open: https://mentneo-ea55a.web.app
2. Login
3. Add data
4. Check on laptop - data appears!
5. Check on mobile - data appears!

✅ **Done!**

---

## 🐛 Troubleshooting

### Issue: Backend URL not working

**Check**:
1. Backend is deployed and running on Render
2. URL in `.env.production` is correct
3. Frontend is rebuilt: `npm run build`
4. Frontend is redeployed: `firebase deploy`

### Issue: CORS errors

**Solution**: Make sure backend has CORS enabled:

In `backend/server.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://mentneo-ea55a.web.app', 'https://mentneo-ea55a.firebaseapp.com'],
  credentials: true
}));
```

### Issue: Data still not syncing

**Check**:
1. Open browser console (F12)
2. Look for API errors
3. Check Network tab - are API calls going to the right URL?
4. Verify backend environment variables are set correctly

---

## 📊 Comparison

| Solution | Cost | Setup Time | Reliability | Best For |
|----------|------|------------|-------------|----------|
| **Render** | Free | 10 min | ⭐⭐⭐⭐⭐ | Production |
| **Railway** | Free | 10 min | ⭐⭐⭐⭐⭐ | Production |
| **ngrok** | Free | 2 min | ⭐⭐ | Testing only |
| **Firebase Functions** | Pay-as-go | 20 min | ⭐⭐⭐⭐⭐ | Production |

---

## ✅ Summary

**Problem**: Data stored in localStorage (device-specific)

**Solution**: Deploy backend to cloud (Render/Railway/Functions)

**Result**: Data stored in Firebase database (accessible from all devices)

**Time**: 10-15 minutes to set up

**Cost**: Free (with Render or Railway free tier)

---

## 🎉 After Deployment

Your app will work like this:

1. **User opens app on laptop** → Sees all data
2. **User opens app on mobile** → Sees same data
3. **User adds employee on mobile** → Appears on laptop
4. **User submits report on laptop** → Appears on mobile

All devices stay in sync! 🔄

---

## 📞 Need Help?

If you get stuck:

1. Check Render/Railway deployment logs
2. Check browser console for errors
3. Verify backend URL is correct
4. Make sure environment variables are set
5. Test backend health endpoint first

---

**Recommended Next Step**: Deploy backend to Render (Option 1) - it's the easiest and most reliable free solution!
