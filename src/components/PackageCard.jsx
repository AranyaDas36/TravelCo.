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
    <div className="package-card border rounded-lg overflow-hidden shadow-lg m-2 sm:m-4 max-w-full sm:max-w-sm w-full">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-40 sm:h-64 object-cover"
      />
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-4 text-sm sm:text-base">{shortDescription}</p>
        <div className="flex flex-col justify-between items-start">
          <div>
            <span className="text-lg sm:text-xl font-semibold text-black-600">
              Rs {price}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 ml-2">
              /person
            </span>
          </div>
          <span className="text-xs sm:text-sm text-gray-600">
            Duration: {duration} days
          </span>
        </div>
        <button 
          onClick={handleReadMore}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition text-sm sm:text-base"
        >
          Read More Details
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
