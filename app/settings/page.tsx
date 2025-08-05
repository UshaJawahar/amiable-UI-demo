'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  AlertCircle
} from 'lucide-react'
import AdminLogin from '../components/AdminLogin'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const router = useRouter()
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAdminLoginSuccess = () => {
    setShowAdminLogin(false)
    router.push('/admin/dashboard')
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken')
    toast.success('Admin logged out successfully')
  }

  const isAdminLoggedIn = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken') !== null
    }
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Settings
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage your account settings and preferences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">User Settings</h2>
                  <p className="text-gray-600">Manage your personal information</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter your display name"
                    defaultValue="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="Enter your email"
                    defaultValue="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="Enter your phone number"
                    defaultValue="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input-field pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button className="w-full btn-primary">
                  Update Profile
                </button>
              </div>
            </motion.div>

            {/* Admin Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-warning-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
                  <p className="text-gray-600">Administrative functions and controls</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-warning-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-warning-800 mb-1">
                        Administrative Access
                      </h3>
                      <p className="text-sm text-warning-700">
                        This section is for authorized administrators only. Use these functions to manage user applications and platform settings.
                      </p>
                    </div>
                  </div>
                </div>

                {!isMounted ? (
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    {isAdminLoggedIn() ? (
                      <div className="space-y-4">
                        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                            <span className="text-sm font-medium text-success-800">
                              Admin logged in
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => router.push('/admin/dashboard')}
                          className="w-full btn-primary flex items-center justify-center"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Go to Admin Dashboard
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </button>

                        <button
                          onClick={handleAdminLogout}
                          className="w-full btn-secondary"
                        >
                          Logout as Admin
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          Access the admin dashboard to review and manage user applications.
                        </p>

                        <button
                          onClick={() => setShowAdminLogin(true)}
                          className="w-full btn-primary flex items-center justify-center"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Login as Admin
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Notifications Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card mt-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mr-4">
                <Bell className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                <p className="text-gray-600">Manage your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Receive real-time updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Receive updates via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card mt-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center mr-4">
                <Lock className="w-6 h-6 text-error-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Privacy & Security</h2>
                <p className="text-gray-600">Manage your privacy and security settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <button className="btn-secondary">
                  Enable
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Profile Visibility</h3>
                  <p className="text-sm text-gray-600">Control who can see your profile</p>
                </div>
                <select className="input-field">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="connections">Connections Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Data Export</h3>
                  <p className="text-sm text-gray-600">Download your data</p>
                </div>
                <button className="btn-secondary">
                  Export Data
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Delete Account</h3>
                  <p className="text-sm text-gray-600">Permanently delete your account</p>
                </div>
                <button className="btn-error">
                  Delete Account
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin
          onSuccess={handleAdminLoginSuccess}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
    </div>
  )
} 