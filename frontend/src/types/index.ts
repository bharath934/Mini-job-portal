export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employer' | 'seeker';
  profilePic?: string;
  designation?: string;
  education?: string;
  qualification?: string;
  experience?: 'fresher' | 'experienced';
  resume?: string;
  createdAt?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  jobType: 'fulltime' | 'parttime';
  postedBy: string;
  createdAt: string;
  applications?: Application[];
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  applicant: User;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'employer' | 'seeker';
}

export interface JobFormData {
  title: string;
  description: string;
  company: string;
  location: string;
  jobType: 'fulltime' | 'parttime';
}

export interface ProfileUpdateData {
  name: string;
  designation?: string;
  education?: string;
  qualification?: string;
  experience?: 'fresher' | 'experienced';
}