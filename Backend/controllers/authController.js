const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary'); 

// Generate JWT Token with id, role, name, email, and profileImage
const generateToken = (id, role, name, email, profileImage) => {
    return jwt.sign({ id, role, name, email, profileImage }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc Register User
// @route POST /api/auth/register
// @access Public
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

        // Default role to "user". profileImage will use its default from the schema.
        const user = await User.create({ name, email, password, role: "user" });

        if (!user) {
            return res.status(400).json({ message: "Invalid user data" });
        }

        res.status(201).json({
            // Include profileImage when generating the token
            token: generateToken(user._id, user.role, user.name, user.email, user.profileImage),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage, // Include profileImage in the user object
            },
        });

        console.log("✅ User registered successfully!");
    } catch (error) {
        console.error("❌ Register error:", error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc Login User
// @route POST /api/auth/login
// @access Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            return res.json({
                // Include profileImage when generating the token
                token: generateToken(user._id, user.role, user.name, user.email, user.profileImage),
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profileImage: user.profileImage, // Include profileImage in the user object
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
// @route POST /api/auth/admin/login
// @access Public
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

        // Generate token with admin role and include profileImage
        const token = generateToken(admin._id, admin.role, admin.name, admin.email, admin.profileImage);

        res.status(200).json({
            token,
            user: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                profileImage: admin.profileImage, // Include profileImage in the user object
            },
        });
    } catch (error) {
        console.error("❌ Admin login error:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

// --- NEW: User Profile Management Functions ---

// @desc Get User Profile
// @route GET /api/auth/profile
// @access Private
exports.getProfile = async (req, res) => {
    try {
        // req.user is set by the protect middleware
        const user = await User.findById(req.user.id).select('-password'); // Exclude password

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage, // Include profile image
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("❌ Get Profile error:", error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc Update User Profile Details (name, email, password)
// @route PUT /api/auth/profile
// @access Private
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided in the request body
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Only update password if a new password is provided
        if (req.body.password) {
            // For security, you might want to add a check for the old password here
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        // profileImage is updated via a separate endpoint if it's a file upload
        // If profileImage URL is sent directly (e.g., clearing it or a pre-uploaded URL)
        // Ensure this doesn't conflict with file uploads, which will use uploadProfileImage
        if (req.body.profileImage !== undefined) {
             user.profileImage = req.body.profileImage;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profileImage: updatedUser.profileImage, // Send back the updated image URL
            token: generateToken(updatedUser._id, updatedUser.role, updatedUser.name, updatedUser.email, updatedUser.profileImage), // Generate new token with updated info
        });

    } catch (error) {
        console.error("❌ Update Profile error:", error.message);
        // Handle unique email constraint error specifically
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc Upload User Profile Image
// @route POST /api/auth/profile/image
// @access Private
exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided.' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Upload image to Cloudinary from buffer
        const result = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
            {
                folder: `e-store/profile_images/${user._id}`, // Unique folder per user for organization
                transformation: [
                    { width: 200, height: 200, crop: "fill", gravity: "face" }, // Standard size, focus on face
                    { quality: "auto:eco" } // Optimize quality
                ],
                public_id: `profile_${user._id}_${Date.now()}` // Unique public ID for the image
            }
        );

        // Update user's profileImage URL in the database
        user.profileImage = result.secure_url;
        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile image uploaded successfully',
            imageUrl: result.secure_url,
            // Return updated user object and new token
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profileImage: updatedUser.profileImage,
            },
            token: generateToken(updatedUser._id, updatedUser.role, updatedUser.name, updatedUser.email, updatedUser.profileImage), // Generate new token with updated image
        });

    } catch (error) {
        console.error('❌ Upload Profile Image error:', error.message);
        res.status(500).json({ message: 'Failed to upload profile image. ' + error.message });
    }
};