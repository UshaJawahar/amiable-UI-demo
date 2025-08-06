const bigquery = require('./config/bigquery');

async function testBigQueryConnection() {
  try {
    console.log('🔍 Testing BigQuery connection...');
    
    // Test dataset access
    const [datasets] = await bigquery.getDatasets();
    console.log(`✅ Found ${datasets.length} datasets`);
    
    // Test table access
    const [tables] = await bigquery.dataset('amiable_data').getTables();
    console.log(`✅ Found ${tables.length} tables in amiable_data dataset`);
    
    // List table names
    tables.forEach(table => {
      console.log(`  - ${table.id}`);
    });
    
    console.log('✅ BigQuery connection test successful!');
  } catch (error) {
    console.error('❌ BigQuery connection test failed:', error);
  }
}

testBigQueryConnection(); 