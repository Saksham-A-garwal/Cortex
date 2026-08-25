const express = require("express");
const Router = express.Router();

const { isAuthenticated } = require("../middleware/authmiddleware");
const { validate } = require("../middleware/validate");
const { idParamSchema } = require("../Validation/schemas");
const {
  handleCreateChat,
  handleGetUserChats,
  handleDeleteChat,
} = require("../Controllers/chatControllers");

Router.use(isAuthenticated);
Router.get("/", handleGetUserChats);
Router.post("/", handleCreateChat);
Router.delete("/:id", validate({ params: idParamSchema }), handleDeleteChat);

module.exports = Router;
