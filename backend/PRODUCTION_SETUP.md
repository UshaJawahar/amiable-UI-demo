# 🚀 Production Setup Guide - Google Cloud Authentication Best Practices

## 🎯 **Production Authentication Methods (No Service Account Keys)**

### 📋 **Quick Decision Guide:**

- **✅ Google Cloud Run (Recommended)**: No AWS needed, automatic authentication
- **✅ Google App Engine**: No AWS needed, automatic authentication  
- **⚠️ External Services (AWS/Azure)**: Only if deploying outside Google Cloud
- **⚠️ Kubernetes (GKE)**: Only if using Kubernetes

**For your setup, use Google Cloud Run - it's the simplest and most secure!**

### 1. **Workload Identity Federation (Recommended for Production)**

This is the most secure method for production deployments outside Google Cloud.

#### Setup for Kubernetes/GKE:
```yaml
# service-account.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: talent-directory-api
  namespace: default
  annotations:
    iam.gke.io/gcp-service-account: talent-directory-api@bright-link-467413-v6.iam.gserviceaccount.com
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: talent-directory-api-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: talent-directory-api
  namespace: default
```

#### Setup for External Services (AWS, Azure, etc.):
**⚠️ Only use this if you're deploying your backend on AWS/Azure/your own servers!**

```bash
# Create Workload Identity Pool
gcloud iam workload-identity-pools create "talent-directory-pool" --location="global" --display-name="Talent Directory Pool"

# Create Workload Identity Provider (AWS example)
gcloud iam workload-identity-pools providers create-aws "aws-provider" --workload-identity-pool="talent-directory-pool" --account-id="YOUR_AWS_ACCOUNT_ID" --role-session-name="talent-directory-session"

# Create Service Account
gcloud iam service-accounts create talent-directory-api \
  --display-name="Talent Directory API"

# Grant Storage Admin role
gcloud projects add-iam-policy-binding bright-link-467413-v6 \
  --member="serviceAccount:talent-directory-api@bright-link-467413-v6.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

# Allow external identity to impersonate service account
gcloud iam service-accounts add-iam-policy-binding talent-directory-api@bright-link-467413-v6 \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/YOUR_PROJECT_NUMBER/locations/global/workloadIdentityPools/talent-directory-pool/attribute.service_account/talent-directory-api@bright-link-467413-v6.iam.gserviceaccount.com"
```

### 2. **Google Cloud Run (Serverless - Recommended)**

Deploy directly to Google Cloud Run for automatic authentication:

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
```

```yaml
# cloud-run.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: talent-directory-api
spec:
  template:
    metadata:
      annotations:
        run.googleapis.com/execution-environment: gen2
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      containers:
      - image: gcr.io/bright-link-467413-v6/talent-directory-api
        ports:
        - containerPort: 8080
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "8080"
        - name: GOOGLE_CLOUD_PROJECT_ID
          value: "bright-link-467413-v6"
        - name: GOOGLE_CLOUD_BUCKET_NAME
          value: "amiableai"
        resources:
          limits:
            cpu: "1"
            memory: "512Mi"
          requests:
            cpu: "500m"
            memory: "256Mi"
```

### 3. **Google App Engine (Serverless)**

Deploy to App Engine for automatic authentication:

```yaml
# app.yaml
runtime: nodejs18
service: talent-directory-api

env_variables:
  NODE_ENV: "production"
  GOOGLE_CLOUD_PROJECT_ID: "bright-link-467413-v6"
  GOOGLE_CLOUD_BUCKET_NAME: "amiableai"

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10

resources:
  cpu: 1
  memory_gb: 0.5
  disk_size_gb: 10

handlers:
  - url: /.*
    script: auto
    secure: always
```

### 4. **Google Compute Engine (VMs)**

For VM deployments, use metadata-based authentication:

```bash
# Create service account
gcloud iam service-accounts create talent-directory-vm \
  --display-name="Talent Directory VM"

# Grant Storage Admin role
gcloud projects add-iam-policy-binding bright-link-467413-v6 \
  --member="serviceAccount:talent-directory-vm@bright-link-467413-v6.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

# Create VM with service account
gcloud compute instances create talent-directory-api \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --service-account=talent-directory-vm@bright-link-467413-v6.iam.gserviceaccount.com \
  --scopes=https://www.googleapis.com/auth/cloud-platform \
  --image-family=debian-11 \
  --image-project=debian-cloud \
  --metadata-from-file startup-script=startup.sh
```

## 🔧 **Production Environment Configuration**

### Environment Variables for Production:

```env
# Production Environment Variables
NODE_ENV=production
PORT=8080

# MongoDB Configuration (Use MongoDB Atlas for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/talent-directory?retryWrites=true&w=majority

# JWT Configuration (Use strong secret in production)
JWT_SECRET=your-super-strong-jwt-secret-at-least-32-characters-long
JWT_EXPIRE=7d

# Google Cloud Configuration (No key files needed)
GOOGLE_CLOUD_PROJECT_ID=bright-link-467413-v6
GOOGLE_CLOUD_BUCKET_NAME=amiableai

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=info
```

### Production Security Enhancements:

```javascript
// production.js - Additional security middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Data sanitization
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
```

## 🚀 **Deployment Scripts**

### Google Cloud Run Deployment:
```bash
#!/bin/bash
# deploy-cloud-run.sh

PROJECT_ID="bright-link-467413-v6"
SERVICE_NAME="talent-directory-api"
REGION="us-central1"

# Build and push Docker image
docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME .
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID,GOOGLE_CLOUD_BUCKET_NAME=amiableai
```

### App Engine Deployment:
```bash
#!/bin/bash
# deploy-app-engine.sh

# Deploy to App Engine
gcloud app deploy app.yaml --project=bright-link-467413-v6
```

## 📊 **Monitoring and Logging**

### Cloud Logging Configuration:
```javascript
// logging.js
const { Logging } = require('@google-cloud/logging');

const logging = new Logging({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const log = logging.log('talent-directory-api');

// Structured logging
const logEntry = log.entry({
  severity: 'INFO',
  resource: {
    type: 'cloud_run_revision',
    labels: {
      service_name: 'talent-directory-api',
    },
  },
}, {
  message: 'API request processed',
  userId: req.user?.id,
  endpoint: req.path,
  method: req.method,
});
```

### Error Monitoring:
```javascript
// error-monitoring.js
const { ErrorReporting } = require('@google-cloud/error-reporting');

const errors = new ErrorReporting({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  serviceContext: {
    service: 'talent-directory-api',
    version: process.env.npm_package_version,
  },
});

// Global error handler
app.use((err, req, res, next) => {
  errors.report(err);
  res.status(500).json({ error: 'Internal server error' });
});
```

## 🔐 **Security Best Practices**

### 1. **IAM Roles (Principle of Least Privilege)**
```bash
# Create custom role with minimal permissions
gcloud iam roles create TalentDirectoryStorage \
  --project=bright-link-467413-v6 \
  --title="Talent Directory Storage" \
  --description="Custom role for talent directory storage operations" \
  --permissions=storage.objects.create,storage.objects.delete,storage.objects.get,storage.objects.list

# Assign custom role to service account
gcloud projects add-iam-policy-binding bright-link-467413-v6 \
  --member="serviceAccount:talent-directory-api@bright-link-467413-v6.iam.gserviceaccount.com" \
  --role="projects/bright-link-467413-v6/roles/TalentDirectoryStorage"
```

### 2. **VPC Service Controls**
```bash
# Create VPC service perimeter
gcloud access-context-manager perimeters create talent-directory-perimeter \
  --title="Talent Directory Perimeter" \
  --resources=projects/bright-link-467413-v6 \
  --restricted-services=storage.googleapis.com
```

### 3. **Secret Management**
```bash
# Store secrets in Secret Manager
echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-

# Access secrets in application
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();
const [version] = await client.accessSecretVersion({
  name: 'projects/bright-link-467413-v6/secrets/jwt-secret/versions/latest',
});
const jwtSecret = version.payload.data.toString();
```

## 📈 **Performance Optimization**

### 1. **Connection Pooling**
```javascript
// database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
```

### 2. **Caching with Redis**
```javascript
// cache.js
const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on('error', (err) => console.log('Redis Client Error', err));

// Cache middleware
const cache = (duration) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    const cached = await client.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      client.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    next();
  };
};
```

## 🚨 **Production Checklist**

- [ ] **Authentication**: Using Workload Identity Federation or ADC
- [ ] **Secrets**: Stored in Secret Manager, not in code
- [ ] **Monitoring**: Cloud Logging and Error Reporting configured
- [ ] **Security**: VPC Service Controls and IAM roles configured
- [ ] **Performance**: Connection pooling and caching implemented
- [ ] **Backup**: Automated database backups configured
- [ ] **SSL/TLS**: HTTPS enforced everywhere
- [ ] **Rate Limiting**: Implemented and configured
- [ ] **Logging**: Structured logging with proper levels
- [ ] **Health Checks**: Endpoint monitoring configured

---

**🎉 Your production setup is now secure and follows Google Cloud best practices!** 