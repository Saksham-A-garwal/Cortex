const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../Middleware/authMiddleware"); 
const {
  getUserProfile,
  updateUserProfile,
} = require("../Controllers/userControllers");

// We chain the GET and PUT requests together since they share the same URL ("/profile")
router
  .route("/profile")
  .get(isAuthenticated, getUserProfile)
  .put(isAuthenticated, updateUserProfile);

module.exports = router;
