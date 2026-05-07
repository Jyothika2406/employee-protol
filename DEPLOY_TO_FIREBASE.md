# Deploy to Firebase Hosting - Step by Step Guide

## ✅ Prerequisites Completed

- ✅ Code pushed to GitHub: https://github.com/Jyothika2406/employee-protol
- ✅ Production build created in `dist` folder
- ✅ Firebase configuration files created (`firebase.json`, `.firebaserc`)
- ✅ Firebase CLI installed

## 🚀 Deployment Steps

### Method 1: Using Firebase CLI (Recommended)

#### Step 1: Login to Firebase

Open your terminal in the project folder and run:

```bash
firebase login
```

This will open a browser window. Login with your Google account that has access to the Firebase project `mentneo-ea55a`.

#### Step 2: Verify Project

Check if the correct project is selected:

```bash
firebase projects:list
```

You should see `mentneo-ea55a` in the list.

#### Step 3: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Wait for the deployment to complete. You'll see output like:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/mentneo-ea55a/overview
Hosting URL: https://mentneo-ea55a.web.app
```

#### Step 4: Access Your Deployed App

Your app will be live at:
- **Primary URL**: https://mentneo-ea55a.web.app
- **Alternative URL**: https://mentneo-ea55a.firebaseapp.com

---

### Method 2: Using Firebase Console (Manual)

If CLI login doesn't work, you can deploy manually:

#### Step 1: Go to Firebase Console

1. Open: https://console.firebase.google.com/
2. Select project: `mentneo-ea55a`
3. Click on **"Hosting"** in the left sidebar

#### Step 2: Upload Build Files

1. Click **"Get Started"** or **"Add another site"**
2. Follow the setup wizard
3. When asked to upload files, upload the entire `dist` folder contents

#### Step 3: Configure Hosting

Make sure these settings are configured:
- **Public directory**: `dist`
- **Single-page app**: Yes (rewrite all URLs to /index.html)
- **Automatic builds**: Optional (can connect to GitHub)

---

### Method 3: Using GitHub Actions (Automated)

Create a GitHub Actions workflow for automatic deployment on every push.

#### Step 1: Get Firebase Token

In your terminal, run:

```bash
firebase login:ci
```

This will give you a token. Copy it.

#### Step 2: Add Token to GitHub Secrets

1. Go to: https://github.com/Jyothika2406/employee-protol/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `FIREBASE_TOKEN`
4. Value: Paste the token from Step 1
5. Click **"Add secret"**

#### Step 3: Create Workflow File

Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_TOKEN }}'
          channelId: live
          projectId: mentneo-ea55a
```

Now every push to `main` branch will automatically deploy to Firebase!

---

## 🔧 Troubleshooting

### Issue: "Firebase login failed"

**Solution 1**: Try with reauth
```bash
firebase login --reauth
```

**Solution 2**: Try without localhost
```bash
firebase login --no-localhost
```
Then follow the URL and paste the code.

**Solution 3**: Use CI token
```bash
firebase login:ci
```
Then use the token with:
```bash
firebase deploy --token "YOUR_TOKEN_HERE"
```

---

### Issue: "Project not found"

**Solution**: Initialize Firebase in the project
```bash
firebase init hosting
```

Select:
- Use existing project: `mentneo-ea55a`
- Public directory: `dist`
- Single-page app: Yes
- Automatic builds: No (or Yes if you want GitHub integration)

---

### Issue: "Build folder not found"

**Solution**: Make sure you built the project first
```bash
npm run build
```

This creates the `dist` folder with production files.

---

### Issue: "Permission denied"

**Solution**: Make sure your Google account has access to the Firebase project `mentneo-ea55a`. Ask the project owner to add you as an editor.

---

## 📋 Quick Command Reference

```bash
# Login to Firebase
firebase login

# Check current project
firebase projects:list

# Switch project (if needed)
firebase use mentneo-ea55a

# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Deploy with token (for CI/CD)
firebase deploy --only hosting --token "YOUR_TOKEN"

# View deployment history
firebase hosting:channel:list

# Rollback to previous version (if needed)
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

---

## 🌐 After Deployment

### 1. Test Your Deployed App

Visit: https://mentneo-ea55a.web.app

Test all features:
- ✅ Login with admin credentials
- ✅ Add employees with different roles
- ✅ Submit reports
- ✅ Check all tabs work correctly
- ✅ Test on mobile devices

### 2. Configure Custom Domain (Optional)

If you want a custom domain like `employee.yourcompany.com`:

1. Go to Firebase Console → Hosting
2. Click **"Add custom domain"**
3. Follow the instructions to add DNS records
4. Wait for SSL certificate to be provisioned (can take up to 24 hours)

### 3. Set Up Backend (if needed)

Your backend is currently running locally on port 5001. For production:

**Option A: Deploy Backend to Firebase Functions**
```bash
firebase init functions
# Then deploy
firebase deploy --only functions
```

**Option B: Deploy Backend to a Cloud Service**
- Heroku
- Railway
- Render
- Google Cloud Run
- AWS EC2

**Option C: Keep Backend Local (for testing only)**
- Not recommended for production
- Users won't be able to access the app from other devices

---

## 📊 Monitoring

### View Analytics

1. Go to: https://console.firebase.google.com/project/mentneo-ea55a/analytics
2. Enable Google Analytics (if not already enabled)
3. View user activity, page views, etc.

### View Hosting Metrics

1. Go to: https://console.firebase.google.com/project/mentneo-ea55a/hosting
2. Click on your site
3. View:
   - Requests per day
   - Bandwidth usage
   - Response times
   - Error rates

---

## 🔐 Security

### Environment Variables

Your `.env` files are NOT deployed (they're in `.gitignore`). 

For production, set environment variables in:
1. Firebase Console → Project Settings → Service Accounts
2. Or use Firebase Functions config:
```bash
firebase functions:config:set someservice.key="THE API KEY"
```

### Firebase Rules

Make sure your Firestore/Realtime Database rules are properly configured:

```javascript
// Example Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## ✅ Deployment Checklist

Before deploying, make sure:

- [ ] All code is committed and pushed to GitHub
- [ ] `npm run build` completes without errors
- [ ] `dist` folder is created with all files
- [ ] Firebase CLI is installed (`firebase --version`)
- [ ] Logged into Firebase (`firebase login`)
- [ ] Correct project selected (`firebase use mentneo-ea55a`)
- [ ] `firebase.json` and `.firebaserc` exist
- [ ] Backend is deployed or accessible
- [ ] Environment variables are configured
- [ ] Database rules are set up
- [ ] Tested locally before deploying

---

## 🎉 Success!

Once deployed, share your app URL with your team:

**Live URL**: https://mentneo-ea55a.web.app

**Admin Login**:
- Email: `sravani@company.com`
- Password: `Sravani@2024`

Or:
- Email: `superadmin@company.com`
- Password: `Super@123`

---

## 📞 Need Help?

If you encounter any issues:

1. Check Firebase Console for error logs
2. Check browser console (F12) for JavaScript errors
3. Verify all files are in the `dist` folder
4. Make sure Firebase project `mentneo-ea55a` exists and you have access
5. Try deploying from a different network (sometimes firewall blocks Firebase CLI)

---

**Last Updated**: May 7, 2026
**Project**: Employee Portal
**Firebase Project**: mentneo-ea55a
**GitHub**: https://github.com/Jyothika2406/employee-protol
