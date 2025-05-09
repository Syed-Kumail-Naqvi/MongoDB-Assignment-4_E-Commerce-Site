import React from "react";
import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

const AdminRoute = ({ children }) => {
  const user = getUserFromToken();
  return user?.role === "admin" ? children : <Navigate to="/" />;
};

export default AdminRoute;
