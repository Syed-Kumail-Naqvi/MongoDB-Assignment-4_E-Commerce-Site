import React from "react";
import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

const AdminRoute = ({ children }) => {
  let user;
  try {
    user = getUserFromToken();
  } catch (error) {
    // Invalid or expired token, redirect to login
    return <Navigate to="/login" />;
  }

  return user?.role === "admin" ? children : <Navigate to="/" />;
};

export default AdminRoute;