const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'talent' | 'client' | 'admin';
  purpose: 'talent' | 'professional';
  userRole?: 'production' | 'acting';
  category?: string;
  bio?: string;
  skills?: string[];
  experience?: number;
  location?: string;
  hourlyRate?: number;
  profileImage?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  type: 'film' | 'tv' | 'commercial' | 'theater' | 'voice' | 'other';
  status: 'draft' | 'active' | 'casting' | 'in_production' | 'completed' | 'cancelled';
  description: string;
  location: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: {
    startDate: string;
    endDate: string;
    castingDeadline: string;
  };
  requirements: {
    roles: Array<{
      id: string;
      title: string;
      description: string;
      type: 'acting' | 'production';
      category: string;
      experience: string;
      skills: string[];
      budget: {
        min: number;
        max: number;
      };
      filled: boolean;
      applications: number;
    }>;
    totalRoles: number;
    filledRoles: number;
  };
  company: {
    name: string;
    logo?: string;
    verified: boolean;
  };
  stats: {
    views: number;
    applications: number;
    shortlisted: number;
    hired: number;
  };
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  projectId: string;
  roleId: string;
  applicantId: string;
  status: 'pending' | 'shortlisted' | 'rejected' | 'hired';
  coverLetter?: string;
  portfolio?: Array<{
    title: string;
    description?: string;
    url: string;
    type: 'image' | 'video' | 'document';
  }>;
  resume?: string;
  auditionVideo?: string;
  proposedRate?: number;
  availability?: {
    startDate?: string;
    endDate?: string;
    flexible: boolean;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'application' | 'project' | 'system' | 'featured' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  action?: {
    type: 'view' | 'approve' | 'reject' | 'download';
    url?: string;
    label?: string;
  };
  sender?: {
    id: string;
    name: string;
    avatar?: string;
    role: 'talent' | 'professional';
    verified: boolean;
  };
  project?: {
    id: string;
    title: string;
    type: string;
  };
  metadata?: {
    applicationCount?: number;
    projectViews?: number;
    deadline?: string;
  };
  createdAt: string;
}

// API Response types
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Auth types
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  purpose: 'talent' | 'professional';
  phone?: string;
  role?: 'production' | 'acting';
  userRole?: 'production' | 'acting';
  category?: string;
  experience?: string;
  skills?: string[];
  languages?: string[];
  location?: string;
  hasDisability?: boolean;
  disabilityType?: string;
  disabilityCertificate?: any;
  bio?: string;
  socialMediaReels?: Array<{
    id: string;
    platform: 'instagram' | 'facebook' | 'youtube';
    url: string;
    title: string;
    description?: string;
  }>;
  companyName?: string;
  companyType?: 'film_studio' | 'ott_platform' | 'casting_agency' | 'production_house' | 'other';
  jobTitle?: string;
  industry?: string;
  companySize?: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+';
  website?: string;
  hiringNeeds?: string[];
  projectTypes?: string[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// API Service Class
class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Create an error object that includes the response data
        const error = new Error(data.message || 'API request failed');
        (error as any).response = { data };
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('token', response.data.token);
    }

    return response.data || { success: response.success, message: response.message };
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('token', response.data.token);
    }

    return response.data || { success: response.success, message: response.message };
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/auth/me');
    if (!response.data) {
      throw new Error('User data not found');
    }
    return response.data;
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('token');
  }

  // User methods
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.data) {
      throw new Error('User data not found');
    }
    return response.data;
  }

  async getUsers(params?: {
    role?: string;
    category?: string;
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: User[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }

    const response = await this.request<{ users: User[]; total: number }>(`/users?${queryParams}`);
    return response.data || { users: [], total: 0 };
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.request<User>(`/users/${id}`);
    if (!response.data) {
      throw new Error('User data not found');
    }
    return response.data;
  }

  // Project methods
  async createProject(data: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const response = await this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.data) {
      throw new Error('Project data not found');
    }
    return response.data;
  }

  async getProjects(params?: {
    type?: string;
    status?: string;
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<{ projects: Project[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }

    const response = await this.request<{ projects: Project[]; total: number }>(`/projects?${queryParams}`);
    return response.data || { projects: [], total: 0 };
  }

  async getProjectById(id: string): Promise<Project> {
    const response = await this.request<Project>(`/projects/${id}`);
    if (!response.data) {
      throw new Error('Project data not found');
    }
    return response.data;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.data) {
      throw new Error('Project data not found');
    }
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.request<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Application methods
  async createApplication(data: Omit<Application, '_id' | 'createdAt' | 'updatedAt'>): Promise<Application> {
    const response = await this.request<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.data) {
      throw new Error('Application data not found');
    }
    return response.data;
  }

  async getApplications(params?: {
    status?: string;
    projectId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ applications: Application[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }

    const response = await this.request<{ applications: Application[]; total: number }>(`/applications?${queryParams}`);
    return response.data || { applications: [], total: 0 };
  }

  async updateApplication(id: string, data: Partial<Application>): Promise<Application> {
    const response = await this.request<Application>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.data) {
      throw new Error('Application data not found');
    }
    return response.data;
  }

  // Notification methods
  async getNotifications(params?: {
    read?: boolean;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{ notifications: Notification[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }

    const response = await this.request<{ notifications: Notification[]; total: number }>(`/notifications?${queryParams}`);
    return response.data || { notifications: [], total: 0 };
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    const response = await this.request<Notification>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
    if (!response.data) {
      throw new Error('Notification data not found');
    }
    return response.data;
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await this.request<void>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  // File upload methods
  async uploadFile(file: File, purpose: string): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);

    const response = await this.request<{ url: string; filename: string }>('/upload/single', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData
      },
      body: formData,
    });
    if (!response.data) {
      throw new Error('Upload data not found');
    }
    return response.data;
  }

  // Analytics methods
  async getAnalytics(): Promise<any> {
    const response = await this.request<any>('/analytics');
    return response.data || {};
  }

  // Health check
  async healthCheck(): Promise<{ success: boolean; message: string }> {
    const response = await this.request<{ success: boolean; message: string }>('/health');
    return response.data || { success: false, message: 'Health check failed' };
  }
}

// Create and export a singleton instance
export const api = new ApiService();

// Export types
export type { ApiResponse }; 