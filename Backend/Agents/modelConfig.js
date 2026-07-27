const { ChatGroq } = require("@langchain/groq");
const { ChatOpenRouter } = require("@langchain/openrouter");

const RouterModel = () => new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  temperature: 0,
});


const GeneralModel = () => new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.3,
});


const CodingModel = () => new ChatOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-r1",
  temperature: 0.1,
  maxTokens: 2048,
});


const SearchModel = () => new ChatOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 2048,
});


const RagModel = () => new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});


function getAgentModel(agentType) {
  switch (agentType) {
    case "router":
      return RouterModel();

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

module.exports = { getAgentModel };
