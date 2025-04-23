import React, { useState } from "react";
import '../index.css';

const LoginPage = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle user login logic here (e.g., send data to API)
    console.log("User logged in:", credentials);
    setCredentials({ email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-6">Login to Your Account</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;