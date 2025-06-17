import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../context/AuthContext';
import axiosInstance from '../admin/axiosInstance';
import { Plus, Package, DollarSign, MapPin, Video, Image, Calendar, FileText } from 'lucide-react';

const AddPackage = () => {
  const [packageData, setPackageData] = useState({
    title: '',
    description: '',
    price: '',
    itinerary: [],
    videoUrl: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageData(prevData => ({
      ...prevData,
      [name]: name === 'itinerary' ? value.split(',') : value
    }));
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'admin') {
      alert('You are not authorized to add a package.');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post('/api/packages', packageData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/packages');
    } catch (err) {
      console.error('Error adding package:', err);
      alert('Failed to add package. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You are not authorized to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <Plus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Create New Travel Package
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Add exciting new travel experiences to your collection. Fill in the details below to create an amazing package.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleAddPackage} className="space-y-8">
            {/* Package Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="flex items-center text-lg font-semibold text-gray-800">
                <Package className="h-5 w-5 mr-2 text-blue-500" />
                Package Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg"
                placeholder="Enter package title..."
                value={packageData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="flex items-center text-lg font-semibold text-gray-800">
                <FileText className="h-5 w-5 mr-2 text-green-500" />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg resize-none"
                placeholder="Describe your travel package..."
                value={packageData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Price and Itinerary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="space-y-2">
                <label htmlFor="price" className="flex items-center text-lg font-semibold text-gray-800">
                  <DollarSign className="h-5 w-5 mr-2 text-yellow-500" />
                  Price (₹)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 text-lg"
                  placeholder="Enter price..."
                  value={packageData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Itinerary */}
              <div className="space-y-2">
                <label htmlFor="itinerary" className="flex items-center text-lg font-semibold text-gray-800">
                  <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                  Itinerary (comma-separated)
                </label>
                <input
                  type="text"
                  id="itinerary"
                  name="itinerary"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-lg"
                  placeholder="Day 1: Arrival, Day 2: Sightseeing..."
                  value={packageData.itinerary.join(',')}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Media URLs Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video URL */}
              <div className="space-y-2">
                <label htmlFor="videoUrl" className="flex items-center text-lg font-semibold text-gray-800">
                  <Video className="h-5 w-5 mr-2 text-red-500" />
                  Video URL (Optional)
                </label>
                <input
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 text-lg"
                  placeholder="https://example.com/video.mp4"
                  value={packageData.videoUrl}
                  onChange={handleChange}
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label htmlFor="imageUrl" className="flex items-center text-lg font-semibold text-gray-800">
                  <Image className="h-5 w-5 mr-2 text-indigo-500" />
                  Image URL
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 text-lg"
                  placeholder="https://example.com/image.jpg"
                  value={packageData.imageUrl}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Creating Package...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Package
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPackage;

