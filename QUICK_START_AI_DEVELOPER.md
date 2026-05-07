# Quick Start: AI Developer Role

## ✅ What's New?

Added a new **"AI Developer"** role that can:
- ✅ View Dashboard
- ✅ Submit Daily Reports
- ✅ Manage Settings
- ❌ No access to Attendance, Salary, Bank, or Payment features

## 🚀 How to Add an AI Developer (3 Steps)

### Step 1: Login as Admin
- Go to `http://localhost:5173`
- Login with your admin credentials

### Step 2: Add AI Developer
1. Click **"Employees"** tab
2. Fill in the form:
   - Name: `Developer Name`
   - Email: `developer@company.com`
   - Phone: `1234567890`
   - Password: `Dev@123` (minimum 6 characters)
   - **Role**: Select **"AI Developer"** ⭐ (NEW DROPDOWN)
   - Position: `AI Developer` (optional)
   - Department: `AI Team` (optional)
   - Salary: `50000` (optional)

3. Click **"Add Employee"**

### Step 3: AI Developer Can Login
- Email: `developer@company.com`
- Password: `Dev@123`
- They will only see: Dashboard, Reports, Settings

## 📊 Visual Differences

### In Employee Table:
- **AI Developer**: Blue badge "AI Developer"
- **Regular Employee**: Gray badge "Employee"

### Navigation Tabs:
- **Admin/Superadmin**: All tabs (9 tabs)
- **Regular Employee**: Dashboard, Attendance, Reports, Salary, Bank, Money Management, Settings (7 tabs)
- **AI Developer**: Dashboard, Reports, Settings (3 tabs only) ⭐

## 🎯 Example

**Adding "Rahul Kumar" as AI Developer:**

```
Name: Rahul Kumar
Email: rahul@company.com
Phone: 9876543210
Password: Rahul@123
Role: AI Developer ← Select this
Position: Senior AI Developer
Department: AI Research
Salary: 75000
```

Click "Add Employee" → Done! ✅

**Rahul can now login and submit daily reports!**

## 🔄 To Change Role

1. Go to Employees tab
2. Find the employee
3. Click "Edit"
4. Change Role dropdown from "Employee" to "AI Developer" (or vice versa)
5. Click "Update Employee"

## 📝 What AI Developers Can Do

### Submit Daily Reports With:
- Calls made
- Leads generated
- Conversions
- Revenue (₹)
- Client details (name, company, phone, email, address)
- Notes
- File attachments

### View Dashboard:
- Overview statistics
- Their role badge
- Quick navigation

### Manage Profile:
- Update personal info
- Change password
- Upload profile picture

## ❓ FAQ

**Q: Can AI Developers see other employees' reports?**
A: No, they can only see their own reports.

**Q: Can I convert an existing employee to AI Developer?**
A: Yes! Edit the employee and change the Role dropdown.

**Q: Can AI Developers mark attendance?**
A: No, they don't have access to the Attendance tab.

**Q: Can AI Developers submit payment transactions?**
A: No, they don't have access to Money Management.

## 🎨 UI Changes

1. **New dropdown in Add Employee form**: "Role" selector
2. **New column in Employee table**: Shows role badge
3. **Different navigation**: AI Developers see only 3 tabs
4. **Color coding**: Blue for AI Developer, Gray for Employee

## 🔧 Testing

1. **Hard refresh browser**: `Ctrl + Shift + R`
2. **Add a test AI Developer**
3. **Login with their credentials**
4. **Verify they only see 3 tabs**: Dashboard, Reports, Settings
5. **Submit a test report**
6. **Logout and login as admin to see the report**

## ✨ Done!

Your AI Developer role is now ready to use! 🎉

For detailed documentation, see: `AI_DEVELOPER_ROLE.md`
