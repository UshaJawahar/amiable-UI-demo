const express = require('express');
const { 
  uploadSingle, 
  uploadMultiple, 
  deleteFile, 
  listFiles 
} = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const { 
  uploadSingle: uploadSingleMiddleware, 
  uploadMultiple: uploadMultipleMiddleware,
  handleUploadError 
} = require('../middleware/upload');

const router = express.Router();

// All routes are protected
router.use(protect);

// Upload routes
router.post('/single', uploadSingleMiddleware, handleUploadError, uploadSingle);
router.post('/multiple', uploadMultipleMiddleware, handleUploadError, uploadMultiple);

// File management routes
router.delete('/:filename', deleteFile);
router.get('/list', listFiles);

module.exports = router; 