const MAX_TOOL_CALLS_PER_TURN = Number(process.env.MAX_TOOL_CALLS_PER_TURN || 5);

const DEFAULT_ALLOWED_TOOLS = ["web_search", "read_url", "search_my_documents", "list_my_documents", "write_code"];

const resolveAllowedTools = (requested) => {
  if (!Array.isArray(requested) || requested.length === 0) return DEFAULT_ALLOWED_TOOLS;
  return requested.filter((name) => DEFAULT_ALLOWED_TOOLS.includes(name));
};

const filterToolsByAllowlist = (tools, allowedNames) => {
  const allowed = new Set(allowedNames);
  return tools.filter((toolInstance) => allowed.has(toolInstance.name));
};

const isOverToolBudget = (toolCallCount, incoming = 0) =>
  toolCallCount + incoming > MAX_TOOL_CALLS_PER_TURN;

const budgetExceededMessage = () =>
  `I reached my limit of ${MAX_TOOL_CALLS_PER_TURN} tool calls for this question, so I stopped and answered with what I had. If the answer looks incomplete, try asking for one thing at a time.`;

module.exports = {
  MAX_TOOL_CALLS_PER_TURN,
  DEFAULT_ALLOWED_TOOLS,
  resolveAllowedTools,
  filterToolsByAllowlist,
  isOverToolBudget,
  budgetExceededMessage,
};
