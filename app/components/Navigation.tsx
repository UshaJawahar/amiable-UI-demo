'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSidebar } from './SidebarContext'
import { 
  Home, 
  Search, 
  UserPlus, 
  Users, 
  MessageCircle, 
  Bell, 
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Building,
  Film,
  Award,
  Globe,
  Menu,
  X,
  User,
  Briefcase,
  FileText,
  Calendar,
  MapPin,
  Star,
  CheckCircle,
  TrendingUp,
  PieChart,
  Activity,
  Target,
  Zap
} from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  icon: React.ReactNode
  description?: string
  badge?: string
  children?: NavigationItem[]
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: <Home className="w-5 h-5" />,
    description: 'Platform overview and featured content'
  },
  {
    name: 'Explore Talent',
    href: '/explore',
    icon: <Users className="w-5 h-5" />,
    description: 'Discover talented individuals and professionals',
    children: [
      {
        name: 'Featured Profiles',
        href: '/explore?filter=featured',
        icon: <Star className="w-4 h-4" />
      },
      {
        name: 'Verified Talents',
        href: '/explore?filter=verified',
        icon: <CheckCircle className="w-4 h-4" />
      },
      {
        name: 'By Category',
        href: '/explore?filter=category',
        icon: <Film className="w-4 h-4" />
      }
    ]
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: <Briefcase className="w-5 h-5" />,
    description: 'Manage casting calls and project timelines',
    children: [
      {
        name: 'Active Projects',
        href: '/projects/active',
        icon: <Activity className="w-4 h-4" />
      },
      {
        name: 'Casting Calls',
        href: '/projects/casting',
        icon: <User className="w-4 h-4" />
      },
      {
        name: 'Completed',
        href: '/projects/completed',
        icon: <CheckCircle className="w-4 h-4" />
      }
    ]
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: <MessageCircle className="w-5 h-5" />,
    description: 'Communicate with talents and professionals',
    badge: '3'
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: <Bell className="w-5 h-5" />,
    description: 'Stay updated with platform activities',
    badge: '5'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Platform performance and insights',
    children: [
      {
        name: 'Overview',
        href: '/analytics/overview',
        icon: <TrendingUp className="w-4 h-4" />
      },
      {
        name: 'User Analytics',
        href: '/analytics/users',
        icon: <Users className="w-4 h-4" />
      },
      {
        name: 'Project Analytics',
        href: '/analytics/projects',
        icon: <Briefcase className="w-4 h-4" />
      },
      {
        name: 'Engagement',
        href: '/analytics/engagement',
        icon: <Target className="w-4 h-4" />
      }
    ]
  },
  {
    name: 'Admin',
    href: '/admin',
    icon: <Settings className="w-5 h-5" />,
    description: 'Platform administration and moderation',
    children: [
      {
        name: 'Dashboard',
        href: '/admin',
        icon: <BarChart3 className="w-4 h-4" />
      },
      {
        name: 'User Management',
        href: '/admin/users',
        icon: <Users className="w-4 h-4" />
      },
      {
        name: 'Content Moderation',
        href: '/admin/moderation',
        icon: <FileText className="w-4 h-4" />
      },
      {
        name: 'Featured Profiles',
        href: '/admin/featured',
        icon: <Star className="w-4 h-4" />
      }
    ]
  }
]

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isDesktopMenuOpen, setIsDesktopMenuOpen } = useSidebar()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const isExpanded = (itemName: string) => expandedItems.includes(itemName)

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`hidden lg:block bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-50 transition-all duration-300 ${
        isDesktopMenuOpen ? 'w-64' : 'w-16'
      }`}>
        <div className={`h-full flex flex-col ${isDesktopMenuOpen ? 'p-6' : 'p-4'}`}>
          {/* Logo and Hamburger */}
          <div className="mb-8">
            {isDesktopMenuOpen ? (
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <button
                  onClick={() => setIsDesktopMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={() => setIsDesktopMenuOpen(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <div className="flex-1 space-y-2">
            {navigationItems.map((item) => (
              <div key={item.name}>
                {isDesktopMenuOpen ? (
                  // Expanded view
                  <button
                    onClick={() => {
                      if (item.children) {
                        toggleExpanded(item.name)
                      } else {
                        window.location.href = item.href
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${isActive(item.href) ? 'text-primary-600' : 'text-gray-400'}`}>
                        {item.icon}
                      </div>
                      <div>
                        <span className="font-medium">{item.name}</span>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.children && (
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform ${
                            isExpanded(item.name) ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </div>
                  </button>
                ) : (
                  // Collapsed view - just icons
                  <Link
                    href={item.href}
                    className={`w-full flex flex-col items-center justify-center py-3 rounded-lg transition-colors relative ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    title={item.name}
                  >
                    <div className={`${isActive(item.href) ? 'text-primary-600' : 'text-gray-400'}`}>
                      {item.icon}
                    </div>
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}

                {/* Submenu - only show in expanded view */}
                {isDesktopMenuOpen && item.children && (
                  <AnimatePresence>
                    {isExpanded(item.name) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-8 mt-2 space-y-1"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`flex items-center space-x-3 px-4 py-2 text-sm rounded-lg transition-colors ${
                              isActive(child.href)
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <div className={`${isActive(child.href) ? 'text-primary-600' : 'text-gray-400'}`}>
                              {child.icon}
                            </div>
                            <span>{child.name}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* User Section */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            {isDesktopMenuOpen ? (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-600">Professional</p>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Desktop Header */}
      <div className={`hidden lg:block bg-white border-b border-gray-200 px-4 py-3 fixed top-0 z-30 transition-all duration-300 ${
        isDesktopMenuOpen ? 'left-64 right-0' : 'left-16 right-0'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">AmiAble</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                5
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">AmiAble</span>
          </Link>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border-b border-gray-200"
            >
              <div className="px-4 py-6 space-y-4">
                {navigationItems.map((item) => (
                  <div key={item.name}>
                    <button
                      onClick={() => {
                        if (item.children) {
                          toggleExpanded(item.name)
                        } else {
                          window.location.href = item.href
                          setIsMobileMenuOpen(false)
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`${isActive(item.href) ? 'text-primary-600' : 'text-gray-400'}`}>
                          {item.icon}
                        </div>
                        <div>
                          <span className="font-medium">{item.name}</span>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {item.children && (
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform ${
                              isExpanded(item.name) ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </div>
                    </button>

                    {/* Mobile Submenu */}
                    {item.children && (
                      <AnimatePresence>
                        {isExpanded(item.name) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-8 mt-2 space-y-1"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center space-x-3 px-4 py-2 text-sm rounded-lg transition-colors ${
                                  isActive(child.href)
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                <div className={`${isActive(child.href) ? 'text-primary-600' : 'text-gray-400'}`}>
                                  {child.icon}
                                </div>
                                <span>{child.name}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}

                {/* Mobile User Section */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                      JD
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">John Doe</p>
                      <p className="text-sm text-gray-600">Professional</p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


    </>
  )
} 