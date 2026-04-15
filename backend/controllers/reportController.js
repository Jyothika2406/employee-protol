const { db } = require('../config/firebase');
const { addActivityLog } = require('./logController');

// Add Report
const addReport = async (req, res) => {
  try {
    const { date, leads, calls, conversations, conversions, revenue, notes } = req.body;

    if (!date || leads === undefined || conversations === undefined) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const reportRef = await db.collection('reports').add({
      userId: req.userId,
      date: new Date(date),
      leads: parseInt(leads) || 0,
      calls: parseInt(calls) || 0,
      conversations: parseInt(conversations) || 0,
      conversions: parseInt(conversions) || 0,
      revenue: parseFloat(revenue) || 0,
      notes: notes || '',
      createdAt: new Date()
    });

    await addActivityLog(req.userId, `Added report for ${date}`);

    res.status(201).json({
      id: reportRef.id,
      message: 'Report added successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get My Reports
const getMyReports = async (req, res) => {
  try {
    const { range = 'all', startDate, endDate } = req.query;
    let query = db.collection('reports').where('userId', '==', req.userId);

    if (range === 'daily' || startDate) {
      const start = new Date(startDate || new Date().toISOString().split('T')[0]);
      const end = new Date(endDate || new Date().toISOString().split('T')[0]);
      query = query.where('date', '>=', start).where('date', '<=', end);
    }

    const snapshot = await query.orderBy('date', 'desc').get();
    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    }));

    // Calculate totals
    let totals = {
      totalLeads: 0,
      totalCalls: 0,
      totalConversations: 0,
      totalConversions: 0,
      totalRevenue: 0
    };

    reports.forEach(report => {
      totals.totalLeads += report.leads;
      totals.totalCalls += report.calls;
      totals.totalConversations += report.conversations;
      totals.totalConversions += report.conversions;
      totals.totalRevenue += report.revenue;
    });

    res.json({ reports, totals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Reports (Admin/SuperAdmin)
const getAllReports = async (req, res) => {
  try {
    const { range = 'all', startDate, endDate, userId } = req.query;
    let query = db.collection('reports');

    if (userId) {
      query = query.where('userId', '==', userId);
    }

    if (range === 'daily' || startDate) {
      const start = new Date(startDate || new Date().toISOString().split('T')[0]);
      const end = new Date(endDate || new Date().toISOString().split('T')[0]);
      query = query.where('date', '>=', start).where('date', '<=', end);
    }

    const snapshot = await query.orderBy('date', 'desc').get();
    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    }));

    // Calculate totals
    let totals = {
      totalLeads: 0,
      totalCalls: 0,
      totalConversations: 0,
      totalConversions: 0,
      totalRevenue: 0
    };

    reports.forEach(report => {
      totals.totalLeads += report.leads;
      totals.totalCalls += report.calls;
      totals.totalConversations += report.conversations;
      totals.totalConversions += report.conversions;
      totals.totalRevenue += report.revenue;
    });

    res.json({ reports, totals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Report
const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { leads, calls, conversations, conversions, revenue, notes } = req.body;

    const reportDoc = await db.collection('reports').doc(id).get();
    if (!reportDoc.exists) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Check permission
    if (reportDoc.data().userId !== req.userId && req.userRole !== 'admin' && req.userRole !== 'superadmin') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const updateData = {};
    if (leads !== undefined) updateData.leads = parseInt(leads);
    if (calls !== undefined) updateData.calls = parseInt(calls);
    if (conversations !== undefined) updateData.conversations = parseInt(conversations);
    if (conversions !== undefined) updateData.conversions = parseInt(conversions);
    if (revenue !== undefined) updateData.revenue = parseFloat(revenue);
    if (notes !== undefined) updateData.notes = notes;

    await db.collection('reports').doc(id).update(updateData);

    await addActivityLog(req.userId, `Updated report: ${id}`);

    res.json({ message: 'Report updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Report
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const reportDoc = await db.collection('reports').doc(id).get();
    if (!reportDoc.exists) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (reportDoc.data().userId !== req.userId && req.userRole !== 'admin' && req.userRole !== 'superadmin') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    await db.collection('reports').doc(id).delete();

    await addActivityLog(req.userId, `Deleted report: ${id}`);

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addReport, getMyReports, getAllReports, updateReport, deleteReport };
