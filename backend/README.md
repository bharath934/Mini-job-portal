# Enhanced Job Board Backend

This is the enhanced backend API for the Job Board application built with Node.js, Express, MongoDB, and file upload capabilities.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **File Uploads**: Profile pictures and resume uploads with multer
- **Job Management**: CRUD operations for job postings with job type (full-time/part-time)
- **Application System**: Job seekers can apply to jobs, employers can view applications
- **Profile Management**: Enhanced profiles for employers and job seekers
- **Admin Panel**: Complete user and job management for administrators

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the environment variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/jobboard
     JWT_SECRET=your-very-long-and-secure-secret-key-here
     ```

3. **Create Uploads Directory**
   ```bash
   mkdir uploads
   ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017/jobboard`

5. **Run the Application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Profile Management
- `PUT /api/profile/update` - Update user profile
- `POST /api/profile/upload-pic` - Upload profile picture
- `POST /api/profile/upload-resume` - Upload resume (job seekers only)

### Jobs
- `GET /api/jobs` - Get all jobs (authenticated)
- `GET /api/jobs/my-jobs` - Get jobs posted by current employer
- `POST /api/jobs` - Create new job (employer only)
- `PUT /api/jobs/:id` - Update job (employer only)
- `DELETE /api/jobs/:id` - Delete job (employer only)
- `POST /api/jobs/:id/apply` - Apply to job (job seekers only)
- `GET /api/jobs/:id/applications` - Get job applications (employer only)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/jobs` - Get all jobs (admin only)
- `PUT /api/admin/users/:id` - Update user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `GET /api/admin/stats` - Get statistics (admin only)

## Database Schema

### Users
- `name` - String (required)
- `email` - String (required, unique)
- `password` - String (required, hashed)
- `role` - String (admin/employer/seeker)
- `profilePic` - String (file path)
- `designation` - String (employer only)
- `education` - String (employer only)
- `qualification` - String (job seeker only)
- `experience` - String (fresher/experienced, job seeker only)
- `resume` - String (file path, job seeker only)

### Jobs
- `title` - String (required)
- `description` - String (required)
- `company` - String (required)
- `location` - String (required)
- `jobType` - String (fulltime/parttime, required)
- `postedBy` - ObjectId (User reference)

### Applications
- `jobId` - ObjectId (Job reference)
- `applicantId` - ObjectId (User reference)
- `status` - String (pending/accepted/rejected)

## File Upload

The application supports file uploads for:
- **Profile Pictures**: Images (JPG, PNG, GIF) up to 5MB
- **Resumes**: PDF, DOC, DOCX files up to 5MB

Files are stored in the `uploads/` directory and served statically.

## Default Admin Account

To create an admin account, you can manually insert into the database or modify the registration endpoint temporarily to allow admin role registration.

## Security Features

- JWT Authentication with 24-hour expiration
- Password hashing with bcrypt
- Role-based access control
- File type validation for uploads
- Input validation with express-validator
- CORS enabled for cross-origin requests

## Testing

The backend can be tested using tools like Postman or curl. Make sure to include the JWT token in the Authorization header for protected routes:

```
Authorization: Bearer <your-jwt-token>
```

## File Structure

```
backend/
├── models/
│   ├── User.js
│   ├── Job.js
│   └── Application.js
├── routes/
│   ├── auth.js
│   ├── profile.js
│   ├── jobs.js
│   └── admin.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── uploads/
├── server.js
├── package.json
└── README.md
```