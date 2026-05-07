# Money Transaction & Photo Upload Guide

## ✅ Issues Fixed

### 1. **All Transactions Now Stored**
- Previously: Only the last transaction was being saved
- Now: All transactions are properly stored and accumulated
- Each transaction gets a unique ID to prevent overwrites

### 2. **Photo Upload Configuration**
- Added Cloudinary configuration for image uploads
- Photos can now be uploaded with transactions
- Using demo Cloudinary account (you can replace with your own)

---

## 🚀 How to Use Money Management

### **Access the Feature**
1. Login to the portal: http://localhost:5173/
2. Click on **"Money Management"** tab in the navigation

---

## 💰 Adding a Transaction

### **For Employees:**
1. Fill in the transaction details:
   - **Date**: Select transaction date
   - **Type**: Automatically set to "Credit" (incoming payment)
   - **Amount**: Enter the amount
   - **Mode**: Select payment method (PhonePe, GPay, Bank, Cash, etc.)
   - **Category**: Enter category (e.g., "Client Payment", "Project Payment")
   - **Notes**: Add any additional notes

2. **Upload Payment Screenshot** (REQUIRED for employees):
   - Click "Choose File" under "Payment Screenshot"
   - Select an image file (JPG, PNG, etc.)
   - The preview will show below

3. Click **"Add Transaction"** button

4. Success! Your transaction is now recorded

### **For Admins/Super Admins:**
1. Same as above, but:
   - Can choose **Type**: Credit (incoming) or Debit (outgoing)
   - Payment screenshot is optional (but recommended)
   - Can add transactions for any purpose

---

## 📸 Photo Upload Details

### **Cloudinary Configuration**

The app uses Cloudinary for image storage. Current configuration:
- **Cloud Name**: demo
- **Upload Preset**: ml_default

### **To Use Your Own Cloudinary Account:**

1. **Create Free Account**:
   - Go to https://cloudinary.com
   - Sign up for free account

2. **Get Your Credentials**:
   - Go to Dashboard
   - Copy your **Cloud Name**

3. **Create Upload Preset**:
   - Go to Settings → Upload
   - Click "Add upload preset"
   - Set **Signing Mode**: Unsigned
   - Set **Folder**: transactions (optional)
   - Copy the **Preset Name**

4. **Update Configuration**:
   - Open `employee-protol/.env`
   - Replace:
     ```
     VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
     VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name_here
     ```

5. **Restart Frontend**:
   ```bash
   # Stop the frontend (Ctrl+C in terminal)
   npm run dev
   ```

---

## 🔍 Viewing Transactions

### **Transaction List Shows:**
- Transaction ID (auto-generated)
- Date
- Type (Credit/Debit)
- Amount
- Payment Mode
- Category
- Notes
- Payment Screenshot (if uploaded)
- Submitted by (name and role)

### **Filters Available:**
- Search by transaction ID, date, category, notes
- Filter by Type (All/Credit/Debit)
- Filter by Mode (All/Cash/PhonePe/GPay/Bank/Card/Other)
- Date range filter
- Show only transactions with proof
- Filter by submitter role (Admin only)

### **Summary Cards:**
- Total Credit (incoming)
- Total Debit (outgoing)
- Balance (Credit - Debit)
- Today's totals

---

## ✏️ Editing Transactions

### **Who Can Edit:**
- **Employees**: Can edit their own transactions only
- **Super Admins**: Can edit all transactions

### **How to Edit:**
1. Click **"Edit"** button on the transaction
2. Modify the details
3. Upload new screenshot if needed (optional)
4. Click **"Update Transaction"**

---

## 🗑️ Deleting Transactions

### **Who Can Delete:**
- **Employees**: Can delete their own transactions only
- **Super Admins**: Can delete all transactions

### **How to Delete:**
1. Click **"Delete"** button on the transaction
2. Confirm the deletion
3. Transaction is permanently removed

---

## 📊 Analytics & Reports

### **Available Metrics:**
- Total revenue (all credits)
- Total expenses (all debits)
- Net balance
- Today's transactions
- Mode-wise breakdown (Cash, PhonePe, GPay, etc.)
- Daily summaries

---

## 🐛 Troubleshooting

### **Photos Not Uploading?**

**Problem**: "Cloudinary is not configured" error

**Solution**:
1. Check if `.env` file exists in `employee-protol/` folder
2. Verify `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` are set
3. Restart the frontend server
4. Try using the demo credentials first to test

---

### **Transactions Not Saving?**

**Problem**: Transactions disappear after refresh

**Solution**:
1. Check browser console for errors (F12 → Console tab)
2. Clear browser cache and localStorage:
   - F12 → Application tab → Local Storage → Clear
3. Refresh the page and try again

---

### **Only Last Transaction Showing?**

**Problem**: Previous transactions are being overwritten

**Solution**:
- This has been fixed in the latest code
- Clear your browser's localStorage:
  - F12 → Application → Local Storage → Right-click → Clear
- Refresh the page
- Add new transactions - they will all be stored now

---

## 💡 Tips & Best Practices

### **For Employees:**
1. ✅ Always upload payment screenshot
2. ✅ Add clear category names (e.g., "ABC Company Payment")
3. ✅ Include client/project details in notes
4. ✅ Submit transactions on the same day as payment

### **For Admins:**
1. ✅ Review transactions regularly
2. ✅ Use filters to analyze payment patterns
3. ✅ Export data periodically (use browser print → Save as PDF)
4. ✅ Verify payment screenshots match amounts

---

## 🔐 Security Notes

- All transactions are stored locally in browser (localStorage)
- Payment screenshots are uploaded to Cloudinary (secure cloud storage)
- Only authorized users can view/edit transactions
- Employees can only see their own transactions
- Admins can see all transactions

---

## 📱 Mobile Usage

The Money Management interface is responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

---

## 🆘 Need Help?

If you encounter any issues:
1. Check this guide first
2. Look at browser console for error messages (F12)
3. Verify all environment variables are set correctly
4. Restart both backend and frontend servers
5. Clear browser cache and localStorage

---

## 🎯 Current Status

✅ **Working Features:**
- Add transactions with all details
- Upload payment screenshots
- View all transactions
- Filter and search transactions
- Edit own transactions
- Delete own transactions
- View analytics and summaries
- All transactions properly stored (no overwrites)

⚠️ **Limitations:**
- Data stored in browser localStorage (not in Firebase database yet)
- Photos uploaded to Cloudinary demo account (limited storage)
- No backend API integration yet (coming soon)

---

## 🚀 Future Enhancements

Planned features:
- [ ] Backend API integration with Firebase
- [ ] Export transactions to Excel/CSV
- [ ] Email notifications for large transactions
- [ ] Recurring transaction templates
- [ ] Multi-currency support
- [ ] Advanced analytics dashboard
- [ ] Mobile app

---

**Last Updated**: May 7, 2026
**Version**: 1.0.0
