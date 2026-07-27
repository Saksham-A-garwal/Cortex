const { StateGraph, START, END } = require("@langchain/langgraph");
const { ToolNode } = require("@langchain/langgraph/prebuilt");
const { TavilySearch } = require("@langchain/tavily");

// Import our State
const { StateAnnotation } = require("./State");

// Import all our Nodes
const { routerNode } = require("./Nodes/routerNode");
const { generalNode } = require("./Nodes/generalNode");
const { codingNode } = require("./Nodes/codingNode");
const { searchNode } = require("./Nodes/searchNode");
const { ragNode } = require("./Nodes/ragNode");

// 1. Conditional Routing Logic (Where does it go AFTER the router?)
const routeToAgent = (state) => {
  const decision = state.routeDecision;

  if (decision === "coding") return "coding_agent";
  if (decision === "search") return "search_agent";
  if (decision === "rag") return "rag_agent";
  return "general_agent"; // Default
};

// 2. Tool Logic (Did the Search Agent decide to use the Tavily tool?)
const shouldContinueToTools = (state) => {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];

  // If the AI requested a tool call, route it to the "tools" node
  if (lastMessage.tool_calls?.length > 0) {
    return "tools";
  }

  // Otherwise, the agent is finished!
  return END;
};

const createCortexAgentApp = () => {
  const searchTool = new TavilySearch({ maxResults: 3 });

  const workflow = new StateGraph(StateAnnotation)
  // Add all of our agent nodes
  .addNode("router_agent", routerNode, {
    metadata: { tags: ["langsmith:hidden"] },
  })
  .addNode("general_agent", generalNode)
  .addNode("coding_agent", codingNode)
  .addNode("search_agent", searchNode)
  .addNode("rag_agent", ragNode)

  // Add the ToolNode (Equipped with Tavily for the search agent to use)
  .addNode("tools", new ToolNode([searchTool]))

  // The graph ALWAYS starts at the router
  .addEdge(START, "router_agent")

  // After the router finishes, use our conditional logic to pick the next node
  .addConditionalEdges("router_agent", routeToAgent)

  // The Coding and General agents immediately end when they are done
  .addEdge("general_agent", END)
  .addEdge("coding_agent", END)
  .addEdge("rag_agent", END)

  // The Search agent is special: it conditionally goes to "tools" OR ends.
  .addConditionalEdges("search_agent", shouldContinueToTools)

  // After the tools finish running, they ALWAYS send the results back to the search agent to summarize
  .addEdge("tools", "search_agent");

  return workflow.compile();
};

// Lazily create the production graph. This prevents module imports (including
// deterministic tests) from requiring every provider API key up front.
let cortexAgentApp;
const getCortexAgentApp = () => {
  if (!cortexAgentApp) {
    cortexAgentApp = createCortexAgentApp();
  }
  return cortexAgentApp;
};

module.exports = {
  getCortexAgentApp,
  createCortexAgentApp,
  routeToAgent,
  shouldContinueToTools,
};
