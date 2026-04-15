const bcrypt = require('bcryptjs');
const { getDb } = require('../config/firebase');
const { addActivityLog } = require('./logController');

// Add Employee
const addEmployee = async (req, res) => {
  try {
    const { name, email, phone, salary } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, phone are required' });
    }

    const db = getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    // Check if email exists
    const existingUser = await db.collection('users').where('email', '==', email).get();
    if (!existingUser.empty) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash temporary password
    const tempPassword = 'Temp@' + Math.random().toString(36).substring(7);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create user document
    const userRef = await db.collection('users').add({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'employee',
      address: '',
      createdAt: new Date()
    });

    // Create salary document
    await db.collection('salaries').doc(userRef.id).set({
      userId: userRef.id,
      monthlySalary: salary || 0,
      finalSalary: 0,
      daysPresent: 0,
      daysAbsent: 0
    });

    // Log activity
    await addActivityLog(req.userId, `Created new employee: ${email}`);

    res.status(201).json({
      id: userRef.id,
      message: 'Employee added successfully',
      tempPassword: tempPassword
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Employees
const getEmployees = async (req, res) => {
  try {
    const db = getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const snapshot = await db.collection('users').where('role', '==', 'employee').get();
    const employees = [];

    for (const doc of snapshot.docs) {
      const salaryDoc = await db.collection('salaries').doc(doc.id).get();
      employees.push({
        id: doc.id,
        ...doc.data(),
        salary: salaryDoc.exists ? salaryDoc.data() : null
      });
    }

    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Employee
const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    if (!db) return res.status(404).json({ error: 'Employee not found' });
    const userDoc = await db.collection('users').doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const salaryDoc = await db.collection('salaries').doc(id).get();

    res.json({
      id: userDoc.id,
      ...userDoc.data(),
      salary: salaryDoc.exists ? salaryDoc.data() : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    // Check if user is updating their own profile or is admin
    if (req.userId !== id && req.userRole !== 'admin' && req.userRole !== 'superadmin') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    await db.collection('users').doc(id).update(updateData);

    await addActivityLog(req.userId, `Updated employee: ${id}`);

    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const db = getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    await db.collection('users').doc(id).delete();
    await db.collection('salaries').doc(id).delete();

    await addActivityLog(req.userId, `Deleted employee: ${id}`);

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addEmployee, getEmployees, getEmployee, updateEmployee, deleteEmployee };
