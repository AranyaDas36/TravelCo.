import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PackageCard from './../components/PackageCard';
import { useAuth } from './../context/AuthContext';
import axios from 'axios';

const Packages = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPackages = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/packages');
      setPackages(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch packages');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    if (!user || user.role !== 'admin') {
      alert('You are not authorized to delete this package.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/packages/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchPackages(); // Refresh the list after deletion
    } catch (err) {
      console.error('Error deleting package:', err);
      alert('Failed to delete package. Please try again.');
    }
  };

  const truncateText = (text, maxLength = 100) => 
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  

  return (
    <section className="packages-container py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Explore Our Travel Packages</h2>

        {user && user.role === 'admin' && (
          <Link to="/add-package">
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg mb-6">
              + Add Package
            </button>
          </Link>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {packages.map(pkg => (
            <div key={pkg._id} className="relative">
              <Link to={`/packages/${pkg._id}`}>
                <PackageCard
                  id={pkg._id}
                  title={pkg.title}
                  shortDescription={truncateText(pkg.description, 25)}
                  price={pkg.price}
                  duration={pkg.itinerary ? pkg.itinerary.length : 'N/A'}
                  imageUrl={pkg.imageUrl}
                />
              </Link>
              {user && user.role === 'admin' && (
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Link to={`/update-package/${pkg._id}`}>
                    <button className="bg-blue-500 text-white p-2 rounded">Edit</button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(pkg._id)} 
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;

