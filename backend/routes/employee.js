const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const {
  addEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

router.post('/', verifyToken, verifyRole('admin', 'superadmin'), addEmployee);
router.get('/', verifyToken, verifyRole('admin', 'superadmin'), getEmployees);
router.get('/:id', verifyToken, getEmployee);
router.put('/:id', verifyToken, updateEmployee);
router.delete('/:id', verifyToken, verifyRole('admin', 'superadmin'), deleteEmployee);

module.exports = router;
