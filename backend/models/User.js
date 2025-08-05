const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['talent', 'client', 'admin'],
    default: 'talent'
  },
  purpose: {
    type: String,
    enum: ['talent', 'professional'],
    required: [true, 'Purpose is required']
  },
  userRole: {
    type: String,
    enum: ['production', 'acting'],
    required: function() { return this.purpose === 'talent'; }
  },
  category: {
    type: String,
    trim: true,
    required: function() { return this.purpose === 'talent'; }
  },
  experience: {
    type: String,
    trim: true,
    required: function() { return this.purpose === 'talent'; }
  },
  skills: [{
    type: String,
    trim: true
  }],
  languages: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true,
    required: function() { return this.purpose === 'talent'; }
  },
  hasDisability: {
    type: Boolean,
    default: false
  },
  disabilityType: {
    type: String,
    trim: true
  },
  disabilityCertificate: {
    type: String, // Google Cloud Storage URL
    default: null
  },
  companyName: {
    type: String,
    trim: true,
    required: function() { return this.purpose === 'professional'; }
  },
  companyType: {
    type: String,
    enum: ['film_studio', 'ott_platform', 'casting_agency', 'production_house', 'other'],
    required: function() { return this.purpose === 'professional'; }
  },
  jobTitle: {
    type: String,
    trim: true,
    required: function() { return this.purpose === 'professional'; }
  },
  industry: {
    type: String,
    trim: true,
    required: function() { return this.purpose === 'professional'; }
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
    required: function() { return this.purpose === 'professional'; }
  },
  website: {
    type: String,
    trim: true
  },
  hiringNeeds: [{
    type: String,
    trim: true
  }],
  projectTypes: [{
    type: String,
    trim: true
  }],
  profileImage: {
    type: String, // Google Cloud Storage URL
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  hourlyRate: {
    type: Number,
    min: [0, 'Hourly rate cannot be negative']
  },
  portfolio: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageUrl: String, // Google Cloud Storage URL
    projectUrl: String,
    technologies: [String]
  }],
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    website: String
  },
  socialMediaReels: [{
    id: {
      type: String,
      required: true
    },
    platform: {
      type: String,
      enum: ['instagram', 'facebook', 'youtube'],
      required: true
    },
    url: {
      type: String,
      required: true,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL']
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Index for search functionality
userSchema.index({ 
  name: 'text', 
  skills: 'text', 
  bio: 'text' 
});

// Unique index for email
userSchema.index({ email: 1 }, { unique: true });

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 