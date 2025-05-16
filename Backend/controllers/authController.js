const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token with id and role
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    // Default role to "user"
    const user = await User.create({ name, email, password, role: "user" });

    if (!user) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

    console.log("✅ User registered successfully!");
  } catch (error) {
    console.error("❌ Register error:", error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        token: generateToken(user._id, user.role),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    res.status(401).json({ message: 'Invalid Credentials' });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Admin Login User
exports.adminLoginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    // Find admin by email and role
    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // Generate token with admin role
    const token = generateToken(admin._id, admin.role);

    res.status(200).json({
      token,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("❌ Admin login error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};