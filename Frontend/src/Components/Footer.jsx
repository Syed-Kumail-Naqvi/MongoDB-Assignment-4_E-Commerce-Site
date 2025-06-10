import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Ensure FaLinkedin is imported if you want to use it

const Footer = () => {
  return (
    // Main footer container: dynamic background, text colors, and border for theme support
    <footer className="bg-gray-800 text-gray-300 py-10 px-4 border-t border-gray-700 mt-auto shadow-xl
                       dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center text-sm space-y-8 md:space-y-0">

        {/* Section 1: Copyright and Brand Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <p className="text-lg font-semibold text-blue-400 mb-2">K-Store</p>
          <p className="text-gray-300 dark:text-gray-400 mb-1">
            &copy; {new Date().getFullYear()} All Rights Reserved.
          </p>
          <p className="text-gray-400 dark:text-gray-500">
            Your destination for cutting-edge electronics.
          </p>
          <p className="mt-2 text-gray-400 dark:text-gray-500">
            Powered by <span className="font-medium text-gray-200 dark:text-gray-300">Kummi Bro</span>
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-white mb-4 dark:text-blue-400">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/products" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-300">Shop All Products</Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-300">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-300">Contact Support</Link>
            </li>
            <li>
              <Link to="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-300">Privacy Policy</Link>
            </li>
            {/* Add a Terms of Service Link for completeness */}
            <li>
              <Link to="/terms" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-300">Terms of Service</Link>
            </li>
          </ul>
        </div>

        {/* Section 3: Connect With Us (Social Media Icons) */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-white mb-4 dark:text-green-400">Connect With Us</h3>
          <div className="flex justify-center md:justify-start space-x-6">
            {/* Using FaFacebook from react-icons */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
               className="text-gray-400 hover:text-blue-500 transition-colors duration-200 transform hover:scale-110">
              <FaFacebook className="text-2xl" />
            </a>
            {/* Using FaTwitter from react-icons */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
               className="text-gray-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110">
              <FaTwitter className="text-2xl" />
            </a>
            {/* Using FaInstagram from react-icons */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
               className="text-gray-400 hover:text-pink-500 transition-colors duration-200 transform hover:scale-110">
              <FaInstagram className="text-2xl" />
            </a>
            {/* Adding a LinkedIn icon for professional presence */}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
               className="text-gray-400 hover:text-blue-600 transition-colors duration-200 transform hover:scale-110">
              <FaLinkedin className="text-2xl" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;