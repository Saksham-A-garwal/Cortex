const { ChatOpenRouter } = require("@langchain/openrouter");

const ORCHESTRATOR_MODEL = process.env.ORCHESTRATOR_MODEL || "deepseek/deepseek-v4-flash";
const GREETING_MODEL = process.env.GREETING_MODEL || "deepseek/deepseek-v4-flash";
const GENERAL_MODEL = process.env.GENERAL_MODEL || "deepseek/deepseek-chat";
const RAG_MODEL = process.env.RAG_MODEL || "deepseek/deepseek-chat";
const CODING_MODEL = process.env.CODING_MODEL || "deepseek/deepseek-r1";
const SEARCH_MODEL = process.env.SEARCH_MODEL || "deepseek/deepseek-chat";

const openRouter = (model, options) =>
  new ChatOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    model,
    ...options,
  });

const OrchestratorModel = () => openRouter(ORCHESTRATOR_MODEL, { temperature: 0.2, maxTokens: 1024 });

const GreetingModel = () => openRouter(GREETING_MODEL, { temperature: 0.4, maxTokens: 200 });

const GeneralModel = () => openRouter(GENERAL_MODEL, { temperature: 0.3, maxTokens: 1024 });

const CodingModel = () => openRouter(CODING_MODEL, { temperature: 0.1, maxTokens: 1024 });

const SearchModel = () => openRouter(SEARCH_MODEL, { temperature: 0, maxTokens: 512 });

const RagModel = () => openRouter(RAG_MODEL, { temperature: 0, maxTokens: 768 });

function getAgentModel(agentType) {
  switch (agentType) {
    case "orchestrator":
      return OrchestratorModel();

    case "greeting":
      return GreetingModel();

    case "coding":
      return CodingModel();

    case "search":
      return SearchModel();

    case "rag":
      return RagModel();

    case "general":
    default:
      return GeneralModel();
  }
}

module.exports = {
  getAgentModel,
  ORCHESTRATOR_MODEL,
  GREETING_MODEL,
  GENERAL_MODEL,
  RAG_MODEL,
  CODING_MODEL,
  SEARCH_MODEL,
};
