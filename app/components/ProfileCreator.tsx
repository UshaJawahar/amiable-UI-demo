'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Camera, 
  Mic, 
  Music, 
  Film, 
  Plus, 
  X, 
  Tag, 
  Upload, 
  Edit,
  Save,
  Globe,
  MapPin,
  Calendar,
  Award,
  CheckCircle,
  AlertCircle,
  Star,
  Heart,
  MessageCircle,
  ExternalLink
} from 'lucide-react'
import SocialMediaEmbed from './SocialMediaEmbed'

interface ProfileTag {
  id: string
  name: string
  category: 'skill' | 'genre' | 'language' | 'specialty' | 'award'
  color: string
}

interface ProfileSection {
  id: string
  title: string
  content: string
  type: 'text' | 'list' | 'media'
  order: number
}

interface ProfileCreatorProps {
  onSave: (profile: any) => Promise<void>
  initialData?: any
  isEditing?: boolean
}

export default function ProfileCreator({ 
  onSave, 
  initialData, 
  isEditing = false 
}: ProfileCreatorProps) {
  const [activeStep, setActiveStep] = useState(1)
  const [profile, setProfile] = useState({
    basicInfo: {
      name: initialData?.name || '',
      headline: initialData?.headline || '',
      bio: initialData?.bio || '',
      location: initialData?.location || '',
      experience: initialData?.experience || '',
      hourlyRate: initialData?.hourlyRate || '',
      availability: initialData?.availability || 'Available'
    },
    tags: initialData?.tags || [],
    sections: initialData?.sections || [],
    socialMediaReels: initialData?.socialMediaReels || []
  })

  const [newTag, setNewTag] = useState({ name: '', category: 'skill' as const })
  const [newSection, setNewSection] = useState({ title: '', content: '', type: 'text' as const })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tagCategories = [
    { value: 'skill', label: 'Skills', icon: Star, color: 'bg-blue-100 text-blue-700' },
    { value: 'genre', label: 'Genres', icon: Film, color: 'bg-purple-100 text-purple-700' },
    { value: 'language', label: 'Languages', icon: Globe, color: 'bg-green-100 text-green-700' },
    { value: 'specialty', label: 'Specialties', icon: Award, color: 'bg-orange-100 text-orange-700' },
    { value: 'award', label: 'Awards', icon: CheckCircle, color: 'bg-yellow-100 text-yellow-700' }
  ]

  const commonTags = {
    skill: ['Method Acting', 'Voice Training', 'Stage Combat', 'LED Lighting', 'Color Theory', 'Audio Mixing', 'Foley', 'Cinematography', 'Video Editing', 'Script Writing'],
    genre: ['Drama', 'Comedy', 'Action', 'Romance', 'Horror', 'Sci-Fi', 'Documentary', 'Commercial', 'Theater', 'Musical'],
    language: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean'],
    specialty: ['Character Development', 'Accent Training', 'Physical Theater', 'Improv', 'Comedy Writing', 'Stunt Coordination', 'Makeup Effects', 'Sound Design'],
    award: ['Best Actor', 'Best Supporting Role', 'Outstanding Performance', 'Technical Achievement', 'Innovation Award']
  }

  const handleAddTag = () => {
    if (newTag.name.trim() && !profile.tags.find((t: ProfileTag) => t.name === newTag.name)) {
      const tag: ProfileTag = {
        id: Date.now().toString(),
        name: newTag.name,
        category: newTag.category,
        color: tagCategories.find(c => c.value === newTag.category)?.color || 'bg-gray-100 text-gray-700'
      }
      setProfile(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
      setNewTag({ name: '', category: 'skill' })
    }
  }

  const handleRemoveTag = (tagId: string) => {
    setProfile(prev => ({
      ...prev,
      tags: prev.tags.filter((t: ProfileTag) => t.id !== tagId)
    }))
  }

  const handleAddSection = () => {
    if (newSection.title.trim() && newSection.content.trim()) {
      const section: ProfileSection = {
        id: Date.now().toString(),
        title: newSection.title,
        content: newSection.content,
        type: newSection.type,
        order: profile.sections.length + 1
      }
      setProfile(prev => ({
        ...prev,
        sections: [...prev.sections, section]
      }))
      setNewSection({ title: '', content: '', type: 'text' })
    }
  }

  const handleRemoveSection = (sectionId: string) => {
    setProfile(prev => ({
      ...prev,
      sections: prev.sections.filter((s: ProfileSection) => s.id !== sectionId)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSave(profile)
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { id: 1, title: 'Basic Info', icon: User },
    { id: 2, title: 'Tags & Skills', icon: Tag },
    { id: 3, title: 'Social Media', icon: Globe },
    { id: 4, title: 'Review', icon: CheckCircle }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                activeStep >= step.id 
                  ? 'border-primary-500 bg-primary-500 text-white' 
                  : 'border-gray-300 text-gray-500'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  activeStep > step.id ? 'bg-primary-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step) => (
            <span
              key={step.id}
              className={`text-sm ${
                activeStep >= step.id ? 'text-primary-600 font-medium' : 'text-gray-500'
              }`}
            >
              {step.title}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Basic Info */}
        {activeStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={profile.basicInfo.name}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, name: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    value={profile.basicInfo.headline}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, headline: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Professional Actor & Voice Artist"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={profile.basicInfo.location}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, location: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="City, State"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={profile.basicInfo.experience}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, experience: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="5"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate (USD)
                  </label>
                  <input
                    type="number"
                    value={profile.basicInfo.hourlyRate}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, hourlyRate: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="50"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={profile.basicInfo.availability}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, availability: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Part-time">Part-time</option>
                    <option value="On-demand">On-demand</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio *
                </label>
                <textarea
                  value={profile.basicInfo.bio}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    basicInfo: { ...prev.basicInfo, bio: e.target.value }
                  }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tell us about your background, experience, and what makes you unique..."
                  required
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                disabled={activeStep === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Tags & Skills */}
        {activeStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tags & Skills</h2>
              
              {/* Add New Tag */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add Custom Tag</h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newTag.name}
                    onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter tag name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <select
                    value={newTag.category}
                    onChange={(e) => setNewTag(prev => ({ ...prev, category: e.target.value as any }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {tagCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Common Tags */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Tags</h3>
                {tagCategories.map(category => (
                  <div key={category.value} className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <category.icon className="w-4 h-4 mr-2" />
                      {category.label}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {commonTags[category.value as keyof typeof commonTags].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (!profile.tags.find((t: ProfileTag) => t.name === tag)) {
                              const newTag: ProfileTag = {
                                id: Date.now().toString(),
                                name: tag,
                                category: category.value as any,
                                color: category.color
                              }
                              setProfile(prev => ({
                                ...prev,
                                tags: [...prev.tags, newTag]
                              }))
                            }
                          }}
                          disabled={profile.tags.find((t: ProfileTag) => t.name === tag)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            profile.tags.find((t: ProfileTag) => t.name === tag)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : category.color + ' hover:opacity-80 cursor-pointer'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Tags */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Tags</h3>
                {profile.tags.length === 0 ? (
                  <p className="text-gray-500">No tags selected yet. Add some tags to showcase your skills and specialties.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.tags.map((tag: ProfileTag) => (
                      <span
                        key={tag.id}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${tag.color}`}
                      >
                        {tag.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag.id)}
                          className="ml-2 hover:opacity-70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Social Media */}
        {activeStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Social Media & Portfolio</h2>
              
              {/* Social Media Reels */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Reels & Videos</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add links to your social media reels, YouTube videos, or other online portfolio content to showcase your work.
                </p>
                <SocialMediaEmbed
                  reels={profile.socialMediaReels}
                  onReelsChange={(reels) => setProfile(prev => ({ ...prev, socialMediaReels: reels }))}
                  isEditable={true}
                  maxReels={5}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Review */}
        {activeStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Profile</h2>
              
              {/* Basic Info Review */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span> {profile.basicInfo.name}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Headline:</span> {profile.basicInfo.headline}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span> {profile.basicInfo.location}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Experience:</span> {profile.basicInfo.experience}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Hourly Rate:</span> {profile.basicInfo.hourlyRate}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Availability:</span> {profile.basicInfo.availability}
                  </div>
                </div>
                <div className="mt-4">
                  <span className="font-medium text-gray-700">Bio:</span>
                  <p className="text-sm text-gray-600 mt-1">{profile.basicInfo.bio}</p>
                </div>
              </div>

              {/* Tags Review */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tags & Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.tags.map((tag: ProfileTag) => (
                    <span
                      key={tag.id}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${tag.color}`}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Media Review */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media & Portfolio</h3>
                {profile.socialMediaReels.length > 0 ? (
                  <div className="space-y-2">
                    {profile.socialMediaReels.map((reel: any, index: number) => (
                      <div key={index} className="text-success-600">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        {reel.platform}: {reel.title}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No social media links added yet.</p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  )
} 