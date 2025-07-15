import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterData, Job, JobFormData, User, ProfileUpdateData, Application } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    api.post('/auth/login', credentials).then(res => res.data),
  
  register: (userData: RegisterData): Promise<AuthResponse> =>
    api.post('/auth/register', userData).then(res => res.data),
  
  getCurrentUser: (): Promise<User> =>
    api.get('/auth/me').then(res => res.data),
};

export const profileAPI = {
  updateProfile: (profileData: ProfileUpdateData): Promise<User> =>
    api.put('/profile/update', profileData).then(res => res.data),
  
  uploadProfilePic: (formData: FormData): Promise<User> =>
    api.post('/profile/upload-pic', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
  
  uploadResume: (formData: FormData): Promise<User> =>
    api.post('/profile/upload-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
};

export const jobAPI = {
  getAllJobs: (): Promise<Job[]> =>
    api.get('/jobs').then(res => res.data),
  
  getMyJobs: (): Promise<Job[]> =>
    api.get('/jobs/my-jobs').then(res => res.data),
  
  createJob: (jobData: JobFormData): Promise<Job> =>
    api.post('/jobs', jobData).then(res => res.data),
  
  updateJob: (id: string, jobData: JobFormData): Promise<Job> =>
    api.put(`/jobs/${id}`, jobData).then(res => res.data),
  
  deleteJob: (id: string): Promise<void> =>
    api.delete(`/jobs/${id}`).then(res => res.data),
  
  applyToJob: (jobId: string): Promise<Application> =>
    api.post(`/jobs/${jobId}/apply`).then(res => res.data),
  
  getJobApplications: (jobId: string): Promise<Application[]> =>
    api.get(`/jobs/${jobId}/applications`).then(res => res.data),
};

export const adminAPI = {
  getAllUsers: (): Promise<User[]> =>
    api.get('/admin/users').then(res => res.data),
  
  getAllJobs: (): Promise<Job[]> =>
    api.get('/admin/jobs').then(res => res.data),
  
  updateUser: (id: string, userData: Partial<User>): Promise<User> =>
    api.put(`/admin/users/${id}`, userData).then(res => res.data),
  
  deleteUser: (id: string): Promise<void> =>
    api.delete(`/admin/users/${id}`).then(res => res.data),
  
  getStats: (): Promise<{
    totalUsers: number;
    totalEmployers: number;
    totalSeekers: number;
    totalJobs: number;
  }> =>
    api.get('/admin/stats').then(res => res.data),
};