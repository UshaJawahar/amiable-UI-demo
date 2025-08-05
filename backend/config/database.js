const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/talent-directory';
    
    // Only connect if MONGODB_URI is provided
    if (!process.env.MONGODB_URI) {
      console.log('MongoDB URI not provided, skipping database connection');
      return;
    }
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit process, just log the error
    console.log('Continuing without database connection...');
  }
};

module.exports = connectDB; 