"use client"
import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get token and userType from URL
  const token = searchParams?.get("token") || ""
  const userType = searchParams?.get("userType") || ""

  useEffect(() => {
    if (!token || !userType) {
      setError("Invalid reset link. Please request a new password reset link.")
    }
  }, [token, userType])

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    // Length check
    if (password.length >= 8) strength += 25
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 25
    // Contains number
    if (/\d/.test(password)) strength += 25
    // Contains special char
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25

    setPasswordStrength(strength)
  }, [password])

  const getStrengthColor = () => {
    if (passwordStrength < 50) return "bg-md-error"
    if (passwordStrength < 75) return "bg-md-tertiary"
    return "bg-md-primary"
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Reset error state
    setError("")
    
    // Validate inputs
    if (!password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }
    
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }
    
    if (passwordStrength < 50) {
      setError("Please choose a stronger password")
      return
    }
    
    setLoading(true)
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          token,
          password,
          userType
        }
      )
      
      setSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (error) {
      console.error("Error resetting password:", error)
      setError(
        error.response?.data?.error || 
        "Failed to reset password. The link may have expired."
      )
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 mb-6 bg-md-primary-container text-md-on-primary-container rounded-3xl text-center"
      >
        <p>Your password has been successfully reset!</p>
        <p className="mt-2">Redirecting to login page...</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-md-error-container text-md-on-error-container rounded-3xl text-center">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="relative">
          <input
            id="password"
            name="password"
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-6 pt-6 pb-1 text-xl rounded-3xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            New Password
          </label>
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-6 text-md-on-surface-variant"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Password strength indicator */}
        {password && (
          <div className="space-y-1">
            <div className="h-1 w-full bg-md-outline rounded">
              <div 
                className={`h-full rounded transition-all ${getStrengthColor()}`}
                style={{ width: `${passwordStrength}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-md-on-surface-variant">
              <span>Weak</span>
              <span>Medium</span>
              <span>Strong</span>
            </div>
          </div>
        )}
        
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={passwordVisible ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full px-6 pt-6 pb-1 text-xl rounded-3xl appearance-none focus:outline-none peer border border-md-outline focus:border-md-primary bg-transparent text-md-on-surface"
            placeholder=" "
          />
          <label
            htmlFor="confirmPassword"
            className="absolute duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 text-md-on-surface-variant peer-focus:text-md-primary"
          >
            Confirm Password
          </label>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-6 rounded-3xl bg-md-primary text-md-on-primary hover:bg-md-primary-container hover:text-md-on-primary-container transition-colors duration-200 font-medium text-xl ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Resetting Password...
          </span>
        ) : (
          "Reset Password"
        )}
      </button>
    </form>
  )
}
