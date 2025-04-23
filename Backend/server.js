const express = require('express'); // Importing Express JS
const app = express(); // Calling Express JS
const dotenv = require('dotenv'); // Importing Dotenv
const router = require('./routes/router');
dotenv.config(); // Calling Dotenv
app.use(express.json); // For Converting Body into JSON
app.use('/', router); // Calling Router
const PORT = process.env.PORT // Importing PORT From env File
const database = require('./database/database'); // Importing MongoDB
database(); // Calling Database

app.listen(PORT, ()=> console.log(`Server is Running on PORT: ${PORT}`));