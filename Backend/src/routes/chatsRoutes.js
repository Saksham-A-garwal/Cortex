const express = require("express");
const Router = express.Router();

const { isAuthenticated } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const { idParamSchema } = require("../validation/schemas");
const {
  handleCreateChat,
  handleGetUserChats,
  handleDeleteChat,
} = require("../controllers/chatControllers");

Router.use(isAuthenticated);
Router.get("/", handleGetUserChats);
Router.post("/", handleCreateChat);
Router.delete("/:id", validate({ params: idParamSchema }), handleDeleteChat);

module.exports = Router;
