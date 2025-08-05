'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, File, Image, Video, FileText, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void
  onRemove?: (filename: string) => void
  acceptedTypes?: string[]
  maxFiles?: number
  maxSize?: number // in MB
  folder?: string
  className?: string
}

export interface UploadedFile {
  url: string
  filename: string
  size: number
  contentType: string
  originalName: string
}

export default function FileUpload({
  onUpload,
  onRemove,
  acceptedTypes = ['image/*', 'video/*', 'application/pdf'],
  maxFiles = 5,
  maxSize = 10, // 10MB default
  folder = 'uploads',
  className = ''
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const selectedFiles = Array.from(files)
    
    // Validate file count
    if (uploadedFiles.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', ''))
        }
        return file.type === type
      })

      const isValidSize = file.size <= maxSize * 1024 * 1024

      if (!isValidType) {
        alert(`${file.name} is not an accepted file type`)
      }
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is ${maxSize}MB`)
      }

      return isValidType && isValidSize
    })

    if (validFiles.length === 0) return

    setIsUploading(true)

    try {
      // Mock file upload - in a real app, this would upload to your storage solution
      const mockUploadedFiles = validFiles.map((file, index) => ({
        url: URL.createObjectURL(file), // Temporary URL for demo
        filename: `${folder}/${Date.now()}-${index}-${file.name}`,
        size: file.size,
        contentType: file.type,
        originalName: file.name
      }))

      const allFiles = [...uploadedFiles, ...mockUploadedFiles]
      setUploadedFiles(allFiles)
      onUpload(allFiles)
      
      // Show success message
      console.log('Files uploaded successfully:', mockUploadedFiles)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = async (filename: string) => {
    try {
      // Mock file removal - in a real app, this would delete from your storage solution
      const updatedFiles = uploadedFiles.filter(file => file.filename !== filename)
      setUploadedFiles(updatedFiles)
      onUpload(updatedFiles)
      onRemove?.(filename)
      
      console.log('File removed successfully:', filename)
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to remove file')
    }
  }

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return <Image className="w-4 h-4" />
    if (contentType.startsWith('video/')) return <Video className="w-4 h-4" />
    if (contentType === 'application/pdf') return <FileText className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          handleFileSelect(e.dataTransfer.files)
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop files here, or{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            browse
          </button>
        </p>
        <p className="text-xs text-gray-500">
          Accepted types: {acceptedTypes.join(', ')} | Max size: {maxSize}MB | Max files: {maxFiles}
        </p>

        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={file.filename}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.contentType)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file.filename)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 