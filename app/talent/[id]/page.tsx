'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Globe, 
  Play, 
  Download,
  Heart,
  Share2,
  MessageCircle,
  Award,
  CheckCircle,
  Eye,
  Clock,
  Users,
  Film,
  Mic,
  Camera,
  Music,
  Edit,
  Flag,
  Bookmark,
  ExternalLink,
  FileText,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import SocialMediaEmbed from '../../components/SocialMediaEmbed'
import { getTalentById } from '../../lib/api'

interface TalentProfile {
  id: string
  name: string
  role: 'production' | 'acting'
  category: string
  location: string
  experience: string
  rating: number
  featured: boolean
  verified: boolean
  hasDisability: boolean
  disabilityType?: string
  bio?: string
  skills: string[]
  languages: string[]
  availability: string
  hourlyRate?: string
  avatar?: string | null
  portfolio: {
    videos: { id: string; title: string; url: string; thumbnail: string; duration: string }[]
    images: { id: string; title: string; url: string; description: string }[]
    documents: { id: string; title: string; url: string; type: string }[]
    socialMediaReels: { id: string; platform: 'instagram' | 'facebook' | 'youtube'; url: string; title: string; description?: string }[]
  }
  workHistory: {
    id: string
    title: string
    company: string
    duration: string
    description: string
    type: 'film' | 'tv' | 'commercial' | 'theater' | 'other'
  }[]
  education: {
    id: string
    degree: string
    institution: string
    year: string
    description: string
  }[]
  certifications: {
    id: string
    name: string
    issuer: string
    year: string
    validUntil?: string
  }[]
  socialLinks: {
    linkedin?: string
    instagram?: string
    twitter?: string
    website?: string
  }
  contactInfo: {
    email: string
    phone?: string
    preferredContact: 'email' | 'phone' | 'platform'
  }
  stats: {
    profileViews: number
    connections: number
    projects: number
    responseRate: number
  }
}

export default function TalentProfilePage({ params }: { params: { id: string } }) {
  const [talent, setTalent] = useState<TalentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'portfolio' | 'experience' | 'contact'>('portfolio')
  const [isFavorite, setIsFavorite] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  // Fetch talent data from API
  useEffect(() => {
    const fetchTalent = async () => {
      try {
        setLoading(true)
        const response = await getTalentById(params.id)
        
        if (response.success) {
          const talentData = response.data
          
          // Transform API data to match our interface
          const transformedTalent: TalentProfile = {
            id: talentData.id,
            name: talentData.name,
            role: talentData.role,
            category: talentData.category,
            location: talentData.location,
            experience: talentData.experience,
            rating: talentData.rating || 4.5,
            featured: talentData.featured || false,
            verified: talentData.verified || true,
            hasDisability: talentData.hasDisability || false,
            disabilityType: talentData.disabilityType,
            bio: talentData.bio,
            skills: talentData.skills || [],
            languages: talentData.languages || [],
            availability: talentData.availability || 'Available',
            avatar: talentData.avatar,
            portfolio: {
              videos: [],
              images: [],
              documents: [],
              socialMediaReels: []
            },
            workHistory: [],
            education: [],
            certifications: [],
            socialLinks: {},
            contactInfo: {
              email: 'contact@example.com', // This would come from the talent's profile
              phone: '+1-555-0123',
              preferredContact: 'email'
            },
            stats: {
              profileViews: 1247,
              connections: 89,
              projects: 23,
              responseRate: 95
            }
          }
          
          setTalent(transformedTalent)
        } else {
          toast.error('Failed to fetch talent profile')
        }
      } catch (error) {
        console.error('Error fetching talent:', error)
        toast.error('Failed to load talent profile')
      } finally {
        setLoading(false)
      }
    }

    fetchTalent()
  }, [params.id])

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks')
  }

  const handleShare = () => {
    navigator.share?.({
      title: `${talent?.name} - Talent Profile`,
      url: window.location.href,
    }).catch(() => {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Profile link copied to clipboard')
    })
  }

  const handleContact = () => {
    setShowContactModal(true)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Drama': <Mic className="w-5 h-5" />,
      'Comedy': <Mic className="w-5 h-5" />,
      'Voice Acting': <Mic className="w-5 h-5" />,
      'Lighting': <Camera className="w-5 h-5" />,
      'Sound Design': <Music className="w-5 h-5" />,
      'Camera Operation': <Camera className="w-5 h-5" />,
    }
    return iconMap[category] || <Film className="w-5 h-5" />
  }

  const getWorkTypeIcon = (type: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'film': <Film className="w-4 h-4" />,
      'tv': <Film className="w-4 h-4" />,
      'commercial': <Film className="w-4 h-4" />,
      'theater': <Users className="w-4 h-4" />,
      'other': <Film className="w-4 h-4" />,
    }
    return iconMap[type] || <Film className="w-4 h-4" />
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

  if (!talent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Talent Not Found</h2>
          <p className="text-gray-600 mb-4">The talent profile you're looking for doesn't exist.</p>
          <Link href="/explore" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/explore" className="flex items-center text-primary-600 hover:text-primary-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explore
            </Link>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite ? 'text-error-600 bg-error-50' : 'text-gray-400 hover:text-error-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:text-primary-600'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-max px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex items-start space-x-6">
                {talent.avatar ? (
                  <img 
                    src={talent.avatar} 
                    alt={talent.name}
                    className="w-24 h-24 rounded-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold ${talent.avatar ? 'hidden' : ''}`}>
                  {talent.name.charAt(0)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{talent.name}</h1>
                    {talent.verified && (
                      <div className="bg-success-500 text-white p-1 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                    {talent.featured && (
                      <div className="bg-accent-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        <Award className="w-3 h-3 inline mr-1" />
                        Featured
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(talent.category)}
                      <span>{talent.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{talent.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{talent.experience}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    {renderStars(talent.rating)}
                    <span className="text-sm text-gray-600">({talent.rating})</span>
                  </div>
                  
                  {talent.bio && (
                    <p className="text-gray-700 leading-relaxed">{talent.bio}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Skills and Languages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills & Languages</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Skills</h4>
                  {talent.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {talent.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No skills listed</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Languages</h4>
                  {talent.languages.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {talent.languages.map((language, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-secondary-100 text-secondary-700 text-sm rounded-full"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No languages listed</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {[
                    { id: 'portfolio', label: 'Portfolio', count: talent.portfolio.videos.length + talent.portfolio.images.length },
                    { id: 'experience', label: 'Experience', count: talent.workHistory.length },
                    { id: 'contact', label: 'Contact', count: 0 }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'portfolio' && (
                  <motion.div
                    key="portfolio"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Videos */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Videos</h4>
                      {talent.portfolio.videos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {talent.portfolio.videos.map((video) => (
                            <div key={video.id} className="relative group cursor-pointer">
                              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                  <Play className="w-12 h-12 text-white opacity-80" />
                                </div>
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                                <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                              </div>
                              <div className="mt-2">
                                <h5 className="font-medium text-gray-900">{video.title}</h5>
                                <p className="text-sm text-gray-600">{video.duration}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Film className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500">No videos uploaded</p>
                        </div>
                      )}
                    </div>

                    {/* Images */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Images</h4>
                      {talent.portfolio.images.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {talent.portfolio.images.map((image) => (
                            <div key={image.id} className="group cursor-pointer">
                              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                  <Camera className="w-8 h-8 text-gray-500" />
                                </div>
                              </div>
                              <div className="mt-2">
                                <h5 className="font-medium text-gray-900 text-sm">{image.title}</h5>
                                <p className="text-xs text-gray-600">{image.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500">No images uploaded</p>
                        </div>
                      )}
                    </div>

                    {/* Documents */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Documents</h4>
                      {talent.portfolio.documents.length > 0 ? (
                        <div className="space-y-3">
                          {talent.portfolio.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-gray-400" />
                                <div>
                                  <h5 className="font-medium text-gray-900">{doc.title}</h5>
                                  <p className="text-sm text-gray-600">{doc.type.toUpperCase()}</p>
                                </div>
                              </div>
                              <button className="text-primary-600 hover:text-primary-700">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500">No documents uploaded</p>
                        </div>
                      )}
                    </div>

                    {/* Social Media Reels */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Social Media Reels</h4>
                      {talent.portfolio.socialMediaReels.length > 0 ? (
                        <SocialMediaEmbed
                          reels={talent.portfolio.socialMediaReels}
                          onReelsChange={() => {}} // Read-only in profile view
                          isEditable={false}
                        />
                      ) : (
                        <div className="text-center py-8">
                          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500">No social media links attached</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'experience' && (
                  <motion.div
                    key="experience"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Work History */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Work History</h4>
                      {talent.workHistory.length > 0 ? (
                        <div className="space-y-4">
                          {talent.workHistory.map((work) => (
                            <div key={work.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                {getWorkTypeIcon(work.type)}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{work.title}</h5>
                                <p className="text-sm text-gray-600">{work.company}</p>
                                <p className="text-sm text-gray-500">{work.duration}</p>
                                <p className="text-sm text-gray-700 mt-2">{work.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Film className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500">No work history available</p>
                        </div>
                      )}
                    </div>

                    {/* Education */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Education</h4>
                      {talent.education.length > 0 ? (
                        <div className="space-y-4">
                          {talent.education.map((edu) => (
                            <div key={edu.id} className="p-4 border border-gray-200 rounded-lg">
                              <h5 className="font-medium text-gray-900">{edu.degree}</h5>
                              <p className="text-sm text-gray-600">{edu.institution}</p>
                              <p className="text-sm text-gray-500">{edu.year}</p>
                              <p className="text-sm text-gray-700 mt-2">{edu.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500">No education information available</p>
                        </div>
                      )}
                    </div>

                    {/* Certifications */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h4>
                      {talent.certifications.length > 0 ? (
                        <div className="space-y-4">
                          {talent.certifications.map((cert) => (
                            <div key={cert.id} className="p-4 border border-gray-200 rounded-lg">
                              <h5 className="font-medium text-gray-900">{cert.name}</h5>
                              <p className="text-sm text-gray-600">{cert.issuer}</p>
                              <p className="text-sm text-gray-500">{cert.year}</p>
                              {cert.validUntil && (
                                <p className="text-sm text-gray-500">Valid until: {cert.validUntil}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500">No certificates attached</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'contact' && (
                  <motion.div
                    key="contact"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{talent.contactInfo.email}</span>
                        </div>
                        {talent.contactInfo.phone && (
                          <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900">{talent.contactInfo.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{talent.location}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{talent.availability}</span>
                        </div>
                        {talent.hourlyRate && (
                          <div className="flex items-center space-x-3">
                            <Award className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900">Rate: {talent.hourlyRate}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Social Links */}
                    {Object.values(talent.socialLinks).some(link => link) ? (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h4>
                        <div className="flex space-x-4">
                          {talent.socialLinks.linkedin && (
                            <a
                              href={talent.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {talent.socialLinks.instagram && (
                            <a
                              href={talent.socialLinks.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {talent.socialLinks.website && (
                            <a
                              href={talent.socialLinks.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <Globe className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h4>
                        <div className="text-center py-8">
                          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500">No social links attached</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
              <button
                onClick={handleContact}
                className="w-full btn-primary mb-3"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact {talent.name}
              </button>
              <button className="w-full btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </button>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Profile Views</span>
                  </div>
                  <span className="font-medium text-gray-900">{talent.stats.profileViews.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Connections</span>
                  </div>
                  <span className="font-medium text-gray-900">{talent.stats.connections}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Film className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Projects</span>
                  </div>
                  <span className="font-medium text-gray-900">{talent.stats.projects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Response Rate</span>
                  </div>
                  <span className="font-medium text-gray-900">{talent.stats.responseRate}%</span>
                </div>
              </div>
            </motion.div>

            {/* Similar Talents */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Talents</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Similar Talent {i}</p>
                      <p className="text-xs text-gray-600">Drama • New York</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact {talent.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Project inquiry, collaboration, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="Tell us about your project or opportunity..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowContactModal(false)
                    toast.success('Message sent successfully!')
                  }}
                  className="flex-1 btn-primary"
                >
                  Send Message
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 