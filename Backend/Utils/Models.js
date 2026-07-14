const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ChatGroq } = require("@langchain/groq");

// This function checks the .env file and returns the correct AI model!
const getActiveModel = () => {
  const activeModel = process.env.ACTIVE_MODEL;

  if (activeModel === "GROQ") {
    console.log("🚀 Using Groq (Llama 3) for lightning-fast streaming!");
    return new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.1-8b-instant", // The blazing fast free model
      maxTokens: 2048,
    });
  }

  if (activeModel === "GEMINI") {
    console.log("🚀 Using Google Gemini!");
    return new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-1.5-flash",
      maxOutputTokens: 2048,
    });
  }

  throw new Error("Invalid ACTIVE_MODEL in .env file");
};

module.exports = { getActiveModel };
