"use client"
import React, { Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

// Create a loading component for the Suspense fallback
function ResetPasswordLoading() {
  return (
    <div className="p-4 bg-md-surface-container-highest text-md-on-surface-variant rounded-3xl text-center">
      <div className="flex justify-center mb-2">
        <svg className="animate-spin h-6 w-6 text-md-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p>Loading password reset form...</p>
    </div>
  )
}

// Create a client component that uses useSearchParams
const ResetPasswordForm = React.lazy(() => import('./reset-password-form'))

export default function ResetPassword() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-md-background p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-md-surface-container rounded-3xl shadow-md"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="h-12 w-12 rounded-3xl bg-md-primary flex items-center justify-center">
            <span className="text-md-on-primary text-2xl font-bold">A</span>
          </div>
          <h1 className="ml-3 text-2xl font-bold text-md-on-surface">Aptinova</h1>
        </div>
        
        <h2 className="text-3xl font-semibold text-md-on-surface mb-6 text-center">
          Reset Your Password
        </h2>
        
        <Suspense fallback={<ResetPasswordLoading />}>
          <ResetPasswordForm />
        </Suspense>
        
        <div className="mt-6 text-center">
          <Link 
            href="/auth/login"
            className="text-md-primary hover:text-md-primary-container transition-colors duration-200"
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
