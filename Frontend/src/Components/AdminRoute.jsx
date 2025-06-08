import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/useAuthHook"; // Import useAuth hook

const AdminRoute = ({ children }) => {
  const { user, isAdmin, isLoading } = useAuth(); // Get user, isAdmin, and isLoading

  if (isLoading) {
    return <div>Loading authentication...</div>; // Or a spinner component
  }

  // If not logged in, redirect to admin login
  if (!user) {
    return <Navigate to="/adminlogin" />;
  }

  // If logged in but not an admin, redirect to an unauthorized page or home
  if (!isAdmin) {
    // You might want a specific unauthorized page like '/unauthorized'
    // or just send them back to the home page or login page
    return <Navigate to="/" />; // Or navigate('/login')
  }

  // If logged in AND is admin, render children
  return children;
};

export default AdminRoute;