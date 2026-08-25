const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authmiddleware");
const {
  getUserProfile,
  updateUserProfile,
} = require("../Controllers/userControllers");

router
  .route("/profile")
  .get(isAuthenticated, getUserProfile)
  .put(isAuthenticated, updateUserProfile);

module.exports = router;
