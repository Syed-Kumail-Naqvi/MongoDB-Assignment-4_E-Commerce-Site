import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getUserFromToken } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const handleLogout = () => {
    localStorage.removeItem(user?.role === "admin" ? "adminToken" : "token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-extrabold text-blue-700 hover:text-blue-800 transition">
        E-Store
      </Link>

      <div className="flex items-center space-x-8 text-gray-700 font-medium">
        <Link
          to="/"
          className="hover:text-blue-600 transition"
          aria-label="Home"
        >
          Home
        </Link>
        <Link
          to="/products"
          className="hover:text-blue-600 transition"
          aria-label="Shop Products"
        >
          Shop
        </Link>
        <Link
          to="/about"
          className="hover:text-blue-600 transition"
          aria-label="About Us"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="hover:text-blue-600 transition"
          aria-label="Contact Us"
        >
          Contact
        </Link>
        {user?.role === "admin" && (
          <Link
            to="/dashboard"
            className="hover:text-blue-600 transition font-semibold"
            aria-label="Admin Dashboard"
          >
            Dashboard
          </Link>
        )}

        {isAuthenticated() ? (
          <>
            <span className="text-gray-800 px-3 py-1 rounded bg-blue-100">
              Hello, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 font-semibold transition"
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-blue-600 transition"
              aria-label="Login"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:text-blue-600 transition"
              aria-label="Signup"
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