const { db } = require('../config/firebase');
const { addActivityLog } = require('./logController');

// Get Bank Details
const getBankDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const uid = userId || req.userId;

    // Check permission
    if (uid !== req.userId && req.userRole !== 'admin' && req.userRole !== 'superadmin') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const bankDoc = await db.collection('bankDetails').doc(uid).get();

    if (!bankDoc.exists) {
      return res.json({ message: 'No bank details found' });
    }

    res.json(bankDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Bank Details (Admin only)
const updateBankDetails = async (req, res) => {
  try {
    const { userId, accountNumber, ifsc, bankName, branch } = req.body;

    if (!userId || !accountNumber || !ifsc || !bankName) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const bankRef = db.collection('bankDetails').doc(userId);

    await bankRef.set({
      userId,
      accountNumber,
      ifsc,
      bankName,
      branch: branch || '',
      updatedAt: new Date()
    }, { merge: true });

    await addActivityLog(req.userId, `Updated bank details for employee: ${userId}`);

    res.json({ message: 'Bank details updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBankDetails, updateBankDetails };
