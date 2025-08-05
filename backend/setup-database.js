const mongoose = require('mongoose');
require('dotenv').config();

// Import all models to ensure they're registered
const User = require('./models/User');
const Project = require('./models/Project');
const Application = require('./models/Application');
const Notification = require('./models/Notification');
const Analytics = require('./models/Analytics');
const FeaturedProfile = require('./models/FeaturedProfile');
const AdminAction = require('./models/AdminAction');

const setupDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://usha:ushausha@35.209.234.43:27017/admin';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });

    console.log('✅ Connected to MongoDB successfully!');
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
    console.log(`Host: ${mongoose.connection.host}`);

    // Get database instance
    const db = mongoose.connection.db;

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Existing collections:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });

    // Create indexes for all models
    console.log('\n🔧 Creating indexes...');
    
    // User indexes
    await User.createIndexes();
    console.log('✅ User indexes created');

    // Project indexes
    await Project.createIndexes();
    console.log('✅ Project indexes created');

    // Application indexes
    await Application.createIndexes();
    console.log('✅ Application indexes created');

    // Notification indexes
    await Notification.createIndexes();
    console.log('✅ Notification indexes created');

    // Analytics indexes
    await Analytics.createIndexes();
    console.log('✅ Analytics indexes created');

    // FeaturedProfile indexes
    await FeaturedProfile.createIndexes();
    console.log('✅ FeaturedProfile indexes created');

    // AdminAction indexes
    await AdminAction.createIndexes();
    console.log('✅ AdminAction indexes created');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📊 Database Statistics:');
    
    // Get collection stats
    const stats = await db.stats();
    console.log(`  - Collections: ${stats.collections}`);
    console.log(`  - Data size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Storage size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Indexes: ${stats.indexes}`);
    console.log(`  - Index size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 