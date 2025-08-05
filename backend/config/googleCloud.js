const { Storage } = require('@google-cloud/storage');

let storage, bucket;

// Initialize Google Cloud Storage only if credentials are available
const initializeGCS = () => {
  try {
    storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
    const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
    bucket = storage.bucket(bucketName);
    console.log('Google Cloud Storage initialized successfully');
    return true;
  } catch (error) {
    console.log('Google Cloud Storage not available:', error.message);
    return false;
  }
};

// Check if GCS is available
const isGCSAvailable = () => {
  return storage && bucket;
};

// Upload file to Google Cloud Storage
const uploadToGCS = async (file, userId) => {
  if (!isGCSAvailable()) {
    throw new Error('Google Cloud Storage not available');
  }

  try {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/\s+/g, '_');
    const destination = `uploads/${userId}/${timestamp}_${originalName}`;
    
    const blob = bucket.file(destination);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => {
        reject(error);
      });

      blobStream.on('finish', async () => {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
        
        resolve({
          filename: originalName,
          destination,
          publicUrl,
          size: file.size,
          mimetype: file.mimetype
        });
      });

      blobStream.end(file.buffer);
    });
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Download file from Google Cloud Storage
const downloadFromGCS = async (filename) => {
  if (!isGCSAvailable()) {
    throw new Error('Google Cloud Storage not available');
  }

  try {
    const file = bucket.file(filename);
    const [exists] = await file.exists();
    
    if (!exists) {
      throw new Error('File not found');
    }

    const [buffer] = await file.download();
    return buffer;
  } catch (error) {
    throw new Error(`Download failed: ${error.message}`);
  }
};

// Delete file from Google Cloud Storage
const deleteFromGCS = async (filename) => {
  if (!isGCSAvailable()) {
    throw new Error('Google Cloud Storage not available');
  }

  try {
    const file = bucket.file(filename);
    await file.delete();
  } catch (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};

// List files in Google Cloud Storage
const listFilesInGCS = async (prefix = '') => {
  if (!isGCSAvailable()) {
    throw new Error('Google Cloud Storage not available');
  }

  try {
    const [files] = await bucket.getFiles({ prefix });
    return files.map(file => ({
      name: file.name,
      size: file.metadata.size,
      contentType: file.metadata.contentType,
      timeCreated: file.metadata.timeCreated,
      publicUrl: `https://storage.googleapis.com/${bucket.name}/${file.name}`
    }));
  } catch (error) {
    throw new Error(`List files failed: ${error.message}`);
  }
};

// Initialize GCS on module load
initializeGCS();

module.exports = {
  storage,
  bucket,
  uploadToGCS,
  downloadFromGCS,
  deleteFromGCS,
  listFilesInGCS,
  isGCSAvailable
}; 