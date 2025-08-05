const mongoose = require('mongoose');

const adminActionSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Admin ID is required']
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    trim: true
  },
  targetType: {
    type: String,
    enum: ['user', 'project', 'application', 'featured_profile'],
    required: [true, 'Target type is required']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Target ID is required']
  },
  details: {
    previousState: Object,
    newState: Object,
    reason: {
      type: String,
      maxlength: [500, 'Reason cannot be more than 500 characters']
    }
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
adminActionSchema.index({ adminId: 1 });
adminActionSchema.index({ createdAt: -1 });
adminActionSchema.index({ targetType: 1, targetId: 1 });

module.exports = mongoose.model('AdminAction', adminActionSchema); 