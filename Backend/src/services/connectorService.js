const { getConnector, listConnectors } = require("../config/connectorCatalog");
const ConnectorConnectionModel = require("../models/ConnectorConnection");
const { encrypt, decrypt } = require("../utils/encryption");
const {
  signState,
  verifyState,
  buildAuthorizeUrl,
  exchangeCodeForToken,
} = require("./connectorOAuthService");

const getRedirectUri = (connectorId) =>
  `${process.env.BACKEND_URL || "http://localhost:5000"}/api/connectors/${connectorId}/callback`;

const listAvailableConnectors = async (userId) => {
  const connections = await ConnectorConnectionModel.find({ userId });
  const connectedIds = new Set(connections.map((c) => c.connectorId));

  return listConnectors().map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    connected: connectedIds.has(c.id),
  }));
};

const startConnect = (userId, connectorId) => {
  const connector = getConnector(connectorId);
  if (!connector || !connector.clientId) return null;

  const state = signState(userId, connectorId);
  return buildAuthorizeUrl(connector, state, getRedirectUri(connectorId));
};

const handleCallback = async (connectorId, code, state) => {
  const connector = getConnector(connectorId);
  if (!connector) throw new Error("Unknown connector.");

  const userId = verifyState(state, connectorId);
  const tokens = await exchangeCodeForToken(connector, code, getRedirectUri(connectorId));

  const expiresAt = tokens.expiresIn ? new Date(Date.now() + tokens.expiresIn * 1000) : null;

  await ConnectorConnectionModel.findOneAndUpdate(
    { userId, connectorId },
    {
      userId,
      connectorId,
      encryptedAccessToken: encrypt(tokens.accessToken),
      encryptedRefreshToken: tokens.refreshToken ? encrypt(tokens.refreshToken) : null,
      expiresAt,
      scope: tokens.scope,
    },
    { upsert: true, returnDocument: "after", runValidators: true },
  );

  return userId;
};

const disconnect = async (userId, connectorId) => {
  const result = await ConnectorConnectionModel.findOneAndDelete({ userId, connectorId });
  return Boolean(result);
};

const getDecryptedAccessToken = async (userId, connectorId) => {
  const connection = await ConnectorConnectionModel.findOne({ userId, connectorId });
  if (!connection) return null;
  return decrypt(connection.encryptedAccessToken);
};

const getUserMcpServers = async (userId) => {
  const connections = await ConnectorConnectionModel.find({ userId });
  const servers = {};

  for (const connection of connections) {
    const connector = getConnector(connection.connectorId);
    if (!connector) continue;

    servers[connector.id] = {
      transport: "http",
      url: connector.mcpServerUrl,
      headers: { Authorization: `Bearer ${decrypt(connection.encryptedAccessToken)}` },
    };
  }

  return servers;
};

module.exports = {
  listAvailableConnectors,
  startConnect,
  handleCallback,
  disconnect,
  getDecryptedAccessToken,
  getUserMcpServers,
};
