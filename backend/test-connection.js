const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    const mongoURI = 'mongodb://usha:ushausha@35.209.234.43:27017/admin';
    
    console.log('Testing MongoDB connection...');
    console.log('Connection string:', mongoURI);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    console.log('✅ Connected to MongoDB successfully!');
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
    console.log(`Host: ${mongoose.connection.host}`);

    // Test creating a simple collection
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Existing collections:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
};

testConnection(); 