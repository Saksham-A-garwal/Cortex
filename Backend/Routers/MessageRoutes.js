const express = require("express");
const Router = express.Router();
const { isAuthenticated } = require("../middleware/authmiddleware");
const {
  handleGetMessages,
  handleSendMessage,
} = require("../Controllers/MessageControllers");
Router.use(isAuthenticated);

Router.get("/:chatId", handleGetMessages);
Router.post("/", handleSendMessage);

module.exports = Router;
