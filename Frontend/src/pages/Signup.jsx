import React, { useState } from "react";
import '../index.css';

const SignupPage = () => {
  const [user, setUser] = useState({
    username: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert("Passwords Do Not Match!");
      return;
    }
    console.log("User Signed Up:", user);
    setUser({ username: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-6">Create an Account</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
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
              value={user.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
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
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;