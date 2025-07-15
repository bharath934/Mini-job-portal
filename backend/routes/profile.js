const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Update profile
router.put('/update', [
  auth,
  body('name', 'Name is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, designation, education, qualification, experience } = req.body;

    const updateData = { name };

    // Add role-specific fields
    if (req.user.role === 'employer') {
      if (designation) updateData.designation = designation;
      if (education) updateData.education = education;
    } else if (req.user.role === 'seeker') {
      if (qualification) updateData.qualification = qualification;
      if (experience) updateData.experience = experience;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload profile picture
router.post('/upload-pic', auth, upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: `/uploads/${req.file.filename}` },
      { new: true }
    ).select('-password');

    res.json({
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload resume (job seekers only)
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (req.user.role !== 'seeker') {
      return res.status(403).json({ message: 'Only job seekers can upload resumes' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resume: `/uploads/${req.file.filename}` },
      { new: true }
    ).select('-password');

    res.json({
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;