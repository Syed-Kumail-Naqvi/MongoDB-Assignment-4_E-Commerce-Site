const mongoose = require('mongoose');

const userScheama = mongoose.Schema({
    
    name : String,
    email : String,
    password : String

})

module.exports = userScheama ;