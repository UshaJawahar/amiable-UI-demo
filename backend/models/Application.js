const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Basic Information
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
  purpose: {
    type: String,
    enum: ['talent', 'professional'],
    required: [true, 'Purpose is required']
  },

  // Talent-specific fields
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
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
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

  // Professional-specific fields
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

  // Application status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for search functionality
applicationSchema.index({ 
  name: 'text', 
  skills: 'text', 
  bio: 'text',
  companyName: 'text'
});

// Unique index for email
applicationSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema); 