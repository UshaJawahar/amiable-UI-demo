const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project ID is required']
  },
  roleId: {
    type: String,
    required: [true, 'Role ID is required']
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant ID is required']
  },
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  },
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot be more than 2000 characters']
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
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['image', 'video', 'document'],
      required: true
    }
  }],
  resume: {
    type: String, // Google Cloud Storage URL
    default: null
  },
  auditionVideo: {
    type: String, // Google Cloud Storage URL
    default: null
  },
  proposedRate: {
    type: Number,
    min: [0, 'Rate cannot be negative']
  },
  availability: {
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    flexible: {
      type: Boolean,
      default: false
    }
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  }
}, {
  timestamps: true
});

// Index for efficient queries
applicationSchema.index({ projectId: 1, applicantId: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ applicantId: 1 });

module.exports = mongoose.model('Application', applicationSchema); 