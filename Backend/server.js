const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const route = require('./routes/Route');
const { errorHandler } = require('./middleware/middleware');
const cors = require('cors');

dotenv.config();
const app = express();

// Connecting Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", route); 

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running On PORT ${PORT}`));