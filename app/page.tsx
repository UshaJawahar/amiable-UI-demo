'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Users, 
  Film, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Heart,
  Shield,
  Globe,
  Award
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Verified Talent Pool",
      description: "Curated profiles of skilled individuals who have disabilities, verified through our comprehensive screening process."
    },
    {
      icon: <Film className="w-8 h-8" />,
      title: "Dual Career Tracks",
      description: "Choose between Production roles (behind-the-scenes) and Acting roles (on-screen performance)."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Featured Profiles",
      description: "Standout talents highlighted by our admin team for maximum industry visibility."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Assurance",
      description: "Admin-moderated content ensures professional standards and authentic representation."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Industry Access",
      description: "Direct connection to film studios, OTT platforms, and casting agencies worldwide."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Career Growth",
      description: "Structured pathways for skill development and industry integration."
    }
  ]

  const stats = [
    { number: "500+", label: "Verified Talents" },
    { number: "50+", label: "Industry Partners" },
    { number: "100+", label: "Successful Placements" },
    { number: "95%", label: "Satisfaction Rate" }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Casting Director",
      company: "Netflix",
      content: "This platform has revolutionized how we discover diverse talent. The quality and professionalism of profiles is outstanding.",
      avatar: "/avatars/sarah.jpg"
    },
    {
      name: "Michael Chen",
      role: "Production Manager",
      company: "Disney+",
      content: "The structured approach to talent categorization makes it incredibly easy to find the right people for our projects.",
      avatar: "/avatars/michael.jpg"
    },
    {
      name: "Priya Patel",
      role: "Actor",
      company: "Independent Artist",
      content: "This platform gave me the visibility I needed. Within weeks of joining, I landed my first major role.",
      avatar: "/avatars/priya.jpg"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Empowering{' '}
              <span className="gradient-text">Inclusive</span>{' '}
              Talent in Media
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Connect talented individuals who have disabilities to opportunities in film, television, and OTT industries. 
              Building bridges between inclusive hiring goals and accessible talent pipelines.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="btn-primary text-lg px-8 py-4">
                Join as Talent
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/explore" className="btn-secondary text-lg px-8 py-4">
                Explore Talent
                <Play className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide a comprehensive ecosystem designed specifically to support the distinct skills and perspectives of talent with disabilities and industry professionals seeking inclusive hiring solutions in media and entertainment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-hover group"
              >
                <div className="text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to connect talented individuals with industry opportunities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Register & Verify",
                description: "Create your profile with OTP verification and choose your career track (Production or Acting)."
              },
              {
                step: "02",
                title: "Build Portfolio",
                description: "Upload your work samples, certificates, and showcase your skills with professional presentation."
              },
              {
                step: "03",
                title: "Get Discovered",
                description: "Industry professionals search and connect with verified talent through our curated platform."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What People Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from industry professionals and talented individuals who have experienced the platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of talented individuals and industry professionals creating inclusive opportunities in media.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-200 text-lg">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
              <Link href="/explore" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-all duration-200 text-lg">
                Explore Opportunities
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AmiAble</span>
              </div>
              <p className="text-gray-400">
                Empowering talent who have disabilities in the media industry through inclusive opportunities and professional connections.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Talent</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link href="/explore" className="hover:text-white transition-colors">Browse Opportunities</Link></li>
                <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Industry</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/explore" className="hover:text-white transition-colors">Find Talent</Link></li>
                <li><Link href="/partnership" className="hover:text-white transition-colors">Partnership</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AmiAble. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 