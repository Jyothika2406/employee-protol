# 🧪 Function Test Checklist - Employee Portal

## Test All Features Systematically

### ✅ **Login & Authentication**
- [ ] Login with admin credentials
- [ ] Login with super admin credentials  
- [ ] Login with employee credentials
- [ ] Forgot password link
- [ ] Logout button
- [ ] Session persistence (refresh page)

---

### ✅ **Dashboard**
- [ ] View total employees count
- [ ] View total reports count
- [ ] View pending approvals count
- [ ] View user role display
- [ ] Company revenue analytics (admin only)
- [ ] Total revenue display
- [ ] Total expense display
- [ ] Net profit calculation
- [ ] Today's revenue/expense

---

### ✅ **Attendance Management**

#### Employee Functions:
- [ ] Mark Present button
- [ ] Mark Absent button
- [ ] GPS location verification
- [ ] View own attendance history
- [ ] See pending approval status

#### Admin Functions:
- [ ] View pending approvals list
- [ ] Approve attendance button
- [ ] Reject attendance button
- [ ] View all attendance records
- [ ] Filter attendance by date
- [ ] View location data

---

### ✅ **Employee Management** (Admin Only)

#### Add Employee:
- [ ] Fill employee form (name, email, phone)
- [ ] Add position field
- [ ] Add department field
- [ ] Set monthly salary
- [ ] Generate password
- [ ] Submit form
- [ ] View success message

#### Edit Employee:
- [ ] Click Edit button
- [ ] Modify employee details
- [ ] Update button works
- [ ] Cancel button works
- [ ] Changes saved

#### Delete Employee:
- [ ] Click Delete button
- [ ] Confirmation dialog appears
- [ ] Employee deleted
- [ ] List updates

---

### ✅ **Reports Management**

#### Add Report (Employee):
- [ ] Fill report form (calls, leads, conversions, revenue)
- [ ] Add client name
- [ ] Add company name
- [ ] Add phone numbers
- [ ] Add client email
- [ ] Add client address
- [ ] Add notes
- [ ] Upload attachments
- [ ] Submit report
- [ ] View success message

#### Edit Report:
- [ ] Click Edit button
- [ ] Modify report details
- [ ] Update button works
- [ ] Cancel button works

#### Delete Report:
- [ ] Click Delete button
- [ ] Confirmation dialog
- [ ] Report deleted

#### View Reports:
- [ ] Employee sees own reports only
- [ ] Admin sees all reports
- [ ] Filter by date range
- [ ] Search functionality

---

### ✅ **Salary Management**

#### Employee View:
- [ ] View monthly salary
- [ ] View days present
- [ ] View days absent
- [ ] View final salary calculation
- [ ] View deduction details
- [ ] Generate certificate button
- [ ] Print functionality

#### Admin Functions:
- [ ] Select employee dropdown
- [ ] Set monthly salary
- [ ] Save salary button
- [ ] View salary calculations

---

### ✅ **Bank Details**

#### Employee:
- [ ] Fill bank form (bank name, account number, holder, IFSC)
- [ ] Save bank details button
- [ ] View saved details
- [ ] Update existing details

#### Admin:
- [ ] Select employee dropdown
- [ ] Fill employee bank details
- [ ] Save button
- [ ] View all employee bank details

---

### ✅ **Money Management** ⭐ (Main Feature)

#### Add Transaction:
- [ ] Select date
- [ ] Select type (Credit/Debit) - Admin only
- [ ] Enter amount
- [ ] Select mode (PhonePe, GPay, Bank, Cash, etc.)
- [ ] Enter category
- [ ] Enter notes
- [ ] Upload payment screenshot
- [ ] Image preview shows
- [ ] Submit transaction button
- [ ] Success message appears
- [ ] Transaction appears in list

#### View Transactions:
- [ ] All transactions display
- [ ] Transaction ID shows
- [ ] Date displays correctly
- [ ] Amount displays correctly
- [ ] Payment mode shows
- [ ] Category displays
- [ ] Notes visible
- [ ] Screenshot thumbnail shows
- [ ] Click image to view full size

#### Edit Transaction:
- [ ] Click Edit button
- [ ] Form populates with data
- [ ] Modify details
- [ ] Upload new screenshot (optional)
- [ ] Update button works
- [ ] Changes saved
- [ ] Cancel button works

#### Delete Transaction:
- [ ] Click Delete button
- [ ] Confirmation dialog
- [ ] Transaction deleted
- [ ] List updates

#### Filters:
- [ ] Search by transaction ID
- [ ] Search by category
- [ ] Search by notes
- [ ] Filter by type (Credit/Debit)
- [ ] Filter by mode
- [ ] Filter by date range
- [ ] Filter by proof only
- [ ] Filter by submitter role (Admin)
- [ ] Clear filters button

#### Analytics:
- [ ] Total credit displays
- [ ] Total debit displays
- [ ] Balance calculation
- [ ] Today's totals
- [ ] Mode-wise breakdown
- [ ] Daily summaries
- [ ] Charts/graphs (if any)

---

### ✅ **Company Management** (Admin Only)

#### Add Expense:
- [ ] Select date
- [ ] Select category (Food, Rent, Utilities, etc.)
- [ ] Enter description
- [ ] Enter amount
- [ ] Upload photo
- [ ] Add multiple photos
- [ ] Remove photo button
- [ ] Enter notes
- [ ] Submit expense button
- [ ] Success message

#### Edit Expense:
- [ ] Click Edit button
- [ ] Modify details
- [ ] Update photos
- [ ] Update button works
- [ ] Cancel button works

#### Delete Expense:
- [ ] Click Delete button
- [ ] Confirmation dialog
- [ ] Expense deleted

#### View Expenses:
- [ ] All expenses display
- [ ] Filter by category
- [ ] Filter by date range
- [ ] Search functionality
- [ ] Total expenses display
- [ ] Category breakdown
- [ ] Daily summaries

---

### ✅ **Settings**

#### Profile:
- [ ] View profile information
- [ ] Upload profile image
- [ ] Image preview
- [ ] Save changes

#### Change Password:
- [ ] Current password field
- [ ] New password field
- [ ] Confirm password field
- [ ] Submit button
- [ ] Validation works

---

## 🐛 **Common Issues to Check**

### Data Persistence:
- [ ] Transactions persist after page refresh
- [ ] Images persist after page refresh
- [ ] Filters reset correctly
- [ ] Form data clears after submit

### Error Handling:
- [ ] Empty form validation
- [ ] Invalid email format
- [ ] Invalid phone format
- [ ] Amount validation (positive numbers)
- [ ] Date validation
- [ ] File size validation
- [ ] Network error handling

### UI/UX:
- [ ] Buttons have hover effects
- [ ] Loading states show
- [ ] Success messages display
- [ ] Error messages display
- [ ] Forms reset after submit
- [ ] Modals close properly
- [ ] Dropdowns work
- [ ] Date pickers work
- [ ] File upload works

### Performance:
- [ ] Page loads quickly
- [ ] Images load properly
- [ ] No console errors
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] Responsive on mobile

---

## 🔍 **How to Test**

### 1. Open Browser Console (F12)
- Check for any red errors
- Check for warnings
- Monitor network requests

### 2. Test Each Feature Systematically
- Go through each section
- Click every button
- Fill every form
- Upload test files

### 3. Test Different User Roles
- Login as Employee
- Login as Admin
- Login as Super Admin
- Verify permissions

### 4. Test Edge Cases
- Empty forms
- Invalid data
- Large files
- Many transactions
- Long text inputs

---

## 📝 **Report Issues**

For each broken feature, note:
1. **What button/feature** is not working
2. **What happens** when you click it
3. **What error message** appears (if any)
4. **Console errors** (F12 → Console tab)
5. **Which user role** you're testing with

---

## ✅ **Quick Test Script**

Run this in browser console to test localStorage:

```javascript
// Test transaction storage
console.log('Transactions:', JSON.parse(localStorage.getItem('mockMoneyTransactions') || '[]').length);
console.log('Employees:', JSON.parse(localStorage.getItem('mockEmployees') || '[]').length);
console.log('Reports:', JSON.parse(localStorage.getItem('mockReports') || '[]').length);
console.log('Attendance:', JSON.parse(localStorage.getItem('mockAttendance') || '[]').length);
```

---

**Start testing and let me know which specific buttons/features are not working!** 🧪
