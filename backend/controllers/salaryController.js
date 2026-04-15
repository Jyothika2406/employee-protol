const { db } = require('../config/firebase');
const { addActivityLog } = require('./logController');

// Get Salary
const getSalary = async (req, res) => {
  try {
    const { userId } = req.params;
    const uid = userId || req.userId;

    // Check permission
    if (uid !== req.userId && req.userRole !== 'admin' && req.userRole !== 'superadmin') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const salaryDoc = await db.collection('salaries').doc(uid).get();

    if (!salaryDoc.exists) {
      return res.status(404).json({ error: 'Salary details not found' });
    }

    // Get attendance data
    const attendanceSnapshot = await db.collection('attendance')
      .where('userId', '==', uid)
      .get();

    let daysPresent = 0, daysAbsent = 0;
    attendanceSnapshot.docs.forEach(doc => {
      const record = doc.data();
      if (record.status === 'present') daysPresent++;
      else if (record.status === 'absent') daysAbsent++;
    });

    const salary = salaryDoc.data();
    const totalWorkingDays = 26; // Default working days per month
    const perDaySalary = salary.monthlySalary / totalWorkingDays;
    const finalSalary = perDaySalary * daysPresent;

    res.json({
      monthlySalary: salary.monthlySalary,
      perDaySalary: perDaySalary.toFixed(2),
      daysPresent,
      daysAbsent,
      totalWorkingDays,
      finalSalary: finalSalary.toFixed(2),
      totalDeduction: (salary.monthlySalary - finalSalary).toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Set Monthly Salary (Admin only)
const setSalary = async (req, res) => {
  try {
    const { userId, monthlySalary } = req.body;

    if (!userId || !monthlySalary) {
      return res.status(400).json({ error: 'UserId and monthlySalary required' });
    }

    const salaryRef = db.collection('salaries').doc(userId);
    const exists = await salaryRef.get();

    if (exists.exists) {
      await salaryRef.update({ monthlySalary: parseFloat(monthlySalary) });
    } else {
      await salaryRef.set({
        userId,
        monthlySalary: parseFloat(monthlySalary),
        finalSalary: 0,
        daysPresent: 0,
        daysAbsent: 0
      });
    }

    await addActivityLog(req.userId, `Updated salary for employee: ${userId}`);

    res.json({ message: 'Salary updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getSalary, setSalary };
