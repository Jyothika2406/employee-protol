const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const { getBankDetails, updateBankDetails } = require('../controllers/bankController');

router.get('/:userId', verifyToken, getBankDetails);
router.put('/', verifyToken, verifyRole('admin', 'superadmin'), updateBankDetails);

module.exports = router;
