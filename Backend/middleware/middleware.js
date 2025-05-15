const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  return authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
};

const protect = async (req, res, next) => {
  const token = getTokenFromHeader(req);
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token", error: err.message });
  }
};

const protectAdmin = async (req, res, next) => {
  const token = getTokenFromHeader(req);
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admins only" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token", error: err.message });
  }
};

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = {
  protect,
  protectAdmin,
  errorHandler,
};