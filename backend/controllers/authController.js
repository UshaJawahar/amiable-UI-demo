const User = require('../models/User');
const Application = require('../models/Application');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Check if database is connected
const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

// @desc    Register user (creates application for admin review)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    // Check if database is connected
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please try again later.'
      });
    }

    const { 
      name, 
      email, 
      password, 
      purpose,
      phone,
      profileImage, // Added profileImage
      profile_picture, // Added profile_picture
      role,
      userRole,
      category,
      experience,
      skills,
      languages,
      location,
      hasDisability,
      disabilityType,
      disabilityCertificate,
      bio,
      socialMediaReels,
      companyName,
      companyType,
      jobTitle,
      industry,
      companySize,
      website,
      hiringNeeds,
      projectTypes
    } = req.body;

    // Check if application already exists
    const existingApplication = await Application.findOne({ email });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'An application with this email already exists'
      });
    }

    // Check if user already exists (approved user)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create application with all fields
    const applicationData = {
      name,
      email,
      password,
      purpose,
      phone,
      profileImage, // Added profileImage
      profile_picture, // Added profile_picture
      ...(purpose === 'talent' && {
        userRole: role || userRole, // Handle both role and userRole
        category,
        experience,
        skills,
        languages,
        location,
        hasDisability,
        disabilityType,
        disabilityCertificate,
        bio,
        socialMediaReels
      }),
      ...(purpose === 'professional' && {
        companyName,
        companyType,
        jobTitle,
        industry,
        companySize,
        website,
        hiringNeeds,
        projectTypes
      })
    };

    const application = await Application.create(applicationData);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Please wait for admin approval.',
      application: {
        id: application._id,
        name: application.name,
        email: application.email,
        purpose: application.purpose,
        status: application.status,
        submittedAt: application.createdAt
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    // Check if database is connected
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please try again later.'
      });
    }

    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // Check if database is connected
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please try again later.'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        skills: user.skills,
        experience: user.experience,
        portfolio: user.portfolio,
        socialLinks: user.socialLinks,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    // Check if database is connected
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please try again later.'
      });
    }

    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for admin
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/auth/admin/me
// @access  Private
const getAdminMe = async (req, res) => {
  try {
    // Check if database is connected
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please try again later.'
      });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin,
        profileImage: admin.profileImage,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error('Get admin me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  adminLogin,
  getAdminMe
}; 