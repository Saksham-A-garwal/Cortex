const express = require("express");
const Router = express.Router();
const { isAuthenticated } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const { chatIdParamSchema, sendMessageSchema } = require("../validation/schemas");
const {
  handleGetMessages,
  handleSendMessage,
} = require("../controllers/messageControllers");

Router.use(isAuthenticated);

Router.get("/:chatId", validate({ params: chatIdParamSchema }), handleGetMessages);
Router.post("/", validate({ body: sendMessageSchema }), handleSendMessage);

module.exports = Router;
