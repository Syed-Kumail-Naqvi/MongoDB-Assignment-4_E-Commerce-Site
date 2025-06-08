import React, { useState } from "react";
import Swal from "sweetalert2";
import "../index.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../Context/useAuthHook';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from AuthContext

  const [user, setUser] = useState({
    username: "", // Note: your backend expects 'name' for this field
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match. Try again!",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.username, // Ensure this matches your backend's expected field (`name`)
          email: user.email,
          password: user.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: data.message || "Failed to register user",
        });
        return;
      }

      // --- CRITICAL CHANGE FOR AUTOMATIC LOGIN ---
      if (data.token && data.user) {
        login(data.token, data.user); // Automatically log in the user
      } else {
        // This case should ideally not happen if your backend is configured correctly
        // (which it is, as per your authController.js for registerUser)
        console.warn("Signup successful but missing token or user data for auto-login.");
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Welcome! Please login now.",
          timer: 1800,
          showConfirmButton: false,
        });
        setTimeout(() => {
          navigate("/login"); // Fallback to navigate to login if auto-login data is missing
        }, 1800);
        return;
      }
      // --- END CRITICAL CHANGE ---

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Welcome! You are now logged in.", // Updated message
        timer: 1800,
        showConfirmButton: false,
      });

      console.log("User registered and logged in:", data);
      setUser({ username: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => {
        navigate("/"); // Navigate to home page after successful auto-login
      }, 1800);

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong. Please try again later.",
      });
      console.error("Signup error:", error);
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
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700 mb-2
                         dark:text-gray-200" /* Dark mode text */
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-gray-800
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-green-400" /* Dark mode styles */
              placeholder="Your chosen username"
            />
          </div>
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
              value={user.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-gray-800
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-green-400" /* Dark mode styles */
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
              value={user.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-gray-800
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-green-400" /* Dark mode styles */
              placeholder="Enter a strong password"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-700 mb-2
                         dark:text-gray-200" /* Dark mode text */
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-gray-800
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-green-400" /* Dark mode styles */
              placeholder="Re-enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-bold text-lg"
          >
            Sign Up
          </button>
          <p className="mt-6 text-center text-gray-600 text-sm
                        dark:text-gray-300"> {/* Dark mode text */}
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="font-medium text-green-600 hover:text-green-700 cursor-pointer transition-colors duration-200
                         dark:text-green-400 dark:hover:text-green-300" /* Dark mode link */
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;