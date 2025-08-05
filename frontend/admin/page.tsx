'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  User,
  UserCheck, 
  UserX, 
  Star, 
  TrendingUp, 
  Eye, 
  MessageCircle,
  Settings,
  Shield,
  Award,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  MapPin,
  Building,
  Film,
  Mic,
  Camera,
  Music,
  Edit,
  Trash2,
  MoreVertical,
  Plus,
  Bell,
  Mail
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'talent' | 'professional'
  category: string
  status: 'pending' | 'approved' | 'rejected' | 'featured'
  location: string
  joinedDate: string
  lastActive: string
  verified: boolean
  hasDisability: boolean
  portfolioCount: number
  views: number
  connections: number
}

interface Analytics {
  totalUsers: number
  pendingApprovals: number
  featuredProfiles: number
  totalViews: number
  connections: number
  growthRate: number
  topCategories: { name: string; count: number }[]
  recentActivity: { type: string; description: string; time: string }[]
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'users' | 'approvals' | 'featured' | 'analytics' | 'settings'>('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'featured'>('all')
  const [roleFilter, setRoleFilter] = useState<'all' | 'talent' | 'professional'>('all')
  const [loading, setLoading] = useState(true)

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Alex Rodriguez',
        email: 'alex@example.com',
        role: 'talent',
        category: 'Lighting',
        status: 'approved',
        location: 'Los Angeles, CA',
        joinedDate: '2024-01-15',
        lastActive: '2024-01-20',
        verified: true,
        hasDisability: true,
        portfolioCount: 5,
        views: 245,
        connections: 12
      },
      {
        id: '2',
        name: 'Emma Thompson',
        email: 'emma@example.com',
        role: 'talent',
        category: 'Drama',
        status: 'featured',
        location: 'New York, NY',
        joinedDate: '2024-01-10',
        lastActive: '2024-01-21',
        verified: true,
        hasDisability: true,
        portfolioCount: 8,
        views: 567,
        connections: 23
      },
      {
        id: '3',
        name: 'David Kim',
        email: 'david@example.com',
        role: 'talent',
        category: 'Sound Design',
        status: 'pending',
        location: 'Austin, TX',
        joinedDate: '2024-01-18',
        lastActive: '2024-01-19',
        verified: false,
        hasDisability: true,
        portfolioCount: 3,
        views: 89,
        connections: 5
      },
      {
        id: '4',
        name: 'Netflix Casting',
        email: 'casting@netflix.com',
        role: 'professional',
        category: 'Casting Agency',
        status: 'approved',
        location: 'Los Angeles, CA',
        joinedDate: '2024-01-05',
        lastActive: '2024-01-21',
        verified: true,
        hasDisability: false,
        portfolioCount: 0,
        views: 1234,
        connections: 45
      },
      {
        id: '5',
        name: 'Maria Garcia',
        email: 'maria@example.com',
        role: 'talent',
        category: 'Comedy',
        status: 'rejected',
        location: 'Miami, FL',
        joinedDate: '2024-01-12',
        lastActive: '2024-01-15',
        verified: false,
        hasDisability: true,
        portfolioCount: 2,
        views: 34,
        connections: 2
      }
    ]

    const mockAnalytics: Analytics = {
      totalUsers: 1250,
      pendingApprovals: 23,
      featuredProfiles: 45,
      totalViews: 15678,
      connections: 892,
      growthRate: 15.4,
      topCategories: [
        { name: 'Acting', count: 156 },
        { name: 'Lighting', count: 89 },
        { name: 'Sound Design', count: 67 },
        { name: 'Camera Operation', count: 54 },
        { name: 'Voice Acting', count: 43 }
      ],
      recentActivity: [
        { type: 'registration', description: 'New talent registration: Sarah Chen', time: '2 hours ago' },
        { type: 'approval', description: 'Profile approved: David Kim', time: '4 hours ago' },
        { type: 'featured', description: 'Profile featured: Emma Thompson', time: '1 day ago' },
        { type: 'connection', description: 'New connection: Netflix Casting ↔ Alex Rodriguez', time: '1 day ago' },
        { type: 'rejection', description: 'Profile rejected: Maria Garcia', time: '2 days ago' }
      ]
    }

    setUsers(mockUsers)
    setFilteredUsers(mockUsers)
    setAnalytics(mockAnalytics)
    setLoading(false)
  }, [])

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, statusFilter, roleFilter])

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ))
  }

  const handleVerificationToggle = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, verified: !user.verified } : user
    ))
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'pending': return 'bg-warning-100 text-warning-700'
      case 'approved': return 'bg-success-100 text-success-700'
      case 'rejected': return 'bg-error-100 text-error-700'
      case 'featured': return 'bg-accent-100 text-accent-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'talent':
        return <User className="w-4 h-4" />
      case 'professional':
        return <Building className="w-4 h-4" />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Lighting': <Camera className="w-4 h-4" />,
      'Sound Design': <Music className="w-4 h-4" />,
      'Camera Operation': <Camera className="w-4 h-4" />,
      'Drama': <Mic className="w-4 h-4" />,
      'Comedy': <Mic className="w-4 h-4" />,
      'Voice Acting': <Mic className="w-4 h-4" />,
      'Casting Agency': <Building className="w-4 h-4" />,
    }
    return iconMap[category] || <Film className="w-4 h-4" />
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your AmiAble platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-error-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Mail className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
                { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> },
                { id: 'approvals', label: 'Approvals', icon: <UserCheck className="w-5 h-5" /> },
                { id: 'featured', label: 'Featured', icon: <Star className="w-5 h-5" /> },
                { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> },
                { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Assuming AnimatePresence is from framer-motion or similar */}
          {/* For this example, we'll use a simple conditional rendering */}
          {selectedTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', value: analytics?.totalUsers, icon: <Users className="w-6 h-6" />, color: 'primary' },
                  { label: 'Pending Approvals', value: analytics?.pendingApprovals, icon: <Clock className="w-6 h-6" />, color: 'warning' },
                  { label: 'Featured Profiles', value: analytics?.featuredProfiles, icon: <Star className="w-6 h-6" />, color: 'accent' },
                  { label: 'Total Views', value: analytics?.totalViews, icon: <Eye className="w-6 h-6" />, color: 'success' },
                ].map((stat, index) => (
                  <div key={index} className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value?.toLocaleString()}</p>
                      </div>
                      <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Growth and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Growth</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-success-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">+{analytics?.growthRate}%</p>
                      <p className="text-sm text-gray-600">Growth this month</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {analytics?.recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Categories */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
                <div className="space-y-3">
                  {analytics?.topCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">{index + 1}</span>
                        </div>
                        <span className="text-gray-900">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{category.count} users</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </button>
              </div>

              {/* Filters */}
              <div className="card">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="featured">Featured</option>
                  </select>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="talent">Talent</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              {getRoleIcon(user.role)}
                              <span className="text-sm text-gray-900">{user.role}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{user.location}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">{new Date(user.joinedDate).toLocaleDateString()}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleVerificationToggle(user.id)}
                                className={`p-1 rounded ${user.verified ? 'text-success-600' : 'text-gray-400'}`}
                                title={user.verified ? 'Unverify' : 'Verify'}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-error-600">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'approvals' && (
            <motion.div
              key="approvals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
                <span className="text-sm text-gray-600">{analytics?.pendingApprovals} pending</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.filter(user => user.status === 'pending').map((user) => (
                  <div key={user.id} className="card">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getRoleIcon(user.role)}
                        <span className="text-xs text-gray-600">{user.role}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(user.category)}
                        <span className="text-sm text-gray-700">{user.category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{user.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{user.portfolioCount} portfolio items</span>
                      </div>
                      {user.hasDisability && (
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-accent-500" />
                          <span className="text-sm text-accent-600">Disability verified</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(user.id, 'approved')}
                        className="flex-1 btn-primary py-2"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(user.id, 'rejected')}
                        className="flex-1 bg-error-600 hover:bg-error-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedTab === 'featured' && (
            <motion.div
              key="featured"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Featured Profiles</h2>
                <button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Feature Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.filter(user => user.status === 'featured').map((user) => (
                  <div key={user.id} className="card">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-warning-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="bg-accent-100 text-accent-700 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(user.category)}
                        <span className="text-sm text-gray-700">{user.category}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{user.views} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{user.connections} connections</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(user.id, 'approved')}
                        className="flex-1 btn-secondary py-2"
                      >
                        Remove Featured
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-16 h-16 text-gray-400" />
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <PieChart className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Platform Activity</h3>
                  <button className="btn-secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </button>
                </div>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-16 h-16 text-gray-400" />
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                      <input
                        type="text"
                        defaultValue="AmiAble"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                      <input
                        type="email"
                        defaultValue="admin@inclusive-talent.com"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Auto-approval</label>
                      <label className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                        <span className="ml-2 text-sm text-gray-700">Enable automatic profile approval</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Two-Factor Authentication</label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                        <span className="ml-2 text-sm text-gray-700">Require 2FA for admin accounts</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
                      <select className="input-field">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                        <option>4 hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">New User Registrations</p>
                      <p className="text-sm text-gray-600">Get notified when new users register</p>
                    </div>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Pending Approvals</p>
                      <p className="text-sm text-gray-600">Get notified when profiles need approval</p>
                    </div>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">System Alerts</p>
                      <p className="text-sm text-gray-600">Get notified about system issues</p>
                    </div>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 