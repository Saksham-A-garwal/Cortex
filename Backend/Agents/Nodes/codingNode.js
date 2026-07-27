const { getAgentModel } = require("../modelConfig");
const { SystemMessage } = require("@langchain/core/messages");
const { codingPrompt } = require("../Prompts/CodingAgent");

const codingNode = async (state) => {
  const model = getAgentModel("coding");
  const messages = [new SystemMessage(codingPrompt), ...state.messages];

  const response = await model.invoke(messages);
  return { messages: [response] };
};

module.exports = { codingNode };
