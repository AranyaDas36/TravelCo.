import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 ">
        {/* About Section */}
        <div className='px-10 mx-10'>
          <h2 className="text-xl font-bold mb-3">About Us</h2>
          <p className="text-gray-400">
            Explore the world with us! We provide the best travel experiences with curated packages, expert guides, and memorable adventures.
          </p>
        </div>

        {/* Quick Links */}
        <div className='mx-32'>
          <h2 className="text-xl font-bold mb-3">Quick Links</h2>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Destinations</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Tours</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className='mx-32'>
          <h2 className="text-xl font-bold mb-3">Follow Us</h2>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaFacebookF /></a>
            <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaInstagram /></a>
            <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaTwitter /></a>
            <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Travel Explorer. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
