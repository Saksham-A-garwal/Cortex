const express = require("express");
const Router = express.Router();
const { isAuthenticated } = require("../middleware/authmiddleware");
const { validate } = require("../middleware/validate");
const { chatIdParamSchema, sendMessageSchema } = require("../Validation/schemas");
const {
  handleGetMessages,
  handleSendMessage,
} = require("../Controllers/MessageControllers");

Router.use(isAuthenticated);

Router.get("/:chatId", validate({ params: chatIdParamSchema }), handleGetMessages);
Router.post("/", validate({ body: sendMessageSchema }), handleSendMessage);

module.exports = Router;
