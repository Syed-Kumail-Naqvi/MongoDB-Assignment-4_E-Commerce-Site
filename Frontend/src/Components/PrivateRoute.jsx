import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/useAuthHook"; // Import useAuth hook

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth(); // Get user and isLoading from AuthContext

  if (isLoading) {
    return <div>Loading authentication...</div>; 
  }

  // If user is null, redirect to login
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;