const express = require('express');
const router = express.Router();
const { getAllUsersWithOrders } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/users', protectAdmin, getAllUsersWithOrders);

module.exports = router;