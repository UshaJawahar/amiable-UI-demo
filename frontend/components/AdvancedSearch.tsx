'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Users, 
  Film, 
  Mic, 
  Camera, 
  Music,
  X,
  Save,
  Bookmark,
  Sliders,
  Calendar,
  DollarSign,
  Globe,
  Award,
  CheckCircle,
  Eye,
  Heart,
  MessageCircle,
  Plus,
  Minus
} from 'lucide-react'

interface SearchFilters {
  query: string
  role: string[]
  category: string[]
  location: string[]
  experience: string[]
  skills: string[]
  languages: string[]
  availability: string[]
  rating: number
  verified: boolean
  featured: boolean
  hasDisability: boolean
  hourlyRate: {
    min: number
    max: number
  }
  portfolio: {
    hasVideos: boolean
    hasImages: boolean
    hasDocuments: boolean
  }
}

interface SavedSearch {
  id: string
  name: string
  filters: SearchFilters
  createdAt: Date
  resultCount: number
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void
  onSavedSearchSelect: (search: SavedSearch) => void
  totalResults: number
  isLoading?: boolean
}

export default function AdvancedSearch({ 
  onFiltersChange, 
  onSavedSearchSelect, 
  totalResults, 
  isLoading = false 
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    role: [],
    category: [],
    location: [],
    experience: [],
    skills: [],
    languages: [],
    availability: [],
    rating: 0,
    verified: false,
    featured: false,
    hasDisability: false,
    hourlyRate: { min: 0, max: 1000 },
    portfolio: {
      hasVideos: false,
      hasImages: false,
      hasDocuments: false
    }
  })

  const [showFilters, setShowFilters] = useState(false)
  const [showSavedSearches, setShowSavedSearches] = useState(false)
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [newLanguage, setNewLanguage] = useState('')

  // Available options
  const roles = ['production', 'acting']
  const categories = {
    production: ['Lighting', 'Sound Design', 'Camera Operation', 'Editing', 'Production Management', 'Art Direction', 'Costume Design', 'Makeup', 'Stunt Coordination'],
    acting: ['Drama', 'Comedy', 'Action', 'Romance', 'Horror', 'Sci-Fi', 'Documentary', 'Commercial', 'Voice Acting', 'Theater']
  }
  const locations = ['Los Angeles, CA', 'New York, NY', 'Atlanta, GA', 'Miami, FL', 'Austin, TX', 'Chicago, IL', 'Seattle, WA', 'Denver, CO', 'Nashville, TN', 'Portland, OR']
  const experienceLevels = ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years']
  const availabilityOptions = ['Available Now', 'Available Next Week', 'Available Next Month', 'Available on Request']
  const commonSkills = ['Method Acting', 'Voice Training', 'Stage Combat', 'LED Lighting', 'Color Theory', 'Audio Mixing', 'Foley', 'Cinematography', 'Video Editing', 'Script Writing']
  const commonLanguages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi']

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleArrayFilterChange = (key: keyof SearchFilters, value: string, action: 'add' | 'remove') => {
    setFilters(prev => ({
      ...prev,
      [key]: action === 'add' 
        ? [...(prev[key] as string[]), value]
        : (prev[key] as string[]).filter(item => item !== value)
    }))
  }

  const handleSaveSearch = () => {
    const searchName = prompt('Enter a name for this search:')
    if (!searchName) return

    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName,
      filters: { ...filters },
      createdAt: new Date(),
      resultCount: totalResults
    }

    setSavedSearches(prev => [newSavedSearch, ...prev])
    setShowSavedSearches(false)
  }

  const handleLoadSavedSearch = (search: SavedSearch) => {
    setFilters(search.filters)
    onSavedSearchSelect(search)
    setShowSavedSearches(false)
  }

  const clearAllFilters = () => {
    setFilters({
      query: '',
      role: [],
      category: [],
      location: [],
      experience: [],
      skills: [],
      languages: [],
      availability: [],
      rating: 0,
      verified: false,
      featured: false,
      hasDisability: false,
      hourlyRate: { min: 0, max: 1000 },
      portfolio: {
        hasVideos: false,
        hasImages: false,
        hasDocuments: false
      }
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.query) count++
    if (filters.role.length > 0) count++
    if (filters.category.length > 0) count++
    if (filters.location.length > 0) count++
    if (filters.experience.length > 0) count++
    if (filters.skills.length > 0) count++
    if (filters.languages.length > 0) count++
    if (filters.availability.length > 0) count++
    if (filters.rating > 0) count++
    if (filters.verified) count++
    if (filters.featured) count++
    if (filters.hasDisability) count++
    if (filters.hourlyRate.min > 0 || filters.hourlyRate.max < 1000) count++
    if (filters.portfolio.hasVideos || filters.portfolio.hasImages || filters.portfolio.hasDocuments) count++
    return count
  }

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={filters.query}
          onChange={(e) => handleFilterChange('query', e.target.value)}
          placeholder="Search by name, skills, or keywords..."
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
          <button
            onClick={() => setShowSavedSearches(!showSavedSearches)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Saved Searches"
          >
            <Bookmark className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-primary-100 text-primary-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title="Advanced Filters"
          >
            <Sliders className="h-5 w-5" />
            {getActiveFiltersCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{totalResults} results found</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveSearch}
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <Save className="h-4 w-4 mr-1" />
            Save Search
          </button>
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Saved Searches Dropdown */}
      <AnimatePresence>
        {showSavedSearches && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4"
          >
            <h3 className="font-medium text-gray-900 mb-3">Saved Searches</h3>
            {savedSearches.length === 0 ? (
              <p className="text-gray-500 text-sm">No saved searches yet</p>
            ) : (
              <div className="space-y-2">
                {savedSearches.map((search) => (
                  <button
                    key={search.id}
                    onClick={() => handleLoadSavedSearch(search)}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{search.name}</span>
                      <span className="text-sm text-gray-500">{search.resultCount} results</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {search.createdAt.toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Role */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Role Type</h4>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <label key={role} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.role.includes(role)}
                        onChange={(e) => handleArrayFilterChange('role', role, e.target.checked ? 'add' : 'remove')}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Object.entries(categories).map(([role, cats]) => 
                    cats.map((cat) => (
                      <label key={cat} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.category.includes(cat)}
                          onChange={(e) => handleArrayFilterChange('category', cat, e.target.checked ? 'add' : 'remove')}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{cat}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Location</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {locations.map((location) => (
                    <label key={location} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.location.includes(location)}
                        onChange={(e) => handleArrayFilterChange('location', location, e.target.checked ? 'add' : 'remove')}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Experience Level</h4>
                <div className="space-y-2">
                  {experienceLevels.map((exp) => (
                    <label key={exp} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.experience.includes(exp)}
                        onChange={(e) => handleArrayFilterChange('experience', exp, e.target.checked ? 'add' : 'remove')}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{exp}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Skills</h4>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add skill..."
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      onClick={() => {
                        if (newSkill.trim() && !filters.skills.includes(newSkill.trim())) {
                          handleArrayFilterChange('skills', newSkill.trim(), 'add')
                          setNewSkill('')
                        }
                      }}
                      className="px-2 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {filters.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                      >
                        {skill}
                        <button
                          onClick={() => handleArrayFilterChange('skills', skill, 'remove')}
                          className="ml-1 text-primary-500 hover:text-primary-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    Common: {commonSkills.slice(0, 3).join(', ')}...
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Languages</h4>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Add language..."
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      onClick={() => {
                        if (newLanguage.trim() && !filters.languages.includes(newLanguage.trim())) {
                          handleArrayFilterChange('languages', newLanguage.trim(), 'add')
                          setNewLanguage('')
                        }
                      }}
                      className="px-2 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {filters.languages.map((language) => (
                      <span
                        key={language}
                        className="inline-flex items-center px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full"
                      >
                        {language}
                        <button
                          onClick={() => handleArrayFilterChange('languages', language, 'remove')}
                          className="ml-1 text-secondary-500 hover:text-secondary-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Rating */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600">{filters.rating}+</span>
                  </div>
                </div>

                {/* Hourly Rate */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Hourly Rate ($)</h4>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.hourlyRate.min}
                        onChange={(e) => handleFilterChange('hourlyRate', { ...filters.hourlyRate, min: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.hourlyRate.max}
                        onChange={(e) => handleFilterChange('hourlyRate', { ...filters.hourlyRate, max: parseInt(e.target.value) || 1000 })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Portfolio */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Portfolio</h4>
                  <div className="space-y-2">
                    {Object.entries(filters.portfolio).map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleFilterChange('portfolio', { ...filters.portfolio, [key]: e.target.checked })}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          Has {key.replace('has', '').toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Status</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.verified}
                        onChange={(e) => handleFilterChange('verified', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Verified Only</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.featured}
                        onChange={(e) => handleFilterChange('featured', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Featured Only</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.hasDisability}
                        onChange={(e) => handleFilterChange('hasDisability', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Talent with Disabilities</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 