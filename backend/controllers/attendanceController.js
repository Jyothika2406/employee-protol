const { db } = require('../config/firebase');
const { addActivityLog } = require('./logController');

// Mark Attendance
const markAttendance = async (req, res) => {
  try {
    const { date, status } = req.body; // status: present, absent, half-day

    if (!date || !status) {
      return res.status(400).json({ error: 'Date and status required' });
    }

    const attendanceDate = new Date(date).toISOString().split('T')[0];

    // Check if already marked
    const existing = await db.collection('attendance')
      .where('userId', '==', req.userId)
      .where('date', '==', attendanceDate)
      .get();

    if (!existing.empty) {
      // Update existing
      await db.collection('attendance').doc(existing.docs[0].id).update({
        status,
        updatedAt: new Date()
      });
    } else {
      // Create new
      await db.collection('attendance').add({
        userId: req.userId,
        date: attendanceDate,
        status,
        createdAt: new Date()
      });
    }

    await addActivityLog(req.userId, `Marked attendance: ${status}`);

    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Attendance
const getAttendance = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    const uid = userId || req.userId;

    // Check permission
    if (uid !== req.userId && req.userRole !== 'admin' && req.userRole !== 'superadmin') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    let query = db.collection('attendance').where('userId', '==', uid);

    if (startDate && endDate) {
      query = query
        .where('date', '>=', startDate)
        .where('date', '<=', endDate);
    }

    const snapshot = await query.orderBy('date', 'desc').get();
    const attendance = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Calculate attendance stats
    let present = 0, absent = 0, halfDay = 0;
    attendance.forEach(record => {
      if (record.status === 'present') present++;
      else if (record.status === 'absent') absent++;
      else if (record.status === 'half-day') halfDay++;
    });

    res.json({
      attendance,
      stats: { present, absent, halfDay, total: attendance.length }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Attendance (Admin)
const getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = db.collection('attendance');

    if (startDate && endDate) {
      query = query
        .where('date', '>=', startDate)
        .where('date', '<=', endDate);
    }

    const snapshot = await query.orderBy('date', 'desc').get();
    const attendance = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { markAttendance, getAttendance, getAllAttendance };
