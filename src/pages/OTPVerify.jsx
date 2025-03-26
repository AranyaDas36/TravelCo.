"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import axiosInstance from "../admin/axiosInstance"

const OTPVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(600) // 10 minutes in seconds
  const [resendDisabled, setResendDisabled] = useState(true)

  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ""

  // Redirect if no email is provided
  useEffect(() => {
    if (!email) {
      navigate("/signup")
    }
  }, [email, navigate])

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setResendDisabled(false)
    }
  }, [timer])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus()
    }
  }

  const handleResendOtp = async () => {
    setLoading(true)
    setError("")

    try {
      await axiosInstance.post("/api/auth/register", { email })
      setTimer(600) // Reset timer to 10 minutes
      setResendDisabled(true)
      alert("New OTP has been sent to your email")
    } catch (error) {
      setError("Failed to resend OTP. Please try again.")
    }

    setLoading(false)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const otpString = otp.join("")

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits of the OTP")
      setLoading(false)
      return
    }

    try {
      const response = await axiosInstance.post("/api/auth/verify-otp", {
        email,
        otp: otpString,
      })

      alert(response.data.message) // Registration successful
      navigate("/login") // Redirect to login page after successful registration
    } catch (error) {
      setError(error.response?.data?.message || "Invalid or expired OTP")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit OTP to <span className="font-medium">{email}</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            OTP expires in <span className="font-medium text-red-500">{formatTime(timer)}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="mt-8 space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            ))}
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendDisabled || loading}
                className={`text-sm font-medium ${
                  resendDisabled ? "text-gray-400" : "text-blue-600 hover:text-blue-500"
                }`}
              >
                {resendDisabled ? `Resend OTP in ${formatTime(timer)}` : "Resend OTP"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OTPVerify

