import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './../context/AuthContext';
import ImageGallery from './ImageGallery';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Clock, IndianRupee, Video, ImageIcon } from 'lucide-react';
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
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8 mb-44">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          {packageDetails.thumbnailUrl && (
            <div className="relative h-96">
              <img src={packageDetails.thumbnailUrl} alt={packageDetails.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <h1 className="text-5xl font-bold text-white text-center">{packageDetails.title}</h1>
              </div>
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-wrap justify-between items-center mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <MapPin className="text-blue-500 mr-2" />
                <span className="text-gray-600">Destination</span>
              </div>
              <div className="flex items-center mb-4 md:mb-0">
                <Clock className="text-blue-500 mr-2" />
                <span className="text-gray-600">{packageDetails.itinerary?.length || 0} days</span>
              </div>
            </div>


            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {packageDetails.videoUrl && (
                <div className="md:w-1/2">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Video className="mr-2 text-blue-500" />
                    Watch This Preview
                  </h2>
                  <div className="aspect-w-16 aspect-h-9">
                    <video src={packageDetails.videoUrl} controls className="rounded-lg w-full h-full object-cover" />
                  </div>
                </div>
              )}

              

              <div className="md:w-1/2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <CalendarDays className="mr-2 text-blue-500" />
                  Itinerary
                </h2>
                <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
                  {packageDetails.itinerary && packageDetails.itinerary.map((day, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-gray-50 p-4 rounded-lg shadow"
                    >
                      <h3 className="font-semibold text-lg mb-2">Day {index + 1}</h3>
                      <p className="text-gray-600">{day}</p>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">{packageDetails.description}</p>


            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <ImageIcon className="mr-2 text-blue-500" />
              </h2>
              <ImageGallery
                images={packageDetails.galleryImages || []}
                onAddImage={handleAddImage}
                onRemoveImage={handleRemoveImage}
                isAdmin={user && user.role === 'admin'}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center">
              {user && user.role === 'admin' && (
                <div className="mb-4 sm:mb-0">
                  <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded mr-2 hover:bg-red-600 transition-colors">
                    Delete Package
                  </button>
                  <button onClick={handleUpdate} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                    Update Package
                  </button>
                </div>
              )}
              <div className="flex items-center">
                <span className="text-3xl font-bold text-black-600 mr-4 flex items-center">
                  <IndianRupee className="text-black-600 mr-1" />
                  {priceInRupees}
                </span>
                <button onClick={handleBookNow} className="bg-green-500 text-white py-3 px-8 rounded-lg shadow-lg hover:bg-green-600 transition-colors text-lg font-semibold">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PackageDetails;

