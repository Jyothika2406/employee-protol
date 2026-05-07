require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeFirebase } = require('./config/firebase');

// Import routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const reportRoutes = require('./routes/report');
const attendanceRoutes = require('./routes/attendance');
const salaryRoutes = require('./routes/salary');
const bankRoutes = require('./routes/bank');
const logRoutes = require('./routes/logs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Firebase
initializeFirebase();

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Employee Portal Backend API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      employees: '/api/employees',
      reports: '/api/reports',
      attendance: '/api/attendance',
      salary: '/api/salary',
      bank: '/api/bank',
      logs: '/api/logs'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/logs', logRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method,
    message: 'The requested endpoint does not exist. Check /api/health for available endpoints.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
