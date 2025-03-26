import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../context/AuthContext';
import axiosInstance from '../admin/axiosInstance';


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
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Add New Package</h2>

      <form onSubmit={handleAddPackage} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full p-2 border rounded"
            value={packageData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            className="w-full p-2 border rounded"
            value={packageData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            className="w-full p-2 border rounded"
            value={packageData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="itinerary" className="block text-gray-700">Itinerary (Separate by commas)</label>
          <input
            type="text"
            id="itinerary"
            name="itinerary"
            className="w-full p-2 border rounded"
            value={packageData.itinerary.join(',')}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="videoUrl" className="block text-gray-700">Video URL</label>
          <input
            type="text"
            id="videoUrl"
            name="videoUrl"
            className="w-full p-2 border rounded"
            value={packageData.videoUrl}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-gray-700">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            className="w-full p-2 border rounded"
            value={packageData.imageUrl}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Package'}
        </button>
      </form>
    </div>
  );
};

export default AddPackage;

