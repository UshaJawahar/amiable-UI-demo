const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  type: {
    type: String,
    enum: ['film', 'tv', 'commercial', 'theater', 'voice', 'other'],
    required: [true, 'Project type is required']
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'casting', 'in_production', 'completed', 'cancelled'],
    default: 'draft'
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  budget: {
    min: {
      type: Number,
      required: [true, 'Minimum budget is required'],
      min: [0, 'Budget cannot be negative']
    },
    max: {
      type: Number,
      required: [true, 'Maximum budget is required'],
      min: [0, 'Budget cannot be negative']
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'USD'
    }
  },
  timeline: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    castingDeadline: {
      type: Date,
      required: [true, 'Casting deadline is required']
    }
  },
  requirements: {
    roles: [{
      id: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        required: true,
        trim: true
      },
      type: {
        type: String,
        enum: ['acting', 'production'],
        required: true
      },
      category: {
        type: String,
        required: true,
        trim: true
      },
      experience: {
        type: String,
        required: true,
        trim: true
      },
      skills: [{
        type: String,
        trim: true
      }],
      budget: {
        min: {
          type: Number,
          required: true,
          min: [0, 'Budget cannot be negative']
        },
        max: {
          type: Number,
          required: true,
          min: [0, 'Budget cannot be negative']
        }
      },
      filled: {
        type: Boolean,
        default: false
      },
      applications: {
        type: Number,
        default: 0
      }
    }],
    totalRoles: {
      type: Number,
      required: true,
      min: [1, 'At least one role is required']
    },
    filledRoles: {
      type: Number,
      default: 0
    }
  },
  company: {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    logo: {
      type: String, // Google Cloud Storage URL
      default: null
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    applications: {
      type: Number,
      default: 0
    },
    shortlisted: {
      type: Number,
      default: 0
    },
    hired: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project creator is required']
  }
}, {
  timestamps: true
});

// Index for search functionality
projectSchema.index({ 
  title: 'text', 
  description: 'text',
  'requirements.roles.title': 'text',
  'requirements.roles.description': 'text',
  tags: 'text'
});

// Index for filtering
projectSchema.index({ status: 1, type: 1, createdBy: 1 });

module.exports = mongoose.model('Project', projectSchema); 