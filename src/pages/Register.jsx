"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import axios from "axios"
import axiosInstance from "../admin/axiosInstance"

const Signup = () => {
  const navigate = useNavigate()

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateForm = () => {
    let isValid = true

    if (!credentials.name) {
      setError("Name is required")
      isValid = false
    } else {
      setError("")
    }

    if (!credentials.email) {
      setEmailError("Email is required")
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      setEmailError("Email is invalid")
      isValid = false
    } else {
      setEmailError("")
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Step 1: Send registration request to initiate OTP
      const response = await axiosInstance.post("/api/auth/register", credentials)

      // Step 2: If successful, navigate to OTP verification page with email
      if (response.data.message === "OTP sent to your email") {
        navigate("/verify-otp", { state: { email: credentials.email } })
      }
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed, please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="flex min-h-screen bg-white items-center justify-center">
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16">
        <div className="flex-1">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-serif tracking-wide mb-1">Travel Horizon</h1>
            <p className="text-gray-500 text-sm">Explore More. Experience Life.</p>
          </div>

          <h2 className="text-3xl font-bold mb-8">Join the Adventure</h2>

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={credentials.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 border-gray-300 focus:ring-black"
              />
            </div>

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

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="******"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 
                  ${passwordError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-black"}`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup

