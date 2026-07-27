const { getAgentModel } = require("../modelConfig");
const { SystemMessage } = require("@langchain/core/messages");
const { searchPrompt } = require("../Prompts/SearchAgent");
const { TavilySearch } = require("@langchain/tavily");

const searchNode = async (state) => {
  const model = getAgentModel("search");

  // Give the AI access to the internet!
  const searchTool = new TavilySearch({ maxResults: 3 });
  const modelWithTools = model.bindTools([searchTool]);

  const messages = [new SystemMessage(searchPrompt), ...state.messages];
  const response = await modelWithTools.invoke(messages);

  return { messages: [response] };
};

module.exports = { searchNode };
