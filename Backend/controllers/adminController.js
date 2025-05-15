const User = require('../models/user');
const Order = require('../models/orderModel'); // if you have order schema

// Controller: Get all users with their orders
const getAllUsersWithOrders = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    // Optionally populate order history (if you store orders)
    const usersWithOrders = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ user: user._id });
        return { ...user.toObject(), orders };
      })
    );

    res.status(200).json(usersWithOrders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to Fetch Users', error: err });
  }
};

module.exports = { getAllUsersWithOrders };