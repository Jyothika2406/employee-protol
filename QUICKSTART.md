# Quick Start - Firebase Configuration

## What Changed?

✅ All demo mode code removed
✅ Application now requires real Firebase credentials
✅ Production-ready setup scripts created
✅ Complete documentation provided

## Your Next Steps (5 minutes)

### 1️⃣ Get Firebase Service Account Key

Visit: https://console.firebase.google.com/

1. Select project: **mentneo-ea55a**
2. Click ⚙️ (Settings) → **Project Settings**
3. Tab: **Service Accounts**
4. Button: **Generate New Private Key**
5. Save the JSON file (keep it secure!)

### 2️⃣ Configure Backend

```bash
cd backend
node setup-firebase.js
```

This interactive script will ask you to copy-paste values from the JSON file you downloaded.

### 3️⃣ Create Initial Users

```bash
node scripts/seed-database.js
```

This creates:
- ✅ admin@company.com (password: Admin@123)
- ✅ superadmin@company.com (password: Super@123)
- ✅ employee@company.com (password: Employee@123)

### 4️⃣ Restart Backend & Login

```bash
npm start
# In another terminal:
npm run dev
```

Then visit: http://localhost:5173

Login with: `admin@company.com` / `Admin@123`

## Documentation

- **Complete Setup Guide**: See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- **Production Deployment**: See [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)

## Troubleshooting

### "Database not configured" message?
→ Check your `.env` file has all Firebase credentials
→ Restart backend server after updating `.env`

### "Invalid email or password" on login?
→ Run `node scripts/seed-database.js` to create users

### Still having issues?
→ Check Firebase Console to ensure:
  - Firestore database is created
  - Collections exist (users, salaries, etc.)
  - Security rules allow authenticated access

---

**Questions?** Review the full guides linked above or check Firebase documentation.
