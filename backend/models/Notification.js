const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    enum: ['application', 'project', 'system', 'featured', 'reminder'],
    required: [true, 'Notification type is required']
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  read: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  action: {
    type: {
      type: String,
      enum: ['view', 'approve', 'reject', 'download']
    },
    url: String,
    label: String
  },
  sender: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    avatar: String,
    role: {
      type: String,
      enum: ['talent', 'professional']
    },
    verified: Boolean
  },
  project: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    title: String,
    type: String
  },
  metadata: {
    applicationCount: Number,
    projectViews: Number,
    deadline: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ userId: 1, timestamp: -1 });
notificationSchema.index({ type: 1 });

module.exports = mongoose.model('Notification', notificationSchema); 