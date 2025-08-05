'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MessageCircle, 
  Star,
  Calendar,
  MapPin,
  DollarSign,
  Award,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Filter,
  RefreshCw,
  Settings,
  Target,
  Zap,
  Heart,
  Share2,
  Building,
  User,
  Film,
  Mic,
  Camera,
  Music,
  Globe,
  Smartphone,
  Mail
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AnalyticsData {
  overview: {
    totalUsers: number
    totalProjects: number
    totalApplications: number
    activeUsers: number
    featuredProfiles: number
    verifiedUsers: number
    platformRevenue: number
  }
  trends: {
    userGrowth: { date: string; users: number }[]
    projectGrowth: { date: string; projects: number }[]
    applicationGrowth: { date: string; applications: number }[]
    engagementGrowth: { date: string; engagement: number }[]
  }
  demographics: {
    userTypes: { type: string; count: number; percentage: number }[]
    categories: { category: string; count: number; percentage: number }[]
    locations: { location: string; count: number; percentage: number }[]
    disabilities: { type: string; count: number; percentage: number }[]
  }
  performance: {
    topProjects: { id: string; title: string; applications: number; views: number; status: string }[]
    topTalents: { id: string; name: string; views: number; applications: number; rating: number }[]
    topCompanies: { id: string; name: string; projects: number; hires: number; rating: number }[]
    conversionRates: { metric: string; rate: number; change: number }[]
  }
  engagement: {
    dailyActiveUsers: number
    weeklyActiveUsers: number
    monthlyActiveUsers: number
    averageSessionDuration: number
    pageViews: number
    bounceRate: number
    retentionRate: number
  }
  insights: {
    recommendations: string[]
    alerts: { type: 'success' | 'warning' | 'error'; message: string; timestamp: Date }[]
    opportunities: { title: string; description: string; impact: 'high' | 'medium' | 'low' }[]
  }
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<string>('overview')

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockAnalytics: AnalyticsData = {
      overview: {
        totalUsers: 1247,
        totalProjects: 89,
        totalApplications: 567,
        activeUsers: 892,
        featuredProfiles: 45,
        verifiedUsers: 678,
        platformRevenue: 125000
      },
      trends: {
        userGrowth: [
          { date: '2024-01-01', users: 1000 },
          { date: '2024-01-08', users: 1050 },
          { date: '2024-01-15', users: 1120 },
          { date: '2024-01-22', users: 1180 },
          { date: '2024-01-29', users: 1247 }
        ],
        projectGrowth: [
          { date: '2024-01-01', projects: 65 },
          { date: '2024-01-08', projects: 72 },
          { date: '2024-01-15', projects: 78 },
          { date: '2024-01-22', projects: 84 },
          { date: '2024-01-29', projects: 89 }
        ],
        applicationGrowth: [
          { date: '2024-01-01', applications: 400 },
          { date: '2024-01-08', applications: 450 },
          { date: '2024-01-15', applications: 500 },
          { date: '2024-01-22', applications: 535 },
          { date: '2024-01-29', applications: 567 }
        ],
        engagementGrowth: [
          { date: '2024-01-01', engagement: 75 },
          { date: '2024-01-08', engagement: 78 },
          { date: '2024-01-15', engagement: 82 },
          { date: '2024-01-22', engagement: 85 },
          { date: '2024-01-29', engagement: 88 }
        ]
      },
      demographics: {
        userTypes: [
          { type: 'Talent', count: 892, percentage: 71.5 },
          { type: 'Professional', count: 355, percentage: 28.5 }
        ],
        categories: [
          { category: 'Drama', count: 234, percentage: 18.8 },
          { category: 'Voice Acting', count: 189, percentage: 15.2 },
          { category: 'Lighting', count: 156, percentage: 12.5 },
          { category: 'Sound Design', count: 134, percentage: 10.7 },
          { category: 'Camera Operation', count: 123, percentage: 9.9 },
          { category: 'Other', count: 411, percentage: 33.0 }
        ],
        locations: [
          { location: 'New York', count: 234, percentage: 18.8 },
          { location: 'Los Angeles', count: 198, percentage: 15.9 },
          { location: 'Chicago', count: 145, percentage: 11.6 },
          { location: 'Toronto', count: 123, percentage: 9.9 },
          { location: 'London', count: 98, percentage: 7.9 },
          { location: 'Other', count: 449, percentage: 36.0 }
        ],
        disabilities: [
          { type: 'Visual Impairment', count: 234, percentage: 18.8 },
          { type: 'Hearing Impairment', count: 189, percentage: 15.2 },
          { type: 'Mobility Impairment', count: 156, percentage: 12.5 },
          { type: 'Cognitive Disability', count: 134, percentage: 10.7 },
          { type: 'Multiple Disabilities', count: 123, percentage: 9.9 },
          { type: 'Other', count: 411, percentage: 33.0 }
        ]
      },
      performance: {
        topProjects: [
          { id: '1', title: 'Netflix Drama Series', applications: 45, views: 1247, status: 'casting' },
          { id: '2', title: 'Animated Feature Film', applications: 38, views: 892, status: 'active' },
          { id: '3', title: 'Commercial Campaign', applications: 32, views: 756, status: 'completed' },
          { id: '4', title: 'Documentary Series', applications: 28, views: 634, status: 'casting' },
          { id: '5', title: 'Theater Production', applications: 25, views: 567, status: 'active' }
        ],
        topTalents: [
          { id: '1', name: 'Emma Thompson', views: 1247, applications: 12, rating: 4.9 },
          { id: '2', name: 'Alex Rodriguez', views: 892, applications: 8, rating: 4.7 },
          { id: '3', name: 'Sarah Chen', views: 756, applications: 15, rating: 4.8 },
          { id: '4', name: 'Marcus Johnson', views: 634, applications: 6, rating: 4.6 },
          { id: '5', name: 'Lisa Park', views: 567, applications: 9, rating: 4.5 }
        ],
        topCompanies: [
          { id: '1', name: 'Netflix Studios', projects: 8, hires: 23, rating: 4.8 },
          { id: '2', name: 'Disney Animation', projects: 6, hires: 18, rating: 4.7 },
          { id: '3', name: 'Inclusive Brands Inc.', projects: 5, hires: 15, rating: 4.6 },
          { id: '4', name: 'Independent Films Co.', projects: 4, hires: 12, rating: 4.5 },
          { id: '5', name: 'Theater Productions Ltd.', projects: 3, hires: 9, rating: 4.4 }
        ],
        conversionRates: [
          { metric: 'Profile Views to Applications', rate: 12.5, change: 2.3 },
          { metric: 'Applications to Interviews', rate: 8.7, change: 1.8 },
          { metric: 'Interviews to Hires', rate: 15.2, change: -0.5 },
          { metric: 'User Registration to Verification', rate: 92.3, change: 3.1 }
        ]
      },
      engagement: {
        dailyActiveUsers: 234,
        weeklyActiveUsers: 892,
        monthlyActiveUsers: 1247,
        averageSessionDuration: 8.5,
        pageViews: 45678,
        bounceRate: 23.4,
        retentionRate: 78.9
      },
      insights: {
        recommendations: [
          'Consider featuring more voice acting profiles to meet growing demand',
          'Implement automated follow-up emails to improve application response rates',
          'Add more accessibility features to increase user engagement',
          'Partner with disability advocacy organizations to expand user base'
        ],
        alerts: [
          { type: 'success', message: 'User registration increased by 15% this week', timestamp: new Date() },
          { type: 'warning', message: 'Application response time is 2 days above average', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
          { type: 'success', message: 'Platform revenue exceeded monthly target by 12%', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6) }
        ],
        opportunities: [
          { title: 'Expand to International Markets', description: 'High demand for inclusive talent in European markets', impact: 'high' },
          { title: 'Launch Mobile App', description: 'Mobile usage shows 40% of users prefer mobile access', impact: 'high' },
          { title: 'Add Video Interview Feature', description: 'Streamline hiring process with integrated video calls', impact: 'medium' },
          { title: 'Implement AI Matching', description: 'Use AI to suggest optimal talent-project matches', impact: 'medium' }
        ]
      }
    }

    setAnalytics(mockAnalytics)
    setLoading(false)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-success-600' : 'text-error-600'
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-error-600 bg-error-50 border-error-200'
      case 'medium': return 'text-warning-600 bg-warning-50 border-warning-200'
      case 'low': return 'text-success-600 bg-success-50 border-success-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
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

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Analytics Data</h2>
          <p className="text-gray-600">Analytics data is not available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Platform performance and user insights</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <button
                onClick={() => toast.success('Data refreshed!')}
                className="btn-secondary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              
              <button className="btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-max px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.totalUsers)}</p>
                <div className="flex items-center mt-2">
                  <span className="text-success-600 text-sm font-medium">+12.5%</span>
                  <TrendingUp className="w-4 h-4 text-success-600 ml-1" />
                </div>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalProjects}</p>
                <div className="flex items-center mt-2">
                  <span className="text-success-600 text-sm font-medium">+8.3%</span>
                  <TrendingUp className="w-4 h-4 text-success-600 ml-1" />
                </div>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Film className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.totalApplications)}</p>
                <div className="flex items-center mt-2">
                  <span className="text-success-600 text-sm font-medium">+15.2%</span>
                  <TrendingUp className="w-4 h-4 text-success-600 ml-1" />
                </div>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-accent-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview.platformRevenue)}</p>
                <div className="flex items-center mt-2">
                  <span className="text-success-600 text-sm font-medium">+22.1%</span>
                  <TrendingUp className="w-4 h-4 text-success-600 ml-1" />
                </div>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts and Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* User Growth Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 card"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">User Growth Trend</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Total Users</span>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics.trends.userGrowth.map((point, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-primary-500 rounded-t"
                    style={{ height: `${(point.users / 1300) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Demographics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">User Demographics</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">User Types</h4>
                {analytics.demographics.userTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {type.type === 'Talent' ? <User className="w-4 h-4 text-primary-500" /> : <Building className="w-4 h-4 text-secondary-500" />}
                      <span className="text-sm text-gray-700">{type.type}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatPercentage(type.percentage)}</span>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Top Categories</h4>
                {analytics.demographics.categories.slice(0, 5).map((category, index) => (
                  <div key={index} className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">{category.category}</span>
                    <span className="text-sm font-medium text-gray-900">{formatPercentage(category.percentage)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Projects</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {analytics.performance.topProjects.map((project, index) => (
                <div key={project.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{project.title}</h4>
                      <p className="text-xs text-gray-600">{project.applications} applications</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{project.views} views</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'casting' ? 'bg-primary-100 text-primary-700' :
                      project.status === 'active' ? 'bg-success-100 text-success-700' :
                      'bg-accent-100 text-accent-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Conversion Rates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Rates</h3>
            
            <div className="space-y-4">
              {analytics.performance.conversionRates.map((rate, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{rate.metric}</p>
                    <p className="text-xs text-gray-600">Current rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{formatPercentage(rate.rate)}</p>
                    <div className={`flex items-center text-sm ${getChangeColor(rate.change)}`}>
                      {getChangeIcon(rate.change)}
                      <span className="ml-1">{rate.change >= 0 ? '+' : ''}{rate.change.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">{analytics.engagement.dailyActiveUsers}</h4>
            <p className="text-sm text-gray-600">Daily Active Users</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-secondary-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">{analytics.engagement.averageSessionDuration}m</h4>
            <p className="text-sm text-gray-600">Avg. Session Duration</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-accent-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">{formatNumber(analytics.engagement.pageViews)}</h4>
            <p className="text-sm text-gray-600">Page Views</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card text-center"
          >
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-success-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">{formatPercentage(analytics.engagement.retentionRate)}</h4>
            <p className="text-sm text-gray-600">Retention Rate</p>
          </motion.div>
        </div>

        {/* Insights and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Insights</h3>
            
            <div className="space-y-4">
              {analytics.insights.alerts.map((alert, index) => (
                <div key={index} className={`p-3 border rounded-lg ${
                  alert.type === 'success' ? 'border-success-200 bg-success-50' :
                  alert.type === 'warning' ? 'border-warning-200 bg-warning-50' :
                  'border-error-200 bg-error-50'
                }`}>
                  <div className="flex items-start space-x-3">
                    {alert.type === 'success' ? <CheckCircle className="w-5 h-5 text-success-600 mt-0.5" /> :
                     alert.type === 'warning' ? <AlertCircle className="w-5 h-5 text-warning-600 mt-0.5" /> :
                     <AlertCircle className="w-5 h-5 text-error-600 mt-0.5" />}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {alert.timestamp.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Opportunities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Growth Opportunities</h3>
            
            <div className="space-y-4">
              {analytics.insights.opportunities.map((opportunity, index) => (
                <div key={index} className={`p-4 border rounded-lg ${getImpactColor(opportunity.impact)}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{opportunity.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      opportunity.impact === 'high' ? 'bg-error-100 text-error-700' :
                      opportunity.impact === 'medium' ? 'bg-warning-100 text-warning-700' :
                      'bg-success-100 text-success-700'
                    }`}>
                      {opportunity.impact} impact
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 