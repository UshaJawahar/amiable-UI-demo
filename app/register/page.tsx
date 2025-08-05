'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Users, 
  User, 
  Building, 
  FileText, 
  Upload,
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Heart,
  Shield,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import SocialMediaEmbed from '../components/SocialMediaEmbed'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'

// Form schemas
const baseSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
})

const talentSchema = baseSchema.extend({
  purpose: z.literal('talent'),
  role: z.enum(['production', 'acting'], { required_error: 'Please select a role type' }),
  category: z.string().min(1, 'Please select a category'),
  experience: z.string().min(1, 'Please select your experience level'),
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
  languages: z.array(z.string()).min(1, 'Please add at least one language'),
  location: z.string().min(1, 'Please enter your location'),
  hasDisability: z.boolean(),
  disabilityType: z.string().optional(),
  disabilityCertificate: z.any().optional(),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  socialMediaReels: z.array(z.object({
    id: z.string(),
    platform: z.enum(['instagram', 'facebook', 'youtube']),
    url: z.string().url(),
    title: z.string(),
    description: z.string().optional(),
  })).optional(),
})

const professionalSchema = baseSchema.extend({
  purpose: z.literal('professional'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  companyType: z.enum(['film_studio', 'ott_platform', 'casting_agency', 'production_house', 'other'], { 
    required_error: 'Please select company type' 
  }),
  jobTitle: z.string().min(2, 'Job title must be at least 2 characters'),
  industry: z.string().min(1, 'Please select your industry'),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+'], { 
    required_error: 'Please select company size' 
  }),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  hiringNeeds: z.array(z.string()).min(1, 'Please select at least one hiring need'),
  projectTypes: z.array(z.string()).min(1, 'Please select at least one project type'),
})

type TalentFormData = z.infer<typeof talentSchema>
type ProfessionalFormData = z.infer<typeof professionalSchema>

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [purpose, setPurpose] = useState<'talent' | 'professional' | null>(null)
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [hasDisability, setHasDisability] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{
    certificate?: File
  }>({})

  const talentForm = useForm<TalentFormData>({
    resolver: zodResolver(talentSchema),
    defaultValues: {
      purpose: 'talent',
      role: undefined,
      category: '',
      experience: '',
      skills: [],
      languages: [],
      location: '',
      hasDisability: false,
      bio: '',
      socialMediaReels: [],
    },
  })

  const professionalForm = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      purpose: 'professional',
      companyName: '',
      companyType: undefined,
      jobTitle: '',
      industry: '',
      companySize: undefined,
      website: '',
      hiringNeeds: [],
      projectTypes: [],
    },
  })

  const currentForm = purpose === 'talent' ? talentForm : professionalForm

  const handlePurposeSelection = (selectedPurpose: 'talent' | 'professional') => {
    setPurpose(selectedPurpose)
    setStep(2)
    
    // Set the purpose field in the appropriate form
    if (selectedPurpose === 'talent') {
      talentForm.setValue('purpose', 'talent')
    } else {
      professionalForm.setValue('purpose', 'professional')
    }
  }

  const handleFileUpload = (field: 'certificate', files: FileList | null) => {
    if (!files) return

    if (field === 'certificate') {
      setUploadedFiles(prev => ({ ...prev, certificate: files[0] }))
      talentForm.setValue('disabilityCertificate', files[0])
    }
  }

  const onSubmit = async (data: TalentFormData | ProfessionalFormData) => {
    try {
      // Prepare registration data
      const registrationData = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        purpose: data.purpose,
        ...(data.purpose === 'talent' && {
          userRole: data.role,
          category: data.category,
          languages: data.languages,
          hasDisability: data.hasDisability,
          disabilityType: data.disabilityType,
          bio: data.bio,
          socialMediaReels: data.socialMediaReels || [],
        }),
        ...(data.purpose === 'professional' && {
          companyName: data.companyName,
          companyType: data.companyType,
          jobTitle: data.jobTitle,
          industry: data.industry,
          companySize: data.companySize,
          website: data.website,
          hiringNeeds: data.hiringNeeds,
          projectTypes: data.projectTypes,
        }),
      }
      
      const success = await register(registrationData)
      
      if (success) {
        // Reset forms and redirect
        talentForm.reset()
        professionalForm.reset()
        setPurpose(null)
        setStep(1)
        setUploadedFiles({})
        router.push('/')
      }
      
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
    }
  }

  const renderPurposeSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Join Our Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose your purpose and start connecting with opportunities in the inclusive media industry
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Talent Option */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="card-hover cursor-pointer"
          onClick={() => handlePurposeSelection('talent')}
        >
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              I'm a Talent
            </h3>
            <p className="text-gray-600 mb-6">
              I want to showcase my skills and connect with opportunities in film, television, and OTT industries.
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                Create professional portfolio
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                Choose between Production or Acting roles
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                Get discovered by industry professionals
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                Access exclusive opportunities
              </div>
            </div>
          </div>
        </motion.div>

        {/* Professional Option */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="card-hover cursor-pointer"
          onClick={() => handlePurposeSelection('professional')}
        >
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-gradient-to-r from-accent-500 to-warning-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              I'm Hiring Talent
            </h3>
            <p className="text-gray-600 mb-6">
              I represent a company looking to hire diverse talent for inclusive projects and opportunities.
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                Access verified talent pool
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                Filter by skills and experience
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                Connect directly with candidates
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                Support inclusive hiring goals
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

  const renderTalentForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <button
          onClick={() => setStep(1)}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Purpose Selection
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Talent Registration</h2>
        <p className="text-gray-600">Create your professional profile and showcase your skills</p>
      </div>

      <form onSubmit={talentForm.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                {...talentForm.register('firstName')}
                className="input-field"
                placeholder="Enter your first name"
              />
              {talentForm.formState.errors.firstName && (
                <p className="text-error-600 text-sm mt-1">{talentForm.formState.errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                {...talentForm.register('lastName')}
                className="input-field"
                placeholder="Enter your last name"
              />
              {talentForm.formState.errors.lastName && (
                <p className="text-error-600 text-sm mt-1">{talentForm.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                {...talentForm.register('email')}
                className="input-field"
                placeholder="Enter your email"
              />
              {talentForm.formState.errors.email && (
                <p className="text-error-600 text-sm mt-1">{talentForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                {...talentForm.register('phone')}
                className="input-field"
                placeholder="Enter your phone number"
              />
              {talentForm.formState.errors.phone && (
                <p className="text-error-600 text-sm mt-1">{talentForm.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...talentForm.register('password')}
                  className="input-field pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {talentForm.formState.errors.password && (
                <p className="text-error-600 text-sm mt-1">{talentForm.formState.errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...talentForm.register('confirmPassword')}
                  className="input-field pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {talentForm.formState.errors.confirmPassword && (
                <p className="text-error-600 text-sm mt-1">{talentForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role Type</label>
              <select
                {...talentForm.register('role')}
                className="input-field"
              >
                <option value="">Select role type</option>
                <option value="production">Production (Behind-the-scenes)</option>
                <option value="acting">Acting (On-screen)</option>
              </select>
              {talentForm.formState.errors.role && (
                <p className="text-error-600 text-sm mt-1">{talentForm.formState.errors.role.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                {...talentForm.register('category')}
                className="input-field"
              >
                <option value="">Select category</option>
                {talentForm.watch('role') === 'production' && (
                  <>
                    <option value="Lighting">Lighting</option>
                    <option value="Sound Design">Sound Design</option>
                    <option value="Camera Operation">Camera Operation</option>
                    <option value="Set Design">Set Design</option>
                    <option value="Costume Design">Costume Design</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Editing">Editing</option>
                  </>
                )}
                {talentForm.watch('role') === 'acting' && (
                  <>
                    <option value="Drama">Drama</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Voice Acting">Voice Acting</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Theater">Theater</option>
                    <option value="Film">Film</option>
                    <option value="Television">Television</option>
                  </>
                )}
              </select>
              {talentForm.formState.errors.category && (
                <p className="text-error-600 text-sm mt-1">{talentForm.formState.errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
              <select
                {...talentForm.register('experience')}
                className="input-field"
              >
                <option value="">Select experience level</option>
                <option value="0-1 years">0-1 years</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
              {talentForm.formState.errors.experience && (
                <p className="text-error-600 text-sm mt-1">{talentForm.formState.errors.experience.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                {...talentForm.register('location')}
                className="input-field"
                placeholder="City, State/Country"
              />
              {talentForm.formState.errors.location && (
                <p className="text-error-600 text-sm mt-1">{talentForm.formState.errors.location.message}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
            <input
              type="text"
              className="input-field"
              placeholder="Add skills (comma separated)"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault()
                  const value = e.currentTarget.value.trim()
                  if (value) {
                    const currentSkills = talentForm.watch('skills') || []
                    talentForm.setValue('skills', [...currentSkills, value])
                    e.currentTarget.value = ''
                  }
                }
              }}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {talentForm.watch('skills')?.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-100 text-primary-700 text-sm rounded-full flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => {
                      const currentSkills = talentForm.watch('skills') || []
                      talentForm.setValue('skills', currentSkills.filter((_, i) => i !== index))
                    }}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {talentForm.formState.errors.skills && (
              <p className="text-error-600 text-sm mt-1">{talentForm.formState.errors.skills.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
            <input
              type="text"
              className="input-field"
              placeholder="Add languages (comma separated)"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault()
                  const value = e.currentTarget.value.trim()
                  if (value) {
                    const currentLanguages = talentForm.watch('languages') || []
                    talentForm.setValue('languages', [...currentLanguages, value])
                    e.currentTarget.value = ''
                  }
                }
              }}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {talentForm.watch('languages')?.map((language, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary-100 text-secondary-700 text-sm rounded-full flex items-center"
                >
                  {language}
                  <button
                    type="button"
                    onClick={() => {
                      const currentLanguages = talentForm.watch('languages') || []
                      talentForm.setValue('languages', currentLanguages.filter((_, i) => i !== index))
                    }}
                    className="ml-2 text-secondary-600 hover:text-secondary-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {talentForm.formState.errors.languages && (
              <p className="text-error-600 text-sm mt-1">{talentForm.formState.errors.languages.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              {...talentForm.register('bio')}
              className="input-field"
              rows={4}
              placeholder="Tell us about yourself, your experience, and what makes you unique..."
            />
            {talentForm.formState.errors.bio && (
              <p className="text-error-600 text-sm mt-1">{talentForm.formState.errors.bio.message}</p>
            )}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Media Links (Optional)</h3>
          <p className="text-gray-600 mb-4">
            Add links to your social media profiles and reels to showcase your work
          </p>
          
          <SocialMediaEmbed
            reels={talentForm.watch('socialMediaReels') || []}
            onReelsChange={(reels) => talentForm.setValue('socialMediaReels', reels)}
            isEditable={true}
            maxReels={5}
          />
        </div>

        {/* Disability Information */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Accessibility Information</h3>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={hasDisability}
                onChange={(e) => {
                  setHasDisability(e.target.checked)
                  talentForm.setValue('hasDisability', e.target.checked)
                }}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                I identify as a person with a disability
              </span>
            </label>
          </div>

          {hasDisability && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Disability (Optional)
                </label>
                <input
                  type="text"
                  {...talentForm.register('disabilityType')}
                  className="input-field"
                  placeholder="e.g., Visual impairment, Hearing impairment, Mobility, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disability Certificate (Required for verification)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload your disability certificate or medical documentation
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('certificate', e.target.files)}
                    className="hidden"
                    id="certificate-upload"
                  />
                  <label
                    htmlFor="certificate-upload"
                    className="btn-secondary cursor-pointer inline-flex"
                  >
                    Choose File
                  </label>
                </div>
                {uploadedFiles.certificate && (
                  <div className="mt-2 flex items-center text-sm text-success-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {uploadedFiles.certificate.name}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>



        {/* Terms and Submit */}
        <div className="card">
          <div className="mb-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                {...talentForm.register('agreeToTerms')}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
              />
              <span className="ml-2 text-sm text-gray-700">
                I agree to the{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {talentForm.formState.errors.agreeToTerms && (
              <p className="text-error-600 text-sm mt-1">{talentForm.formState.errors.agreeToTerms.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={talentForm.formState.isSubmitting}
            className="w-full btn-primary"
          >
            {talentForm.formState.isSubmitting ? (
              <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )

  const renderProfessionalForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <button
          onClick={() => setStep(1)}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Purpose Selection
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Professional Registration</h2>
        <p className="text-gray-600">Connect with talented individuals for your inclusive projects</p>
      </div>

      <form onSubmit={professionalForm.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                {...professionalForm.register('firstName')}
                className="input-field"
                placeholder="Enter your first name"
              />
              {professionalForm.formState.errors.firstName && (
                <p className="text-error-600 text-sm mt-1">{professionalForm.formState.errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                {...professionalForm.register('lastName')}
                className="input-field"
                placeholder="Enter your last name"
              />
              {professionalForm.formState.errors.lastName && (
                <p className="text-error-600 text-sm mt-1">{professionalForm.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                {...professionalForm.register('email')}
                className="input-field"
                placeholder="Enter your work email"
              />
              {professionalForm.formState.errors.email && (
                <p className="text-error-600 text-sm mt-1">{professionalForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                {...professionalForm.register('phone')}
                className="input-field"
                placeholder="Enter your phone number"
              />
              {professionalForm.formState.errors.phone && (
                <p className="text-error-600 text-sm mt-1">{professionalForm.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...professionalForm.register('password')}
                  className="input-field pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {professionalForm.formState.errors.password && (
                <p className="text-error-600 text-sm mt-1">{professionalForm.formState.errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...professionalForm.register('confirmPassword')}
                  className="input-field pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {professionalForm.formState.errors.confirmPassword && (
                <p className="text-error-600 text-sm mt-1">{professionalForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                {...professionalForm.register('companyName')}
                className="input-field"
                placeholder="Enter company name"
              />
              {professionalForm.formState.errors.companyName && (
                <p className="text-error-600 text-sm mt-1">{professionalForm.formState.errors.companyName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
              <input
                type="text"
                {...professionalForm.register('jobTitle')}
                className="input-field"
                placeholder="e.g., Casting Director, Producer"
              />
              {professionalForm.formState.errors.jobTitle && (
                <p className="text-error-600 text-sm mt-1">{professionalForm.formState.errors.jobTitle.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Type</label>
              <select
                {...professionalForm.register('companyType')}
                className="input-field"
              >
                <option value="">Select company type</option>
                <option value="film_studio">Film Studio</option>
                <option value="ott_platform">OTT Platform</option>
                <option value="casting_agency">Casting Agency</option>
                <option value="production_house">Production House</option>
                <option value="other">Other</option>
              </select>
              {professionalForm.formState.errors.companyType && (
                <p className="text-error-600 text-sm mt-1">{professionalForm.formState.errors.companyType.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
              <select
                {...professionalForm.register('companySize')}
                className="input-field"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-1000">201-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
              {professionalForm.formState.errors.companySize && (
                <p className="text-error-600 text-sm mt-1">{professionalForm.formState.errors.companySize.message}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              {...professionalForm.register('industry')}
              className="input-field"
            >
              <option value="">Select industry</option>
              <option value="Film">Film</option>
              <option value="Television">Television</option>
              <option value="Streaming">Streaming/OTT</option>
              <option value="Commercial">Commercial</option>
              <option value="Theater">Theater</option>
              <option value="Documentary">Documentary</option>
              <option value="Animation">Animation</option>
              <option value="Other">Other</option>
            </select>
            {professionalForm.formState.errors.industry && (
              <p className="text-error-600 text-sm mt-1">{professionalForm.formState.errors.industry.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Website (Optional)</label>
            <input
              type="url"
              {...professionalForm.register('website')}
              className="input-field"
              placeholder="https://www.yourcompany.com"
            />
            {professionalForm.formState.errors.website && (
              <p className="text-error-600 text-sm mt-1">{professionalForm.formState.errors.website.message}</p>
            )}
          </div>
        </div>

        {/* Hiring Needs */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Hiring Needs</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">What type of talent are you looking for?</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Actors/Performers',
                'Voice Actors',
                'Production Crew',
                'Technical Specialists',
                'Creative Directors',
                'Writers',
                'Musicians',
                'Dancers',
                'Stunt Performers',
                'Other'
              ].map((need) => (
                <label key={need} className="flex items-center">
                  <input
                    type="checkbox"
                    value={need}
                    onChange={(e) => {
                      const currentNeeds = professionalForm.watch('hiringNeeds') || []
                      if (e.target.checked) {
                        professionalForm.setValue('hiringNeeds', [...currentNeeds, need])
                      } else {
                        professionalForm.setValue('hiringNeeds', currentNeeds.filter(n => n !== need))
                      }
                    }}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{need}</span>
                </label>
              ))}
            </div>
            {professionalForm.formState.errors.hiringNeeds && (
              <p className="text-error-600 text-sm mt-1">{professionalForm.formState.errors.hiringNeeds.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Types</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Feature Films',
                'TV Series',
                'Commercials',
                'Documentaries',
                'Short Films',
                'Web Series',
                'Theater Productions',
                'Voice Over',
                'Music Videos',
                'Corporate Videos'
              ].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    value={type}
                    onChange={(e) => {
                      const currentTypes = professionalForm.watch('projectTypes') || []
                      if (e.target.checked) {
                        professionalForm.setValue('projectTypes', [...currentTypes, type])
                      } else {
                        professionalForm.setValue('projectTypes', currentTypes.filter(t => t !== type))
                      }
                    }}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
            {professionalForm.formState.errors.projectTypes && (
              <p className="text-error-600 text-sm mt-1">{professionalForm.formState.errors.projectTypes.message}</p>
            )}
          </div>
        </div>

        {/* Terms and Submit */}
        <div className="card">
          <div className="mb-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                {...professionalForm.register('agreeToTerms')}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
              />
              <span className="ml-2 text-sm text-gray-700">
                I agree to the{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {professionalForm.formState.errors.agreeToTerms && (
              <p className="text-error-600 text-sm mt-1">{professionalForm.formState.errors.agreeToTerms.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={professionalForm.formState.isSubmitting}
            className="w-full btn-primary"
          >
            {professionalForm.formState.isSubmitting ? (
              <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="section-padding">
        <AnimatePresence mode="wait">
          {step === 1 && renderPurposeSelection()}
          {step === 2 && purpose === 'talent' && renderTalentForm()}
          {step === 2 && purpose === 'professional' && renderProfessionalForm()}
        </AnimatePresence>
      </div>
    </div>
  )
} 