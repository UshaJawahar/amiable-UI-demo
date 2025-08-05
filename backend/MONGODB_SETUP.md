# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Recommended)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to your users
5. Click "Create"

### Step 3: Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Select "Read and write to any database"
6. Click "Add User"

### Step 4: Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific IP addresses
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., `talent-directory`)

### Step 6: Update Environment Variables
Add this to your `.env` file:
```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/talent-directory?retryWrites=true&w=majority
```

## Option 2: Self-hosted MongoDB on Google Cloud

### Step 1: Create a Compute Engine Instance
```bash
gcloud compute instances create mongodb-instance \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud \
  --tags=mongodb \
  --metadata=startup-script='#! /bin/bash
    # Install MongoDB
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
    
    # Configure MongoDB for external access
    sudo sed -i "s/bindIp: 127.0.0.1/bindIp: 0.0.0.0/" /etc/mongod.conf
    sudo systemctl restart mongod'
```

### Step 2: Create Firewall Rule
```bash
gcloud compute firewall-rules create allow-mongodb \
  --direction=INGRESS \
  --priority=1000 \
  --network=default \
  --action=ALLOW \
  --rules=tcp:27017 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=mongodb
```

### Step 3: Get Instance IP
```bash
gcloud compute instances describe mongodb-instance --zone=us-central1-a --format="get(networkInterfaces[0].accessConfigs[0].natIP)"
```

### Step 4: Update Environment Variables
Add this to your `.env` file:
```env
MONGODB_URI=mongodb://YOUR_INSTANCE_IP:27017/talent-directory
```

## Option 3: MongoDB with Google Cloud Storage Integration

This is what we've already set up! Your backend now:
- Connects to MongoDB for user data and authentication
- Uses Google Cloud Storage for file uploads
- Provides a complete API for talent directory management

### Current Setup:
- **Database**: MongoDB (Atlas or self-hosted)
- **File Storage**: Google Cloud Storage bucket (`amiableai`)
- **Authentication**: JWT tokens
- **API**: RESTful endpoints for users and file management

## Testing the Setup

### 1. Test Database Connection
```bash
curl https://your-api-url/api/health
```

### 2. Test User Registration
```bash
curl -X POST https://your-api-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test File Upload
```bash
curl -X POST https://your-api-url/api/upload/single \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test-image.jpg"
```

## Security Best Practices

1. **Use MongoDB Atlas** for production (managed security)
2. **Enable MongoDB authentication** for self-hosted instances
3. **Use strong passwords** for database users
4. **Restrict network access** to specific IPs in production
5. **Enable SSL/TLS** for database connections
6. **Regular backups** (automatic with Atlas)
7. **Monitor database performance** and usage

## Troubleshooting

### Connection Issues
- Check if MongoDB service is running
- Verify firewall rules
- Ensure correct connection string format
- Check network connectivity

### Authentication Issues
- Verify username and password
- Check database user permissions
- Ensure correct database name

### Performance Issues
- Monitor database indexes
- Check connection pooling
- Optimize queries
- Consider read replicas for scaling 