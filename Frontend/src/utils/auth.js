export const getRegularUser = () => {
  const userStr = localStorage.getItem("user"); // This should be the JSON string of the user object
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      // Optional: Add a simple check for expiration if 'user' object also contains 'exp'
      // if (user.exp && user.exp * 1000 < Date.now()) {
      //   localStorage.removeItem("user");
      //   localStorage.removeItem("token");
      //   return null;
      // }
      return user; // Return the full user object
    } catch (e) {
      console.error("Error parsing user data from localStorage:", e);
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // Also clear token if user data is corrupt
      return null;
    }
  }
  return null;
};

export const getAdminUser = () => {
  // Assuming 'adminName' and 'isAdmin' flag are stored upon admin login
  const adminName = localStorage.getItem("adminName");
  const isAdminFlag = localStorage.getItem("isAdmin");
  const adminToken = localStorage.getItem("adminToken");

  if (isAdminFlag === "true" && adminToken) { // Check both flag and token presence
    try {
      // Decode adminToken to verify it's still valid, or just rely on the presence for simplicity
      const payload = JSON.parse(atob(adminToken.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminName");
        localStorage.removeItem("isAdmin");
        return null;
      }
      
      // If `adminName` is stored, use it. Otherwise, use a default or try to get from token payload if available.
      return { 
        name: adminName || payload.name || payload.email, // Prioritize stored name, then payload name/email
        role: "admin", 
        // You can add other payload details if needed, e.g., id: payload.id
      };
    } catch (e) {
      console.error("Error processing admin data/token:", e);
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminName");
      localStorage.removeItem("isAdmin");
      return null;
    }
  }
  return null;
};

export const getUserFromToken = () => {
  // Prefer regular user data first
  const regularUser = getRegularUser();
  if (regularUser) {
    return regularUser;
  }

  // If no regular user, check for admin
  const adminUser = getAdminUser();
  if (adminUser) {
    return adminUser;
  }

  // If neither, decode from general token if it exists (e.g., if 'user' object was not saved properly)
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("user"); // Clear user too if token is general
      localStorage.removeItem("adminName");
      localStorage.removeItem("isAdmin");
      return null;
    }
    // Return payload with role if available, otherwise default to 'user'
    return { ...payload, role: payload.role || "user" }; 
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    localStorage.removeItem("adminName");
    localStorage.removeItem("isAdmin");
    return null;
  }
};

// --- ADD THESE FUNCTIONS ---

// ✅ User is logged in (either regular user or admin)
export const isAuthenticated = () => {
  return !!getUserFromToken(); // Returns true if getUserFromToken returns a user object
};

// ✅ Admin check
export const isAdminAuthenticated = () => {
  const user = getUserFromToken(); // Get the current logged-in user/admin
  return user?.role === "admin"; // Check if their role is 'admin'
};