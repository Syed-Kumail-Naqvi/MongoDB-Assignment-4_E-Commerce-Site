import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import React, { useContext, useState } from "react"; // Import useState
import { AuthContext } from '../Context/authContextDefinition';
import { useCart } from '../Context/useCartHook';
import { useTheme } from '../Context/themeContextDefinition';
import { FaShoppingCart, FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa"; // Import FaBars and FaTimes

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook for current path
  const { user, isAdmin, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu

  const isUserLoggedIn = !!user;
  const isAdminLoggedIn = isAdmin;
  const displayedName = user ? (user.name || user.email?.split('@')[0] || "User") : null;
  const cartItemCount = cartItems?.length || 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false); // Close mobile menu on logout
  };

  const NavLink = ({ to, children, isSpecial = false }) => {
    const isActive = location.pathname === to;
    const baseClasses = "hover:text-blue-400 transition-colors duration-200 text-lg relative group dark:text-gray-200 dark:hover:text-blue-300 py-2 md:py-0";
    const activeClasses = "text-blue-400 dark:text-blue-300 font-bold";
    const specialClasses = "text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-200 text-lg border border-yellow-400 px-3 py-1 rounded-md dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-yellow-200 whitespace-nowrap";

    return (
      <Link
        to={to}
        className={`${isSpecial ? specialClasses : baseClasses} ${isActive && !isSpecial ? activeClasses : ""}`}
        onClick={() => setMobileMenuOpen(false)} // Close menu on link click
        aria-current={isActive ? "page" : undefined}
      >
        {children}
        {!isSpecial && (
          <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100`}></span>
        )}
      </Link>
    );
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-700
                    dark:from-gray-950 dark:to-gray-800 dark:border-gray-700 transition-colors duration-300">
      {/* Logo */}
      <Link
        to="/"
        className="text-3xl font-extrabold text-blue-400 hover:text-blue-300 transition-colors duration-300 tracking-wide transform hover:scale-105"
      >
        K-Store
      </Link>

      {/* Desktop Navigation & Icons (Hidden on small screens) */}
      <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-gray-300 font-medium">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Shop</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>

        {isAdminLoggedIn && (
          <NavLink to="/dashboard" isSpecial={true}>Dashboard</NavLink>
        )}

        {/* Cart Icon */}
        <button
          onClick={() => navigate("/cart")}
          aria-label="Cart"
          className="relative text-gray-300 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1
                     dark:text-gray-200 dark:hover:text-blue-300"
        >
          <FaShoppingCart size={26} />
          {cartItemCount > 0 && ( // Only show badge if there are items
            <span className="absolute -top-1 -right-1.5 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold leading-none transform translate-x-1 translate-y-1 min-w-[20px] text-center">
              {cartItemCount}
            </span>
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-200
                     dark:bg-gray-700 dark:hover:bg-gray-600 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {theme === 'dark' ? (
            <FaSun size={20} className="text-yellow-400" />
          ) : (
            <FaMoon size={20} className="text-blue-300" />
          )}
        </button>

        {/* Auth Buttons/Profile for Desktop */}
        {isUserLoggedIn ? (
          <>
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-blue-200 px-4 py-2 rounded-full bg-blue-700 bg-opacity-70 text-base font-semibold shadow-inner
                         dark:bg-blue-800 dark:text-blue-100 hover:scale-105 transition-transform duration-200 whitespace-nowrap"
              aria-label="View Profile"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-blue-300 dark:border-blue-400 flex-shrink-0"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://i.ibb.co/hK8bQYq/user-placeholder.webp' }} // More generic placeholder
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {displayedName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <span>Hello, {displayedName}!</span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 font-semibold shadow
                         dark:bg-red-700 dark:hover:bg-red-800 whitespace-nowrap"
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-blue-300 hover:text-blue-400 transition-colors duration-200 text-lg dark:text-blue-300 dark:hover:text-blue-200 whitespace-nowrap"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold shadow dark:bg-blue-700 dark:hover:bg-blue-800 whitespace-nowrap"
            >
              Signup
            </Link>
          </>
        )}
      </div>

      {/* Hamburger Icon (Visible on small screens) */}
      <div className="md:hidden flex items-center space-x-4">
        {/* Cart Icon for Mobile */}
        <button
          onClick={() => navigate("/cart")}
          aria-label="Cart"
          className="relative text-gray-300 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1
                     dark:text-gray-200 dark:hover:text-blue-300"
        >
          <FaShoppingCart size={24} />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1.5 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold leading-none transform translate-x-1 translate-y-1 min-w-[20px] text-center">
              {cartItemCount}
            </span>
          )}
        </button>

        {/* Theme Toggle for Mobile */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-200
                     dark:bg-gray-700 dark:hover:bg-gray-600 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {theme === 'dark' ? (
            <FaSun size={20} className="text-yellow-400" />
          ) : (
            <FaMoon size={20} className="text-blue-300" />
          )}
        </button>

        {/* Hamburger/Close Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-2 transition-colors duration-200"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-95 z-40 transform transition-transform duration-300 ease-in-out
                    ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}
      >
        <div className="flex flex-col items-center justify-center min-h-screen text-xl space-y-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>

          {isAdminLoggedIn && (
            <NavLink to="/dashboard" isSpecial={true}>Dashboard</NavLink>
          )}

          {isUserLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="flex items-center space-x-3 text-blue-200 px-6 py-3 rounded-full bg-blue-700 text-xl font-semibold shadow-inner
                           dark:bg-blue-800 dark:text-blue-100 hover:scale-105 transition-transform duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-blue-300 dark:border-blue-400 flex-shrink-0"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://i.ibb.co/hK8bQYq/user-placeholder.webp' }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {displayedName?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <span>Hello, {displayedName}!</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors duration-200 font-semibold shadow text-xl"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-blue-300 hover:text-blue-400 transition-colors duration-200 text-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold shadow text-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;