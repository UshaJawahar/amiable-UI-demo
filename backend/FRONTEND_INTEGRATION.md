# Frontend Integration Guide

This guide explains how to integrate your Next.js frontend with the backend API.

## API Base URL

The backend API runs on `http://localhost:5000` by default.

## Authentication Flow

### 1. Register a User
```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Store token in localStorage or state management
      localStorage.setItem('token', data.token);
      return data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
```

### 2. Login User
```javascript
const loginUser = async (credentials) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.token);
      return data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

### 3. Get Current User
```javascript
const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};
```

## File Upload Integration

### 1. Upload Single File
```javascript
const uploadFile = async (file) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('http://localhost:5000/api/upload/single', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

### 2. Upload Multiple Files
```javascript
const uploadMultipleFiles = async (files) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await fetch('http://localhost:5000/api/upload/multiple', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

### 3. List Files
```javascript
const listFiles = async (prefix = '') => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const url = prefix 
      ? `http://localhost:5000/api/upload/list?prefix=${encodeURIComponent(prefix)}`
      : 'http://localhost:5000/api/upload/list';
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('List files error:', error);
    throw error;
  }
};
```

## API Utility Functions

Create a utility file for API calls:

```javascript
// utils/api.js
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // File upload methods
  async uploadFile(file) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/upload/single`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  }

  async listFiles(prefix = '') {
    const endpoint = prefix ? `/upload/list?prefix=${encodeURIComponent(prefix)}` : '/upload/list';
    return this.request(endpoint);
  }
}

export const apiService = new ApiService();
```

## Environment Variables for Frontend

Add these to your frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## CORS Configuration

The backend is configured to accept requests from `http://localhost:3000`. If your frontend runs on a different port, update the `FRONTEND_URL` in the backend `.env` file.

## Error Handling

Always handle API errors gracefully:

```javascript
try {
  const result = await apiService.someMethod();
  // Handle success
} catch (error) {
  // Handle error
  console.error('API Error:', error.message);
  // Show user-friendly error message
}
```

## Testing the Integration

1. Start the backend: `npm run dev` (in backend directory)
2. Start the frontend: `npm run dev` (in root directory)
3. Test the health endpoint: `http://localhost:5000/api/health`
4. Try registering a user and uploading files

## Common Issues

1. **CORS Error**: Make sure `FRONTEND_URL` is set correctly in backend `.env`
2. **Authentication Error**: Check if token is being sent in headers
3. **File Upload Error**: Verify file size and type restrictions
4. **Connection Error**: Ensure backend is running on port 5000 