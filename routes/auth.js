const express = require("express");
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
require('dotenv').config({ path: '.env.local' });

const JWT_SECRET = process.env.JWT_SECRET;


// ROUTE 1: Create a user using POST "/api/auth/createuser"
router.post('/createuser', [
  body('imageurl'),
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
], async (req, res) => {
  let success=false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    
    if (user) {
      let success=false;
      return res.status(400).json({success, error: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      imageurl:req.body.imageurl,
      name: req.body.name,
      email: req.body.email,
      password: secPass
    });

    const data = {
      user: {
        id: user.id
      }
    };

    const authToken = jwt.sign(data, JWT_SECRET);
    const success=true;
    res.json({success, authToken });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 2: Authenticate a user using POST "/api/auth/login"
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists()
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const success=false;
    return res.status(400).json({success, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      const success = false;
      return res.status(400).json({success, error: "Invalid credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      const success = false;
      return res.status(400).json({success, error: "Invalid credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    };

    const authToken = jwt.sign(data, JWT_SECRET);
    const success=true;
    res.json({success, authToken });

    
  } catch (error) {
    console.error(success,error.message);
    res.status(500).send("Internal server error");
  }
});

//Route 3: Get loggedin user details using: POST"/api/auth/getuser. Login required.
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});




module.exports = router;
