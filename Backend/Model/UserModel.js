const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique : true,
  },
  password: {
    type: String,
    required: true,
  },
  role : {
    type : String,
    default : "USER"
  }
}, {timestamps : true});

const UserModel = mongoose.model("User" , UserSchema);

module.exports =  UserModel;
