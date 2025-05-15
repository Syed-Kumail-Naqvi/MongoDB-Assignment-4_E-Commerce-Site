export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  try {
    // Decode the token payload without a library (simple base64 decode)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Check expiration
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      throw new Error("Token expired");
    }
    return payload.user; // assuming payload contains user info under 'user'
  } catch (error) {
    localStorage.removeItem("token");
    throw new Error("Invalid token");
  }
};

export const isAuthenticated = () => {
  try {
    const user = getUserFromToken();
    return !!user;
  } catch {
    return false;
  }
};