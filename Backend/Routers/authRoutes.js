const express = require("express");
const Router = express.Router();
const {handleCreateUser , handleLoginUser} = require("../Controllers/authControllers")

Router.post("/SignUp" , handleCreateUser);
Router.post("/Login" , handleLoginUser);

module.exports = Router;