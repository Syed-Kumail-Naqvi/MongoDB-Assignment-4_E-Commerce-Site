import { Link, useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from '../Context/authContextDefinition'; // Import AuthContext
import { FaShoppingCart, FaSun, FaMoon } from "react-icons/fa"; // Import sun/moon icons
import { useCart } from '../Context/useCartHook';
import { useTheme } from '../Context/themeContextDefinition'; // Import useTheme hook

const Navbar = () => {
  const navigate = useNavigate();
  // Consume AuthContext to get user data and logout function
  // user object now includes profileImage
  const { user, isAdmin, logout } = useContext(AuthContext);
  // Consume ThemeContext to get theme and toggleTheme function
  const { theme, toggleTheme } = useTheme();

  // Derive display logic directly from AuthContext's state
  const isUserLoggedIn = !!user; // user will be null if not logged in
  const isAdminLoggedIn = isAdmin; // isAdmin is already a boolean from context

  // Determine the name to display.
  // Using user?.name to safely access properties.
  const displayedName = user ? (user.name || user.email.split('@')[0] || "User") : null;

  const { cartItems } = useCart();
  const cartItemCount = cartItems?.length || 0;

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate("/login"); // Redirect to login after logout
  };

  return (
    // Navbar background and border will now dynamically change based on theme
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-700
                    dark:from-gray-950 dark:to-gray-800 dark:border-gray-700 transition-colors duration-300">
      <Link
        to="/"
        className="text-3xl font-extrabold text-blue-400 hover:text-blue-300 transition-colors duration-300 tracking-wide transform hover:scale-105"
      >
        K-Store
      </Link>

      <div className="flex items-center space-x-6 md:space-x-8 text-gray-300 font-medium">
        <Link
          to="/"
          className="hover:text-blue-400 transition-colors duration-200 text-lg relative group
                     dark:text-gray-200 dark:hover:text-blue-300"
        >
          Home
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
        </Link>
        <Link
          to="/products"
          className="hover:text-blue-400 transition-colors duration-200 text-lg relative group
                     dark:text-gray-200 dark:hover:text-blue-300"
        >
          Shop
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
        </Link>
        <Link
          to="/about"
          className="hover:text-blue-400 transition-colors duration-200 text-lg relative group
                     dark:text-gray-200 dark:hover:text-blue-300"
        >
          About
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
        </Link>
        <Link
          to="/contact" // Assuming you'll create a Contact page later
          className="hover:text-blue-400 transition-colors duration-200 text-lg relative group
                     dark:text-gray-200 dark:hover:text-blue-300"
        >
          Contact
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
        </Link>

        {isAdminLoggedIn && (
          <Link
            to="/dashboard"
            className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-200 text-lg border border-yellow-400 px-3 py-1 rounded-md
                       dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-yellow-200"
          >
            Dashboard
          </Link>
        )}

        {/* Cart Icon with improved badge */}
        <button
          onClick={() => navigate("/cart")}
          aria-label="Cart"
          className="relative text-gray-300 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1
                     dark:text-gray-200 dark:hover:text-blue-300"
        >
          <FaShoppingCart size={26} /> {/* Slightly larger icon */}
          <span className="absolute -top-1 -right-1.5 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold leading-none transform translate-x-1 translate-y-1">
            {cartItemCount}
          </span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-200
                     dark:bg-gray-700 dark:hover:bg-gray-600 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {theme === 'dark' ? (
            <FaSun size={20} className="text-yellow-400 animate-spin-once" /> // Animated sun for dark mode
          ) : (
            <FaMoon size={20} className="text-blue-300 animate-spin-once" /> // Animated moon for light mode
          )}
        </button>

        {isUserLoggedIn ? (
          <>
            {/* NEW: Profile Image and Link for Logged-in User */}
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-blue-200 px-4 py-2 rounded-full bg-blue-700 bg-opacity-70 text-base font-semibold shadow-inner
                         dark:bg-blue-800 dark:text-blue-100 hover:scale-105 transition-transform duration-200"
              aria-label="View Profile"
            >
              {/* Conditionally render profile image if available */}
              {user?.profileImage && (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-blue-300 dark:border-blue-400 flex-shrink-0"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=AVATAR' }} // Fallback on error
                />
              )}
              <span>Hello, {displayedName}!</span>
            </Link>

            {/* Existing Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 font-semibold shadow
                         dark:bg-red-700 dark:hover:bg-red-800"
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-blue-300 hover:text-blue-400 transition-colors duration-200 text-lg
                         dark:text-blue-300 dark:hover:text-blue-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold shadow
                         dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;