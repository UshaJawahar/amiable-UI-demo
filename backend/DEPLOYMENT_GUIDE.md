# 🚀 Production Deployment Guide

## 🎯 **Recommended Production Deployment: Google Cloud Run**

This guide shows you how to deploy your backend to Google Cloud Run with **secure authentication** (no service account keys needed).

## 📋 **Prerequisites**

1. **Google Cloud CLI installed**
2. **Docker installed**
3. **Google Cloud project with billing enabled**
4. **MongoDB Atlas account (for production database)**

## 🚀 **Step-by-Step Deployment**

### 1. **Prepare Your Environment**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create production environment file
cp env.production .env.production
```

### 2. **Update Production Environment**

Edit `.env.production` with your production values:

```env
# MongoDB Atlas (Production Database)
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/talent-directory?retryWrites=true&w=majority

# Strong JWT Secret (at least 32 characters)
JWT_SECRET=your-super-strong-jwt-secret-at-least-32-characters-long

# Your frontend domain
FRONTEND_URL=https://your-frontend-domain.com
```

### 3. **Authenticate with Google Cloud**

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project bright-link-467413-v6

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable storage.googleapis.com
```

### 4. **Deploy to Google Cloud Run**

```bash
# Make deployment script executable
chmod +x deploy-cloud-run.sh

# Run deployment
./deploy-cloud-run.sh
```

**Or deploy manually:**

```bash
# Build and push Docker image
docker build -t gcr.io/bright-link-467413-v6/talent-directory-api .
docker push gcr.io/bright-link-467413-v6/talent-directory-api

# Deploy to Cloud Run
gcloud run deploy talent-directory-api \
  --image gcr.io/bright-link-467413-v6/talent-directory-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production,GOOGLE_CLOUD_PROJECT_ID=bright-link-467413-v6,GOOGLE_CLOUD_BUCKET_NAME=amiableai
```

## 🔐 **Security Features**

### ✅ **What's Secure by Default:**

1. **No Service Account Keys** - Uses Application Default Credentials
2. **HTTPS Only** - All traffic encrypted
3. **Automatic Scaling** - Scales to zero when not in use
4. **Isolated Environment** - Each request runs in isolation
5. **Built-in Monitoring** - Cloud Logging and Error Reporting

### 🔧 **Additional Security Setup:**

```bash
# Create custom IAM role with minimal permissions
gcloud iam roles create TalentDirectoryStorage \
  --project=bright-link-467413-v6 \
  --title="Talent Directory Storage" \
  --description="Custom role for talent directory storage operations" \
  --permissions=storage.objects.create,storage.objects.delete,storage.objects.get,storage.objects.list

# Assign role to Cloud Run service account
gcloud projects add-iam-policy-binding bright-link-467413-v6 \
  --member="serviceAccount:YOUR_CLOUD_RUN_SERVICE_ACCOUNT" \
  --role="projects/bright-link-467413-v6/roles/TalentDirectoryStorage"
```

## 📊 **Monitoring and Logging**

### View Logs:
```bash
# View real-time logs
gcloud logs tail --project=bright-link-467413-v6 --filter="resource.type=cloud_run_revision"

# View specific service logs
gcloud logs read --project=bright-link-467413-v6 --filter="resource.labels.service_name=talent-directory-api"
```

### Monitor Performance:
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Navigate to Cloud Run > talent-directory-api
- View metrics, logs, and error reports

## 🔄 **Continuous Deployment**

### GitHub Actions Workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Google Cloud CLI
      uses: google-github-actions/setup-gcloud@v0
      with:
        project_id: bright-link-467413-v6
        service_account_key: ${{ secrets.GCP_SA_KEY }}
    
    - name: Build and Deploy
      run: |
        cd backend
        chmod +x deploy-cloud-run.sh
        ./deploy-cloud-run.sh
```

## 🚨 **Troubleshooting**

### Common Issues:

1. **"Permission denied"**
   ```bash
   # Check your permissions
   gcloud projects get-iam-policy bright-link-467413-v6
   ```

2. **"Service account not found"**
   ```bash
   # Cloud Run uses default compute service account
   # No additional setup needed for ADC
   ```

3. **"MongoDB connection failed"**
   - Check your MongoDB Atlas connection string
   - Ensure IP whitelist includes Cloud Run IPs

4. **"File upload failed"**
   ```bash
   # Check bucket permissions
   gsutil iam get gs://amiableai
   ```

## 📈 **Performance Optimization**

### Environment Variables for Performance:

```env
# Add to your Cloud Run service
NODE_OPTIONS=--max-old-space-size=512
UV_THREADPOOL_SIZE=64
```

### Scaling Configuration:

```bash
# Update scaling settings
gcloud run services update talent-directory-api \
  --region=us-central1 \
  --min-instances=1 \
  --max-instances=20 \
  --concurrency=80
```

## 🔗 **API Testing**

### Test Your Deployed API:

```bash
# Get your service URL
SERVICE_URL=$(gcloud run services describe talent-directory-api --region=us-central1 --format="value(status.url)")

# Test health endpoint
curl $SERVICE_URL/api/health

# Test registration
curl -X POST $SERVICE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 🎉 **Success!**

Your backend is now:
- ✅ **Deployed** to Google Cloud Run
- ✅ **Secure** with Application Default Credentials
- ✅ **Scalable** with automatic scaling
- ✅ **Monitored** with Cloud Logging
- ✅ **HTTPS** enabled by default

**Next Steps:**
1. Update your frontend to use the new API URL
2. Set up custom domain (optional)
3. Configure monitoring alerts
4. Set up automated backups

---

**🎯 Your production backend is ready and secure!** 