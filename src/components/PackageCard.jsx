import React from 'react';
import { useNavigate } from 'react-router-dom';

const PackageCard = ({ 
  id, 
  title, 
  shortDescription, 
  price, 
  duration, 
  imageUrl // Updated prop to imageUrl
}) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/packages/${id}`);
  };

  return (
    <div className="package-card border rounded-lg overflow-hidden shadow-lg m-4 max-w-sm">
      <img
        src={imageUrl} // Use imageUrl instead of pkg.coverImage
        alt={title} // Use the title for better accessibility
        className="w-full h-64 object-cover" // Ensures the image fits properly
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{shortDescription}</p>

        <div className="flex flex-col justify-between items-start">
          <div>
            <span className="text-xl font-semibold text-black-600">
              Rs {price}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              /person
            </span>
          </div>
          <span className="text-sm text-gray-600">
            Duration: {duration} days
          </span>
        </div>

        <button 
          onClick={handleReadMore}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Read More Details
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
