# Fix Render Deployment Errors - Step by Step

## ✅ Issues Fixed

1. ✅ Updated Node.js version to 20.x (latest LTS)
2. ✅ Updated all dependencies to latest secure versions
3. ✅ Fixed npm vulnerabilities
4. ✅ Added proper Render configuration
5. ✅ Pushed changes to GitHub

---

## 🚀 Deploy to Render - Complete Guide

### Step 1: Grant Render Access to GitHub

The error "It looks like we don't have access to your repo" means Render needs permission.

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click your profile** (top right)
3. **Click "Account Settings"**
4. **Click "GitHub"** in the left sidebar
5. **Click "Configure GitHub App"**
6. **Select**: "All repositories" or select `employee-protol` specifically
7. **Click "Save"**

### Step 2: Create New Web Service

1. **Go to**: https://dashboard.render.com/
2. **Click "New +"** → **"Web Service"**
3. **Find your repo**: `Jyothika2406/employee-protol`
4. **Click "Connect"**

### Step 3: Configure Service

Fill in these settings:

```
Name: employee-portal-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: node server.js
Instance Type: Free
```

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables (copy from your `backend/.env` file):

```
NODE_ENV=production
PORT=5000
FIREBASE_PROJECT_ID=mentneo-ea55a
FIREBASE_PRIVATE_KEY=<your-private-key>
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@mentneo-ea55a.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://mentneo-ea55a.firebaseio.com
```

**Important**: For `FIREBASE_PRIVATE_KEY`, copy the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

### Step 5: Create Web Service

Click **"Create Web Service"**

Render will now:
1. Clone your repository
2. Install dependencies
3. Start the server
4. Give you a URL

Wait 2-3 minutes for deployment to complete.

### Step 6: Verify Deployment

Once deployed, you'll see:
```
✅ Live
Your service is live at https://employee-portal-backend.onrender.com
```

**Test the backend**:
Open in browser: `https://employee-portal-backend.onrender.com/api/health`

You should see:
```json
{"status": "Backend is running!"}
```

---

## 🔧 Update Frontend to Use Backend

### Step 1: Update Environment File

Edit `employee-protol/.env.production`:

```env
VITE_API_URL=https://employee-portal-backend.onrender.com/api
```

Replace `employee-portal-backend` with your actual Render service name.

### Step 2: Rebuild Frontend

```bash
cd employee-protol
npm run build
```

### Step 3: Redeploy to Firebase

```bash
firebase deploy --only hosting
```

Or double-click: `deploy-to-firebase.bat`

---

## 📱 Test on Mobile

1. **Open mobile browser**
2. **Go to**: https://mentneo-ea55a.web.app
3. **Login** with your credentials
4. **Add test data** (employee, report, etc.)
5. **Open on laptop** - data should appear!
6. **Refresh mobile** - data should sync!

✅ **Success!** Data now syncs across all devices!

---

## 🐛 Troubleshooting

### Issue: "It looks like we don't have access to your repo"

**Solution**:
1. Go to: https://github.com/settings/installations
2. Find "Render"
3. Click "Configure"
4. Grant access to `employee-protol` repository
5. Go back to Render and try again

---

### Issue: "Build failed" or "npm install failed"

**Solution**:
1. Check Render logs for specific error
2. Make sure `backend/package.json` exists
3. Make sure Node version is 20.x or higher
4. Try manual deploy:
   ```bash
   cd backend
   npm install
   npm start
   ```
   If it works locally, it should work on Render.

---

### Issue: "Application failed to respond"

**Solution**:
1. Check environment variables are set correctly
2. Make sure `PORT` is set to `5000` (or use `process.env.PORT`)
3. Check Render logs for errors
4. Verify Firebase credentials are correct

---

### Issue: CORS errors in browser

**Solution**:

Update `backend/server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://mentneo-ea55a.web.app',
    'https://mentneo-ea55a.firebaseapp.com',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

Then redeploy on Render (it will auto-deploy from GitHub).

---

### Issue: "Free instance will spin down with inactivity"

This is normal for Render's free tier. The first request after inactivity may take 50 seconds.

**Solutions**:
1. **Upgrade to paid plan** ($7/month) - no spin down
2. **Use a ping service** to keep it alive:
   - https://uptimerobot.com/ (free)
   - Ping your backend every 10 minutes
3. **Accept the delay** - subsequent requests are fast

---

## 📊 Render Dashboard

After deployment, you can:

1. **View Logs**: Click "Logs" tab to see server output
2. **View Metrics**: See CPU, memory usage
3. **Redeploy**: Click "Manual Deploy" → "Deploy latest commit"
4. **Environment Variables**: Update anytime in "Environment" tab
5. **Custom Domain**: Add your own domain in "Settings"

---

## 🔄 Auto-Deploy from GitHub

Render automatically deploys when you push to GitHub!

Every time you:
```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will automatically:
1. Detect the push
2. Pull latest code
3. Run `npm install`
4. Restart the server

You'll see deployment status in Render dashboard.

---

## ✅ Deployment Checklist

- [x] Updated dependencies to latest versions
- [x] Fixed npm vulnerabilities
- [x] Pushed changes to GitHub
- [ ] **Grant Render access to GitHub** ← DO THIS FIRST
- [ ] Create new web service on Render
- [ ] Configure service settings
- [ ] Add environment variables
- [ ] Deploy and wait for completion
- [ ] Test backend health endpoint
- [ ] Update frontend `.env.production`
- [ ] Rebuild frontend
- [ ] Redeploy to Firebase
- [ ] Test on mobile

---

## 🎉 After Successful Deployment

Your architecture will be:

```
Mobile/Laptop/Tablet
    ↓
Frontend (Firebase Hosting)
https://mentneo-ea55a.web.app
    ↓
Backend (Render)
https://employee-portal-backend.onrender.com
    ↓
Firebase Database
    ↓
✅ Data syncs across all devices!
```

---

## 💡 Alternative: If Render Doesn't Work

### Option 1: Railway
- Go to: https://railway.app/
- Connect GitHub
- Deploy `backend` folder
- Same process as Render

### Option 2: Heroku
```bash
cd backend
heroku create employee-portal-backend
git push heroku main
```

### Option 3: Firebase Functions
```bash
firebase init functions
# Move backend code to functions/
firebase deploy --only functions
```

---

## 📞 Need Help?

If you're still stuck:

1. **Check Render logs** for specific errors
2. **Check browser console** (F12) for frontend errors
3. **Verify environment variables** are set correctly
4. **Test backend locally** first: `cd backend && npm start`
5. **Check GitHub repository** has latest code

---

## 🎯 Quick Summary

**Problem**: Render can't access your GitHub repo
**Solution**: Grant Render access in GitHub settings
**Time**: 5 minutes
**Result**: Backend deployed and accessible from all devices

**Next**: Update frontend to use backend URL and redeploy!

---

**Last Updated**: May 7, 2026
**Status**: Ready to Deploy
**Backend URL**: Will be `https://employee-portal-backend.onrender.com`
