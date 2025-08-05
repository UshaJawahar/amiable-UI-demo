const multer = require('multer');

// Create a simple multer storage that stores files in memory
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only image files (JPEG, JPG, PNG, GIF) are allowed'), false);
  }

  // Check file size (500KB = 512000 bytes)
  const maxSize = 512000;
  if (file.size > maxSize) {
    return cb(new Error('File size must be less than 500KB'), false);
  }

  cb(null, true);
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 512000 // 500KB in bytes
  }
});

// Function to convert file buffer to base64
const convertToBase64 = (file) => {
  try {
    const base64String = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64String}`;
    return dataURI;
  } catch (error) {
    throw new Error(`Failed to convert file to base64: ${error.message}`);
  }
};

// Function to validate base64 image
const validateBase64Image = (base64String) => {
  try {
    // Check if it's a valid data URI
    if (!base64String.startsWith('data:image/')) {
      return false;
    }
    
    // Extract the base64 part
    const base64Data = base64String.split(',')[1];
    if (!base64Data) {
      return false;
    }
    
    // Check size (500KB limit)
    const sizeInBytes = Math.ceil((base64Data.length * 3) / 4);
    if (sizeInBytes > 512000) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  upload,
  convertToBase64,
  validateBase64Image
}; 