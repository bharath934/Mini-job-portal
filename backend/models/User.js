const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'employer', 'seeker'],
    default: 'seeker'
  },
  profilePic: {
    type: String,
    default: null
  },
  // Employer-specific fields
  designation: {
    type: String,
    default: null
  },
  education: {
    type: String,
    default: null
  },
  // Job seeker-specific fields
  qualification: {
    type: String,
    default: null
  },
  experience: {
    type: String,
    enum: ['fresher', 'experienced', null], // ✅ fixed: allow null
    default: null
  },
  resume: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error('Password hashing error:', error);
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
