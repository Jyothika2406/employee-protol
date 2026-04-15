const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const { getActivityLogs } = require('../controllers/logController');

router.get('/', verifyToken, verifyRole('superadmin'), getActivityLogs);

module.exports = router;
