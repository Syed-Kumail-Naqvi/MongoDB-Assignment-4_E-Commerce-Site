import React from "react";
import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "../utils/auth";

const AdminRoute = ({ children }) => {
  return isAdminAuthenticated() ? children : <Navigate to="/adminlogin" />;
};

export default AdminRoute;
