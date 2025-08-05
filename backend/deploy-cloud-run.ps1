# Talent Directory API - Google Cloud Run Deployment Script (PowerShell)
# This script deploys the backend to Google Cloud Run with secure authentication

# Configuration
$PROJECT_ID = "bright-link-467413-v6"
$SERVICE_NAME = "talent-directory-api"
$REGION = "us-central1"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host "Deploying Talent Directory API to Google Cloud Run..." -ForegroundColor Green
Write-Host "Project: $PROJECT_ID" -ForegroundColor Cyan
Write-Host "Service: $SERVICE_NAME" -ForegroundColor Cyan
Write-Host "Region: $REGION" -ForegroundColor Cyan
Write-Host ""

# Check if gcloud is installed
try {
    gcloud --version | Out-Null
} catch {
    Write-Host "Google Cloud CLI is not installed." -ForegroundColor Red
    Write-Host "Please install it from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Check if user is authenticated
$authStatus = gcloud auth list --filter=status:ACTIVE --format="value(account)"
if (-not $authStatus) {
    Write-Host "You are not authenticated with Google Cloud." -ForegroundColor Red
    Write-Host "Please run: gcloud auth login" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is installed
try {
    docker --version | Out-Null
} catch {
    Write-Host "Docker is not installed or not running." -ForegroundColor Red
    Write-Host "Please install Docker Desktop and start it." -ForegroundColor Yellow
    exit 1
}

# Set the project
Write-Host "Setting project to $PROJECT_ID..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# Enable required APIs
Write-Host "Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable storage.googleapis.com

# Build and push Docker image
Write-Host "Building and pushing Docker image..." -ForegroundColor Yellow
docker build -t $IMAGE_NAME .
docker push $IMAGE_NAME

# Deploy to Cloud Run
Write-Host "Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $SERVICE_NAME `
  --image $IMAGE_NAME `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --max-instances 10 `
  --set-env-vars NODE_ENV=production,GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID,GOOGLE_CLOUD_BUCKET_NAME=amiableai

# Get the service URL
$SERVICE_URL = gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)"

Write-Host ""
Write-Host "Deployment successful!" -ForegroundColor Green
Write-Host "Service URL: $SERVICE_URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "API Endpoints:" -ForegroundColor Yellow
Write-Host "   - Health Check: $SERVICE_URL/api/health" -ForegroundColor White
Write-Host "   - Register: $SERVICE_URL/api/auth/register" -ForegroundColor White
Write-Host "   - Login: $SERVICE_URL/api/auth/login" -ForegroundColor White
Write-Host "   - Upload: $SERVICE_URL/api/upload/single" -ForegroundColor White
Write-Host ""
Write-Host "Authentication: Using Application Default Credentials (ADC)" -ForegroundColor Green
Write-Host "Monitoring: Check Cloud Run console for logs and metrics" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your backend is now live and secure!" -ForegroundColor Green 