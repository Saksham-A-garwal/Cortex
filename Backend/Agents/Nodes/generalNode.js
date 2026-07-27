const { getAgentModel } = require("../modelConfig");
const { SystemMessage } = require("@langchain/core/messages");
const { generalPrompt } = require("../Prompts/GeneralAgent");

const generalNode = async (state) => {
  const model = getAgentModel("general");
  const messages = [new SystemMessage(generalPrompt), ...state.messages];

  const response = await model.invoke(messages);
  return { messages: [response] };
};

module.exports = { generalNode };
