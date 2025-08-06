const bigquery = require('../config/bigquery');

const DATASET_ID = 'amiable_data';

// Helper function to convert data for BigQuery
function prepareForBigQuery(data, tableName) {
  const prepared = {
    id: data._id ? data._id.toString() : data.id,
    createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Add all other fields
  Object.keys(data).forEach(key => {
    if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'id') {
      const value = data[key];
      
      if (value === null || value === undefined) {
        prepared[key] = null;
      } else if (Array.isArray(value)) {
        prepared[key] = value;
      } else if (typeof value === 'object' && value !== null) {
        // Handle nested objects
        prepared[key] = JSON.stringify(value);
      } else if (value instanceof Date) {
        prepared[key] = value.toISOString();
      } else {
        prepared[key] = value;
      }
    }
  });

  return prepared;
}

// Insert data into BigQuery
async function insertIntoBigQuery(data, tableName) {
  try {
    const preparedData = prepareForBigQuery(data, tableName);
    
    await bigquery
      .dataset(DATASET_ID)
      .table(tableName)
      .insert([preparedData]);
    
    console.log(`✅ Data inserted into BigQuery table: ${tableName}`);
  } catch (error) {
    console.error(`❌ Error inserting into BigQuery table ${tableName}:`, error);
    // Don't throw error to avoid breaking the main flow
  }
}

// Update data in BigQuery
async function updateInBigQuery(id, data, tableName) {
  try {
    const preparedData = prepareForBigQuery(data, tableName);
    
    // BigQuery doesn't support direct updates, so we'll need to handle this differently
    // For now, we'll just log the update
    console.log(`📝 Update logged for BigQuery table: ${tableName}, ID: ${id}`);
  } catch (error) {
    console.error(`❌ Error updating in BigQuery table ${tableName}:`, error);
  }
}

// Query data from BigQuery
async function queryFromBigQuery(query) {
  try {
    const [rows] = await bigquery.query(query);
    return rows;
  } catch (error) {
    console.error('❌ Error querying BigQuery:', error);
    throw error;
  }
}

module.exports = {
  insertIntoBigQuery,
  updateInBigQuery,
  queryFromBigQuery,
  prepareForBigQuery
}; 