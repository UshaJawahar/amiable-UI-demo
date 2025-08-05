const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  overview: {
    totalUsers: {
      type: Number,
      required: true,
      min: [0, 'Total users cannot be negative']
    },
    totalProjects: {
      type: Number,
      required: true,
      min: [0, 'Total projects cannot be negative']
    },
    totalApplications: {
      type: Number,
      required: true,
      min: [0, 'Total applications cannot be negative']
    },
    activeUsers: {
      type: Number,
      required: true,
      min: [0, 'Active users cannot be negative']
    },
    featuredProfiles: {
      type: Number,
      required: true,
      min: [0, 'Featured profiles cannot be negative']
    },
    verifiedUsers: {
      type: Number,
      required: true,
      min: [0, 'Verified users cannot be negative']
    },
    platformRevenue: {
      type: Number,
      required: true,
      min: [0, 'Platform revenue cannot be negative']
    }
  },
  trends: {
    userGrowth: [{
      date: {
        type: String,
        required: true
      },
      users: {
        type: Number,
        required: true,
        min: [0, 'Users cannot be negative']
      }
    }],
    projectGrowth: [{
      date: {
        type: String,
        required: true
      },
      projects: {
        type: Number,
        required: true,
        min: [0, 'Projects cannot be negative']
      }
    }],
    applicationGrowth: [{
      date: {
        type: String,
        required: true
      },
      applications: {
        type: Number,
        required: true,
        min: [0, 'Applications cannot be negative']
      }
    }],
    engagementGrowth: [{
      date: {
        type: String,
        required: true
      },
      engagement: {
        type: Number,
        required: true,
        min: [0, 'Engagement cannot be negative']
      }
    }]
  },
  demographics: {
    userTypes: [{
      type: {
        type: String,
        required: true
      },
      count: {
        type: Number,
        required: true,
        min: [0, 'Count cannot be negative']
      },
      percentage: {
        type: Number,
        required: true,
        min: [0, 'Percentage cannot be negative'],
        max: [100, 'Percentage cannot exceed 100']
      }
    }],
    categories: [{
      category: {
        type: String,
        required: true
      },
      count: {
        type: Number,
        required: true,
        min: [0, 'Count cannot be negative']
      },
      percentage: {
        type: Number,
        required: true,
        min: [0, 'Percentage cannot be negative'],
        max: [100, 'Percentage cannot exceed 100']
      }
    }],
    locations: [{
      location: {
        type: String,
        required: true
      },
      count: {
        type: Number,
        required: true,
        min: [0, 'Count cannot be negative']
      },
      percentage: {
        type: Number,
        required: true,
        min: [0, 'Percentage cannot be negative'],
        max: [100, 'Percentage cannot exceed 100']
      }
    }],
    disabilities: [{
      type: {
        type: String,
        required: true
      },
      count: {
        type: Number,
        required: true,
        min: [0, 'Count cannot be negative']
      },
      percentage: {
        type: Number,
        required: true,
        min: [0, 'Percentage cannot be negative'],
        max: [100, 'Percentage cannot exceed 100']
      }
    }]
  },
  performance: {
    topProjects: [{
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
      },
      title: {
        type: String,
        required: true
      },
      applications: {
        type: Number,
        required: true,
        min: [0, 'Applications cannot be negative']
      },
      views: {
        type: Number,
        required: true,
        min: [0, 'Views cannot be negative']
      },
      status: {
        type: String,
        required: true
      }
    }],
    topTalents: [{
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      views: {
        type: Number,
        required: true,
        min: [0, 'Views cannot be negative']
      },
      applications: {
        type: Number,
        required: true,
        min: [0, 'Applications cannot be negative']
      },
      rating: {
        type: Number,
        required: true,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5']
      }
    }],
    topCompanies: [{
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      projects: {
        type: Number,
        required: true,
        min: [0, 'Projects cannot be negative']
      },
      hires: {
        type: Number,
        required: true,
        min: [0, 'Hires cannot be negative']
      },
      rating: {
        type: Number,
        required: true,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5']
      }
    }],
    conversionRates: [{
      metric: {
        type: String,
        required: true
      },
      rate: {
        type: Number,
        required: true,
        min: [0, 'Rate cannot be negative'],
        max: [100, 'Rate cannot exceed 100']
      },
      change: {
        type: Number,
        required: true
      }
    }]
  },
  engagement: {
    dailyActiveUsers: {
      type: Number,
      required: true,
      min: [0, 'Daily active users cannot be negative']
    },
    weeklyActiveUsers: {
      type: Number,
      required: true,
      min: [0, 'Weekly active users cannot be negative']
    },
    monthlyActiveUsers: {
      type: Number,
      required: true,
      min: [0, 'Monthly active users cannot be negative']
    },
    averageSessionDuration: {
      type: Number,
      required: true,
      min: [0, 'Session duration cannot be negative']
    },
    pageViews: {
      type: Number,
      required: true,
      min: [0, 'Page views cannot be negative']
    },
    bounceRate: {
      type: Number,
      required: true,
      min: [0, 'Bounce rate cannot be negative'],
      max: [100, 'Bounce rate cannot exceed 100']
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
analyticsSchema.index({ date: 1 }, { unique: true });

module.exports = mongoose.model('Analytics', analyticsSchema); 