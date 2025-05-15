import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const PrivateRoute = ({ children }) => {
  let auth;
  try {
    auth = isAuthenticated();
  } catch (error) {
    // Something wrong with auth check, force login
    return <Navigate to="/login" />;
  }

  return auth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
