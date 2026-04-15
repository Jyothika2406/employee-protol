const { db } = require('../config/firebase');

// Add Activity Log
const addActivityLog = async (userId, action) => {
  try {
    await db.collection('activityLogs').add({
      userId,
      action,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error adding activity log:', error);
  }
};

// Get Activity Logs (Super Admin only)
const getActivityLogs = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    let query = db.collection('activityLogs');

    if (userId) {
      query = query.where('userId', '==', userId);
    }

    if (startDate && endDate) {
      query = query
        .where('timestamp', '>=', new Date(startDate))
        .where('timestamp', '<=', new Date(endDate));
    }

    const snapshot = await query.orderBy('timestamp', 'desc').get();
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    }));

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addActivityLog, getActivityLogs };
