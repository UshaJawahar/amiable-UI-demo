# Talent Directory Backend API

A Node.js/Express backend API with MongoDB and Google Cloud Storage integration for the Talent Directory Platform.

## Features

- 🔐 **Authentication & Authorization** - JWT-based authentication with role-based access control
- 📁 **File Upload/Download** - Google Cloud Storage integration for file management
- 🗄️ **MongoDB Database** - Self-hosted MongoDB with Mongoose ODM
- 🔒 **Security** - Helmet, CORS, Rate limiting, Input validation
- 📊 **User Management** - Complete user CRUD operations
- 🎯 **Search & Filtering** - Text search capabilities

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (self-hosted)
- **ODM**: Mongoose
- **Storage**: Google Cloud Storage
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer

## Prerequisites

1. **MongoDB** - Install and run MongoDB locally
2. **Google Cloud Account** - Set up Google Cloud Storage
3. **Node.js** - Version 14 or higher
4. **npm** - Package manager

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/talent-directory
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   
   # Google Cloud Storage Configuration
   GOOGLE_CLOUD_PROJECT_ID=your-google-cloud-project-id
   GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
   GOOGLE_CLOUD_KEY_FILE=path/to/your/service-account-key.json
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:3000
   ```

3. **Set up Google Cloud Storage**:
   - Create a Google Cloud project
   - Enable Cloud Storage API
   - Create a service account and download the JSON key file
   - Create a storage bucket
   - Update the environment variables

4. **Start MongoDB**:
   ```bash
   # Start MongoDB service
   mongod
   ```

5. **Run the server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### File Upload
- `POST /api/upload/single` - Upload single file (protected)
- `POST /api/upload/multiple` - Upload multiple files (protected)
- `DELETE /api/upload/:filename` - Delete file (protected)
- `GET /api/upload/list` - List files (protected)

### Health Check
- `GET /api/health` - Server health status

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['talent', 'client', 'admin']),
  profileImage: String (Google Cloud Storage URL),
  bio: String,
  skills: [String],
  experience: Number,
  location: String,
  hourlyRate: Number,
  portfolio: [{
    title: String,
    description: String,
    imageUrl: String,
    projectUrl: String,
    technologies: [String]
  }],
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    website: String
  },
  isVerified: Boolean,
  isActive: Boolean
}
```

## Google Cloud Storage Setup

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Cloud Storage API**:
   - Go to APIs & Services > Library
   - Search for "Cloud Storage" and enable it

3. **Create Service Account**:
   - Go to IAM & Admin > Service Accounts
   - Create a new service account
   - Download the JSON key file
   - Place it in your project (e.g., `config/service-account-key.json`)

4. **Create Storage Bucket**:
   - Go to Cloud Storage > Buckets
   - Create a new bucket
   - Set appropriate permissions

5. **Update Environment Variables**:
   ```env
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
   GOOGLE_CLOUD_KEY_FILE=config/service-account-key.json
   ```

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password security
- **Input Validation** - Express-validator for request validation
- **Rate Limiting** - Prevent abuse with request limiting
- **CORS Protection** - Configured for frontend access
- **Helmet Security** - Various HTTP headers for security
- **File Type Validation** - Only allowed file types can be uploaded
- **File Size Limits** - 5MB maximum file size

## Development

### Project Structure
```
backend/
├── config/
│   ├── database.js          # MongoDB connection
│   └── googleCloud.js       # Google Cloud Storage config
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── uploadController.js  # File upload logic
├── middleware/
│   ├── auth.js             # JWT authentication
│   └── upload.js           # File upload middleware
├── models/
│   └── User.js             # User model
├── routes/
│   ├── auth.js             # Authentication routes
│   └── upload.js           # Upload routes
├── server.js               # Main server file
├── package.json
└── README.md
```

### Running Tests
```bash
npm test
```

### Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT expiration time
- `GOOGLE_CLOUD_PROJECT_ID` - Google Cloud project ID
- `GOOGLE_CLOUD_BUCKET_NAME` - Storage bucket name
- `GOOGLE_CLOUD_KEY_FILE` - Service account key file path
- `FRONTEND_URL` - Frontend application URL

## Production Deployment

1. **Set environment variables** for production
2. **Use PM2 or similar** for process management
3. **Set up MongoDB** on a production server
4. **Configure Google Cloud Storage** with proper permissions
5. **Set up reverse proxy** (nginx) if needed
6. **Enable HTTPS** with SSL certificates

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Google Cloud Storage Error**:
   - Verify service account key file path
   - Check bucket permissions
   - Ensure API is enabled

3. **CORS Error**:
   - Update `FRONTEND_URL` in `.env`
   - Check CORS configuration

4. **File Upload Error**:
   - Check file size limits
   - Verify file type restrictions
   - Ensure bucket exists and is accessible

## License

MIT License 