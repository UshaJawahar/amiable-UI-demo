'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  DollarSign,
  FileText,
  Send,
  X,
  Clock,
  User,
  Building,
  Star,
  Award,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react'

interface ContactForm {
  type: 'message' | 'invitation' | 'project' | 'audition'
  subject: string
  message: string
  projectDetails?: {
    title: string
    description: string
    startDate: string
    endDate: string
    location: string
    budget: {
      min: number
      max: number
      currency: string
    }
    requirements: string[]
  }
  auditionDetails?: {
    role: string
    date: string
    location: string
    preparation: string
    compensation: string
  }
  contactMethod: 'platform' | 'email' | 'phone'
  urgency: 'low' | 'medium' | 'high'
  attachments: File[]
}

interface TalentInfo {
  id: string
  name: string
  role: string
  category: string
  location: string
  rating: number
  verified: boolean
  featured: boolean
  contactInfo: {
    email: string
    phone?: string
    preferredContact: 'email' | 'phone' | 'platform'
  }
  stats: {
    responseRate: number
    avgResponseTime: string
  }
}

interface ContactTalentProps {
  talent: TalentInfo
  isOpen: boolean
  onClose: () => void
  onSend: (form: ContactForm) => Promise<void>
}

export default function ContactTalent({ 
  talent, 
  isOpen, 
  onClose, 
  onSend 
}: ContactTalentProps) {
  const [form, setForm] = useState<ContactForm>({
    type: 'message',
    subject: '',
    message: '',
    contactMethod: 'platform',
    urgency: 'medium',
    attachments: []
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showAuditionForm, setShowAuditionForm] = useState(false)
  const [newRequirement, setNewRequirement] = useState('')

  const handleFormChange = (key: keyof ContactForm, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleProjectChange = (key: keyof NonNullable<ContactForm['projectDetails']>, value: any) => {
    setForm(prev => ({
      ...prev,
      projectDetails: {
        ...prev.projectDetails!,
        [key]: value
      }
    }))
  }

  const handleAuditionChange = (key: keyof NonNullable<ContactForm['auditionDetails']>, value: any) => {
    setForm(prev => ({
      ...prev,
      auditionDetails: {
        ...prev.auditionDetails!,
        [key]: value
      }
    }))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files)
    setForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles]
    }))
  }

  const removeFile = (index: number) => {
    setForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const addRequirement = () => {
    if (newRequirement.trim() && form.projectDetails) {
      handleProjectChange('requirements', [...form.projectDetails.requirements, newRequirement.trim()])
      setNewRequirement('')
    }
  }

  const removeRequirement = (index: number) => {
    if (form.projectDetails) {
      handleProjectChange('requirements', form.projectDetails.requirements.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSend(form)
      onClose()
      setForm({
        type: 'message',
        subject: '',
        message: '',
        contactMethod: 'platform',
        urgency: 'medium',
        attachments: []
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getContactMethodIcon = (method: string) => {
    switch (method) {
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'phone':
        return <Phone className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                  {talent.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Contact {talent.name}</h2>
                  <p className="text-sm text-gray-600">{talent.role} • {talent.category}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Talent Stats */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(talent.rating) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{talent.rating} Rating</p>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {talent.stats.responseRate}%
                  </div>
                  <p className="text-sm text-gray-600">Response Rate</p>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {talent.stats.avgResponseTime}
                  </div>
                  <p className="text-sm text-gray-600">Avg Response</p>
                </div>
                <div>
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">{talent.location}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Contact Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Contact Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'message', label: 'Message', icon: MessageCircle },
                    { value: 'invitation', label: 'Invitation', icon: Calendar },
                    { value: 'project', label: 'Project', icon: FileText },
                    { value: 'audition', label: 'Audition', icon: Award }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleFormChange('type', value)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        form.type === value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => handleFormChange('subject', e.target.value)}
                  placeholder="Enter subject..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              {/* Project Details */}
              {form.type === 'project' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <h4 className="font-medium text-blue-900">Project Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={form.projectDetails?.title || ''}
                        onChange={(e) => handleProjectChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={form.projectDetails?.location || ''}
                        onChange={(e) => handleProjectChange('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={form.projectDetails?.description || ''}
                      onChange={(e) => handleProjectChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={form.projectDetails?.startDate || ''}
                        onChange={(e) => handleProjectChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={form.projectDetails?.endDate || ''}
                        onChange={(e) => handleProjectChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={form.projectDetails?.budget.min || ''}
                        onChange={(e) => handleProjectChange('budget', { 
                          ...form.projectDetails?.budget, 
                          min: parseInt(e.target.value) || 0 
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <span className="text-gray-500 self-center">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={form.projectDetails?.budget.max || ''}
                        onChange={(e) => handleProjectChange('budget', { 
                          ...form.projectDetails?.budget, 
                          max: parseInt(e.target.value) || 0 
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <select
                        value={form.projectDetails?.budget.currency || 'USD'}
                        onChange={(e) => handleProjectChange('budget', { 
                          ...form.projectDetails?.budget, 
                          currency: e.target.value 
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        placeholder="Add requirement..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button
                        type="button"
                        onClick={addRequirement}
                        className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.projectDetails?.requirements.map((req, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                        >
                          {req}
                          <button
                            type="button"
                            onClick={() => removeRequirement(index)}
                            className="ml-1 text-primary-500 hover:text-primary-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Audition Details */}
              {form.type === 'audition' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 p-4 bg-purple-50 border border-purple-200 rounded-lg"
                >
                  <h4 className="font-medium text-purple-900">Audition Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={form.auditionDetails?.role || ''}
                        onChange={(e) => handleAuditionChange('role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="datetime-local"
                        value={form.auditionDetails?.date || ''}
                        onChange={(e) => handleAuditionChange('date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={form.auditionDetails?.location || ''}
                      onChange={(e) => handleAuditionChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preparation Required
                    </label>
                    <textarea
                      value={form.auditionDetails?.preparation || ''}
                      onChange={(e) => handleAuditionChange('preparation', e.target.value)}
                      rows={3}
                      placeholder="Describe what the talent should prepare..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compensation
                    </label>
                    <input
                      type="text"
                      value={form.auditionDetails?.compensation || ''}
                      onChange={(e) => handleAuditionChange('compensation', e.target.value)}
                      placeholder="e.g., $100, Travel expenses covered, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </motion.div>
              )}

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => handleFormChange('message', e.target.value)}
                  rows={6}
                  placeholder="Write your message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              {/* Contact Method & Urgency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Method
                  </label>
                  <select
                    value={form.contactMethod}
                    onChange={(e) => handleFormChange('contactMethod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="platform">Platform Message</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency
                  </label>
                  <select
                    value={form.urgency}
                    onChange={(e) => handleFormChange('urgency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {form.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {form.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 