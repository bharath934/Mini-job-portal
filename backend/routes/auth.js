const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Create demo accounts on server start
const createDemoAccounts = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@tekfix.com' });
    const employerExists = await User.findOne({ email: 'employer@tekfix.com' });
    const seekerExists = await User.findOne({ email: 'seeker@tekfix.com' });

    if (!adminExists) {
      const adminUser = new User({
        name: 'TEKFIX Admin',
        email: 'admin@tekfix.com',
        password: 'admin123',
        role: 'admin'
      });
      await adminUser.save();
      console.log('Demo Admin account created: admin@tekfix.com / admin123');
    }

    if (!employerExists) {
      const employerUser = new User({
        name: 'John Employer',
        email: 'employer@tekfix.com',
        password: 'employer123',
        role: 'employer',
        designation: 'HR Manager',
        education: 'MBA in Human Resources'
      });
      await employerUser.save();
      console.log('Demo Employer account created: employer@tekfix.com / employer123');
    }

    if (!seekerExists) {
      const seekerUser = new User({
        name: 'Jane Seeker',
        email: 'seeker@tekfix.com',
        password: 'seeker123',
        role: 'seeker',
        qualification: 'Bachelor of Computer Science',
        experience: 'fresher'
      });
      await seekerUser.save();
      console.log('Demo Job Seeker account created: seeker@tekfix.com / seeker123');
    }
  } catch (error) {
    console.error('Error creating demo accounts:', error);
  }
};

// Call this function when the module is loaded
createDemoAccounts();

// Register
router.post('/register', [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  body('role', 'Role must be either employer or seeker').isIn(['employer', 'seeker'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, email, password, role } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Build user object based on role
    const newUserData = {
      name,
      email,
      password,
      role
    };

    if (role === 'employer') {
      newUserData.designation = 'HR';
      newUserData.education = 'MBA';
    } else if (role === 'seeker') {
      newUserData.qualification = 'B.Tech';
      newUserData.experience = 'fresher'; // ✅ critical fix
    }

    user = new User(newUserData);
    await user.save();

    // Generate JWT token
    const payload = {
      id: user._id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        designation: user.designation,
        education: user.education,
        qualification: user.qualification,
        experience: user.experience,
        resume: user.resume
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed. Please try again.',
      error: error.message 
    });
  }
});

// Login
router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      id: user._id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h'
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        designation: user.designation,
        education: user.education,
        qualification: user.qualification,
        experience: user.experience,
        resume: user.resume
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      profilePic: req.user.profilePic,
      designation: req.user.designation,
      education: req.user.education,
      qualification: req.user.qualification,
      experience: req.user.experience,
      resume: req.user.resume
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
