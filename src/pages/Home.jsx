import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import { motion } from 'framer-motion'; // Import framer-motion for animations
import './../App.css'; // This imports the styles from App.css
import Contact from './Contact'
import axiosInstance from '../admin/axiosInstance';
import { getPackages } from './../api/api'


const Home = () => {
  const [packages, setPackages] = useState([]);
  

  useEffect(() => {
    const fetchPackages = async () => {
      const response = await getPackages();
      setPackages(response.data); // Assuming response.data is an array of packages
    };

    fetchPackages();
  }, []);

  return (
    // <div className="bg-gray-100">
    //   {/* Hero Section */}
    //   <section className="relative flex items-center justify-between h-full bg-white text-black px-12">
    //     {/* Left Half: Text Content */}
    //     <div className="w-1/2 p-8">
    //       <div className="relative z-10">
    //         <h1 className="text-4xl sm:text-5xl font-extrabold">
    //           Explore Your Next{' '}
    //           <span
    //             className="text-6xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
    //           >
    //             Adventure
    //           </span>
    //         </h1>
    //         <p className="mt-4 text-lg sm:text-xl max-w-3xl py-6">
    //           Discover amazing travel packages and create memories that last a
    //           lifetime. Choose from our carefully curated travel options!
    //         </p>
    //         <a
    //           onClick={() => document.getElementById('packages').scrollIntoView({ behavior: 'smooth' })}
    //           className="mt-6 px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-md cursor-pointer"
    //         >
    //           Explore Packages
    //         </a>
    //       </div>
    //     </div>

    //     {/* Right Half: Image */}
    //     <div className="w-1/2 h-full p-10">
    //       <img
    //         src="https://i.pinimg.com/736x/21/fa/96/21fa969b5684e85242e912116a04224b.jpg" // Replace with your image URL
    //         alt="Adventure"
    //         className="w-full h-full object-cover"
    //       />
    //     </div>
    //   </section>
    <div className="bg-gray-100 ">
    {/* Hero Section */}
    <section className="relative flex flex-col md:flex-row items-center justify-between min-h-[500px] md:min-h-[700px] bg-white text-black px-4 md:px-8 py-10 md:py-14">
      {/* Left Half: Text Content */}
      <div className="w-full md:w-1/2 p-4 md:p-6 md:ml-8 mb-8 md:mb-0">
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight text-center md:text-left">
              Explore Your Next{" "}
            <div className="relative inline-block">
              Adventure
              <svg
                className="absolute -top-8 right-0 w-12 h-12 md:w-16 md:h-16 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4L8.5 15.5M10.5 19.5L8.5 15.5M8.5 15.5L4.5 13.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </h1>
          <div className="w-16 md:w-24 h-1 bg-orange-500 my-4 mx-auto md:mx-0"></div>
          <p className="mt-4 text-gray-600 text-base sm:text-lg max-w-3xl py-2 text-center md:text-left">
            Discover amazing travel packages and create memories that last a
            lifetime. Choose from our carefully curated travel options!
          </p>
          <button
            onClick={() => document.getElementById("packages").scrollIntoView({ behavior: "smooth" })}
            className="mt-6 px-6 md:px-8 py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-full cursor-pointer w-full md:w-auto"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Right Half: Phone Mockup */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center pr-0 md:pr-12 mb-8 md:mb-0">
  <img
    src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    alt="Travel"
    className="w-full max-w-xs sm:max-w-sm md:max-w-md h-64 sm:h-80 md:h-[calc(100vh-12rem)] object-cover rounded-lg shadow-lg"
  />
</div>




        </section>

      {/* Popular Packages Section */}
      <section
        id="packages"
        className="py-12 min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50"
      >
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20"></div>

        <div className="container mx-auto px-4 py-10 relative z-10">
          <h2 className="text-center text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Popular Travel Packages
            </motion.div>
          </h2>

          {/* Horizontal Scroll Container */}
          <div className="overflow-x-auto relative py-12 md:py-24">
            <motion.div
              className="flex gap-4 sm:gap-6"
              animate={{ x: ['0%', '-80%'] }}
              transition={{
                repeat: Infinity,
                repeatType: 'loop',
                duration: 45,
                ease: 'linear',
              }}
            >
              {/* Duplicate the packages to ensure continuous scrolling */}
              {[...packages.slice(0, 5), ...packages.slice(0, 5)].map((pkg, index) => (
                <Link
                  key={`${pkg._id}-${index}`}
                  to={`/packages/${pkg._id}`}
                  className="relative group transform transition-all duration-500 min-w-[80vw] sm:min-w-[40vw] md:min-w-[25vw] lg:min-w-[20vw]"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="package-card border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white backdrop-blur-sm"
                  >
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      className="w-full h-48 sm:h-64 object-cover rounded-t-xl"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800">{pkg.title}</h3>
                      <p className="text-gray-600 mt-2 text-sm">{pkg.shortDescription}</p>
                      <span className="block mt-4 text-lg font-bold text-blue-600">Rs{pkg.price}</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Contact />
    </div>
  );
};

export default Home;
