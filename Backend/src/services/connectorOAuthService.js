const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const STATE_TTL_SECONDS = 600;
const STATE_PURPOSE = "connector-oauth";

const signState = (userId, connectorId) =>
  jwt.sign(
    { purpose: STATE_PURPOSE, userId: String(userId), connectorId, nonce: crypto.randomBytes(8).toString("hex") },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: STATE_TTL_SECONDS },
  );

const verifyState = (state, connectorId) => {
  const payload = jwt.verify(state, process.env.JWT_ACCESS_SECRET);
  if (payload.purpose !== STATE_PURPOSE || payload.connectorId !== connectorId) {
    throw new Error("Invalid or mismatched OAuth state.");
  }
  return payload.userId;
};

const buildAuthorizeUrl = (connector, state, redirectUri) => {
  const url = new URL(connector.authorizeUrl);
  url.searchParams.set("client_id", connector.clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", connector.scope);
  url.searchParams.set("state", state);
  return url.toString();
};

const exchangeCodeForToken = async (connector, code, redirectUri) => {
  const response = await fetch(connector.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: connector.clientId,
      client_secret: connector.clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed (${response.status}): ${await response.text()}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`Token exchange failed: ${data.error_description || data.error}`);
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || null,
    expiresIn: data.expires_in || null,
    scope: data.scope || null,
  };
};

module.exports = { signState, verifyState, buildAuthorizeUrl, exchangeCodeForToken };
