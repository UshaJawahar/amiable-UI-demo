'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, UserCheck, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function RegistrationSuccessPage() {
  const steps = [
    {
      icon: <CheckCircle className="w-8 h-8 text-success-500" />,
      title: 'Application Submitted',
      description: 'Your application has been successfully submitted and is now under review.',
      status: 'completed'
    },
    {
      icon: <Clock className="w-8 h-8 text-warning-500" />,
      title: 'Admin Review',
      description: 'Our admin team will carefully review your application within 24-48 hours.',
      status: 'current'
    },
    {
      icon: <UserCheck className="w-8 h-8 text-primary-500" />,
      title: 'Approval Decision',
      description: 'You will receive an email notification once your application is approved or rejected.',
      status: 'pending'
    },
    {
      icon: <Mail className="w-8 h-8 text-secondary-500" />,
      title: 'Login Access',
      description: 'Once approved, you can login to your account and start using the platform.',
      status: 'pending'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thank you for applying to AmiAble. Your application is now under review.
            </p>
          </motion.div>

          {/* What Happens Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What Happens Next?
            </h2>
            
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`flex items-start space-x-4 p-4 rounded-lg ${
                    step.status === 'completed' ? 'bg-success-50 border border-success-200' :
                    step.status === 'current' ? 'bg-warning-50 border border-warning-200' :
                    'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                  {step.status === 'completed' && (
                    <CheckCircle className="w-6 h-6 text-success-500 flex-shrink-0" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Important Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card bg-primary-50 border border-primary-200"
          >
            <h3 className="text-xl font-semibold text-primary-900 mb-4">
              Important Information
            </h3>
            <div className="space-y-3 text-primary-800">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Review time: 24-48 hours</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>You will receive an email notification with the decision</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>If approved, you can immediately login to your account</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>If rejected, you can reapply after 30 days</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <Link
              href="/"
              className="btn-secondary flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <Link
              href="/login"
              className="btn-primary flex items-center justify-center"
            >
              Check Login Status
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 