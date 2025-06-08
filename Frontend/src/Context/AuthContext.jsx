import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from './authContextDefinition.jsx'; // Import AuthContext from the new file

// Create the Provider Component
export const AuthProvider = ({ children }) => {
  // Add profileImage to the user state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('userToken') || null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to decode token - now extracts profileImage as well
  const decodeToken = (jwtToken) => {
    try {
      const base64Url = jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      return decoded;
    } catch (e) {
      console.error("Error decoding token:", e);
      return null;
    }
  };

  useEffect(() => {
    const loadUser = () => {
      if (token) {
        const decoded = decodeToken(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          // Destructure profileImage from decoded token
          const { id, email, role, name, profileImage } = decoded;
          const userFromToken = { _id: id, email, role, name, profileImage }; // Include profileImage
          setUser(userFromToken);
          setIsAdmin(role === 'admin');
        } else {
          localStorage.removeItem('userToken');
          setToken(null);
          setUser(null);
          setIsAdmin(false);
          
          Swal.fire({
            icon: 'info',
            title: 'Session Expired',
            text: 'Your session has expired. Please log in again.',
            timer: 2000,
            showConfirmButton: false
          });
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, [token]);

  // Login function - now expects profileImage in userData
  const login = (newToken, userData) => {
    localStorage.setItem('userToken', newToken);
    setToken(newToken);
    setUser(userData); // userData should now include profileImage from backend response
    setIsAdmin(userData.role === 'admin');
  };

  // NEW: Function to update user data in context after profile edits (e.g., image upload)
  const updateUser = (updatedUserData, newToken = token) => {
    setUser(prevUser => ({
      ...prevUser, // Keep existing user data
      ...updatedUserData, // Overlay with updated fields (e.g., name, email, profileImage)
    }));
    // If a new token is provided (e.g., after updating profile with new image/name), update it
    if (newToken !== token) {
      localStorage.setItem('userToken', newToken);
      setToken(newToken);
    }
    setIsAdmin(updatedUserData.role === 'admin'); // Ensure admin status is re-evaluated
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        isLoading,
        login,
        logout,
        updateUser, // <--- NEW: Provide updateUser function to context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};