# Complete Employee Roles Guide

## 📋 Overview

The Employee Portal now supports **7 different roles**, each with specific access permissions:

1. **Superadmin** - Full system access
2. **Admin** - Management access (read-only for some features)
3. **Employee** - Standard employee with full features
4. **AI Developer** - Reports and dashboard only
5. **Telecaller** - Reports and dashboard only
6. **HR** - Employee management, attendance, salary, bank
7. **Editor** - Reports and dashboard only

---

## 🎯 Role Permissions Matrix

| Feature | Superadmin | Admin | Employee | AI Developer | Telecaller | HR | Editor |
|---------|-----------|-------|----------|--------------|------------|-----|--------|
| **Dashboard** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Attendance** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Employees** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Reports** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Salary** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Bank** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Money Management** | ✅ | ✅ (view) | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Company Management** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Settings** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 👥 Role Details

### 1. 🔴 Superadmin
**Full system control**

**Access:**
- All 9 tabs
- Can add/edit/delete employees
- Can manage all transactions
- Can approve attendance
- Can view all reports
- Can manage company expenses

**Use Case:**
- System owner
- Company owner
- IT administrator

---

### 2. 🟠 Admin
**Management with read-only restrictions**

**Access:**
- All 9 tabs
- Can view all data
- Can approve attendance
- Can add company expenses
- Cannot edit money transactions (view only)

**Use Case:**
- Department managers
- Team leads
- Operations managers

---

### 3. ⚪ Employee
**Standard employee with full features**

**Access:**
- 7 tabs: Dashboard, Attendance, Reports, Salary, Bank, Money Management, Settings
- Can mark attendance
- Can submit reports
- Can view salary
- Can manage bank details
- Can submit payment transactions
- Cannot manage other employees

**Use Case:**
- Sales team
- Full-time employees
- Regular staff

---

### 4. 🔵 AI Developer
**Reports and dashboard only**

**Access:**
- 3 tabs: Dashboard, Reports, Settings
- Can submit daily reports
- Can view dashboard
- Cannot access attendance, salary, bank, payments

**Use Case:**
- AI/ML developers
- Software developers
- Technical contractors
- Freelance developers

---

### 5. 🟡 Telecaller
**Reports and dashboard only**

**Access:**
- 3 tabs: Dashboard, Reports, Settings
- Can submit daily reports (calls, leads, conversions)
- Can view dashboard
- Cannot access attendance, salary, bank, payments

**Use Case:**
- Call center agents
- Telesales representatives
- Customer support
- Lead generation team

---

### 6. 🟢 HR
**Employee management and HR functions**

**Access:**
- 6 tabs: Dashboard, Employees, Attendance, Salary, Bank, Settings
- Can manage employees (add/edit/delete)
- Can view/approve attendance
- Can view salary details
- Can manage bank details
- Cannot submit reports
- Cannot access money management

**Use Case:**
- HR managers
- HR executives
- Recruitment team
- Payroll administrators

---

### 7. 🟣 Editor
**Content and reports only**

**Access:**
- 3 tabs: Dashboard, Reports, Settings
- Can submit daily reports
- Can view dashboard
- Cannot access attendance, salary, bank, payments

**Use Case:**
- Content writers
- Content editors
- Social media managers
- Marketing content team

---

## 🎨 Visual Identification

Each role has a unique color badge in the employee table:

```
⚪ Employee      - Gray badge
🔵 AI Developer  - Blue badge
🟡 Telecaller    - Yellow/Amber badge
🟢 HR            - Green badge
🟣 Editor        - Pink/Rose badge
```

---

## 📝 How to Add Each Role

### Adding an Employee (any role):

1. **Login as Admin/Superadmin**
2. **Go to Employees tab**
3. **Fill the form:**
   - Name: `Full Name`
   - Email: `email@company.com`
   - Phone: `1234567890`
   - Password: `Password@123` (min 6 chars)
   - **Role**: Select from dropdown ⭐
     - Employee
     - AI Developer
     - Telecaller
     - HR
     - Editor
   - Position: `Job Title` (optional)
   - Department: `Department Name` (optional)
   - Salary: `50000` (optional)

4. **Click "Add Employee"**

---

## 💼 Use Case Examples

### Example 1: Sales Team
**Role:** Employee
- Need to mark attendance
- Submit daily sales reports
- Submit payment transactions
- View salary and bank details

### Example 2: Call Center
**Role:** Telecaller
- Only need to submit call reports
- Track calls, leads, conversions
- No need for attendance or payments

### Example 3: Development Team
**Role:** AI Developer
- Submit daily work reports
- Track project progress
- No need for attendance or payments

### Example 4: HR Department
**Role:** HR
- Manage all employees
- Track attendance
- Manage salary and bank details
- No need to submit reports

### Example 5: Content Team
**Role:** Editor
- Submit daily content reports
- Track content creation
- No need for attendance or payments

---

## 🔄 Changing Roles

To change an employee's role:

1. Go to **Employees** tab
2. Find the employee in the list
3. Click **"Edit"** button
4. Change the **Role** dropdown
5. Click **"Update Employee"**

The employee will see different tabs on their next login.

---

## 📊 Report Submission

### Who Can Submit Reports?
- ✅ Employee
- ✅ AI Developer
- ✅ Telecaller
- ✅ Editor
- ❌ HR (cannot submit reports)

### Report Fields:
- Calls made
- Leads generated
- Conversions
- Revenue (₹)
- Client details (name, company, phone, email, address)
- Notes
- File attachments

---

## 🎯 Quick Reference

### Need Full Features?
→ Use **Employee** role

### Need Only Reports?
→ Use **AI Developer**, **Telecaller**, or **Editor** role

### Need HR Functions?
→ Use **HR** role

### Need Management Access?
→ Use **Admin** or **Superadmin** role

---

## 🔧 Testing

1. **Hard refresh browser**: `Ctrl + Shift + R`
2. **Add test users** for each role
3. **Login with each** to verify access
4. **Check navigation tabs** match the permissions table

---

## ❓ FAQ

**Q: Can I have multiple roles for one person?**
A: No, each employee has one role. Choose the role that best fits their primary function.

**Q: Can Telecallers mark attendance?**
A: No, Telecallers only have access to Dashboard, Reports, and Settings.

**Q: Can HR submit reports?**
A: No, HR role is focused on employee management, not report submission.

**Q: Can AI Developers see other employees' data?**
A: No, they can only see their own reports and dashboard.

**Q: Can I create custom roles?**
A: Currently, only these 5 employee roles are available. Contact your developer for custom roles.

**Q: What's the difference between AI Developer, Telecaller, and Editor?**
A: They have the same access (Dashboard, Reports, Settings). The role name is just for identification and organizational purposes.

---

## 🎨 Color Coding

```css
Employee:     Gray   (#f3f4f6 / #4b5563)
AI Developer: Blue   (#dbeafe / #1e40af)
Telecaller:   Yellow (#fef3c7 / #92400e)
HR:           Green  (#dcfce7 / #166534)
Editor:       Pink   (#fce7f3 / #9f1239)
```

---

## ✅ Summary

- **5 employee roles** available: Employee, AI Developer, Telecaller, HR, Editor
- **Easy role selection** via dropdown in Add Employee form
- **Color-coded badges** for easy identification
- **Role-based access control** for security
- **Flexible role assignment** - can change anytime

---

## 📚 Related Documentation

- `QUICK_START_AI_DEVELOPER.md` - Quick guide for AI Developer role
- `AI_DEVELOPER_ROLE.md` - Detailed AI Developer documentation
- `DASHBOARD_BUTTONS_FIX.md` - Dashboard features guide

---

**Last Updated:** May 7, 2026
**Version:** 2.0
