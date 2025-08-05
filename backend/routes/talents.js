const express = require('express');
const { 
  getTalents, 
  getTalentById, 
  getTalentCategories, 
  getTalentLocations,
  debugGetAllUsers
} = require('../controllers/talentController');

const router = express.Router();

// @desc    Get all talents with filters
// @route   GET /api/talents
// @access  Public
router.get('/', getTalents);

// @desc    Get talent categories
// @route   GET /api/talents/categories
// @access  Public
router.get('/categories', getTalentCategories);

// @desc    Get talent locations
// @route   GET /api/talents/locations
// @access  Public
router.get('/locations', getTalentLocations);

// @desc    Debug - Get all users
// @route   GET /api/talents/debug/all
// @access  Public
router.get('/debug/all', debugGetAllUsers);

// @desc    Get talent by ID
// @route   GET /api/talents/:id
// @access  Public
router.get('/:id', getTalentById);

module.exports = router; 