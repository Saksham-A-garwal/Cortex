const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ChatGroq } = require("@langchain/groq");

const getActiveModel = (requestedModel) => {
  const activeModel = process.env.ACTIVE_MODEL;

  // 1. If Frontend requested a Gemini model
  if (requestedModel && requestedModel.startsWith("gemini")) {
    console.log(`🚀 Using Frontend Requested Model: ${requestedModel}`);
    return new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: requestedModel,
      maxOutputTokens: 2048,
    });
  }

  // 2. NEW: If Frontend requested a Groq/Llama model!
  if (requestedModel && requestedModel.startsWith("llama")) {
    console.log(`🚀 Using Frontend Requested Groq Model: ${requestedModel}`);
    return new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: requestedModel,
      maxTokens: 2048,
    });
  }

  // 3. Fallbacks (If Settings are blank, use .env)
  if (activeModel === "GROQ") {
    console.log("🚀 Using Groq (.env Default)");
    return new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.1-8b-instant",
      maxTokens: 2048,
    });
  }

  if (activeModel === "GEMINI") {
    console.log("🚀 Using Google Gemini (.env Default)");
    return new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-flash-latest",
      maxOutputTokens: 2048,
    });
  }

  throw new Error("Invalid ACTIVE_MODEL in .env file");
};

module.exports = { getActiveModel };
