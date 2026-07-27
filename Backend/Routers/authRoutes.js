const express = require("express");
const Router = express.Router();
const passport = require("passport");
const {
  handleCreateUser,
  handleLoginUser,
  handleOAuthCallback,
} = require("../Controllers/AuthControllers");

// Standard Auth
Router.post("/SignUp", handleCreateUser);
Router.post("/Login", handleLoginUser);

// ==========================================
// GOOGLE OAUTH ROUTES
// ==========================================
Router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

Router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${frontendUrl}/login`,
  }),
  handleOAuthCallback, 
);

// ==========================================
// GITHUB OAUTH ROUTES
// ==========================================
Router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

Router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${frontendUrl}/login`,
  }),
  handleOAuthCallback, 
);

module.exports = Router;
