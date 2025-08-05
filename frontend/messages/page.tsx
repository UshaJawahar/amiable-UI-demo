'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  Mail,
  User,
  Building,
  Star,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Smile,
  Image,
  FileText,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Archive,
  Trash2,
  Flag,
  Blocks, // Changed from Block which doesn't exist
  Calendar,
  MapPin,
  Award,
  MessageCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  type: 'text' | 'image' | 'file' | 'audio'
  timestamp: Date
  read: boolean
  attachments?: {
    name: string
    url: string
    type: string
    size: string
  }[]
}

interface Conversation {
  id: string
  participant: {
    id: string
    name: string
    avatar: string
    role: 'talent' | 'professional'
    category: string
    verified: boolean
    online: boolean
    lastSeen?: Date
  }
  lastMessage: {
    content: string
    timestamp: Date
    senderId: string
    unreadCount: number
  }
  project?: {
    id: string
    title: string
    type: string
    status: 'active' | 'completed' | 'pending'
  }
}

interface User {
  id: string
  name: string
  email: string
  role: 'talent' | 'professional'
  avatar: string
  verified: boolean
  online: boolean
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockCurrentUser: User = {
      id: 'current-user',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'professional',
      avatar: '/avatars/john.jpg',
      verified: true,
      online: true
    }

    const mockConversations: Conversation[] = [
      {
        id: '1',
        participant: {
          id: 'emma',
          name: 'Emma Thompson',
          avatar: '/avatars/emma.jpg',
          role: 'talent',
          category: 'Drama',
          verified: true,
          online: true
        },
        lastMessage: {
          content: 'Thank you for the opportunity! I\'m very excited about this project.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          senderId: 'emma',
          unreadCount: 2
        },
        project: {
          id: 'proj-1',
          title: 'Netflix Drama Series',
          type: 'TV Series',
          status: 'active'
        }
      },
      {
        id: '2',
        participant: {
          id: 'alex',
          name: 'Alex Rodriguez',
          avatar: '/avatars/alex.jpg',
          role: 'talent',
          category: 'Lighting',
          verified: true,
          online: false,
          lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        },
        lastMessage: {
          content: 'I\'ve sent you my updated portfolio with the latest work.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          senderId: 'alex',
          unreadCount: 0
        }
      },
      {
        id: '3',
        participant: {
          id: 'sarah',
          name: 'Sarah Chen',
          avatar: '/avatars/sarah.jpg',
          role: 'talent',
          category: 'Voice Acting',
          verified: true,
          online: true
        },
        lastMessage: {
          content: 'When would you like to schedule the voice recording session?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          senderId: 'current-user',
          unreadCount: 0
        },
        project: {
          id: 'proj-2',
          title: 'Animated Feature Film',
          type: 'Film',
          status: 'pending'
        }
      }
    ]

    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: 'emma',
        receiverId: 'current-user',
        content: 'Hi! I saw your casting call for the Netflix drama series. I\'m very interested in the lead role.',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true
      },
      {
        id: '2',
        senderId: 'current-user',
        receiverId: 'emma',
        content: 'Hello Emma! Thank you for your interest. I\'ve reviewed your profile and I\'m impressed with your work.',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
        read: true
      },
      {
        id: '3',
        senderId: 'emma',
        receiverId: 'current-user',
        content: 'Thank you! I\'ve attached my latest audition tape for your review.',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
        read: true,
        attachments: [
          {
            name: 'emma-audition-tape.mp4',
            url: '/uploads/emma-audition-tape.mp4',
            type: 'video',
            size: '15.2 MB'
          }
        ]
      },
      {
        id: '4',
        senderId: 'current-user',
        receiverId: 'emma',
        content: 'Excellent work! The audition tape is exactly what we\'re looking for. Can you tell me more about your availability for the next few months?',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        read: true
      },
      {
        id: '5',
        senderId: 'emma',
        receiverId: 'current-user',
        content: 'Thank you for the opportunity! I\'m very excited about this project.',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false
      }
    ]

    setCurrentUser(mockCurrentUser)
    setConversations(mockConversations)
    setMessages(mockMessages)
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser!.id,
      receiverId: selectedConversation.participant.id,
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
      read: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? {
            ...conv,
            lastMessage: {
              content: newMessage,
              timestamp: new Date(),
              senderId: currentUser!.id,
              unreadCount: 0
            }
          }
        : conv
    ))

    toast.success('Message sent!')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !selectedConversation) return

    Array.from(files).forEach((file: File) => { // Fixed file typing
      const message: Message = {
        id: Date.now().toString(),
        senderId: currentUser!.id,
        receiverId: selectedConversation.participant.id,
        content: `Sent ${file.name}`,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        timestamp: new Date(),
        read: false,
        attachments: [
          {
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type,
            size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
          }
        ]
      }

      setMessages(prev => [...prev, message])
    })

    toast.success('File uploaded!')
  }

  const handleVoiceMessage = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      toast.success('Recording started...')
      // In real app, implement actual voice recording
    } else {
      toast.success('Voice message sent!')
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participant.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 1000 / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getRoleIcon = (role: string) => {
    return role === 'talent' ? <User size={16} /> : <Building size={16} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen flex">
        {/* Conversations Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings size={20} />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-primary-50 border-primary-200' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {conversation.participant.name.charAt(0)}
                      </div>
                      {conversation.participant.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 truncate">
                            {conversation.participant.name}
                          </h3>
                          {conversation.participant.verified && (
                            <CheckCircle size={16} className="text-success-500" />
                          )}
                          {getRoleIcon(conversation.participant.role)}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {conversation.lastMessage.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {conversation.participant.category}
                        </span>
                        {conversation.lastMessage.unreadCount > 0 && (
                          <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                            {conversation.lastMessage.unreadCount}
                          </span>
                        )}
                      </div>
                      
                      {conversation.project && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-700">
                              {conversation.project.title}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              conversation.project.status === 'active' ? 'bg-success-100 text-success-700' :
                              conversation.project.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                              'bg-warning-100 text-warning-700'
                            }`}>
                              {conversation.project.status}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedConversation.participant.name.charAt(0)}
                      </div>
                      {selectedConversation.participant.online ? (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-white rounded-full"></span>
                      ) : null}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="font-semibold text-gray-900">
                          {selectedConversation.participant.name}
                        </h2>
                        {selectedConversation.participant.verified && (
                          <CheckCircle size={16} className="text-success-500" />
                        )}
                        {getRoleIcon(selectedConversation.participant.role)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedConversation.participant.category}
                        {selectedConversation.participant.online ? ' • Online' : 
                         selectedConversation.participant.lastSeen ? 
                         ` • Last seen ${formatTime(selectedConversation.participant.lastSeen)}` : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Phone size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Video size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Mail size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${
                        message.senderId === currentUser?.id 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-white border border-gray-200'
                      } rounded-lg p-3 shadow-sm`}>
                        <p className="text-sm">{message.content}</p>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment, index) => (
                              <div
                                key={index}
                                className={`p-2 rounded border ${
                                  message.senderId === currentUser?.id 
                                    ? 'bg-primary-600 border-primary-400' 
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  {attachment.type.startsWith('image/') ? (
                                    <Image size={16} />
                                  ) : attachment.type.startsWith('video/') ? (
                                    <Video size={16} />
                                  ) : (
                                    <FileText size={16} />
                                  )}
                                  <span className="text-xs truncate">{attachment.name}</span>
                                </div>
                                <p className="text-xs opacity-75 mt-1">{attachment.size}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className={`flex items-center justify-between mt-2 text-xs ${
                          message.senderId === currentUser?.id ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {message.senderId === currentUser?.id && (
                            <div className="flex items-center space-x-1">
                              {message.read ? (
                                <CheckCircle size={12} />
                              ) : (
                                <Clock size={12} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">Typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <div className="flex items-end space-x-2">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e: React.KeyboardEvent) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={1}
                      />
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          <Paperclip size={20} />
                        </button>
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          <Smile size={20} />
                        </button>
                        <button
                          onClick={handleVoiceMessage}
                          className={`p-2 rounded-lg ${
                            isRecording 
                              ? 'bg-error-500 text-white' 
                              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                      </div>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*,video/*,.pdf,.doc,.docx"
                    />
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}