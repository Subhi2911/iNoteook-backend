//import Schema from 'mongoose';
const mongoose = require('mongoose');
//const { Schema } = mongoose;


const UserSchema = mongoose.Schema({
  imageurl:{
    type:String,
    default: "https://i.postimg.cc/J4rjc7qN/defaultimageurl.png"
  },
  name:{
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
});

//module.exports = mongoose.overwriteMiddlewareResult('user',UserSchema);
const User = mongoose.model('user', UserSchema);

module.exports = User;
