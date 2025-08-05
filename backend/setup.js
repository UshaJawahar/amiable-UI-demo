const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Talent Directory Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  fs.copyFileSync(path.join(__dirname, 'env.example'), envPath);
  console.log('✅ .env file created successfully!');
  console.log('⚠️  Please update the .env file with your configuration values.\n');
} else {
  console.log('✅ .env file already exists.\n');
}

// Create config directory if it doesn't exist
const configDir = path.join(__dirname, 'config');
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir);
  console.log('📁 Created config directory.');
}

       // Check Google Cloud authentication
       console.log('🔐 Google Cloud Authentication Setup:');
       console.log('📋 Since service account keys are disabled, we\'ll use Application Default Credentials (ADC)');
       console.log('📋 Please follow these steps:');
       console.log('   1. Install Google Cloud CLI: https://cloud.google.com/sdk/docs/install');
       console.log('   2. Run: gcloud auth application-default login');
       console.log('   3. Run: gcloud config set project bright-link-467413-v6');
       console.log('   4. Ensure you have Storage Admin permissions\n');

console.log('📋 Next Steps:');
console.log('   1. Update .env file with your configuration');
console.log('   2. Start MongoDB: mongod');
console.log('   3. Run the server: npm run dev');
console.log('   4. Test the API: http://localhost:5000/api/health\n');

console.log('🔗 API Endpoints:');
console.log('   - Health Check: GET /api/health');
console.log('   - Register: POST /api/auth/register');
console.log('   - Login: POST /api/auth/login');
console.log('   - Upload File: POST /api/upload/single');
console.log('   - List Files: GET /api/upload/list\n');

console.log('🎉 Setup complete! Happy coding! 🚀'); 