const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const { getSalary, setSalary } = require('../controllers/salaryController');

router.get('/:userId', verifyToken, getSalary);
router.post('/set', verifyToken, verifyRole('admin', 'superadmin'), setSalary);

module.exports = router;
