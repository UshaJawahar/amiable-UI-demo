'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Plus, 
  X, 
  Play,
  ExternalLink,
  AlertCircle
} from 'lucide-react'
import ReactPlayer from 'react-player'

interface SocialMediaReel {
  id: string
  platform: 'instagram' | 'facebook' | 'youtube'
  url: string
  title: string
  description?: string
  thumbnail?: string
}

interface SocialMediaEmbedProps {
  reels: SocialMediaReel[]
  onReelsChange: (reels: SocialMediaReel[]) => void
  isEditable?: boolean
  maxReels?: number
}

export default function SocialMediaEmbed({ 
  reels, 
  onReelsChange, 
  isEditable = false, 
  maxReels = 10 
}: SocialMediaEmbedProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newReel, setNewReel] = useState({
    platform: 'instagram' as const,
    url: '',
    title: '',
    description: ''
  })
  const [error, setError] = useState('')

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />
      case 'facebook':
        return <Facebook className="w-5 h-5" />
      case 'youtube':
        return <Youtube className="w-5 h-5" />
      default:
        return <ExternalLink className="w-5 h-5" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500'
      case 'facebook':
        return 'bg-blue-600'
      case 'youtube':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  const validateUrl = (url: string, platform: string) => {
    const patterns = {
      instagram: /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/.*/,
      facebook: /^https?:\/\/(www\.)?(facebook\.com|fb\.com)\/.*/,
      youtube: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.*/
    }
    
    return patterns[platform as keyof typeof patterns]?.test(url) || false
  }

  const extractVideoId = (url: string, platform: string) => {
    switch (platform) {
      case 'youtube':
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
        return youtubeMatch ? youtubeMatch[1] : null
      case 'instagram':
        const instagramMatch = url.match(/instagram\.com\/p\/([^\/\n?#]+)/)
        return instagramMatch ? instagramMatch[1] : null
      case 'facebook':
        const facebookMatch = url.match(/facebook\.com\/.*\/videos\/(\d+)/)
        return facebookMatch ? facebookMatch[1] : null
      default:
        return null
    }
  }

  const handleAddReel = () => {
    setError('')
    
    if (!newReel.url.trim()) {
      setError('Please enter a URL')
      return
    }

    if (!validateUrl(newReel.url, newReel.platform)) {
      setError(`Please enter a valid ${newReel.platform} URL`)
      return
    }

    if (!newReel.title.trim()) {
      setError('Please enter a title')
      return
    }

    if (reels.length >= maxReels) {
      setError(`Maximum ${maxReels} reels allowed`)
      return
    }

    const videoId = extractVideoId(newReel.url, newReel.platform)
    if (!videoId) {
      setError('Could not extract video ID from URL')
      return
    }

    const reel: SocialMediaReel = {
      id: Date.now().toString(),
      platform: newReel.platform,
      url: newReel.url,
      title: newReel.title,
      description: newReel.description || undefined
    }

    onReelsChange([...reels, reel])
    setNewReel({ platform: 'instagram', url: '', title: '', description: '' })
    setShowAddForm(false)
  }

  const handleRemoveReel = (id: string) => {
    onReelsChange(reels.filter(reel => reel.id !== id))
  }

  const renderEmbeddedVideo = (reel: SocialMediaReel) => {
    const videoId = extractVideoId(reel.url, reel.platform)
    
    if (reel.platform === 'youtube' && videoId) {
      return (
        <div className="aspect-video w-full">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${videoId}`}
            width="100%"
            height="100%"
            controls
            light
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0
                }
              }
            }}
          />
        </div>
      )
    }

    // For Instagram and Facebook, we'll show a preview with link
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-white mb-3 ${getPlatformColor(reel.platform)}`}>
            {getPlatformIcon(reel.platform)}
          </div>
          <p className="text-sm text-gray-600 mb-2">Preview not available</p>
          <a
            href={reel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm"
          >
            View on {reel.platform.charAt(0).toUpperCase() + reel.platform.slice(1)}
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Social Media Reels</h3>
        {isEditable && reels.length < maxReels && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Reel
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border border-gray-200 rounded-lg bg-gray-50"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={newReel.platform}
                onChange={(e) => setNewReel({ ...newReel, platform: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reel URL
              </label>
              <input
                type="url"
                value={newReel.url}
                onChange={(e) => setNewReel({ ...newReel, url: e.target.value })}
                placeholder={`Enter ${newReel.platform} reel URL`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={newReel.title}
                onChange={(e) => setNewReel({ ...newReel, title: e.target.value })}
                placeholder="Enter reel title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={newReel.description}
                onChange={(e) => setNewReel({ ...newReel, description: e.target.value })}
                placeholder="Enter description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleAddReel}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Reel
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setError('')
                  setNewReel({ platform: 'instagram', url: '', title: '', description: '' })
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {reels.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
          <p>No reels added yet</p>
          {isEditable && (
            <p className="text-sm">Click "Add Reel" to showcase your social media content</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reels.map((reel) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              {renderEmbeddedVideo(reel)}
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${getPlatformColor(reel.platform)}`}>
                      {getPlatformIcon(reel.platform)}
                    </div>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {reel.platform}
                    </span>
                  </div>
                  
                  {isEditable && (
                    <button
                      onClick={() => handleRemoveReel(reel.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <h4 className="font-medium text-gray-900 mb-1">{reel.title}</h4>
                {reel.description && (
                  <p className="text-sm text-gray-600">{reel.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
} 