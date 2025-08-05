const Application = require('../models/Application');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Helper function to check database connection
const isDBConnected = () => {
  return Application.db.readyState === 1;
};

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private (Admin only)
const getApplications = async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please try again later.'
      });
    }

    const applications = await Application.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single application
// @route   GET /api/admin/applications/:id
// @access  Private (Admin only)
const getApplication = async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please try again later.'
      });
    }

    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Approve application
// @route   PUT /api/admin/applications/:id/approve
// @access  Private (Admin only)
const approveApplication = async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please try again later.'
      });
    }

    const application = await Application.findById(req.params.id).select('+password');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Application has already been processed'
      });
    }

    // Create user from application data
    const userData = {
      name: application.name,
      email: application.email,
      password: application.password,
      phone: application.phone,
      purpose: application.purpose,
      profileImage: application.profileImage,
      profile_picture: application.profile_picture,
      // Talent-specific fields
      ...(application.purpose === 'talent' && {
        userRole: application.userRole,
        category: application.category,
        experience: application.experience,
        skills: application.skills,
        languages: application.languages,
        location: application.location,
        hasDisability: application.hasDisability,
        disabilityType: application.disabilityType,
        bio: application.bio,
        socialMediaReels: application.socialMediaReels,
      }),
      // Professional-specific fields
      ...(application.purpose === 'professional' && {
        companyName: application.companyName,
        companyType: application.companyType,
        jobTitle: application.jobTitle,
        industry: application.industry,
        companySize: application.companySize,
        website: application.website,
        hiringNeeds: application.hiringNeeds,
        projectTypes: application.projectTypes,
      })
    };

    const user = await User.create(userData);

    // Update application status
    application.status = 'approved';
    application.reviewedBy = req.admin._id;
    application.reviewedAt = new Date();
    await application.save();

    // Send acceptance email
    try {
      const { sendEmail } = require('../config/email');
      
      const emailResult = await sendEmail({
        to: application.email,
        subject: 'AmiAble Application Accepted - Welcome!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">AmiAble</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Empowering Talent</p>
            </div>
            
            <div style="padding: 30px; background: white;">
              <h2 style="color: #333; margin-bottom: 20px;">🎉 Congratulations! Your Application Has Been Accepted</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Dear ${application.name},
              </p>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                We are thrilled to inform you that your application to join AmiAble has been <strong>accepted</strong>! 
                Welcome to our community of talented individuals and professionals.
              </p>
              
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
                <p style="color: #0c4a6e; line-height: 1.6; margin: 0;">
                  <strong>What happens next?</strong><br>
                  • You can now log in to your account<br>
                  • Complete your profile and portfolio<br>
                  • Start connecting with opportunities<br>
                  • Explore projects and casting calls
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Your account has been created and you can now access all the features of our platform. 
                We look forward to seeing your talent shine in the media industry!
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/login" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Login to Your Account
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Best regards,<br>
                <strong>The AmiAble Team</strong>
              </p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
              <p style="margin: 0; font-size: 14px;">
                © 2024 AmiAble. All rights reserved.
              </p>
            </div>
          </div>
        `
      });

      if (emailResult.success) {
        console.log('Acceptance email sent successfully to:', application.email);
      } else {
        console.error('Failed to send acceptance email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Error sending acceptance email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Application approved successfully and notification sent',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        purpose: user.purpose
      }
    });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reject application
// @route   PUT /api/admin/applications/:id/reject
// @access  Private (Admin only)
const rejectApplication = async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please try again later.'
      });
    }

    const application = await Application.findById(req.params.id).select('+password');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Application has already been processed'
      });
    }

    // Update application status
    application.status = 'rejected';
    application.reviewedBy = req.admin._id;
    application.reviewedAt = new Date();
    await application.save();

    // Send rejection email
    try {
      const { sendEmail } = require('../config/email');
      
             const emailResult = await sendEmail({
         to: application.email,
         subject: 'AmiAble Application Status - Update',
         html: `
           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
             <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
               <h1 style="margin: 0; font-size: 28px;">AmiAble</h1>
               <p style="margin: 10px 0 0 0; opacity: 0.9;">Empowering Talent</p>
             </div>
             
             <div style="padding: 30px; background: white;">
               <h2 style="color: #333; margin-bottom: 20px;">Application Status Update</h2>
               
               <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                 Dear ${application.name},
               </p>
               
               <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                 Thank you for your interest in joining AmiAble. After careful consideration of your application, 
                 we regret to inform you that <strong>your application has been rejected</strong> at this time.
               </p>
               
               <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                 <p style="color: #7f1d1d; line-height: 1.6; margin: 0;">
                   <strong>What happens next?</strong><br>
                   • You can reapply after 30 days<br>
                   • Keep updated with our platform<br>
                   • Visit AmiAble for future opportunities<br>
                   • Consider improving your application for next time
                 </p>
               </div>
               
               <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                 We encourage you to keep updated and visit AmiAble for future opportunities that may be a better fit. 
                 We appreciate your interest in our platform.
               </p>
               
               <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                 Best regards,<br>
                 <strong>The AmiAble Team</strong>
               </p>
             </div>
             
             <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
               <p style="margin: 0; font-size: 14px;">
                 © 2024 AmiAble. All rights reserved.
               </p>
             </div>
           </div>
         `
       });

      if (emailResult.success) {
        console.log('Rejection email sent successfully to:', application.email);
      } else {
        console.error('Failed to send rejection email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Application rejected and notification sent'
    });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get application statistics
// @route   GET /api/admin/applications/stats
// @access  Private (Admin only)
const getApplicationStats = async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please try again later.'
      });
    }

    const total = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: 'pending' });
    const approved = await Application.countDocuments({ status: 'approved' });
    const rejected = await Application.countDocuments({ status: 'rejected' });

    res.json({
      success: true,
      stats: {
        total,
        pending,
        approved,
        rejected
      }
    });
  } catch (error) {
    console.error('Error fetching application stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getApplications,
  getApplication,
  approveApplication,
  rejectApplication,
  getApplicationStats
}; 