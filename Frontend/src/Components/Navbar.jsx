import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated, getUserFromToken } from "../utils/auth";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getUserFromToken();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    // Clear both tokens just to be safe
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link
        to="/"
        className="text-2xl font-extrabold text-blue-400 hover:text-blue-500 transition"
      >
        E-Store
      </Link>

      <div className="flex items-center space-x-6 text-gray-300 font-medium">
        <Link to="/" className="hover:text-blue-400 transition">Home</Link>
        <Link to="/product" className="hover:text-blue-400 transition">Shop</Link>
        <Link to="/about" className="hover:text-blue-400 transition">About</Link>
        <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>

        {user?.role === "admin" && (
          <Link to="/dashboard" className="hover:text-blue-400 font-semibold transition">
            Dashboard
          </Link>
        )}

        {/* Cart Icon */}
        <button
          onClick={() => navigate("/cart")}
          aria-label="Cart"
          className="relative text-gray-300 hover:text-blue-400 transition"
        >
          <FaShoppingCart size={24} />
          {/* Optional: Cart Badge */}
          {/* <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white px-1.5 rounded-full">3</span> */}
        </button>

        {isAuthenticated() ? (
          <>
            <span className="text-gray-200 px-3 py-1 rounded bg-blue-800 bg-opacity-60">
              Hello, {user?.name || user?.username || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 font-semibold transition"
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400 transition">Login</Link>
            <Link to="/signup" className="hover:text-blue-400 transition">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;