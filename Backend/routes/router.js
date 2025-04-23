const express = require('express') // Importing Express js
const Router = express.Router(); // Calling Router

// Importing Files
const signup = require('../controllers/signup');

// SignUp Route
Router.post('/signup', signup);

module.exports = Router ;