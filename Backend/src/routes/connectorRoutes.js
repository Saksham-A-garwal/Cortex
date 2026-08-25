const express = require("express");
const Router = express.Router();

const { isAuthenticated } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const { connectorIdParamSchema } = require("../validation/schemas");
const {
  handleListConnectors,
  handleStartConnect,
  handleOAuthCallback,
  handleDisconnect,
} = require("../controllers/connectorControllers");

// Public: GitHub redirects the browser here directly, with no Cortex auth header attached.
// The signed `state` query param (verified inside handleOAuthCallback) is the authorization
// for this one request - not the isAuthenticated middleware.
Router.get("/:id/callback", validate({ params: connectorIdParamSchema }), handleOAuthCallback);

Router.use(isAuthenticated);
Router.get("/", handleListConnectors);
Router.get("/:id/start", validate({ params: connectorIdParamSchema }), handleStartConnect);
Router.delete("/:id", validate({ params: connectorIdParamSchema }), handleDisconnect);

module.exports = Router;
