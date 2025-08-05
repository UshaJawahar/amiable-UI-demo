# 🔐 Google Cloud Authentication Setup (No Service Account Keys)

Since your organization has disabled service account key creation for security reasons, we'll use **Application Default Credentials (ADC)** which is more secure and recommended by Google.

## 🎯 **Recommended Authentication Methods**

### 1. **Application Default Credentials (ADC) - Recommended**

This is the most secure method and works automatically in Google Cloud environments.

#### For Local Development:
```bash
# Install Google Cloud CLI
# Download from: https://cloud.google.com/sdk/docs/install

# Authenticate with your Google account
gcloud auth application-default login

# Set your project
gcloud config set project bright-link-467413-v6
```

#### For Production (Google Cloud Run/App Engine):
- ADC works automatically - no configuration needed!

### 2. **Workload Identity Federation (For External Services)**

If you're deploying outside Google Cloud, use Workload Identity Federation.

### 3. **Service Account with ADC (Alternative)**

Create a service account and use ADC instead of keys:

```bash
# Create service account
gcloud iam service-accounts create talent-directory-api --display-name="Talent Directory API"

# Grant Storage Admin role
gcloud projects add-iam-policy-binding bright-link-467413-v6 --member="serviceAccount:talent-directory-api@bright-link-467413-v6.iam.gserviceaccount.com" --role="roles/storage.admin"

# Use ADC with service account
gcloud auth activate-service-account --key-file=path/to/service-account.json
```

## 🚀 **Quick Setup for Local Development**

1. **Install Google Cloud CLI:**
   ```bash
   # Windows (using PowerShell)
   (New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
   & $env:Temp\GoogleCloudSDKInstaller.exe
   ```

2. **Authenticate:**
   ```bash
   gcloud auth application-default login
   ```

3. **Set Project:**
   ```bash
   gcloud config set project bright-link-467413-v6
   ```

4. **Verify Setup:**
   ```bash
   gcloud auth list
   gcloud config list
   ```

## 📋 **Environment Variables**

Your `backend/.env` file should look like this:

```env
# Google Cloud Storage Configuration
GOOGLE_CLOUD_PROJECT_ID=bright-link-467413-v6
GOOGLE_CLOUD_BUCKET_NAME=amiableai
# No key file needed - using ADC
```

## 🔧 **Testing the Setup**

1. **Start your backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test the connection:**
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Test file upload (after authentication):**
   ```bash
   # First register/login to get a token
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

## 🛡️ **Security Benefits**

- ✅ **No key files** to manage or accidentally commit
- ✅ **Automatic rotation** of credentials
- ✅ **Principle of least privilege** - only necessary permissions
- ✅ **Audit logging** of all access
- ✅ **Compliance** with security policies

## 🚨 **Troubleshooting**

### "Application Default Credentials not found"
```bash
# Re-authenticate
gcloud auth application-default login
```

### "Permission denied"
```bash
# Check if you have the right roles
gcloud projects get-iam-policy bright-link-467413-v6
```

### "Project not found"
```bash
# Verify project ID
gcloud projects list
gcloud config set project bright-link-467413-v6
```

## 📚 **Additional Resources**

- [Application Default Credentials Documentation](https://cloud.google.com/docs/authentication/application-default-credentials)
- [Google Cloud Storage Node.js Client](https://cloud.google.com/storage/docs/reference/libraries#client-libraries-install-nodejs)
- [IAM Best Practices](https://cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys)

---

**🎉 You're all set!** Your backend will now use secure authentication without any service account keys. 