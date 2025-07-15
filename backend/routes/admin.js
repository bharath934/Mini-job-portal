const express = require('express');
const User = require('../models/User');
const Job = require('../models/Job');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
      designation: user.designation,
      education: user.education,
      qualification: user.qualification,
      experience: user.experience,
      resume: user.resume,
      createdAt: user.createdAt
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all jobs (admin only)
router.get('/jobs', auth, authorize('admin'), async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });
    
    const formattedJobs = jobs.map(job => ({
      id: job._id,
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location,
      jobType: job.jobType,
      postedBy: job.postedBy._id,
      createdAt: job.createdAt
    }));

    res.json(formattedJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (admin only)
router.put('/users/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const { name, designation, education, qualification, experience } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData = { name };

    // Add role-specific fields
    if (user.role === 'employer') {
      if (designation !== undefined) updateData.designation = designation;
      if (education !== undefined) updateData.education = education;
    } else if (user.role === 'seeker') {
      if (qualification !== undefined) updateData.qualification = qualification;
      if (experience !== undefined) updateData.experience = experience;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePic: updatedUser.profilePic,
      designation: updatedUser.designation,
      education: updatedUser.education,
      qualification: updatedUser.qualification,
      experience: updatedUser.experience,
      resume: updatedUser.resume,
      createdAt: updatedUser.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get statistics (admin only)
router.get('/stats', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEmployers = await User.countDocuments({ role: 'employer' });
    const totalSeekers = await User.countDocuments({ role: 'seeker' });
    const totalJobs = await Job.countDocuments();

    res.json({
      totalUsers,
      totalEmployers,
      totalSeekers,
      totalJobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;