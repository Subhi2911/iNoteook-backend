const express = require("express");
const User = require('../models/User');
const router = express.Router();
const {body, validationResult} = require('express-validator');
//let obj;


//Create a user using POST "/api/auth/createuser". Doesn't require Auth
router.post('/createuser',[
    body('name','enter a valid name').isLength({min:3}),
    body('email','enter a valid email').isEmail(), 
    body('password','password must be at least 8 characters').isLength({min:8}),
    ] , async(req,res)=>{
        
    // if there are errors, return bad request and the errors
    const errors = validationResult (req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    //check whether the user with the same email exists already
    try{
        let user = await User.findOne({email: req.body.email})
    
    if (user){
        return res.status(400).json({error: "Sorry a user with this email already exists."});
    }

    //Create a new user.
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    res.json({user})
    }
    catch(error){
        console.error(error.msg);
        res.status(500).send("Some error occured")
    }
    }
)
module.exports = router