"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DateRange } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import {
  Calendar,
  CreditCard,
  IndianRupee,
  MapPin,
  Phone,
  Shield,
  User,
  Mail,
  Home,
  CheckCircle,
  AlertCircle,
  Loader,
  Clock,
} from "lucide-react"
import axios from "axios"
import { format } from "date-fns"
import axiosInstance from "../admin/axiosInstance"

const CheckoutPage = () => {
  const [packageDetails, setPackageDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      key: "selection",
    },
  ])
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    freeCancellation: false,
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeStep, setActiveStep] = useState(1)

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`/api/packages/${id}`)
        setPackageDetails(response.data)
        setError(null)
      } catch (error) {
        console.error("Error fetching package details:", error)
        setError("Failed to load package details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchPackageDetails()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setPersonalDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      })
    }
  }

  const calculateTotalPrice = () => {
    if (!packageDetails) return 0

    const basePrice = Math.round(packageDetails.price)
    const cancellationCharge = personalDetails.freeCancellation ? 299 : 0
    const gst = Math.round(basePrice * 0.05) // 5% GST

    return basePrice + cancellationCharge + gst
  }

  const validateForm = () => {
    const errors = {}

    if (!personalDetails.name.trim()) {
      errors.name = "Name is required"
    }

    if (!personalDetails.phone.trim()) {
      errors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(personalDetails.phone)) {
      errors.phone = "Please enter a valid 10-digit phone number"
    }

    if (!personalDetails.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(personalDetails.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!personalDetails.address.trim()) {
      errors.address = "Address is required"
    }

    const { startDate, endDate } = dateRange[0]
    if (!startDate || !endDate) {
      errors.dateRange = "Please select both start and end dates for your journey"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNextStep = () => {
    if (validateForm()) {
      setActiveStep(2)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevStep = () => {
    setActiveStep(1)
    window.scrollTo(0, 0)
  }

  const handleBookNow = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const { startDate, endDate } = dateRange[0]

      const bookingDetails = {
        packageId: packageDetails?.id,
        startDate,
        endDate,
        personalDetails,
        price: calculateTotalPrice(),
      }

      console.log("Booking Details:", bookingDetails)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      navigate("/payment-server-down")
    } catch (error) {
      console.error("Booking error:", error)
      setError("Failed to process your booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your travel package...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!packageDetails) {
    return null
  }

  const basePrice = Math.round(packageDetails.price)
  const cancellationCharge = personalDetails.freeCancellation ? 299 : 0
  const gst = Math.round(basePrice * 0.05) // 5% GST
  const totalPrice = basePrice + cancellationCharge + gst

  const formattedStartDate = format(dateRange[0].startDate, "dd MMM yyyy")
  const formattedEndDate = format(dateRange[0].endDate, "dd MMM yyyy")
  const numberOfDays = Math.round((dateRange[0].endDate - dateRange[0].startDate) / (1000 * 60 * 60 * 24)) + 1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Steps */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className={`flex flex-col items-center ${activeStep === 1 ? "text-blue-600" : "text-gray-500"}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${activeStep === 1 ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}
              >
                <User className="h-5 w-5" />
              </div>
              <span className="text-sm mt-1 font-medium">Details</span>
            </div>

            <div className={`w-16 h-0.5 ${activeStep === 2 ? "bg-blue-600" : "bg-gray-300"} mx-2`}></div>

            <div className={`flex flex-col items-center ${activeStep === 2 ? "text-blue-600" : "text-gray-500"}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${activeStep === 2 ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}
              >
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="text-sm mt-1 font-medium">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          {activeStep === 1 ? "Complete Your Booking" : "Review & Payment"}
        </h1>

        {activeStep === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Section - Package Details and Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={packageDetails.imageUrl || "/placeholder.svg?height=300&width=800"}
                    alt={packageDetails.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h2 className="text-2xl font-bold">{packageDetails.title}</h2>
                      <div className="flex items-center mt-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{packageDetails.location || "Destination"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">{packageDetails.description}</p>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                      <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-medium">{packageDetails.duration || "3 Days"}</p>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3 flex items-center">
                      <IndianRupee className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Price per person</p>
                        <p className="font-medium">₹{basePrice}</p>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3 flex items-center">
                      <Shield className="h-5 w-5 text-purple-600 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Cancellation</p>
                        <p className="font-medium">Available</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Details Form */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-6 pb-2 border-b">Personal Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          formErrors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Name..."
                        name="name"
                        value={personalDetails.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          formErrors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="xxxxxxxxxx"
                        name="phone"
                        value={personalDetails.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          formErrors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="email@example.com"
                        name="email"
                        type="email"
                        value={personalDetails.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Home className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          formErrors.address ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="123 Main St, City"
                        name="address"
                        value={personalDetails.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="freeCancellation"
                        checked={personalDetails.freeCancellation}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-colors ${
                          personalDetails.freeCancellation ? "bg-blue-500 border-blue-500" : "border-gray-300"
                        }`}
                      >
                        {personalDetails.freeCancellation && <CheckCircle className="h-5 w-5 text-white" />}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-700 font-medium">Add Free Cancellation Protection</span>
                      <p className="text-sm text-gray-500">
                        Cancel up to 24 hours before your trip for a full refund (₹299)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Date Selection */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-28">
                <h2 className="text-xl font-bold mb-6 pb-2 border-b">Travel Dates</h2>

                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div>
                    <p className="text-gray-700 mb-4">Select your travel dates:</p>
                    <DateRange
                      ranges={dateRange}
                      onChange={(item) => setDateRange([item.selection])}
                      moveRangeOnFirstSelection={false}
                      minDate={new Date()}
                      rangeColors={["#3b82f6"]}
                      className="border rounded-lg shadow-sm"
                    />
                    {formErrors.dateRange && <p className="text-red-500 text-sm mt-2">{formErrors.dateRange}</p>}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg w-full md:w-auto">
                    <h3 className="font-medium text-blue-800 mb-2">Your Trip Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium">{formattedStartDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-medium">{formattedEndDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{numberOfDays} days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Fare Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-6 pb-2 border-b">Fare Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="font-medium">₹{basePrice}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cancellation Protection</span>
                    <span className="font-medium">₹{cancellationCharge}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">GST (5%)</span>
                    <span className="font-medium">₹{gst}</span>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total Amount</span>
                      <span className="text-xl font-bold text-blue-600">₹{totalPrice}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  Continue to Payment
                </button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 flex items-center justify-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Secure payment processing
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Review & Payment */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-6 pb-2 border-b">Review Your Booking</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Package Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-lg">{packageDetails.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{packageDetails.location || "Destination"}</p>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {formattedStartDate} - {formattedEndDate}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{numberOfDays} days</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Traveler Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <User className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{personalDetails.name}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Phone className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{personalDetails.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Mail className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{personalDetails.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-medium text-gray-700 mb-3">Price Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Fare</span>
                      <span>₹{basePrice}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Cancellation Protection</span>
                      <span>₹{cancellationCharge}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">GST (5%)</span>
                      <span>₹{gst}</span>
                    </div>

                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total Amount</span>
                        <span className="text-blue-600">₹{totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-6 pb-2 border-b">Payment Method</h2>

              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <p className="text-center text-gray-700">
                    This is a demo checkout page.
                  </p>
                </div>

                <div className="flex items-center justify-between mt-8">
                  <button onClick={handlePrevStep} className="text-blue-600 hover:text-blue-800 font-medium">
                    Back to Details
                  </button>

                  <button
                    onClick={handleBookNow}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="animate-spin h-4 w-4 mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Complete Booking"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutPage

