'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Play, 
  Heart,
  Eye,
  MessageCircle,
  Award,
  Users,
  Film,
  Mic,
  Camera,
  Music,
  Edit,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import AdvancedSearch from '../components/AdvancedSearch'
import ContactTalent from '../components/ContactTalent'

interface Talent {
  id: string
  name: string
  role: 'production' | 'acting'
  category: string
  location: string
  experience: string
  rating: number
  featured: boolean
  verified: boolean
  avatar: string
  skills: string[]
  languages: string[]
  availability: string
  portfolio: {
    videos: string[]
    images: string[]
    documents: string[]
  }
}

export default function ExplorePage() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [filteredTalents, setFilteredTalents] = useState<Talent[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<'all' | 'production' | 'acting'>('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [contactTalent, setContactTalent] = useState<Talent | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockTalents: Talent[] = [
      {
        id: '1',
        name: 'Alex Rodriguez',
        role: 'production',
        category: 'Lighting',
        location: 'Los Angeles, CA',
        experience: '5+ years',
        rating: 4.8,
        featured: true,
        verified: true,
        avatar: '/avatars/alex.jpg',
        skills: ['LED Lighting', 'Color Theory', 'Equipment Setup'],
        languages: ['English', 'Spanish'],
        availability: 'Available',
        portfolio: {
          videos: ['/portfolio/alex-video1.mp4'],
          images: ['/portfolio/alex-work1.jpg'],
          documents: ['/portfolio/alex-resume.pdf']
        }
      },
      {
        id: '2',
        name: 'Emma Thompson',
        role: 'acting',
        category: 'Drama',
        location: 'New York, NY',
        experience: '3+ years',
        rating: 4.9,
        featured: true,
        verified: true,
        avatar: '/avatars/emma.jpg',
        skills: ['Method Acting', 'Voice Training', 'Stage Combat'],
        languages: ['English', 'French'],
        availability: 'Available',
        portfolio: {
          videos: ['/portfolio/emma-audition.mp4'],
          images: ['/portfolio/emma-headshot.jpg'],
          documents: ['/portfolio/emma-resume.pdf']
        }
      },
      {
        id: '3',
        name: 'David Kim',
        role: 'production',
        category: 'Sound Design',
        location: 'Austin, TX',
        experience: '7+ years',
        rating: 4.7,
        featured: false,
        verified: true,
        avatar: '/avatars/david.jpg',
        skills: ['Audio Mixing', 'Foley', 'Sound Effects'],
        languages: ['English', 'Korean'],
        availability: 'Available',
        portfolio: {
          videos: ['/portfolio/david-demo.mp4'],
          images: ['/portfolio/david-studio.jpg'],
          documents: ['/portfolio/david-resume.pdf']
        }
      },
      {
        id: '4',
        name: 'Maria Garcia',
        role: 'acting',
        category: 'Comedy',
        location: 'Miami, FL',
        experience: '4+ years',
        rating: 4.6,
        featured: false,
        verified: true,
        avatar: '/avatars/maria.jpg',
        skills: ['Improv', 'Comedy Writing', 'Character Development'],
        languages: ['English', 'Spanish'],
        availability: 'Available',
        portfolio: {
          videos: ['/portfolio/maria-comedy.mp4'],
          images: ['/portfolio/maria-headshot.jpg'],
          documents: ['/portfolio/maria-resume.pdf']
        }
      },
      {
        id: '5',
        name: 'James Wilson',
        role: 'production',
        category: 'Camera Operation',
        location: 'Atlanta, GA',
        experience: '6+ years',
        rating: 4.5,
        featured: false,
        verified: true,
        avatar: '/avatars/james.jpg',
        skills: ['Cinematography', 'Camera Movement', 'Equipment Maintenance'],
        languages: ['English'],
        availability: 'Available',
        portfolio: {
          videos: ['/portfolio/james-reel.mp4'],
          images: ['/portfolio/james-work.jpg'],
          documents: ['/portfolio/james-resume.pdf']
        }
      },
      {
        id: '6',
        name: 'Sarah Chen',
        role: 'acting',
        category: 'Voice Acting',
        location: 'San Francisco, CA',
        experience: '8+ years',
        rating: 4.9,
        featured: true,
        verified: true,
        avatar: '/avatars/sarah.jpg',
        skills: ['Voice Acting', 'Accent Training', 'Character Voices'],
        languages: ['English', 'Mandarin', 'Japanese'],
        availability: 'Available',
        portfolio: {
          videos: ['/portfolio/sarah-voice-demo.mp4'],
          images: ['/portfolio/sarah-studio.jpg'],
          documents: ['/portfolio/sarah-resume.pdf']
        }
      }
    ]

    setTalents(mockTalents)
    setFilteredTalents(mockTalents)
    setLoading(false)
  }, [])

  // Filter talents based on search and filters
  useEffect(() => {
    let filtered = talents

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(talent =>
        talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(talent => talent.role === selectedRole)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(talent => talent.category === selectedCategory)
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(talent => talent.location.includes(selectedLocation))
    }

    setFilteredTalents(filtered)
  }, [talents, searchTerm, selectedRole, selectedCategory, selectedLocation])

  const categories = {
    production: ['Lighting', 'Sound Design', 'Camera Operation', 'Set Design', 'Costume Design', 'Makeup', 'Editing'],
    acting: ['Drama', 'Comedy', 'Voice Acting', 'Commercial', 'Theater', 'Film', 'Television']
  }

  const locations = ['Los Angeles, CA', 'New York, NY', 'Austin, TX', 'Miami, FL', 'Atlanta, GA', 'San Francisco, CA']

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Lighting': <Camera className="w-5 h-5" />,
      'Sound Design': <Music className="w-5 h-5" />,
      'Camera Operation': <Camera className="w-5 h-5" />,
      'Drama': <Mic className="w-5 h-5" />,
      'Comedy': <Mic className="w-5 h-5" />,
      'Voice Acting': <Mic className="w-5 h-5" />,
    }
    return iconMap[category] || <Film className="w-5 h-5" />
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
        <div className="container-max px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore Talent
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Discover verified talented individuals who have disabilities ready to contribute to your next project. 
              Filter by role, category, location, and more.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-6">
          <AdvancedSearch
            onFiltersChange={(filters) => {
              // Handle advanced filters here
              console.log('Advanced filters:', filters)
            }}
            onSavedSearchSelect={(search) => {
              // Handle saved search selection
              console.log('Saved search selected:', search)
            }}
            totalResults={filteredTalents.length}
            isLoading={loading}
          />
        </div>
      </div>

      {/* Talent Grid */}
      <div className="container-max px-4 sm:px-6 lg:px-8 py-8">
        {filteredTalents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No talents found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalents.map((talent, index) => (
              <motion.div
                key={talent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-hover group"
              >
                {/* Featured Badge */}
                {talent.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-accent-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      Featured
                    </div>
                  </div>
                )}

                {/* Avatar and Basic Info */}
                <div className="relative mb-4">
                  <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {talent.name.charAt(0)}
                    </div>
                  </div>
                  
                  {/* Verified Badge */}
                  {talent.verified && (
                    <div className="absolute bottom-2 left-2">
                      <div className="bg-success-500 text-white p-1 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Talent Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {talent.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-600">
                        {getCategoryIcon(talent.category)}
                        <span>{talent.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {renderStars(talent.rating)}
                      <span className="text-sm text-gray-600 ml-1">({talent.rating})</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {talent.location}
                  </div>

                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Experience:</span> {talent.experience}
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {talent.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {talent.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{talent.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Languages</div>
                    <div className="flex flex-wrap gap-1">
                      {talent.languages.map((language, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      talent.availability === 'Available' 
                        ? 'bg-success-100 text-success-700' 
                        : 'bg-warning-100 text-warning-700'
                    }`}>
                      {talent.availability}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4">
                    <Link
                      href={`/talent/${talent.id}`}
                      className="flex-1 btn-primary text-center py-2"
                    >
                      <Eye className="w-4 h-4 mr-2 inline" />
                      View Profile
                    </Link>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => {
                        setContactTalent(talent)
                        setShowContactModal(true)
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {contactTalent && (
        <ContactTalent
          talent={{
            id: contactTalent.id,
            name: contactTalent.name,
            role: contactTalent.role,
            category: contactTalent.category,
            location: contactTalent.location,
            rating: contactTalent.rating,
            verified: contactTalent.verified,
            featured: contactTalent.featured,
            contactInfo: {
              email: 'contact@example.com', // This would come from the talent's profile
              phone: '+1-555-0123',
              preferredContact: 'platform'
            },
            stats: {
              responseRate: 95,
              avgResponseTime: '2 hours'
            }
          }}
          isOpen={showContactModal}
          onClose={() => {
            setShowContactModal(false)
            setContactTalent(null)
          }}
          onSend={async (form) => {
            // Handle sending the contact form
            console.log('Sending contact form:', form)
            // In a real app, this would send to an API
            toast.success('Message sent successfully!')
          }}
        />
      )}
    </div>
  )
} 