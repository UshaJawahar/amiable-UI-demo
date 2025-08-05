const User = require('../models/User');
const Application = require('../models/Application');
const mongoose = require('mongoose');

// @desc    Get all approved talents
// @route   GET /api/talents
// @access  Public
const getTalents = async (req, res) => {
  try {
    const { 
      role, 
      category, 
      location, 
      search,
      page = 1,
      limit = 12
    } = req.query;

    // Debug: Check all users first
    const allUsers = await User.find({}).select('_id name email purpose userRole category location');
    console.log('All users in database:', allUsers.length);
    console.log('Sample users:', allUsers.slice(0, 3));

    // Debug: Check applications
    const allApplications = await Application.find({}).select('_id name email purpose userRole category location');
    console.log('All applications in database:', allApplications.length);
    console.log('Sample applications:', allApplications.slice(0, 3));

    // Build query for approved talents only
    let query = { 
      purpose: 'talent',
      // Add any additional filters for approved users if needed
    };

    // Role filter
    if (role && role !== 'all') {
      query.userRole = role;
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Location filter
    if (location && location !== 'all') {
      query.location = { $regex: location, $options: 'i' };
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Query for talents:', JSON.stringify(query, null, 2));

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const talents = await User.find(query)
      .select('name userRole category location experience skills languages bio profile_picture hasDisability disabilityType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log('Found talents:', talents.length);

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Transform data for frontend
    const transformedTalents = talents.map(talent => ({
      id: talent._id,
      name: talent.name,
      role: talent.userRole,
      category: talent.category,
      location: talent.location,
      experience: talent.experience,
      rating: 4.5, // Default rating - could be calculated from reviews
      featured: false, // Could be based on premium status or admin selection
      verified: true, // All approved users are verified
      avatar: talent.profile_picture || null,
      skills: talent.skills || [],
      languages: talent.languages || [],
      availability: 'Available', // Default - could be updated by user
      bio: talent.bio,
      hasDisability: talent.hasDisability,
      disabilityType: talent.disabilityType,
      portfolio: {
        videos: [],
        images: [],
        documents: []
      }
    }));

    res.json({
      success: true,
      data: transformedTalents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching talents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch talents',
      error: error.message
    });
  }
};

// @desc    Get talent by ID
// @route   GET /api/talents/:id
// @access  Public
const getTalentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid talent ID format'
      });
    }

    console.log('Looking for talent with ID:', id);

    const talent = await User.findById(id)
      .select('name userRole category location experience skills languages bio profile_picture hasDisability disabilityType createdAt purpose');

    console.log('Found talent:', talent ? 'Yes' : 'No');
    if (talent) {
      console.log('Talent purpose:', talent.purpose);
    }

    if (!talent) {
      return res.status(404).json({
        success: false,
        message: 'Talent not found'
      });
    }

    if (talent.purpose !== 'talent') {
      return res.status(404).json({
        success: false,
        message: 'Talent not found (not a talent user)'
      });
    }

    const transformedTalent = {
      id: talent._id,
      name: talent.name,
      role: talent.userRole,
      category: talent.category,
      location: talent.location,
      experience: talent.experience,
      rating: 4.5,
      featured: false,
      verified: true,
      avatar: talent.profile_picture,
      skills: talent.skills || [],
      languages: talent.languages || [],
      availability: 'Available',
      bio: talent.bio,
      hasDisability: talent.hasDisability,
      disabilityType: talent.disabilityType,
      joinedDate: talent.createdAt,
      portfolio: {
        videos: [],
        images: [],
        documents: []
      }
    };

    res.json({
      success: true,
      data: transformedTalent
    });

  } catch (error) {
    console.error('Error fetching talent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch talent',
      error: error.message
    });
  }
};

// @desc    Get talent categories
// @route   GET /api/talents/categories
// @access  Public
const getTalentCategories = async (req, res) => {
  try {
    const categories = await User.distinct('category', { purpose: 'talent' });
    
    res.json({
      success: true,
      data: categories.filter(category => category) // Remove null/undefined values
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// @desc    Get talent locations
// @route   GET /api/talents/locations
// @access  Public
const getTalentLocations = async (req, res) => {
  try {
    const locations = await User.distinct('location', { purpose: 'talent' });
    
    res.json({
      success: true,
      data: locations.filter(location => location) // Remove null/undefined values
    });

  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch locations',
      error: error.message
    });
  }
};

// @desc    Debug - Get all users for debugging
// @route   GET /api/talents/debug/all
// @access  Public
const debugGetAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}).select('_id name email purpose userRole category location');
    
    console.log('All users in database:', allUsers);
    
    res.json({
      success: true,
      data: allUsers
    });

  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

module.exports = {
  getTalents,
  getTalentById,
  getTalentCategories,
  getTalentLocations,
  debugGetAllUsers
}; 