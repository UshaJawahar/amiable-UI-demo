# MongoDB Atlas Setup Script
# This script helps you set up MongoDB Atlas and configure your backend

Write-Host "=== MongoDB Atlas Setup ===" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Create MongoDB Atlas Account" -ForegroundColor Yellow
Write-Host "1. Go to: https://www.mongodb.com/atlas" -ForegroundColor Cyan
Write-Host "2. Sign up for a free account" -ForegroundColor Cyan
Write-Host "3. Create a new project" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 2: Create a Cluster" -ForegroundColor Yellow
Write-Host "1. Click 'Build a Database'" -ForegroundColor Cyan
Write-Host "2. Choose 'FREE' tier (M0)" -ForegroundColor Cyan
Write-Host "3. Select your preferred cloud provider" -ForegroundColor Cyan
Write-Host "4. Choose a region close to your users" -ForegroundColor Cyan
Write-Host "5. Click 'Create'" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 3: Set Up Database Access" -ForegroundColor Yellow
Write-Host "1. Go to 'Database Access' in the left sidebar" -ForegroundColor Cyan
Write-Host "2. Click 'Add New Database User'" -ForegroundColor Cyan
Write-Host "3. Choose 'Password' authentication" -ForegroundColor Cyan
Write-Host "4. Create a username and strong password" -ForegroundColor Cyan
Write-Host "5. Select 'Read and write to any database'" -ForegroundColor Cyan
Write-Host "6. Click 'Add User'" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 4: Set Up Network Access" -ForegroundColor Yellow
Write-Host "1. Go to 'Network Access' in the left sidebar" -ForegroundColor Cyan
Write-Host "2. Click 'Add IP Address'" -ForegroundColor Cyan
Write-Host "3. For development: Click 'Allow Access from Anywhere' (0.0.0.0/0)" -ForegroundColor Cyan
Write-Host "4. For production: Add your specific IP addresses" -ForegroundColor Cyan
Write-Host "5. Click 'Confirm'" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 5: Get Connection String" -ForegroundColor Yellow
Write-Host "1. Go to 'Database' in the left sidebar" -ForegroundColor Cyan
Write-Host "2. Click 'Connect'" -ForegroundColor Cyan
Write-Host "3. Choose 'Connect your application'" -ForegroundColor Cyan
Write-Host "4. Copy the connection string" -ForegroundColor Cyan
Write-Host "5. Replace <password> with your database user password" -ForegroundColor Cyan
Write-Host "6. Replace <dbname> with 'talent-directory'" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 6: Update Environment Variables" -ForegroundColor Yellow
Write-Host "Add this to your .env file:" -ForegroundColor Cyan
Write-Host "MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/talent-directory?retryWrites=true&w=majority" -ForegroundColor Magenta
Write-Host ""

Write-Host "Step 7: Deploy Updated Backend" -ForegroundColor Yellow
Write-Host "After updating your .env file, run:" -ForegroundColor Cyan
Write-Host "./deploy-cloud-run.ps1" -ForegroundColor Magenta
Write-Host ""

Write-Host "=== Alternative: Self-hosted MongoDB on Google Cloud ===" -ForegroundColor Green
Write-Host "If you prefer self-hosted MongoDB, run:" -ForegroundColor Cyan
Write-Host "gcloud compute instances create mongodb-instance --zone=us-central1-a --machine-type=e2-medium --image-family=ubuntu-2004-lts --image-project=ubuntu-os-cloud --tags=mongodb" -ForegroundColor Magenta
Write-Host ""

Write-Host "=== Testing ===" -ForegroundColor Green
Write-Host "After setup, test your API:" -ForegroundColor Cyan
Write-Host "curl https://talent-directory-api-483134787260.us-central1.run.app/api/health" -ForegroundColor Magenta
Write-Host ""

Write-Host "Need help? Check MONGODB_SETUP.md for detailed instructions." -ForegroundColor Yellow 