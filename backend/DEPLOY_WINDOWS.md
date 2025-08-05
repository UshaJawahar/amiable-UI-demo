# 🚀 Windows Deployment Guide - Google Cloud Run

## 📋 **Prerequisites**

1. **Google Cloud CLI** ✅ (Already installed)
2. **Docker Desktop** ⏳ (Installing...)
3. **PowerShell** ✅ (Already available)

## 🔧 **Step-by-Step Deployment**

### **Step 1: Wait for Docker Installation**
- Docker Desktop is currently installing
- Once complete, start Docker Desktop
- Wait for Docker to be fully running (green icon in system tray)

### **Step 2: Verify Docker is Ready**
```powershell
docker --version
```
Should show Docker version info.

### **Step 3: Deploy Using PowerShell Script**
```powershell
# Run the PowerShell deployment script
.\deploy-cloud-run.ps1
```

### **Step 4: Manual Deployment (Alternative)**
If the script doesn't work, run these commands manually:

```powershell
# Build Docker image
docker build -t gcr.io/bright-link-467413-v6/talent-directory-api .

# Push to Google Container Registry
docker push gcr.io/bright-link-467413-v6/talent-directory-api

# Deploy to Cloud Run
gcloud run deploy talent-directory-api `
  --image gcr.io/bright-link-467413-v6/talent-directory-api `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --max-instances 10 `
  --set-env-vars NODE_ENV=production,GOOGLE_CLOUD_PROJECT_ID=bright-link-467413-v6,GOOGLE_CLOUD_BUCKET_NAME=amiableai
```

## 🎯 **What Happens During Deployment**

1. **Docker Build**: Creates container image from your code
2. **Push to Registry**: Uploads image to Google Container Registry
3. **Deploy to Cloud Run**: Creates serverless service
4. **Configure Environment**: Sets up authentication and variables
5. **Get URL**: Provides your live API endpoint

## ✅ **Expected Results**

After successful deployment, you'll get:
- **Service URL**: `https://talent-directory-api-[hash]-uc.a.run.app`
- **Health Check**: `https://talent-directory-api-[hash]-uc.a.run.app/api/health`
- **API Endpoints**: Register, Login, Upload, etc.

## 🚨 **Troubleshooting**

### **Docker Issues:**
- Make sure Docker Desktop is running
- Restart Docker Desktop if needed
- Check Windows WSL2 is enabled

### **Permission Issues:**
- Run PowerShell as Administrator if needed
- Check execution policy: `Get-ExecutionPolicy`
- Set if needed: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### **Google Cloud Issues:**
- Re-authenticate: `gcloud auth login`
- Check project: `gcloud config get-value project`
- Set project: `gcloud config set project bright-link-467413-v6`

## 🎉 **Success Indicators**

- ✅ Docker builds successfully
- ✅ Image pushes to registry
- ✅ Cloud Run deployment completes
- ✅ Service URL is provided
- ✅ Health check returns 200 OK

---

**Ready to deploy once Docker is running!** 🚀 