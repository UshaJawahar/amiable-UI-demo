const mongoose = require('mongoose');

const featuredProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    enum: ['talent', 'professional', 'project'],
    required: [true, 'Featured type is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  featuredUntil: {
    type: Date,
    required: [true, 'Featured until date is required']
  },
  reason: {
    type: String,
    maxlength: [500, 'Reason cannot be more than 500 characters']
  },
  stats: {
    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative']
    },
    applications: {
      type: Number,
      default: 0,
      min: [0, 'Applications cannot be negative']
    },
    inquiries: {
      type: Number,
      default: 0,
      min: [0, 'Inquiries cannot be negative']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Admin who created the feature is required']
  }
}, {
  timestamps: true
});

// Index for efficient queries
featuredProfileSchema.index({ type: 1, isActive: 1 });
featuredProfileSchema.index({ userId: 1 });
featuredProfileSchema.index({ featuredUntil: 1 });

module.exports = mongoose.model('FeaturedProfile', featuredProfileSchema); 