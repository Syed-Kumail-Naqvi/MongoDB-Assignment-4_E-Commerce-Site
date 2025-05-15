import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import '../index.css';

const AdminLoginPage = () => {
  const navigate = useNavigate();

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
      const response = await fetch("http://localhost:5000/api/auth/admin/login", {
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
          text: data.message || "Invalid admin credentials",
        });
        return;
      }

      // ✅ Store admin token
      localStorage.setItem("adminToken", data.token);

      Swal.fire({
        icon: "success",
        title: "Admin Logged In",
        text: "Welcome back, Admin!",
        timer: 1500,
        showConfirmButton: false,
      });

      // ✅ Redirect to admin dashboard
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);

      setCredentials({ email: "", password: "" });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong. Try again later.",
      });
      console.error("Admin login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-md mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-6 text-center">Admin Login</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg space-y-5"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="admin@example.com"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition duration-300"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;