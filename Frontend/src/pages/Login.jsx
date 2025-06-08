import React, { useState } from "react";
import Swal from "sweetalert2";
import "../index.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../Context/useAuthHook';

const LoginPage = () => {
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
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid credentials, try again",
        });
        return;
      }

      // --- CRITICAL CHANGE HERE ---
      // Instead of manually setting localStorage, use the login function from AuthContext
      // This function already handles setting 'userToken' and updating context state.
      if (data.token && data.user) {
        login(data.token, data.user); // Call AuthContext's login function
      } else {
        throw new Error("Login response missing token or user data.");
      }
      // --- END CRITICAL CHANGE ---

      Swal.fire({
        icon: "success",
        title: "Logged In",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      });

      setCredentials({ email: "", password: "" });
      navigate("/"); // redirect after login
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong. Please try again later.",
      });
      console.error("Login error:", error);
    }
  };

  return (
    // Main container background will now respond to dark mode
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8
                    dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl animate-fade-in-up
                      dark:bg-gray-800 dark:shadow-2xl"> {/* Dark mode styles */}
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center
                       dark:text-white"> {/* Dark mode text */}
          Welcome Back!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2
                         dark:text-gray-200" /* Dark mode text */
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-800
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400" /* Dark mode styles */
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2
                         dark:text-gray-200" /* Dark mode text */
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-800
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400" /* Dark mode styles */
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-bold text-lg"
          >
            Log In
          </button>

          <p className="mt-6 text-center text-gray-600 text-sm
                        dark:text-gray-300"> {/* Dark mode text */}
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer transition-colors duration-200
                         dark:text-blue-400 dark:hover:text-blue-300" /* Dark mode link */
            >
              Sign up here
            </span>
          </p>
          <p className="mt-4 text-center text-gray-600 text-sm
                        dark:text-gray-300"> {/* Dark mode text */}
            Want to browse our products?{" "}
            <span
              onClick={() => navigate("/products")}
              className="font-medium text-purple-600 hover:text-purple-700 cursor-pointer transition-colors duration-200
                         dark:text-purple-400 dark:hover:text-purple-300" /* Dark mode link */
            >
              Visit our Store!
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;