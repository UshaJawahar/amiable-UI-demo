const bigquery = require('./config/bigquery');

const DATASET_ID = 'amiable_data';

// BigQuery table schemas that match MongoDB collections
const tableSchemas = {
  users: [
    { name: 'id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'name', type: 'STRING', mode: 'REQUIRED' },
    { name: 'email', type: 'STRING', mode: 'REQUIRED' },
    { name: 'password', type: 'STRING', mode: 'REQUIRED' },
    { name: 'phone', type: 'STRING' },
    { name: 'role', type: 'STRING', mode: 'REQUIRED' },
    { name: 'purpose', type: 'STRING', mode: 'REQUIRED' },
    { name: 'userRole', type: 'STRING' },
    { name: 'category', type: 'STRING' },
    { name: 'experience', type: 'STRING' },
    { name: 'skills', type: 'STRING', mode: 'REPEATED' },
    { name: 'languages', type: 'STRING', mode: 'REPEATED' },
    { name: 'location', type: 'STRING' },
    { name: 'hasDisability', type: 'BOOLEAN' },
    { name: 'disabilityType', type: 'STRING' },
    { name: 'disabilityCertificate', type: 'STRING' },
    { name: 'companyName', type: 'STRING' },
    { name: 'companyType', type: 'STRING' },
    { name: 'jobTitle', type: 'STRING' },
    { name: 'industry', type: 'STRING' },
    { name: 'companySize', type: 'STRING' },
    { name: 'website', type: 'STRING' },
    { name: 'hiringNeeds', type: 'STRING', mode: 'REPEATED' },
    { name: 'projectTypes', type: 'STRING', mode: 'REPEATED' },
    { name: 'profileImage', type: 'STRING' },
    { name: 'profile_picture', type: 'STRING' },
    { name: 'bio', type: 'STRING' },
    { name: 'hourlyRate', type: 'FLOAT64' },
    { name: 'portfolio', type: 'RECORD', mode: 'REPEATED', fields: [
      { name: 'title', type: 'STRING' },
      { name: 'description', type: 'STRING' },
      { name: 'imageUrl', type: 'STRING' },
      { name: 'projectUrl', type: 'STRING' },
      { name: 'technologies', type: 'STRING', mode: 'REPEATED' }
    ]},
    { name: 'socialLinks', type: 'RECORD', fields: [
      { name: 'linkedin', type: 'STRING' },
      { name: 'github', type: 'STRING' },
      { name: 'twitter', type: 'STRING' },
      { name: 'website', type: 'STRING' }
    ]},
    { name: 'socialMediaReels', type: 'RECORD', mode: 'REPEATED', fields: [
      { name: 'id', type: 'STRING' },
      { name: 'platform', type: 'STRING' },
      { name: 'url', type: 'STRING' },
      { name: 'title', type: 'STRING' },
      { name: 'description', type: 'STRING' }
    ]},
    { name: 'isVerified', type: 'BOOLEAN' },
    { name: 'isActive', type: 'BOOLEAN' },
    { name: 'resetPasswordToken', type: 'STRING' },
    { name: 'resetPasswordExpire', type: 'TIMESTAMP' },
    { name: 'createdAt', type: 'TIMESTAMP' },
    { name: 'updatedAt', type: 'TIMESTAMP' }
  ],

  projects: [
    { name: 'id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'title', type: 'STRING', mode: 'REQUIRED' },
    { name: 'type', type: 'STRING', mode: 'REQUIRED' },
    { name: 'status', type: 'STRING', mode: 'REQUIRED' },
    { name: 'description', type: 'STRING', mode: 'REQUIRED' },
    { name: 'location', type: 'STRING', mode: 'REQUIRED' },
    { name: 'budget', type: 'RECORD', fields: [
      { name: 'min', type: 'FLOAT64' },
      { name: 'max', type: 'FLOAT64' },
      { name: 'currency', type: 'STRING' }
    ]},
    { name: 'timeline', type: 'RECORD', fields: [
      { name: 'startDate', type: 'TIMESTAMP' },
      { name: 'endDate', type: 'TIMESTAMP' },
      { name: 'castingDeadline', type: 'TIMESTAMP' }
    ]},
    { name: 'requirements', type: 'RECORD', fields: [
      { name: 'roles', type: 'RECORD', mode: 'REPEATED', fields: [
        { name: 'id', type: 'STRING' },
        { name: 'title', type: 'STRING' },
        { name: 'description', type: 'STRING' },
        { name: 'type', type: 'STRING' },
        { name: 'category', type: 'STRING' },
        { name: 'experience', type: 'STRING' },
        { name: 'skills', type: 'STRING', mode: 'REPEATED' },
        { name: 'budget', type: 'RECORD', fields: [
          { name: 'min', type: 'FLOAT64' },
          { name: 'max', type: 'FLOAT64' }
        ]},
        { name: 'filled', type: 'BOOLEAN' },
        { name: 'applications', type: 'INTEGER' }
      ]},
      { name: 'totalRoles', type: 'INTEGER' },
      { name: 'filledRoles', type: 'INTEGER' }
    ]},
    { name: 'company', type: 'RECORD', fields: [
      { name: 'name', type: 'STRING' },
      { name: 'logo', type: 'STRING' },
      { name: 'verified', type: 'BOOLEAN' }
    ]},
    { name: 'stats', type: 'RECORD', fields: [
      { name: 'views', type: 'INTEGER' },
      { name: 'applications', type: 'INTEGER' },
      { name: 'shortlisted', type: 'INTEGER' },
      { name: 'hired', type: 'INTEGER' }
    ]},
    { name: 'tags', type: 'STRING', mode: 'REPEATED' },
    { name: 'createdBy', type: 'STRING' },
    { name: 'createdAt', type: 'TIMESTAMP' },
    { name: 'updatedAt', type: 'TIMESTAMP' }
  ],

  applications: [
    { name: 'id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'name', type: 'STRING', mode: 'REQUIRED' },
    { name: 'email', type: 'STRING', mode: 'REQUIRED' },
    { name: 'password', type: 'STRING', mode: 'REQUIRED' },
    { name: 'phone', type: 'STRING' },
    { name: 'purpose', type: 'STRING', mode: 'REQUIRED' },
    { name: 'userRole', type: 'STRING' },
    { name: 'category', type: 'STRING' },
    { name: 'experience', type: 'STRING' },
    { name: 'skills', type: 'STRING', mode: 'REPEATED' },
    { name: 'languages', type: 'STRING', mode: 'REPEATED' },
    { name: 'location', type: 'STRING' },
    { name: 'hasDisability', type: 'BOOLEAN' },
    { name: 'disabilityType', type: 'STRING' },
    { name: 'disabilityCertificate', type: 'STRING' },
    { name: 'profileImage', type: 'STRING' },
    { name: 'profile_picture', type: 'STRING' },
    { name: 'bio', type: 'STRING' },
    { name: 'socialMediaReels', type: 'RECORD', mode: 'REPEATED', fields: [
      { name: 'id', type: 'STRING' },
      { name: 'platform', type: 'STRING' },
      { name: 'url', type: 'STRING' },
      { name: 'title', type: 'STRING' },
      { name: 'description', type: 'STRING' }
    ]},
    { name: 'companyName', type: 'STRING' },
    { name: 'companyType', type: 'STRING' },
    { name: 'jobTitle', type: 'STRING' },
    { name: 'industry', type: 'STRING' },
    { name: 'companySize', type: 'STRING' },
    { name: 'website', type: 'STRING' },
    { name: 'hiringNeeds', type: 'STRING', mode: 'REPEATED' },
    { name: 'projectTypes', type: 'STRING', mode: 'REPEATED' },
    { name: 'status', type: 'STRING' },
    { name: 'adminNotes', type: 'STRING' },
    { name: 'reviewedBy', type: 'STRING' },
    { name: 'reviewedAt', type: 'TIMESTAMP' },
    { name: 'createdAt', type: 'TIMESTAMP' },
    { name: 'updatedAt', type: 'TIMESTAMP' }
  ],

  admins: [
    { name: 'id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'name', type: 'STRING', mode: 'REQUIRED' },
    { name: 'email', type: 'STRING', mode: 'REQUIRED' },
    { name: 'password', type: 'STRING', mode: 'REQUIRED' },
    { name: 'role', type: 'STRING', mode: 'REQUIRED' },
    { name: 'permissions', type: 'STRING', mode: 'REPEATED' },
    { name: 'isActive', type: 'BOOLEAN' },
    { name: 'lastLogin', type: 'TIMESTAMP' },
    { name: 'profileImage', type: 'STRING' },
    { name: 'createdAt', type: 'TIMESTAMP' },
    { name: 'updatedAt', type: 'TIMESTAMP' }
  ],

  analytics: [
    { name: 'id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'type', type: 'STRING', mode: 'REQUIRED' },
    { name: 'data', type: 'STRING' }, // JSON string
    { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
    { name: 'userId', type: 'STRING' },
    { name: 'sessionId', type: 'STRING' },
    { name: 'createdAt', type: 'TIMESTAMP' }
  ],

  notifications: [
    { name: 'id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'userId', type: 'STRING', mode: 'REQUIRED' },
    { name: 'type', type: 'STRING', mode: 'REQUIRED' },
    { name: 'title', type: 'STRING', mode: 'REQUIRED' },
    { name: 'message', type: 'STRING', mode: 'REQUIRED' },
    { name: 'isRead', type: 'BOOLEAN' },
    { name: 'data', type: 'STRING' }, // JSON string
    { name: 'createdAt', type: 'TIMESTAMP' }
  ],

  featuredProfiles: [
    { name: 'id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'userId', type: 'STRING', mode: 'REQUIRED' },
    { name: 'position', type: 'INTEGER' },
    { name: 'isActive', type: 'BOOLEAN' },
    { name: 'startDate', type: 'TIMESTAMP' },
    { name: 'endDate', type: 'TIMESTAMP' },
    { name: 'createdAt', type: 'TIMESTAMP' },
    { name: 'updatedAt', type: 'TIMESTAMP' }
  ],

  adminActions: [
    { name: 'id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'adminId', type: 'STRING', mode: 'REQUIRED' },
    { name: 'action', type: 'STRING', mode: 'REQUIRED' },
    { name: 'targetType', type: 'STRING', mode: 'REQUIRED' },
    { name: 'targetId', type: 'STRING', mode: 'REQUIRED' },
    { name: 'details', type: 'STRING' }, // JSON string
    { name: 'ipAddress', type: 'STRING' },
    { name: 'userAgent', type: 'STRING' },
    { name: 'createdAt', type: 'TIMESTAMP' }
  ]
};

async function createDataset() {
  try {
    await bigquery.createDataset(DATASET_ID);
    console.log(`✅ Dataset ${DATASET_ID} created successfully`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`ℹ️ Dataset ${DATASET_ID} already exists`);
    } else {
      console.error('❌ Error creating dataset:', error);
      throw error;
    }
  }
}

async function createTable(tableName, schema) {
  try {
    const tableId = `${DATASET_ID}.${tableName}`;
    const table = bigquery.dataset(DATASET_ID).table(tableName);
    
    const options = {
      schema: schema,
      location: 'US'
    };

    await table.create(options);
    console.log(`✅ Table ${tableId} created successfully`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`ℹ️ Table ${DATASET_ID}.${tableName} already exists`);
    } else {
      console.error(`❌ Error creating table ${tableName}:`, error);
      throw error;
    }
  }
}

async function setupBigQuery() {
  try {
    console.log('🚀 Setting up BigQuery tables...');
    
    // Create dataset
    await createDataset();
    
    // Create all tables
    for (const [tableName, schema] of Object.entries(tableSchemas)) {
      await createTable(tableName, schema);
    }
    
    console.log('✅ BigQuery setup completed successfully!');
  } catch (error) {
    console.error('❌ BigQuery setup failed:', error);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupBigQuery();
}

module.exports = { setupBigQuery, tableSchemas }; 