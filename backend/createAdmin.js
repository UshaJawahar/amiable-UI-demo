const mongoose = require('mongoose');
const Admin = require('./models/Admin');

// MongoDB connection string
const MONGODB_URI = 'mongodb://usha:ushausha@35.209.234.43:27017/admin';

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@amiable.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    // Create admin user
    const admin = new Admin({
      name: 'Admin User',
      email: 'admin@amiable.com',
      password: 'admin123',
      role: 'admin',
      permissions: [
        'review_applications',
        'approve_applications',
        'reject_applications',
        'manage_users',
        'view_analytics'
      ],
      isActive: true
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@amiable.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin(); 