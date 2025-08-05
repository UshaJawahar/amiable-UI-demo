'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Mail,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  Briefcase,
  Star
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Application {
  _id: string
  name: string
  email: string
  purpose: 'talent' | 'professional'
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  // Talent fields
  userRole?: string
  category?: string
  experience?: string
  skills?: string[]
  languages?: string[]
  location?: string
  hasDisability?: boolean
  disabilityType?: string
  bio?: string
  // Professional fields
  companyName?: string
  companyType?: string
  jobTitle?: string
  industry?: string
  companySize?: string
  website?: string
  hiringNeeds?: string[]
  projectTypes?: string[]
}

interface Stats {
  total: number
  pending: number
  approved: number
  rejected: number
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null)
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
    fetchStats()
  }, [])

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:5000/api/admin/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setApplications(data.applications)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error('Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:5000/api/admin/applications/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleApprove = async (applicationId: string) => {
    setProcessingAction(applicationId)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/admin/applications/${applicationId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('Application approved successfully!')
        fetchApplications()
        fetchStats()
      } else {
        toast.error(data.message || 'Failed to approve application')
      }
    } catch (error) {
      console.error('Error approving application:', error)
      toast.error('Failed to approve application')
    } finally {
      setProcessingAction(null)
    }
  }

  const handleReject = async (applicationId: string, email: string) => {
    setProcessingAction(applicationId)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/admin/applications/${applicationId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('Application rejected and email sent!')
        fetchApplications()
        fetchStats()
      } else {
        toast.error(data.message || 'Failed to reject application')
      }
    } catch (error) {
      console.error('Error rejecting application:', error)
      toast.error('Failed to reject application')
    } finally {
      setProcessingAction(null)
    }
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleExpanded = (applicationId: string) => {
    setExpandedApplication(expandedApplication === applicationId ? null : applicationId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning-100 text-warning-800'
      case 'approved': return 'bg-success-100 text-success-800'
      case 'rejected': return 'bg-error-100 text-error-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Review and manage user applications</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-white"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-white"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-white"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-white"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-error-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="card bg-white mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="input-field"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card bg-white text-center py-12"
              >
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600">No applications match your current filters.</p>
              </motion.div>
            ) : (
              filteredApplications.map((application, index) => (
                <motion.div
                  key={application._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{application.name}</h3>
                        <p className="text-gray-600">{application.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span className="capitalize">{application.status}</span>
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleExpanded(application._id)}
                        className="btn-secondary"
                      >
                        {expandedApplication === application._id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        Details
                      </button>
                      
                      {application.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(application._id)}
                            disabled={processingAction === application._id}
                            className="btn-success"
                          >
                            {processingAction === application._id ? (
                              <div className="loading-dots">
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                            ) : (
                              'Approve'
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(application._id, application.email)}
                            disabled={processingAction === application._id}
                            className="btn-error"
                          >
                            {processingAction === application._id ? (
                              <div className="loading-dots">
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                            ) : (
                              'Reject'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedApplication === application._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-gray-200"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Basic Information */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
                            <div className="space-y-3">
                              <div>
                                <span className="text-sm font-medium text-gray-600">Purpose:</span>
                                <span className="ml-2 text-sm text-gray-900 capitalize">{application.purpose}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-600">Applied:</span>
                                <span className="ml-2 text-sm text-gray-900">
                                  {new Date(application.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Talent-specific Information */}
                          {application.purpose === 'talent' && (
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">Talent Details</h4>
                              <div className="space-y-3">
                                {application.userRole && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Role:</span>
                                    <span className="ml-2 text-sm text-gray-900 capitalize">{application.userRole}</span>
                                  </div>
                                )}
                                {application.category && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Category:</span>
                                    <span className="ml-2 text-sm text-gray-900">{application.category}</span>
                                  </div>
                                )}
                                {application.experience && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Experience:</span>
                                    <span className="ml-2 text-sm text-gray-900">{application.experience}</span>
                                  </div>
                                )}
                                {application.location && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Location:</span>
                                    <span className="ml-2 text-sm text-gray-900">{application.location}</span>
                                  </div>
                                )}
                                {application.skills && application.skills.length > 0 && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Skills:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {application.skills.map((skill, index) => (
                                        <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {application.languages && application.languages.length > 0 && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Languages:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {application.languages.map((language, index) => (
                                        <span key={index} className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full">
                                          {language}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {application.bio && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Bio:</span>
                                    <p className="text-sm text-gray-900 mt-1">{application.bio}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Professional-specific Information */}
                          {application.purpose === 'professional' && (
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h4>
                              <div className="space-y-3">
                                {application.companyName && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Company:</span>
                                    <span className="ml-2 text-sm text-gray-900">{application.companyName}</span>
                                  </div>
                                )}
                                {application.jobTitle && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Job Title:</span>
                                    <span className="ml-2 text-sm text-gray-900">{application.jobTitle}</span>
                                  </div>
                                )}
                                {application.companyType && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Company Type:</span>
                                    <span className="ml-2 text-sm text-gray-900 capitalize">{application.companyType.replace('_', ' ')}</span>
                                  </div>
                                )}
                                {application.industry && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Industry:</span>
                                    <span className="ml-2 text-sm text-gray-900">{application.industry}</span>
                                  </div>
                                )}
                                {application.companySize && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Company Size:</span>
                                    <span className="ml-2 text-sm text-gray-900">{application.companySize}</span>
                                  </div>
                                )}
                                {application.hiringNeeds && application.hiringNeeds.length > 0 && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Hiring Needs:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {application.hiringNeeds.map((need, index) => (
                                        <span key={index} className="px-2 py-1 bg-warning-100 text-warning-700 text-xs rounded-full">
                                          {need}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {application.projectTypes && application.projectTypes.length > 0 && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Project Types:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {application.projectTypes.map((type, index) => (
                                        <span key={index} className="px-2 py-1 bg-info-100 text-info-700 text-xs rounded-full">
                                          {type}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 