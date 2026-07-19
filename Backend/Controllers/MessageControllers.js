const MessageModel = require("../Model/MessageModel");
const { getActiveModel } = require("../Utils/Models.js");
const ChatModel = require("../Model/ChatModel");
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
  const {
    content,
    chatId,
    model: requestedModel,
    systemPrompt: requestedSystemPrompt,
  } = req.body;
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

    // ==========================================
    // AUTO-GENERATE TITLE (If first message)
    // ==========================================
    let generatedTitle = null;
    if (pastMessages.length === 1) {
      try {
        console.log("First message detected! Generating chat title...");
        const titleModel = getActiveModel(requestedModel);
        const titleResponse = await titleModel.invoke([
          new HumanMessage(
            `Generate a 3-5 word title summarizing this message. Do not use quotes or special characters. Message: "${content}"`,
          ),
        ]);

        generatedTitle = titleResponse.content.trim();

        // Update the Chat in the Database
        await ChatModel.findByIdAndUpdate(chatId, { title: generatedTitle });
        console.log("Chat Title updated to:", generatedTitle);
      } catch (err) {
        console.error("Failed to generate title:", err);
      }
    }
    // ==========================================

    // 3. Translate MongoDB history into LangChain objects
    const langchainMessages = pastMessages.map((msg) => {
      if (msg.role === "USER") return new HumanMessage(msg.content);
      return new AIMessage(msg.content);
    });

    // Use the user's custom persona, or fallback to the default!
    const systemPrompt = new SystemMessage(
      requestedSystemPrompt ||
        "You are Cortex, an advanced, highly intelligent AI workspace.",
    );
    langchainMessages.unshift(systemPrompt);

    // 4. Initialize the AI Model using our new Factory!
     const model = getActiveModel(requestedModel);

    // ==========================================
    // THE STREAMING LOGIC
    // ==========================================

    // Set special headers to keep the HTTP connection OPEN!
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullAiResponse = "";
    let isClientConnected = true;

    // Listen for the client severing the connection (The Kill Switch)
    req.on("close", () => {
      console.log("Client disconnected! Aborting stream...");
      isClientConnected = false;
    });

    // Stream the data from whichever model is selected in .env
    const stream = await model.stream(langchainMessages);

    // Loop through the stream in real-time
    for await (const chunk of stream) {
      // If the user clicked Stop, break out of this loop instantly!
      if (!isClientConnected) {
        break;
      }

      if (chunk.content) {
        fullAiResponse += chunk.content;
        res.write(`data: ${JSON.stringify({ chunk: chunk.content })}\n\n`);
      }
    }

    // Whether they stopped it early or let it finish, save whatever was generated to the DB!
    const finalContent = isClientConnected
      ? fullAiResponse
      : fullAiResponse + "\n\n*[Generation stopped by user]*";

    const aiMessage = await MessageModel.create({
      content: finalContent,
      chatId: chatId,
      role: "AI",
    });

    // Only send the 'done' packet if the client is actually still there to receive it!
    if (isClientConnected) {
      // Send one final packet telling React that we are totally done, and include the new title if we made one!
      res.write(
        `data: ${JSON.stringify({ done: true, aiMessage, newTitle: generatedTitle })}\n\n`,
      );
      return res.end();
    }
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
