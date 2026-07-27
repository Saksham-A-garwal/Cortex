const { getAgentModel } = require("../modelConfig");
const { SystemMessage, AIMessage, HumanMessage } = require("@langchain/core/messages");
const { ragPrompt } = require("../Prompts/RagAgent");
const { retrieveRelevantDocuments } = require("../../Services/qdrantService");
const Document = require("../../Model/DocumentModel");

const ragNode = async (state) => {
  const latestMessage = state.messages.at(-1);
  const question = typeof latestMessage.content === "string" ? latestMessage.content : "";

  if (!state.userId) {
    return { messages: [new AIMessage("I cannot access documents without an authenticated user.")] };
  }

  // ==========================================
  // 1. FETCH USER'S RECENT DOCUMENTS
  // ==========================================
  // We need to know what documents the user has uploaded so the AI 
  // can figure out which one they are talking about!
  const recentDocs = await Document.find({ owner: state.userId })
    .sort({ createdAt: -1 }) // Sort by newest first
    .limit(5);
  
  const recentDocNames = recentDocs.length > 0 
    ? recentDocs.map((d) => d.filename).join(", ") 
    : "No documents uploaded yet.";

  // ==========================================
  // 2. QUERY REFORMULATION (The Fix!)
  // ==========================================
  // We use the cheap/fast general model to rewrite the generic query 
  // into a highly specific vector search query.
  const queryModel = getAgentModel("general");
  
  const reformulationPrompt = `You are an expert search query generator for a Vector Database.
The user has recently uploaded these documents to their account: [${recentDocNames}]. (The first one listed is the most recent).

The user is asking a question about a document. If their question is generic (e.g., "summarize the document" or "what is this file about"), assume they are talking about the MOST RECENT document they uploaded, and explicitly include its name and core concepts in your search query. 
If they specifically name a document, use that instead.

Write a highly descriptive search query that will perfectly match the technical content inside the PDF.
Output ONLY the raw search query. Do not use quotes. Do not explain yourself.

User's request: "${question}"`;

  const reformulatedResponse = await queryModel.invoke([new HumanMessage(reformulationPrompt)]);
  const optimizedQuery = reformulatedResponse.content.trim();
  
  console.log(`\n🔍 Original RAG Query: "${question}"`);
  console.log(`🎯 Optimized RAG Query: "${optimizedQuery}"\n`);

  // ==========================================
  // 3. SEARCH QDRANT
  // ==========================================
  // Now we search using the smart query instead of the dumb generic one!
  const documents = await retrieveRelevantDocuments(state.userId, optimizedQuery);
  
  if (documents.length === 0) {
    return {
      messages: [new AIMessage("I cannot find the answer to this in your uploaded documents. Please make sure the document is uploaded.")],
    };
  }

  // ==========================================
  // 4. BUILD CONTEXT & GENERATE ANSWER
  // ==========================================
  const context = documents
    .map(
      (document) =>
        `[${document.metadata.filename}, section ${document.metadata.chunkIndex + 1}]\n${document.pageContent}`,
    )
    .join("\n\n---\n\n");

  const model = getAgentModel("rag");
  const messages = [
    new SystemMessage(`${ragPrompt}\n\nRetrieved document context:\n${context}`),
    ...state.messages,
  ];
  const response = await model.invoke(messages);

  return { messages: [response] };
};

module.exports = { ragNode };
