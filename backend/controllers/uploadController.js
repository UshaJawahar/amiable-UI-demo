const { uploadToGCS, deleteFromGCS, listFilesInGCS, isGCSAvailable } = require('../config/googleCloud');
const mongoose = require('mongoose');

// Check if database is connected
const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

// @desc    Upload single file
// @route   POST /api/upload/single
// @access  Private
const uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Check if GCS is available
    if (!isGCSAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'File storage service not available. Please try again later.'
      });
    }

    const result = await uploadToGCS(req.file, req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: result
    });
  } catch (error) {
    console.error('Upload single error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file'
    });
  }
};

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private
const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Check if GCS is available
    if (!isGCSAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'File storage service not available. Please try again later.'
      });
    }

    const uploadPromises = req.files.map(file => uploadToGCS(file, req.user.id));
    const results = await Promise.all(uploadPromises);
    
    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      data: results
    });
  } catch (error) {
    console.error('Upload multiple error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading files'
    });
  }
};

// @desc    Delete file
// @route   DELETE /api/upload/:filename
// @access  Private
const deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Check if GCS is available
    if (!isGCSAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'File storage service not available. Please try again later.'
      });
    }
    
    await deleteFromGCS(filename);
    
    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file'
    });
  }
};

// @desc    List files
// @route   GET /api/upload/list
// @access  Private
const listFiles = async (req, res) => {
  try {
    // Check if GCS is available
    if (!isGCSAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'File storage service not available. Please try again later.'
      });
    }
    
    const files = await listFilesInGCS();
    
    res.status(200).json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing files'
    });
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  deleteFile,
  listFiles
}; 