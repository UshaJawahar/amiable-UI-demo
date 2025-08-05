const express = require('express');
const { upload, convertToBase64, validateBase64Image } = require('../utils/fileUpload');

const router = express.Router();

// @desc    Upload profile image
// @route   POST /api/upload/profile-image
// @access  Public
router.post('/profile-image', upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Convert file to base64
    const base64Data = convertToBase64(req.file);

    // Validate the base64 data
    if (!validateBase64Image(base64Data)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image data'
      });
    }

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      profile_picture: base64Data,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Upload failed'
    });
  }
});

module.exports = router; 