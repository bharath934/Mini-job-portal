const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all jobs (for job seekers)
router.get('/', auth, async (req, res) => {
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

// Get jobs posted by current employer
router.get('/my-jobs', auth, authorize('employer'), async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 });
    
    // Get application counts for each job
    const jobsWithApplications = await Promise.all(
      jobs.map(async (job) => {
        const applications = await Application.find({ jobId: job._id });
        return {
          id: job._id,
          title: job.title,
          description: job.description,
          company: job.company,
          location: job.location,
          jobType: job.jobType,
          postedBy: job.postedBy,
          createdAt: job.createdAt,
          applications: applications
        };
      })
    );

    res.json(jobsWithApplications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new job (employer only)
router.post('/', [
  auth,
  authorize('employer'),
  body('title', 'Title is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty(),
  body('company', 'Company is required').not().isEmpty(),
  body('location', 'Location is required').not().isEmpty(),
  body('jobType', 'Job type must be fulltime or parttime').isIn(['fulltime', 'parttime'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, company, location, jobType } = req.body;

    const job = new Job({
      title,
      description,
      company,
      location,
      jobType,
      postedBy: req.user._id
    });

    await job.save();

    res.status(201).json({
      id: job._id,
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location,
      jobType: job.jobType,
      postedBy: job.postedBy,
      createdAt: job.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a job (employer only)
router.put('/:id', [
  auth,
  authorize('employer'),
  body('title', 'Title is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty(),
  body('company', 'Company is required').not().isEmpty(),
  body('location', 'Location is required').not().isEmpty(),
  body('jobType', 'Job type must be fulltime or parttime').isIn(['fulltime', 'parttime'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, company, location, jobType } = req.body;

    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user owns this job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    job = await Job.findByIdAndUpdate(
      req.params.id,
      { title, description, company, location, jobType },
      { new: true }
    );

    res.json({
      id: job._id,
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location,
      jobType: job.jobType,
      postedBy: job.postedBy,
      createdAt: job.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a job (employer only)
router.delete('/:id', auth, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user owns this job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete associated applications
    await Application.deleteMany({ jobId: req.params.id });

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply to a job (job seekers only)
router.post('/:id/apply', auth, authorize('seeker'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId: req.params.id,
      applicantId: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = new Application({
      jobId: req.params.id,
      applicantId: req.user._id
    });

    await application.save();

    const populatedApplication = await Application.findById(application._id)
      .populate('applicantId', 'name email profilePic qualification experience resume');

    res.status(201).json({
      id: populatedApplication._id,
      jobId: populatedApplication.jobId,
      applicantId: populatedApplication.applicantId._id,
      applicant: {
        id: populatedApplication.applicantId._id,
        name: populatedApplication.applicantId.name,
        email: populatedApplication.applicantId.email,
        profilePic: populatedApplication.applicantId.profilePic,
        qualification: populatedApplication.applicantId.qualification,
        experience: populatedApplication.applicantId.experience,
        resume: populatedApplication.applicantId.resume
      },
      status: populatedApplication.status,
      appliedAt: populatedApplication.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for a job (employer only)
router.get('/:id/applications', auth, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user owns this job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ jobId: req.params.id })
      .populate('applicantId', 'name email profilePic qualification experience resume')
      .sort({ createdAt: -1 });

    const formattedApplications = applications.map(app => ({
      id: app._id,
      jobId: app.jobId,
      applicantId: app.applicantId._id,
      applicant: {
        id: app.applicantId._id,
        name: app.applicantId.name,
        email: app.applicantId.email,
        profilePic: app.applicantId.profilePic,
        qualification: app.applicantId.qualification,
        experience: app.applicantId.experience,
        resume: app.applicantId.resume
      },
      status: app.status,
      appliedAt: app.createdAt
    }));

    res.json(formattedApplications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;