const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const {
  markAttendance,
  getAttendance,
  getAllAttendance
} = require('../controllers/attendanceController');

router.post('/', verifyToken, markAttendance);
router.get('/', verifyToken, getAttendance);
router.get('/all', verifyToken, verifyRole('admin', 'superadmin'), getAllAttendance);

module.exports = router;
