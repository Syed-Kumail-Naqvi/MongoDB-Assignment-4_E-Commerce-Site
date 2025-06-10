import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../index.css";
import { useAuth } from '../Context/useAuthHook';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from AuthContext

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      Swal.fire({
        icon: "error",
        title: "Missing fields",
        text: "Please enter both email and password",
      });
      return;
    }

    try {
      const response = await fetch(
        "https://mongodb-assignment-4-e-commerce-site.onrender.com/auth/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid admin credentials",
        });
        return;
      }

      if (data.token && data.user) {
        login(data.token, data.user); // Call AuthContext's login function
      } else {
        throw new Error("Admin login response missing token or user data.");
      }

      Swal.fire({
        icon: "success",
        title: "Admin Logged In",
        text: `Welcome back!`,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/dashboard");
      });

      setCredentials({ email: "", password: "" });
    } catch (error) {
      console.error("Admin login error:", error); // Keep console.error for actual errors
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong. Try again later.",
      });
    }
  };

  return (
    // Main container background will now respond to dark mode
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8
                    dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl animate-fade-in-up
                      dark:bg-gray-800 dark:shadow-2xl"> {/* Dark mode styles for background and shadow */}
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center
                       dark:text-white"> {/* Dark mode text color */}
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2
                         dark:text-gray-200" /* Dark mode text color */
            >
              Admin Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200 text-gray-800
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-purple-500" /* Dark mode styles for input */
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2
                         dark:text-gray-200" /* Dark mode text color */
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200 text-gray-800
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-purple-500" /* Dark mode styles for input */
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 font-bold text-lg"
          >
            Log In as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;