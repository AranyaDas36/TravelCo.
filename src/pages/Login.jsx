"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./../context/AuthContext"
import axios from "axios"
import { Eye, EyeOff, Apple, Twitter } from "lucide-react"

const Login = () => {
  // State management
  const { setUser } = useAuth()
  const navigate = useNavigate()

  // Form state
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })

  // Error states
  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Loading state for submit button
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem("authToken")
      if (token) {
        try {
          // Verify token with backend
          const response = await axios.get("http://localhost:5001/api/auth/verify-token", {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (response.data.valid) {
            navigate("/")
          } else {
            // Remove invalid token
            localStorage.removeItem("authToken")
          }
        } catch (error) {
          // Token is invalid
          localStorage.removeItem("authToken")
        }
      }
    }

    checkTokenValidity()
  }, [navigate])

  // Form validation
  const validateForm = () => {
    let isValid = true

    // Email validation
    if (!credentials.email) {
      setEmailError("Email is required")
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      setEmailError("Email is invalid")
      isValid = false
    } else {
      setEmailError("")
    }

    // Password validation
    if (!credentials.password) {
      setPasswordError("Password is required")
      isValid = false
    } else if (credentials.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long")
      isValid = false
    } else {
      setPasswordError("")
    }

    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!validateForm()) {
      return
    }

    // Set loading state
    setIsLoading(true)

    try {
      // Send login request
      const response = await axios.post("http://localhost:5001/api/auth/login", credentials)

      // Check if token exists in response
      if (response.data.token) {
        // Store token in localStorage
        localStorage.setItem("authToken", response.data.token)

        // Update user context
        setUser({
          token: response.data.token,
          ...response.data.user,
        })

        // Navigate to home page
        navigate("/")
      } else {
        setError("Login failed. No token received.")
      }
    } catch (error) {
      // Handle login errors
      setError(error.response?.data?.message || "Login failed, please try again.")
    } finally {
      // Reset loading state
      setIsLoading(false)
    }
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle social login
  const handleSocialLogin = (provider) => {
    // This would be implemented with OAuth in a real application
    console.log(`Login with ${provider}`)
    // For now, just show an alert
    alert(`${provider} login would be implemented with OAuth`)
  }

  // Toggle to signup page
  const goToSignup = () => {
    navigate("/register")
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16">
        <div className="flex-1">
          {/* Logo and tagline */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-serif tracking-wide mb-1">Travel Horizon</h1>
            <p className="text-gray-500 text-sm">Explore More. Experience Life.</p>
          </div>

          {/* Login/Signup toggle buttons */}
          <div className="flex mb-8 space-x-4">
            <button
              onClick={goToSignup}
              className="flex-1 py-3 rounded-md bg-white text-black border border-gray-200 font-medium"
            >
              Sign Up
            </button>
            <button className="flex-1 py-3 rounded-md bg-black text-white font-medium">Log In</button>
          </div>

          <h2 className="text-3xl font-bold mb-8">Begin Your Adventure</h2>

          {/* Social login options */}
          <div className="mb-6">
            <p className="text-sm text-center mb-4">Sign up with Open account</p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleSocialLogin("Apple")}
                className="flex-1 py-2 border border-gray-300 rounded-md flex items-center justify-center"
              >
                <Apple className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleSocialLogin("Google")}
                className="flex-1 py-2 border border-gray-300 rounded-md flex items-center justify-center"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleSocialLogin("Twitter")}
                className="flex-1 py-2 border border-gray-300 rounded-md flex items-center justify-center"
              >
                <Twitter className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
          </div>

          {/* Global error message */}
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="abc@gmail.com"
                value={credentials.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 
                  ${emailError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-black"}`}
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 
                    ${passwordError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-black"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 text-white font-medium rounded-md transition duration-300
                  ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800 focus:ring-2 focus:ring-gray-500"
                  }`}
              >
                {isLoading ? "Logging in..." : "Let's Start"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-teal-50 rounded-tl-3xl rounded-bl-3xl">
          <img
            src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Tropical island with palm trees and seaplane"
            className="w-full h-full object-cover"
          />

          {/* Floating card */}
          <div className="absolute top-16 right-16 bg-white p-4 rounded-lg shadow-lg max-w-xs">
            <div className="flex items-start">
              <div>
                <h3 className="font-bold text-sm">Travel the World, Your Way!</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Discover amazing destinations with personalized journeys & unforgettable experiences.
                </p>
              </div>
              <button className="ml-2 bg-white rounded-full p-1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* Bottom text */}
          <div className="absolute bottom-16 left-16 right-16 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Explore the World, Beyond Boundaries!</h2>
            <p className="text-sm text-gray-600 mt-2">Start your adventure today!</p>

            {/* Navigation dots */}
            <div className="flex justify-center mt-6 space-x-2">
              <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

