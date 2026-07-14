const MessageModel = require("../Model/MessageModel");
const { getActiveModel } = require("../Utils/Models.js");
const {
  HumanMessage,
  AIMessage,
  SystemMessage,
} = require("@langchain/core/messages");

const handleGetMessages = async (req, res) => {
  if (!req.params.chatId)
    return res.status(400).json({ msg: "ChatId is needed" });
  const messages = await MessageModel.find({ chatId: req.params.chatId });
  return res.status(200).json({ messages });
};

const handleSendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    // 1. Save the User's new message to MongoDB
    const userMessage = await MessageModel.create({
      content: content,
      chatId: chatId,
      role: "USER",
    });

    // 2. Fetch the ENTIRE chat history from MongoDB
    const pastMessages = await MessageModel.find({ chatId }).sort({
      createdAt: 1,
    });

    // 3. Translate MongoDB history into LangChain objects
    const langchainMessages = pastMessages.map((msg) => {
      if (msg.role === "USER") return new HumanMessage(msg.content);
      return new AIMessage(msg.content);
    });

    const systemPrompt = new SystemMessage(
      "You are Cortex, an advanced, highly intelligent AI workspace. You are helpful, concise, and write your answers using Markdown formatting.",
    );
    langchainMessages.unshift(systemPrompt);

    // 4. Initialize the AI Model using our new Factory!
    const model = getActiveModel();

    // ==========================================
    // THE STREAMING LOGIC
    // ==========================================

    // Set special headers to keep the HTTP connection OPEN!
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullAiResponse = "";

    // Stream the data from whichever model is selected in .env
    const stream = await model.stream(langchainMessages);

    // Loop through the stream in real-time
    for await (const chunk of stream) {
      if (chunk.content) {
        fullAiResponse += chunk.content;
        res.write(`data: ${JSON.stringify({ chunk: chunk.content })}\n\n`);
      }
    }

    // Once the stream finishes, save the final complete message to the Database!
    const aiMessage = await MessageModel.create({
      content: fullAiResponse,
      chatId: chatId,
      role: "AI",
    });

    // Send one final packet telling React that we are totally done
    res.write(`data: ${JSON.stringify({ done: true, aiMessage })}\n\n`);

    // Close the connection
    return res.end();
  } catch (error) {
    console.error("Error in AI Generation:", error);
    // If the stream hasn't started yet, we can send a 500 error.
    if (!res.headersSent) {
      return res.status(500).json({ msg: "Failed to generate AI response." });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream Failed" })}\n\n`);
      return res.end();
    }
  }
};

module.exports = {
  handleGetMessages,
  handleSendMessage,
};
