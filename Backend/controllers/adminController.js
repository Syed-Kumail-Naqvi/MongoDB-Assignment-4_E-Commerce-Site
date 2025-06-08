const User = require('../models/user');
const Order = require('../models/orderModel'); // Assuming your Order model is named orderModel.js

/**
 * @desc    Get all users with their associated orders
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsersWithOrders = async (req, res) => {
  try {
    // Find all users and select all fields except the password
    const users = await User.find().select('-password');

    // For each user, find their associated orders
    const usersWithOrders = await Promise.all(
      users.map(async (user) => {
        // Find orders where the 'user' field matches the current user's ID
        const orders = await Order.find({ user: user._id });
        // Return a new object that includes all user properties and their orders
        return { ...user.toObject(), orders };
      })
    );

    res.status(200).json(usersWithOrders);
  } catch (err) {
    console.error("Error fetching users:", err); // Log the full error
    res.status(500).json({ message: 'Failed to Fetch Users', error: err.message }); // Send error message
  }
};

/**
 * @desc    Delete a specific user by ID, and their associated orders
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.id; // Extract the user ID from the URL parameters

    // IMPORTANT: Prevent an admin from deleting their own account via this endpoint.
    // This adds a crucial layer of self-preservation.
    // req.user is typically populated by your 'protect' middleware after token verification.
    if (req.user && req.user._id.toString() === userIdToDelete) {
      return res.status(400).json({ message: "You cannot delete your own admin account through this interface. Please use a different user." });
    }

    // Find the user by ID
    const user = await User.findById(userIdToDelete);

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // --- NEW: Delete all orders associated with this user ---
    await Order.deleteMany({ user: userIdToDelete }); // This line ensures all orders are removed

    // Delete the user document from the database
    await user.deleteOne(); // `deleteOne()` is the method for Mongoose 5.x and later to delete a document found by `findById`

    // Send a success response
    res.status(200).json({ success: true, message: `User '${user.name || user.email}' and their orders deleted successfully.` });

  } catch (error) {
    console.error("Error deleting user:", error); // Log the full error for debugging
    res.status(500).json({ success: false, message: "Server Error during user deletion", error: error.message });
  }
};

module.exports = {
  getAllUsersWithOrders,
  deleteUser,
};