const mongoose = require('mongoose');
const URI = process.env.URI;

const dbConnect = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Database Connected!");    
    } 

    catch (error) {
        console.log("Database Not Connected!");
        console.log("Error:", error);
    }
}

module.exports = dbConnect;