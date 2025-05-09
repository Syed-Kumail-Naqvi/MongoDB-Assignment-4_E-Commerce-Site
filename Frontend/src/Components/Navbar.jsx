import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getUserFromToken } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">E-Store</Link>
      <div className="flex items-center space-x-6">
        <Link to="/products">Shop</Link>
        {user?.role === "admin" && <Link to="/dashboard">Dashboard</Link>}
        {isAuthenticated() ? (
          <>
            <span>Hello, {user?.name}</span>
            <button onClick={handleLogout} className="text-red-500">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
