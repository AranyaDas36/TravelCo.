import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './../context/AuthContext';
import ImageGallery from './ImageGallery';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Clock, IndianRupee, Video, ImageIcon, FileText } from 'lucide-react';
import axiosInstance from '../admin/axiosInstance';

const PackageDetails = () => {
  const { id } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPackageDetails = async () => {
        try {
          const response = await axiosInstance.get(`/api/packages/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setPackageDetails(response.data);
        } catch (err) {
          setError('Failed to fetch package details');
        } finally {
          setLoading(false);
        }
      
    };

    fetchPackageDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!user || user.role !== 'admin') {
      alert('You are not authorized to delete this package.');
      return;
    }

    try {
      await axiosInstance.delete(`/api/packages/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/packages');
    } catch (err) {
      console.error('Error deleting package:', err);
      alert('Failed to delete package. Please try again.');
    }
  };

  const handleBookNow = () => {
    //navigate('/payment-server-down');
    navigate(`/checkout/${id}`);
  };

  

  const handleUpdate = () => {
    navigate(`/update-package/${id}`);
  };

  const handleAddImage = async (newImageUrl) => {
    try {
      const response = await axiosInstance.post(`/api/packages/${id}/images`, 
        { imageUrl: newImageUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setPackageDetails(response.data);
    } catch (err) {
      console.error('Error adding image:', err);
      alert('Failed to add image. Please try again.');
    }
  };

  const handleRemoveImage = async (index) => {
    try {
      const response = await axiosInstance.delete(`/api/packages/${id}/images/${index}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPackageDetails(response.data);
    } catch (err) {
      console.error('Error removing image:', err);
      alert('Failed to remove image. Please try again.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  if (error) return <div className="text-center text-red-500 text-xl mt-8">{error}</div>;
  if (!packageDetails) return <div className="text-center text-gray-500 text-xl mt-8">No package details available.</div>;

  const priceInRupees = Math.round(packageDetails.price);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mb-24 sm:mb-44">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100"
        >
          {packageDetails.thumbnailUrl && (
            <div className="relative h-56 sm:h-96">
              <img src={packageDetails.thumbnailUrl} alt={packageDetails.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                <div className="p-6 sm:p-8 text-white">
                  <h1 className="text-2xl sm:text-5xl font-bold mb-2">{packageDetails.title}</h1>
                  <div className="flex items-center text-sm sm:text-base opacity-90">
                    <MapPin className="h-4 w-4 mr-2 text-blue-300" />
                    <span>Amazing Destination</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 sm:p-8">
            {/* Package Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center">
                  <MapPin className="text-blue-600 mr-3 h-5 w-5" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Destination</p>
                    <p className="text-gray-800 font-semibold">Exotic Location</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center">
                  <Clock className="text-purple-600 mr-3 h-5 w-5" />
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Duration</p>
                    <p className="text-gray-800 font-semibold">{packageDetails.itinerary?.length || 0} Days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video and Itinerary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {packageDetails.videoUrl && (
                <div className="w-full">
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200 mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                      <Video className="mr-3 text-red-600 h-6 w-6" />
                      Watch Preview
                    </h2>
                  </div>
                  <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg">
                    <video src={packageDetails.videoUrl} controls className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <div className="w-full">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200 mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                    <CalendarDays className="mr-3 text-green-600 h-6 w-6" />
                    Travel Itinerary
                  </h2>
                </div>
                <div className="max-h-80 sm:max-h-[400px] overflow-y-auto pr-2 sm:pr-4 space-y-3">
                  {packageDetails.itinerary && packageDetails.itinerary.map((day, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-start">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full mr-3 flex-shrink-0">
                          Day {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{day}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center">
                <FileText className="mr-2 text-gray-600 h-5 w-5" />
                About This Package
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{packageDetails.description}</p>
            </div>

            {/* Image Gallery */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                  <ImageIcon className="mr-3 text-indigo-600 h-6 w-6" />
                  Photo Gallery
                </h2>
              </div>
              <ImageGallery
                images={packageDetails.galleryImages || []}
                onAddImage={handleAddImage}
                onRemoveImage={handleRemoveImage}
                isAdmin={user && user.role === 'admin'}
              />
            </div>

            {/* Action Section */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {user && user.role === 'admin' && (
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button 
                      onClick={handleDelete} 
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Delete Package
                    </button>
                    <button 
                      onClick={handleUpdate} 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Update Package
                    </button>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
                      <IndianRupee className="text-gray-800 mr-1 h-6 w-6" />
                      {priceInRupees}
                    </span>
                    <p className="text-sm text-gray-600 text-center">per person</p>
                  </div>
                  <button 
                    onClick={handleBookNow} 
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-8 rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 text-lg font-bold hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PackageDetails;

