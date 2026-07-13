const express = require("express");
const Router = express.Router();

const { isAuthenticated } = require("../middleware/authmiddleware");
const {
  handleCreateChat,
  handleGetUserChats,
} = require("../Controllers/chatControllers");

Router.use(isAuthenticated);
Router.get("/", handleGetUserChats);
Router.post("/", handleCreateChat);

module.exports = Router;