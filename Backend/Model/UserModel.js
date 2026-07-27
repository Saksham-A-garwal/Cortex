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
    required: false, // Made optional because OAuth users don't have passwords
  },
  googleId: {
    type: String,
    sparse: true, // Allows null/missing values to not conflict with unique index if added
  },
  githubId: {
    type: String,
    sparse: true,
  },
  authProvider: {
    type: String,
    enum: ["local", "google", "github"],
    default: "local",
  },
  role : {
    type : String,
    default : "USER"
  }
}, {timestamps : true});

const UserModel = mongoose.model("User" , UserSchema);

module.exports =  UserModel;
