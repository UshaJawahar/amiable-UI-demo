'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  Download,
  Share2,
  MoreVertical,
  Building,
  Film,
  Mic,
  Camera,
  Music,
  Award,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  Image,
  Video,
  Globe,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Project {
  id: string
  title: string
  type: 'film' | 'tv' | 'commercial' | 'theater' | 'voice' | 'other'
  status: 'draft' | 'active' | 'casting' | 'in_production' | 'completed' | 'cancelled'
  description: string
  location: string
  budget: {
    min: number
    max: number
    currency: string
  }
  timeline: {
    startDate: Date
    endDate: Date
    castingDeadline: Date
  }
  requirements: {
    roles: {
      id: string
      title: string
      description: string
      type: 'acting' | 'production'
      category: string
      experience: string
      skills: string[]
      budget: {
        min: number
        max: number
      }
      filled: boolean
      applications: number
    }[]
    totalRoles: number
    filledRoles: number
  }
  company: {
    name: string
    logo: string
    verified: boolean
  }
  stats: {
    views: number
    applications: number
    shortlisted: number
    hired: number
  }
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface Application {
  id: string
  projectId: string
  roleId: string
  talentId: string
  talentName: string
  talentAvatar: string
  talentCategory: string
  status: 'pending' | 'shortlisted' | 'rejected' | 'hired'
  appliedAt: Date
  portfolio: {
    videos: string[]
    images: string[]
    documents: string[]
  }
  coverLetter: string
  rating: number
  verified: boolean
  hasDisability: boolean
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Project['status']>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | Project['type']>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'Netflix Drama Series - "Breaking Barriers"',
        type: 'tv',
        status: 'casting',
        description: 'A groundbreaking drama series exploring the lives of individuals who have disabilities in modern society. We\'re seeking authentic representation and diverse talent to bring these powerful stories to life.',
        location: 'Los Angeles, CA',
        budget: {
          min: 50000,
          max: 150000,
          currency: 'USD'
        },
        timeline: {
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-08-31'),
          castingDeadline: new Date('2024-02-15')
        },
        requirements: {
          roles: [
            {
              id: 'role-1',
              title: 'Lead Actress - Sarah Chen',
              description: 'Portraying a visually impaired lawyer fighting for disability rights',
              type: 'acting',
              category: 'Drama',
              experience: '3+ years',
              skills: ['Method Acting', 'Character Development', 'Legal Research'],
              budget: { min: 80000, max: 120000 },
              filled: false,
              applications: 12
            },
            {
              id: 'role-2',
              title: 'Supporting Actor - Marcus Johnson',
              description: 'Wheelchair-using activist and community leader',
              type: 'acting',
              category: 'Drama',
              experience: '2+ years',
              skills: ['Physical Acting', 'Activism Knowledge', 'Community Engagement'],
              budget: { min: 40000, max: 60000 },
              filled: false,
              applications: 8
            },
            {
              id: 'role-3',
              title: 'Lighting Director',
              description: 'Creating accessible lighting for diverse cast needs',
              type: 'production',
              category: 'Lighting',
              experience: '5+ years',
              skills: ['LED Lighting', 'Accessibility Design', 'Color Theory'],
              budget: { min: 60000, max: 90000 },
              filled: true,
              applications: 15
            }
          ],
          totalRoles: 3,
          filledRoles: 1
        },
        company: {
          name: 'Netflix Studios',
          logo: '/logos/netflix.png',
          verified: true
        },
        stats: {
          views: 1247,
          applications: 35,
          shortlisted: 12,
          hired: 1
        },
        tags: ['Drama', 'Inclusive', 'Disability Rights', 'Netflix'],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        title: 'Animated Feature Film - "Voices of Courage"',
        type: 'film',
        status: 'active',
        description: 'An animated feature film celebrating diversity and inclusion through the voices of talented voice actors with disabilities.',
        location: 'Remote / Los Angeles, CA',
        budget: {
          min: 30000,
          max: 80000,
          currency: 'USD'
        },
        timeline: {
          startDate: new Date('2024-04-01'),
          endDate: new Date('2024-12-31'),
          castingDeadline: new Date('2024-03-15')
        },
        requirements: {
          roles: [
            {
              id: 'role-4',
              title: 'Voice Actor - Hero Character',
              description: 'Main protagonist with cerebral palsy',
              type: 'acting',
              category: 'Voice Acting',
              experience: '2+ years',
              skills: ['Voice Acting', 'Character Voices', 'Emotional Range'],
              budget: { min: 25000, max: 40000 },
              filled: false,
              applications: 6
            }
          ],
          totalRoles: 1,
          filledRoles: 0
        },
        company: {
          name: 'Disney Animation',
          logo: '/logos/disney.png',
          verified: true
        },
        stats: {
          views: 892,
          applications: 18,
          shortlisted: 8,
          hired: 0
        },
        tags: ['Animation', 'Voice Acting', 'Family', 'Disney'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-18')
      },
      {
        id: '3',
        title: 'Commercial Campaign - "Accessibility First"',
        type: 'commercial',
        status: 'completed',
        description: 'National commercial campaign promoting inclusive products and services.',
        location: 'New York, NY',
        budget: {
          min: 15000,
          max: 35000,
          currency: 'USD'
        },
        timeline: {
          startDate: new Date('2023-11-01'),
          endDate: new Date('2024-01-31'),
          castingDeadline: new Date('2023-10-15')
        },
        requirements: {
          roles: [
            {
              id: 'role-5',
              title: 'Commercial Actor',
              description: 'Representing diverse abilities in product showcase',
              type: 'acting',
              category: 'Commercial',
              experience: '1+ years',
              skills: ['Commercial Acting', 'Product Demonstration', 'Authentic Representation'],
              budget: { min: 10000, max: 20000 },
              filled: true,
              applications: 25
            }
          ],
          totalRoles: 1,
          filledRoles: 1
        },
        company: {
          name: 'Inclusive Brands Inc.',
          logo: '/logos/inclusive-brands.png',
          verified: true
        },
        stats: {
          views: 567,
          applications: 25,
          shortlisted: 10,
          hired: 1
        },
        tags: ['Commercial', 'Inclusive', 'National Campaign'],
        createdAt: new Date('2023-10-01'),
        updatedAt: new Date('2024-01-31')
      }
    ]

    const mockApplications: Application[] = [
      {
        id: 'app-1',
        projectId: '1',
        roleId: 'role-1',
        talentId: 'emma',
        talentName: 'Emma Thompson',
        talentAvatar: '/avatars/emma.jpg',
        talentCategory: 'Drama',
        status: 'shortlisted',
        appliedAt: new Date('2024-01-18'),
        portfolio: {
          videos: ['/portfolio/emma-drama.mp4'],
          images: ['/portfolio/emma-headshot.jpg'],
          documents: ['/portfolio/emma-resume.pdf']
        },
        coverLetter: 'I am deeply passionate about authentic representation in media and believe my experience in dramatic roles, combined with my understanding of disability rights, makes me an ideal candidate for this role.',
        rating: 4.9,
        verified: true,
        hasDisability: true
      },
      {
        id: 'app-2',
        projectId: '1',
        roleId: 'role-1',
        talentId: 'sarah',
        talentName: 'Sarah Chen',
        talentAvatar: '/avatars/sarah.jpg',
        talentCategory: 'Voice Acting',
        status: 'pending',
        appliedAt: new Date('2024-01-19'),
        portfolio: {
          videos: ['/portfolio/sarah-audition.mp4'],
          images: ['/portfolio/sarah-headshot.jpg'],
          documents: ['/portfolio/sarah-resume.pdf']
        },
        coverLetter: 'As a voice actor with visual impairment, I bring authentic perspective and experience to roles that require genuine representation.',
        rating: 4.7,
        verified: true,
        hasDisability: true
      }
    ]

    setProjects(mockProjects)
    setApplications(mockApplications)
    setFilteredProjects(mockProjects)
  }, [])

  // Filter projects based on search and filters
  useEffect(() => {
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(project => project.type === typeFilter)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, statusFilter, typeFilter])

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700'
      case 'active': return 'bg-success-100 text-success-700'
      case 'casting': return 'bg-primary-100 text-primary-700'
      case 'in_production': return 'bg-warning-100 text-warning-700'
      case 'completed': return 'bg-accent-100 text-accent-700'
      case 'cancelled': return 'bg-error-100 text-error-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeIcon = (type: Project['type']) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'film': <Film className="w-5 h-5" />,
      'tv': <Film className="w-5 h-5" />,
      'commercial': <Film className="w-5 h-5" />,
      'theater': <Users className="w-5 h-5" />,
      'voice': <Mic className="w-5 h-5" />,
      'other': <Film className="w-5 h-5" />,
    }
    return iconMap[type] || <Film className="w-5 h-5" />
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const getProjectApplications = (projectId: string) => {
    return applications.filter(app => app.projectId === projectId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-1">Manage your casting calls and project timelines</p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="casting">Casting</option>
                <option value="in_production">In Production</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Types</option>
                <option value="film">Film</option>
                <option value="tv">TV</option>
                <option value="commercial">Commercial</option>
                <option value="theater">Theater</option>
                <option value="voice">Voice</option>
                <option value="other">Other</option>
              </select>

              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    view === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-md transition-colors ${
                    view === 'list' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className="container-max px-4 sm:px-6 lg:px-8 py-8">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or create a new project.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`card-hover ${view === 'list' ? 'flex items-center space-x-6' : ''}`}
                onClick={() => setSelectedProject(project)}
              >
                {view === 'grid' ? (
                  /* Grid View */
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white">
                          {getTypeIcon(project.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-2">{project.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Building className="w-4 h-4" />
                            <span>{project.company.name}</span>
                            {project.company.verified && <CheckCircle className="w-4 h-4 text-success-500" />}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(project.budget.min, project.budget.currency)} - {formatCurrency(project.budget.max, project.budget.currency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-gray-900">{project.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Roles:</span>
                        <span className="font-medium text-gray-900">
                          {project.requirements.filledRoles}/{project.requirements.totalRoles} filled
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{project.stats.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{project.stats.applications}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* List View */
                  <>
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      {getTypeIcon(project.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{project.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatCurrency(project.budget.min, project.budget.currency)} - {formatCurrency(project.budget.max, project.budget.currency)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{project.requirements.filledRoles}/{project.requirements.totalRoles} roles filled</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(project.timeline.startDate)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Project Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProject.status)}`}>
                        {selectedProject.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900">{selectedProject.type.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-gray-900">{selectedProject.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(selectedProject.budget.min, selectedProject.budget.currency)} - {formatCurrency(selectedProject.budget.max, selectedProject.budget.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium text-gray-900">{formatDate(selectedProject.timeline.startDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium text-gray-900">{formatDate(selectedProject.timeline.endDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Casting Deadline:</span>
                      <span className="font-medium text-gray-900">{formatDate(selectedProject.timeline.castingDeadline)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Roles */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Roles ({selectedProject.requirements.filledRoles}/{selectedProject.requirements.totalRoles} filled)</h3>
                <div className="space-y-4">
                  {selectedProject.requirements.roles.map((role) => (
                    <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{role.title}</h4>
                          <p className="text-sm text-gray-600">{role.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          role.filled ? 'bg-success-100 text-success-700' : 'bg-primary-100 text-primary-700'
                        }`}>
                          {role.filled ? 'Filled' : `${role.applications} applications`}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium text-gray-900 ml-2">{role.type}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-medium text-gray-900 ml-2">{role.experience}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-medium text-gray-900 ml-2">
                            {formatCurrency(role.budget.min, selectedProject.budget.currency)} - {formatCurrency(role.budget.max, selectedProject.budget.currency)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <span className="text-gray-600 text-sm">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {role.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Applications</h3>
                <div className="space-y-3">
                  {getProjectApplications(selectedProject.id).slice(0, 3).map((application) => (
                    <div key={application.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {application.talentName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{application.talentName}</h4>
                          {application.verified && <CheckCircle className="w-4 h-4 text-success-500" />}
                          {application.hasDisability && <Award className="w-4 h-4 text-accent-500" />}
                        </div>
                        <p className="text-sm text-gray-600">{application.talentCategory}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === 'shortlisted' ? 'bg-primary-100 text-primary-700' :
                        application.status === 'hired' ? 'bg-success-100 text-success-700' :
                        application.status === 'rejected' ? 'bg-error-100 text-error-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {application.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Project
                  </button>
                  <button className="btn-secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </button>
                </div>
                <button className="btn-primary">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  View All Applications
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter project title"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                    <select className="input-field">
                      <option value="">Select type</option>
                      <option value="film">Film</option>
                      <option value="tv">TV</option>
                      <option value="commercial">Commercial</option>
                      <option value="theater">Theater</option>
                      <option value="voice">Voice</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Describe your project..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range (Min)</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range (Max)</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    toast.success('Project created successfully!')
                  }}
                  className="btn-primary"
                >
                  Create Project
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 