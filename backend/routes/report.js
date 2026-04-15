const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const {
  addReport,
  getMyReports,
  getAllReports,
  updateReport,
  deleteReport
} = require('../controllers/reportController');

router.post('/', verifyToken, addReport);
router.get('/my', verifyToken, getMyReports);
router.get('/all', verifyToken, verifyRole('admin', 'superadmin'), getAllReports);
router.put('/:id', verifyToken, updateReport);
router.delete('/:id', verifyToken, deleteReport);

module.exports = router;
