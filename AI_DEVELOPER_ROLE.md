# AI Developer Role Documentation

## Overview
The **AI Developer** role is a specialized employee role with limited access to only essential features needed for daily reporting.

## Key Differences from Regular Employee

### Regular Employee Access:
- ✅ Dashboard
- ✅ Attendance (mark present/absent)
- ✅ Reports (submit daily reports)
- ✅ Salary (view salary details)
- ✅ Bank (manage bank details)
- ✅ Money Management (submit payment transactions)
- ✅ Settings

### AI Developer Access:
- ✅ Dashboard (view only)
- ✅ Reports (submit daily reports)
- ✅ Settings
- ❌ Attendance (not accessible)
- ❌ Salary (not accessible)
- ❌ Bank (not accessible)
- ❌ Money Management (not accessible)

## How to Add an AI Developer

### Step 1: Login as Admin/Superadmin
1. Go to `http://localhost:5173`
2. Login with admin credentials

### Step 2: Navigate to Employees Tab
1. Click on **"Employees"** tab in the navigation
2. You'll see the employee management page

### Step 3: Add New AI Developer
1. Fill in the form:
   - **Full Name**: Enter the developer's name
   - **Email**: Enter their email address
   - **Phone**: Enter their phone number
   - **Password**: Create a password (minimum 6 characters)
   - **Role**: Select **"AI Developer"** from the dropdown
   - **Position**: (Optional) e.g., "AI Developer", "ML Engineer"
   - **Department**: (Optional) e.g., "AI Team", "Development"
   - **Monthly Salary**: (Optional) Enter salary amount

2. Click **"Add Employee"** button

### Step 4: AI Developer Login
1. The AI Developer can now login with:
   - Email: (the email you provided)
   - Password: (the password you created)

2. After login, they will only see:
   - Dashboard (overview)
   - Reports (to submit daily work reports)
   - Settings (to manage profile)

## Features Available to AI Developers

### 1. Dashboard
- View overview statistics
- See their role displayed
- Access quick navigation

### 2. Reports (Main Feature)
AI Developers can submit daily reports with:
- **Calls**: Number of calls made
- **Leads**: Number of leads generated
- **Conversions**: Number of conversions
- **Revenue**: Revenue generated (₹)
- **Client Information**:
  - Client Name
  - Company Name
  - Phone Numbers
  - Email
  - Address
  - Notes
- **File Attachments**: Upload supporting documents

### 3. Settings
- Update profile information
- Change password
- Upload profile picture

## Employee Table Display

When viewing the employee list, AI Developers are shown with:
- **Blue badge** labeled "AI Developer"
- Regular employees have a **gray badge** labeled "Employee"

## Use Cases

### When to Use AI Developer Role:
1. **Contractors/Freelancers**: Limited access for external team members
2. **Reporting-Only Staff**: Team members who only need to submit daily reports
3. **Specialized Roles**: Developers who don't need attendance/salary/payment features
4. **Trial Period**: New hires during probation who only need reporting access

### When to Use Regular Employee Role:
1. **Full-time Employees**: Need attendance tracking
2. **Sales Team**: Need payment transaction features
3. **Staff with Benefits**: Need salary and bank details access

## Technical Implementation

### Role Definition
```typescript
role: 'employee' | 'admin' | 'superadmin' | 'ai-developer'
```

### Tab Visibility Logic
```typescript
const visibleTabs = isAdmin
  ? ['dashboard', 'attendance', 'employees', 'reports', 'salary', 'bank', 'money-management', 'company-management', 'settings']
  : isAIDeveloper
  ? ['dashboard', 'reports', 'settings']
  : ['dashboard', 'attendance', 'reports', 'salary', 'bank', 'money-management', 'settings'];
```

### Report Submission Access
```typescript
{(user?.role === 'employee' || user?.role === 'ai-developer') && (
  // Report submission form
)}
```

## Example: Adding an AI Developer

**Scenario**: Adding a new AI developer named "John Doe"

1. **Login as Admin**
2. **Go to Employees Tab**
3. **Fill the form**:
   - Name: `John Doe`
   - Email: `john.doe@company.com`
   - Phone: `9876543210`
   - Password: `John@123`
   - Role: `AI Developer` (select from dropdown)
   - Position: `AI Developer`
   - Department: `AI Team`
   - Monthly Salary: `50000`

4. **Click "Add Employee"**
5. **Success message** will show: "Employee created successfully. Password: John@123"

6. **John can now login** with:
   - Email: `john.doe@company.com`
   - Password: `John@123`

7. **John will see only**:
   - Dashboard tab
   - Reports tab
   - Settings tab

## Editing AI Developer Details

1. Go to **Employees** tab
2. Find the AI Developer in the list (look for blue "AI Developer" badge)
3. Click **"Edit"** button
4. Modify details as needed
5. You can change their role from "AI Developer" to "Employee" or vice versa
6. Click **"Update Employee"**

## Security Notes

- AI Developers **cannot** access:
  - Other employees' data
  - Payment transactions
  - Attendance records
  - Salary information
  - Bank details
  - Company management features

- AI Developers **can only**:
  - View their own dashboard
  - Submit their own daily reports
  - Manage their own profile

## Troubleshooting

### Issue: AI Developer sees wrong tabs
**Solution**: 
1. Logout and login again
2. Clear browser cache (Ctrl + Shift + R)
3. Verify role is set correctly in Employees table

### Issue: Can't select AI Developer role
**Solution**:
1. Make sure you're logged in as Admin/Superadmin
2. Hard refresh the page (Ctrl + Shift + R)
3. Check if the dropdown shows both options

### Issue: AI Developer can't submit reports
**Solution**:
1. Check if they're logged in correctly
2. Verify their role is "ai-developer" in the database
3. Check browser console for errors (F12)

## Future Enhancements

Potential features that could be added for AI Developers:
- [ ] AI-specific metrics (model accuracy, training time, etc.)
- [ ] Code commit tracking
- [ ] Project assignment
- [ ] Task management
- [ ] Time tracking
- [ ] Performance analytics

## Support

If you need to:
- Add more roles
- Customize AI Developer permissions
- Add new features for AI Developers

Contact your system administrator or development team.
