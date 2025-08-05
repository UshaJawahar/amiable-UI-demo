const express = require('express');
const { register, login, getMe, adminLogin, getAdminMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { protectAdmin } = require('../middleware/adminAuth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Admin routes
router.post('/admin/login', adminLogin);

// Protected routes
router.get('/me', protect, getMe);
router.get('/admin/me', protectAdmin, getAdminMe);

module.exports = router; 