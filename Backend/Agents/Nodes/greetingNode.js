const { SystemMessage } = require("@langchain/core/messages");
const { getAgentModel } = require("../modelConfig");

const GREETING_PATTERNS = [
  /^(hi|hey|hello|yo|sup|hiya)\b/i,
  /^good (morning|afternoon|evening|night)\b/i,
  /^(thanks|thank you|thx|ty|cheers)\b/i,
  /^(bye|goodbye|see ya|see you|cya)\b/i,
  /^(ok|okay|cool|nice|great|awesome|got it|sounds good)[!.]*$/i,
  /^how are you\b/i,
  /^(who are you|what are you|what can you do)\b/i,
];

const MAX_GREETING_LENGTH = 60;

const isGreeting = (text) => {
  const trimmed = String(text ?? "").trim();
  if (!trimmed || trimmed.length > MAX_GREETING_LENGTH) return false;
  if (trimmed.includes("```")) return false;
  return GREETING_PATTERNS.some((pattern) => pattern.test(trimmed));
};

const greetingPrompt = `You are Cortex, a friendly AI assistant. Reply to this greeting or
pleasantry in one or two short sentences. Do not list your capabilities at length. Do not use
markdown headings.`;

const greetingNode = async (state) => {
  const model = getAgentModel("greeting");
  const response = await model.invoke([
    new SystemMessage(greetingPrompt),
    ...state.messages,
  ]);
  return { messages: [response] };
};

module.exports = { isGreeting, greetingNode, GREETING_PATTERNS, MAX_GREETING_LENGTH };
