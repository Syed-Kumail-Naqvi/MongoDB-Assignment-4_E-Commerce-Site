const userScheama = require('../models/user'); // Importing User Schema

const signup = async (req, res)=> {
    
    const {name, email, password} = req.body ;
    console.log(`Name: ${name}, Email: ${email}, Password: ${password}`);
    try {
        const registeredUser = await userScheama.create({
            userName : name,
            userEmail : email,
            userPassword : password 
        })
        res.status(201).json({Message: "Signup Succesfull!", User : registeredUser});    
    } 

    catch (error) {
        console.log("Error:", error);
    }
    
}

module.exports = signup ;