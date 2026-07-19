const express = require("express");
const Router = express.Router();

const { isAuthenticated } = require("../middleware/authmiddleware");
const {
  handleCreateChat,
  handleGetUserChats,
  handleDeleteChat,
} = require("../Controllers/chatControllers");

Router.use(isAuthenticated);
Router.get("/", handleGetUserChats);
Router.post("/", handleCreateChat);
Router.delete("/:id", handleDeleteChat);

module.exports = Router;