import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa"; 
import '../index.css';

const Navbar = () => {
  
  const cartItemCount = 2; // Example: Static count or dynamic from state

  return (
    <nav className="bg-white shadow py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">E-Shop</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/product" className="hover:text-blue-600">Shop</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact</Link>

          {/* Cart Link with Icon */}
          <Link to="/cart" className="hover:text-blue-600 flex items-center space-x-2">
            <FaShoppingCart />
            <span className="font-semibold">{cartItemCount}</span> {/* Display cart count */}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
