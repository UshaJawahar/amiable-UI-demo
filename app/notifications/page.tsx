'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  MessageCircle, 
  Eye, 
  Clock,
  Settings,
  Filter,
  Search,
  Trash2,
  Archive,
  MoreVertical,
  User,
  Building,
  Film,
  Mic,
  Camera,
  Music,
  Award,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  FileText,
  Download,
  ExternalLink,
  Volume2,
  VolumeX,
  Mail,
  Smartphone,
  Globe,
  XCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  type: 'application' | 'message' | 'project' | 'system' | 'featured' | 'reminder'
  title: string
  message: string
  read: boolean
  timestamp: Date
  priority: 'low' | 'medium' | 'high'
  action?: {
    type: 'view' | 'reply' | 'approve' | 'reject' | 'download'
    url: string
    label: string
  }
  sender?: {
    id: string
    name: string
    avatar: string
    role: 'talent' | 'professional'
    verified: boolean
  }
  project?: {
    id: string
    title: string
    type: string
  }
  metadata?: {
    applicationCount?: number
    messageCount?: number
    projectViews?: number
    deadline?: Date
  }
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  types: {
    applications: boolean
    messages: boolean
    projects: boolean
    system: boolean
    featured: boolean
    reminders: boolean
  }
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly'
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    types: {
      applications: true,
      messages: true,
      projects: true,
      system: true,
      featured: true,
      reminders: true
    },
    frequency: 'immediate',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  })
  const [filter, setFilter] = useState<'all' | 'unread' | Notification['type']>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'application',
        title: 'New Application Received',
        message: 'Emma Thompson has applied for the Lead Actress role in "Breaking Barriers"',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        priority: 'high',
        action: {
          type: 'view',
          url: '/applications/1',
          label: 'Review Application'
        },
        sender: {
          id: 'emma',
          name: 'Emma Thompson',
          avatar: '/avatars/emma.jpg',
          role: 'talent',
          verified: true
        },
        project: {
          id: 'proj-1',
          title: 'Breaking Barriers',
          type: 'TV Series'
        },
        metadata: {
          applicationCount: 1
        }
      },
      {
        id: '2',
        type: 'message',
        title: 'New Message from Alex Rodriguez',
        message: 'Hi! I wanted to follow up on the lighting position we discussed...',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        priority: 'medium',
        action: {
          type: 'reply',
          url: '/messages',
          label: 'Reply'
        },
        sender: {
          id: 'alex',
          name: 'Alex Rodriguez',
          avatar: '/avatars/alex.jpg',
          role: 'talent',
          verified: true
        },
        metadata: {
          messageCount: 1
        }
      },
      {
        id: '3',
        type: 'project',
        title: 'Project Status Updated',
        message: 'Your project "Netflix Drama Series" has received 15 new applications',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        priority: 'medium',
        action: {
          type: 'view',
          url: '/projects/1',
          label: 'View Project'
        },
        project: {
          id: 'proj-1',
          title: 'Netflix Drama Series',
          type: 'TV Series'
        },
        metadata: {
          applicationCount: 15,
          projectViews: 1247
        }
      },
      {
        id: '4',
        type: 'featured',
        title: 'Profile Featured',
        message: 'Congratulations! Your profile has been featured on our platform homepage',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        priority: 'high',
        action: {
          type: 'view',
          url: '/profile',
          label: 'View Profile'
        }
      },
      {
        id: '5',
        type: 'reminder',
        title: 'Casting Deadline Reminder',
        message: 'The casting deadline for "Animated Feature Film" is approaching in 3 days',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        priority: 'high',
        action: {
          type: 'view',
          url: '/projects/2',
          label: 'Review Applications'
        },
        project: {
          id: 'proj-2',
          title: 'Animated Feature Film',
          type: 'Film'
        },
        metadata: {
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) // 3 days from now
        }
      },
      {
        id: '6',
        type: 'system',
        title: 'Platform Update',
        message: 'New features have been added to help you manage your projects more efficiently',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        priority: 'low',
        action: {
          type: 'view',
          url: '/updates',
          label: 'Learn More'
        }
      },
      {
        id: '7',
        type: 'application',
        title: 'Application Shortlisted',
        message: 'Sarah Chen has been shortlisted for the Voice Actor role',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        priority: 'medium',
        action: {
          type: 'view',
          url: '/applications/2',
          label: 'Review Application'
        },
        sender: {
          id: 'sarah',
          name: 'Sarah Chen',
          avatar: '/avatars/sarah.jpg',
          role: 'talent',
          verified: true
        },
        project: {
          id: 'proj-2',
          title: 'Animated Feature Film',
          type: 'Film'
        }
      }
    ]

    setNotifications(mockNotifications)
    setFilteredNotifications(mockNotifications)
  }, [])

  // Filter notifications based on search and filter
  useEffect(() => {
    let filtered = notifications

    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.sender?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filter !== 'all') {
      if (filter === 'unread') {
        filtered = filtered.filter(notification => !notification.read)
      } else {
        filtered = filtered.filter(notification => notification.type === filter)
      }
    }

    setFilteredNotifications(filtered)
  }, [notifications, searchTerm, filter])

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })))
    toast.success('All notifications marked as read')
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId))
    toast.success('Notification deleted')
  }

  const getNotificationIcon = (type: Notification['type']) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'application': <User className="w-5 h-5" />,
      'message': <MessageCircle className="w-5 h-5" />,
      'project': <Film className="w-5 h-5" />,
      'system': <Settings className="w-5 h-5" />,
      'featured': <Star className="w-5 h-5" />,
      'reminder': <Clock className="w-5 h-5" />,
    }
    return iconMap[type] || <Bell className="w-5 h-5" />
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'text-error-600 bg-error-50 border-error-200'
      case 'medium': return 'text-warning-600 bg-warning-50 border-warning-200'
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 1000 / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const getRoleIcon = (role: string) => {
    return role === 'talent' ? <User className="w-4 h-4" /> : <Building className="w-4 h-4" />
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All Read
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="btn-secondary"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
                <option value="application">Applications</option>
                <option value="message">Messages</option>
                <option value="project">Projects</option>
                <option value="system">System</option>
                <option value="featured">Featured</option>
                <option value="reminder">Reminders</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="container-max px-4 sm:px-6 lg:px-8 py-8">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search criteria or filters.' 
                : 'You\'re all caught up! Check back later for new updates.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`card cursor-pointer transition-all duration-200 hover:shadow-medium ${
                    !notification.read ? 'border-l-4 border-l-primary-500 bg-primary-50' : ''
                  }`}
                  onClick={() => {
                    if (!notification.read) markAsRead(notification.id)
                    if (notification.action) {
                      // In real app, navigate to the action URL
                      toast.success(`Navigating to ${notification.action.label}`)
                    }
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{notification.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          )}
                        </div>
                      </div>

                      {/* Sender Info */}
                      {notification.sender && (
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {notification.sender.name.charAt(0)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {notification.sender.name}
                            </span>
                            {notification.sender.verified && (
                              <CheckCircle className="w-4 h-4 text-success-500" />
                            )}
                            {getRoleIcon(notification.sender.role)}
                          </div>
                        </div>
                      )}

                      {/* Project Info */}
                      {notification.project && (
                        <div className="flex items-center space-x-2 mb-3">
                          <Film className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {notification.project.title} • {notification.project.type}
                          </span>
                        </div>
                      )}

                      {/* Metadata */}
                      {notification.metadata && (
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {notification.metadata.applicationCount && (
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{notification.metadata.applicationCount} applications</span>
                            </div>
                          )}
                          {notification.metadata.messageCount && (
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{notification.metadata.messageCount} messages</span>
                            </div>
                          )}
                          {notification.metadata.projectViews && (
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{notification.metadata.projectViews} views</span>
                            </div>
                          )}
                          {notification.metadata.deadline && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Deadline: {formatTime(notification.metadata.deadline)}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Button */}
                      {notification.action && (
                        <div className="flex items-center justify-between mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toast.success(`Navigating to ${notification.action!.label}`)
                            }}
                            className="btn-primary text-sm py-1 px-3"
                          >
                            {notification.action.label}
                          </button>
                          
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="p-1 text-gray-400 hover:text-error-600 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Notification Channels */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.email}
                        onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.checked }))}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Push Notifications</p>
                        <p className="text-sm text-gray-600">Receive notifications on your device</p>
                      </div>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.push}
                        onChange={(e) => setSettings(prev => ({ ...prev, push: e.target.checked }))}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Receive notifications via text message</p>
                      </div>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.sms}
                        onChange={(e) => setSettings(prev => ({ ...prev, sms: e.target.checked }))}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(settings.types).map(([type, enabled]) => (
                    <div key={type} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getNotificationIcon(type as Notification['type'])}
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{type}</p>
                          <p className="text-sm text-gray-600">
                            {type === 'applications' && 'New job applications'}
                            {type === 'messages' && 'New messages from talent/professionals'}
                            {type === 'projects' && 'Project updates and status changes'}
                            {type === 'system' && 'Platform updates and announcements'}
                            {type === 'featured' && 'Profile featured notifications'}
                            {type === 'reminders' && 'Deadline and task reminders'}
                          </p>
                        </div>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            types: { ...prev.types, [type]: e.target.checked }
                          }))}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Frequency</h3>
                <select
                  value={settings.frequency}
                  onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="immediate">Immediate</option>
                  <option value="hourly">Hourly Digest</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Digest</option>
                </select>
              </div>

              {/* Quiet Hours */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiet Hours</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Enable Quiet Hours</p>
                      <p className="text-sm text-gray-600">Pause notifications during specific hours</p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.quietHours.enabled}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          quietHours: { ...prev.quietHours, enabled: e.target.checked }
                        }))}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </label>
                  </div>

                  {settings.quietHours.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                        <input
                          type="time"
                          value={settings.quietHours.start}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            quietHours: { ...prev.quietHours, start: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                        <input
                          type="time"
                          value={settings.quietHours.end}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            quietHours: { ...prev.quietHours, end: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowSettings(false)
                    toast.success('Notification settings updated!')
                  }}
                  className="btn-primary"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 