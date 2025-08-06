const mongoose = require('mongoose');
const bigquery = require('./config/bigquery');
const { v4: uuidv4 } = require('uuid');

// Import your MongoDB models
const User = require('./models/User');
const Project = require('./models/Project');
const Application = require('./models/Application');
const Admin = require('./models/Admin');
const Analytics = require('./models/Analytics');
const Notification = require('./models/Notification');
const FeaturedProfile = require('./models/FeaturedProfile');
const AdminAction = require('./models/AdminAction');

const DATASET_ID = 'amiable_data';

// Helper function to convert MongoDB document to BigQuery format
function convertMongoToBigQuery(doc, tableName) {
  const converted = {
    id: doc._id.toString(),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null
  };

  // Add all other fields
  Object.keys(doc._doc).forEach(key => {
    if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
      const value = doc[key];
      
      if (value === null || value === undefined) {
        converted[key] = null;
      } else if (Array.isArray(value)) {
        converted[key] = value;
      } else if (typeof value === 'object' && value !== null) {
        // Handle nested objects (like budget, timeline, etc.)
        converted[key] = JSON.stringify(value);
      } else if (value instanceof Date) {
        converted[key] = value.toISOString();
      } else {
        converted[key] = value;
      }
    }
  });

  return converted;
}

// Migration functions for each collection
async function migrateUsers() {
  console.log('🔄 Migrating users...');
  
  try {
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);
    
    if (users.length === 0) {
      console.log('No users to migrate');
      return;
    }

    const bigQueryData = users.map(user => convertMongoToBigQuery(user, 'users'));
    
    await bigquery
      .dataset(DATASET_ID)
      .table('users')
      .insert(bigQueryData);
    
    console.log(`✅ Successfully migrated ${users.length} users`);
  } catch (error) {
    console.error('❌ Error migrating users:', error);
    throw error;
  }
}

async function migrateProjects() {
  console.log('🔄 Migrating projects...');
  
  try {
    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects to migrate`);
    
    if (projects.length === 0) {
      console.log('No projects to migrate');
      return;
    }

    const bigQueryData = projects.map(project => convertMongoToBigQuery(project, 'projects'));
    
    await bigquery
      .dataset(DATASET_ID)
      .table('projects')
      .insert(bigQueryData);
    
    console.log(`✅ Successfully migrated ${projects.length} projects`);
  } catch (error) {
    console.error('❌ Error migrating projects:', error);
    throw error;
  }
}

async function migrateApplications() {
  console.log('🔄 Migrating applications...');
  
  try {
    const applications = await Application.find({});
    console.log(`Found ${applications.length} applications to migrate`);
    
    if (applications.length === 0) {
      console.log('No applications to migrate');
      return;
    }

    const bigQueryData = applications.map(app => convertMongoToBigQuery(app, 'applications'));
    
    await bigquery
      .dataset(DATASET_ID)
      .table('applications')
      .insert(bigQueryData);
    
    console.log(`✅ Successfully migrated ${applications.length} applications`);
  } catch (error) {
    console.error('❌ Error migrating applications:', error);
    throw error;
  }
}

async function migrateAdmins() {
  console.log('🔄 Migrating admins...');
  
  try {
    const admins = await Admin.find({});
    console.log(`Found ${admins.length} admins to migrate`);
    
    if (admins.length === 0) {
      console.log('No admins to migrate');
      return;
    }

    const bigQueryData = admins.map(admin => convertMongoToBigQuery(admin, 'admins'));
    
    await bigquery
      .dataset(DATASET_ID)
      .table('admins')
      .insert(bigQueryData);
    
    console.log(`✅ Successfully migrated ${admins.length} admins`);
  } catch (error) {
    console.error('❌ Error migrating admins:', error);
    throw error;
  }
}

async function migrateAnalytics() {
  console.log('🔄 Migrating analytics...');
  
  try {
    const analytics = await Analytics.find({});
    console.log(`Found ${analytics.length} analytics records to migrate`);
    
    if (analytics.length === 0) {
      console.log('No analytics to migrate');
      return;
    }

    const bigQueryData = analytics.map(analytic => convertMongoToBigQuery(analytic, 'analytics'));
    
    await bigquery
      .dataset(DATASET_ID)
      .table('analytics')
      .insert(bigQueryData);
    
    console.log(`✅ Successfully migrated ${analytics.length} analytics records`);
  } catch (error) {
    console.error('❌ Error migrating analytics:', error);
    throw error;
  }
}

async function migrateNotifications() {
  console.log('🔄 Migrating notifications...');
  
  try {
    const notifications = await Notification.find({});
    console.log(`Found ${notifications.length} notifications to migrate`);
    
    if (notifications.length === 0) {
      console.log('No notifications to migrate');
      return;
    }

    const bigQueryData = notifications.map(notification => convertMongoToBigQuery(notification, 'notifications'));
    
    await bigquery
      .dataset(DATASET_ID)
      .table('notifications')
      .insert(bigQueryData);
    
    console.log(`✅ Successfully migrated ${notifications.length} notifications`);
  } catch (error) {
    console.error('❌ Error migrating notifications:', error);
    throw error;
  }
}

async function migrateFeaturedProfiles() {
  console.log('🔄 Migrating featured profiles...');
  
  try {
    const featuredProfiles = await FeaturedProfile.find({});
    console.log(`Found ${featuredProfiles.length} featured profiles to migrate`);
    
    if (featuredProfiles.length === 0) {
      console.log('No featured profiles to migrate');
      return;
    }

    const bigQueryData = featuredProfiles.map(profile => convertMongoToBigQuery(profile, 'featuredProfiles'));
    
    await bigquery
      .dataset(DATASET_ID)
      .table('featuredProfiles')
      .insert(bigQueryData);
    
    console.log(`✅ Successfully migrated ${featuredProfiles.length} featured profiles`);
  } catch (error) {
    console.error('❌ Error migrating featured profiles:', error);
    throw error;
  }
}

async function migrateAdminActions() {
  console.log('🔄 Migrating admin actions...');
  
  try {
    const adminActions = await AdminAction.find({});
    console.log(`Found ${adminActions.length} admin actions to migrate`);
    
    if (adminActions.length === 0) {
      console.log('No admin actions to migrate');
      return;
    }

    const bigQueryData = adminActions.map(action => convertMongoToBigQuery(action, 'adminActions'));
    
    await bigquery
      .dataset(DATASET_ID)
      .table('adminActions')
      .insert(bigQueryData);
    
    console.log(`✅ Successfully migrated ${adminActions.length} admin actions`);
  } catch (error) {
    console.error('❌ Error migrating admin actions:', error);
    throw error;
  }
}

async function connectMongoDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://usha:ushausha@35.209.234.43:27017/admin';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

async function runMigration() {
  try {
    console.log('🚀 Starting BigQuery migration...');
    
    // Connect to MongoDB
    await connectMongoDB();
    
    // Run migrations in order
    await migrateUsers();
    await migrateProjects();
    await migrateApplications();
    await migrateAdmins();
    await migrateAnalytics();
    await migrateNotifications();
    await migrateFeaturedProfiles();
    await migrateAdminActions();
    
    console.log('✅ Migration completed successfully!');
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration }; 