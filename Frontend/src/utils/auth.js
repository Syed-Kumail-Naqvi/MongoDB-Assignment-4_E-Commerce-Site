export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;  // No token? Just return null, no error.

  try {
    // Decode JWT payload (base64 decode)
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Check if token expired
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null; // Token expired? Remove and return null.
    }

    // Return user info inside token payload
    return payload.user || null; 
  } catch (error) {
    // Token malformed or decode error
    localStorage.removeItem("token");
    return null;  // Return null instead of throwing
  }
};

export const isAuthenticated = () => {
  return !!getUserFromToken();
};