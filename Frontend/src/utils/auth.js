export const getUserFromToken = () => {
  // 1. Try to get user object from localStorage (already parsed)
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr); // 👈 Already authenticated
    } catch {
      localStorage.removeItem("user");
    }
  }

  // 2. Decode token manually
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode payload

    if (payload.exp * 1000 < Date.now()) {
      // Token expired
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      return null;
    }

    return payload; // Contains id, role, email, etc.
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    return null;
  }
};

// ✅ User is logged in
export const isAuthenticated = () => {
  return !!getUserFromToken();
};

// ✅ Admin check
export const isAdminAuthenticated = () => {
  const user = getUserFromToken();
  return user?.role === "admin";
};