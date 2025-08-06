const {BigQuery} = require('@google-cloud/bigquery');

const bigquery = new BigQuery({
  projectId: process.env.BIGQUERY_PROJECT_ID || 'bright-link-467413-v6',
  // No key file needed - uses Cloud Run's service account automatically
});

module.exports = bigquery; 