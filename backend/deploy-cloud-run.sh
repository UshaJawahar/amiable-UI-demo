#!/bin/bash

# Talent Directory API - Google Cloud Run Deployment Script
# This script deploys the backend to Google Cloud Run with secure authentication

set -e  # Exit on any error

# Configuration
PROJECT_ID="bright-link-467413-v6"
SERVICE_NAME="talent-directory-api"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "Deploying Talent Directory API to Google Cloud Run..."
echo "Project: $PROJECT_ID"
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Google Cloud CLI is not installed."
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "You are not authenticated with Google Cloud."
    echo "Please run: gcloud auth login"
    exit 1
fi

# Set the project
echo "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable storage.googleapis.com

# Build and push Docker image
echo "Building and pushing Docker image..."
docker build -t $IMAGE_NAME .
docker push $IMAGE_NAME

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production,GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID,GOOGLE_CLOUD_BUCKET_NAME=amiableai

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

echo ""
echo "Deployment successful!"
echo "Service URL: $SERVICE_URL"
echo ""
echo "API Endpoints:"
echo "   - Health Check: $SERVICE_URL/api/health"
echo "   - Register: $SERVICE_URL/api/auth/register"
echo "   - Login: $SERVICE_URL/api/auth/login"
echo "   - Upload: $SERVICE_URL/api/upload/single"
echo ""
echo "Authentication: Using Application Default Credentials (ADC)"
echo "Monitoring: Check Cloud Run console for logs and metrics"
echo ""
echo "Your backend is now live and secure!" 