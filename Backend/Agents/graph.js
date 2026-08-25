const { StateGraph, START, END } = require("@langchain/langgraph");

const { StateAnnotation } = require("./State");
const { agentNode } = require("./Nodes/agentNode");
const { toolsNode } = require("./Nodes/toolsNode");
const { isGreeting, greetingNode } = require("./Nodes/greetingNode");

const routeFromEntry = (state) => {
  const latest = state.messages.at(-1);
  const content = typeof latest?.content === "string" ? latest.content : "";
  return isGreeting(content) ? "greeting" : "agent";
};

const shouldContinueToTools = (state) => {
  const lastMessage = state.messages.at(-1);
  if (lastMessage?.tool_calls?.length > 0) return "tools";
  return END;
};

const createCortexAgentApp = () => {
  const workflow = new StateGraph(StateAnnotation)
    .addNode("greeting", greetingNode)
    .addNode("agent", agentNode)
    .addNode("tools", toolsNode)

    .addConditionalEdges(START, routeFromEntry, {
      greeting: "greeting",
      agent: "agent",
    })

    .addEdge("greeting", END)
    .addConditionalEdges("agent", shouldContinueToTools, {
      tools: "tools",
      [END]: END,
    })
    .addEdge("tools", "agent");

  return workflow.compile();
};

let cortexAgentApp;
const getCortexAgentApp = () => {
  if (!cortexAgentApp) cortexAgentApp = createCortexAgentApp();
  return cortexAgentApp;
};

module.exports = {
  getCortexAgentApp,
  createCortexAgentApp,
  routeFromEntry,
  shouldContinueToTools,
};
