const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://usha:ushausha@35.209.234.43:27017/admin';
    
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.db.databaseName}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('Continuing without database connection...');
  }
};

module.exports = connectDB; 