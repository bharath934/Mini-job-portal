const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  console.log('='.repeat(50));
  console.log('TEKFIX JOB BOARD - DEMO ACCOUNTS');
  console.log('='.repeat(50));
  console.log('Admin Account:');
  console.log('Email: admin@tekfix.com');
  console.log('Password: admin123');
  console.log('-'.repeat(30));
  console.log('Employer Account:');
  console.log('Email: employer@tekfix.com');
  console.log('Password: employer123');
  console.log('-'.repeat(30));
  console.log('Job Seeker Account:');
  console.log('Email: seeker@tekfix.com');
  console.log('Password: seeker123');
  console.log('='.repeat(50));
})
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/admin', require('./routes/admin'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});