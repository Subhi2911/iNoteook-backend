//import Schema from 'mongoose';
const mongoose = require('mongoose');
//const { Schema } = mongoose;


const UserSchema = mongoose.Schema({
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
module.exports = mongoose.model('user', UserSchema);
