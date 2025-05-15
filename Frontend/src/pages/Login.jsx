import React, { useState } from "react";
import Swal from "sweetalert2";
import '../index.css';
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const LoginPage = () => {
  const navigate = useNavigate(); // ✅ Setup navigation hook

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
        headers: {
          "Content-Type": "application/json",
        },
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

      // ✅ Save token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // if you're returning user info

      Swal.fire({
        icon: "success",
        title: "Logged In",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      });

      console.log("User logged in:", data);
      setCredentials({ email: "", password: "" });

      // ✅ Navigate to homepage/dashboard
      navigate("/"); // or navigate("/dashboard") if that's your route

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
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-md mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-6 text-center">Login to Your Account</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;