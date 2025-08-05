const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuth');
const {
  getApplications,
  getApplication,
  approveApplication,
  rejectApplication,
  getApplicationStats
} = require('../controllers/adminController');

// All routes require admin authentication
router.use(protectAdmin);

// Application management routes
router.get('/applications', getApplications);
router.get('/applications/stats', getApplicationStats);
router.get('/applications/:id', getApplication);
router.put('/applications/:id/approve', approveApplication);
router.put('/applications/:id/reject', rejectApplication);

module.exports = router; 