import React, { useState } from 'react';

const ImageGallery = ({ images = [], onAddImage, onRemoveImage, isAdmin }) => {
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddImage = () => {
    if (newImageUrl) {
      onAddImage(newImageUrl);
      setNewImageUrl('');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Image Gallery</h2>
      {images.length === 0 ? (
        <p>No images in the gallery.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative h-32 sm:h-52 w-full">
              <img src={image} alt={`Gallery image ${index + 1}`} className="w-full h-32 sm:h-52 object-cover rounded-lg" />
              {isAdmin && (
                <button
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {isAdmin && (
        <div className="mt-4 flex">
          <input
            type="text"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="flex-grow p-2 border rounded-l-md"
          />
          <button
            onClick={handleAddImage}
            className="bg-green-500 text-white py-2 px-4 rounded-r-md hover:bg-green-600 transition-colors"
          >
            Add Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;

