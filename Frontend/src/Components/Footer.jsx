import React from 'react';
import { Link } from 'react-router-dom'; // <--- NEW: Import Link for internal navigation
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

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
              {/* Using Link for internal navigation */}
              <Link to="/products" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-300">Shop All Products</Link>
            </li>
            <li>
              {/* Using Link for internal navigation */}
              <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-300">About Us</Link>
            </li>
            <li>
              {/* Using Link for internal navigation */}
              <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-300">Contact Support</Link>
            </li>
            <li>
              {/* Using Link for a placeholder internal route. Consider creating a /privacy-policy page. */}
              <Link to="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-300">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* Section 3: Connect With Us (Social Media Icons) */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-white mb-4 dark:text-green-400">Connect With Us</h3>
          <div className="flex justify-center md:justify-start space-x-6">
            {/* For external links, it's best practice to use <a> tags to open in a new tab */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
               className="text-gray-400 hover:text-blue-500 transition-colors duration-200 transform hover:scale-110">
              <i className="fab fa-facebook-f text-2xl"></i>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook-icon"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
               className="text-gray-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110">
              <i className="fab fa-twitter text-2xl"></i>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter-icon"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17-17 11.6 2.2.1 4.4-.6 6-2 1.2 1.2 1.8 2.8 1.8 4.8 0 .8-.1 1.6-.3 2.4 0 0-.7 1.5-1.9 2.5 0 0-2.8 1.4-4.8 1.4-2.8 0-5.3-1.8-6.6-4-.6-1.1-1-2.4-1-3.6 0 0-1.2-1.5-2.2-2.5 0 0-2.4-2-4.8-2-.5 0-1-.1-1.5-.3C1 15 2 16 3 17"></path></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
               className="text-gray-400 hover:text-pink-500 transition-colors duration-200 transform hover:scale-110">
              <i className="fab fa-instagram text-2xl"></i>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram-icon"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;