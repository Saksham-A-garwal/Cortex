const MessageModel = require("../Model/MessageModel");
const ChatModel = require("../Model/ChatModel");
const {
  HumanMessage,
  AIMessage,
  SystemMessage,
} = require("@langchain/core/messages");

// 🚀 Import our new Brain and our new Model Configurator
const { getCortexAgentApp } = require("../Agents/graph");
const { getAgentModel } = require("../Agents/modelConfig");

const handleGetMessages = async (req, res) => {
  if (!req.params.chatId)
    return res.status(400).json({ msg: "ChatId is needed" });
  const messages = await MessageModel.find({ chatId: req.params.chatId });
  return res.status(200).json({ messages });
};

const handleSendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content) {
    return res.status(400).json({ msg: "Content is required" });
  }

  let activeChatId = chatId;
  let createdChat = null;

  if (!activeChatId) {
    createdChat = await ChatModel.create({ createdby: req.user._id });
    activeChatId = createdChat._id;
  }

  try {
    // 1. Save User Message
    await MessageModel.create({ content, chatId: activeChatId, role: "USER" });

    // 2. Fetch Chat History
    const pastMessages = await MessageModel.find({ chatId: activeChatId }).sort({
      createdAt: 1,
    });

    // 3. Set up Server-Sent Events (Streaming)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // ==========================================
    // AUTO-GENERATE TITLE (If first message)
    // ==========================================
    let generatedTitle = null;
    if (pastMessages.length === 1) {
      try {
        // We borrow the cheap, fast general model to write titles!
        const titleModel = getAgentModel("general");
        const titleResponse = await titleModel.invoke([
          new HumanMessage(
            `Generate a 3-5 word title for this message. No quotes. Message: "${content}"`,
          ),
        ]);
        generatedTitle = titleResponse.content.trim();
        await ChatModel.findByIdAndUpdate(activeChatId, { title: generatedTitle });
      } catch (err) {
        console.error("Failed to generate title:", err);
      }
    }

    // 4. Translate DB history to LangChain format
    const langchainMessages = pastMessages.map((msg) => {
      if (msg.role === "USER") return new HumanMessage(msg.content);
      return new AIMessage(msg.content);
    });

    // ==========================================
    // 🚀 THE LANGGRAPH STREAMING LOGIC
    // ==========================================
    let fullAiResponse = "";
    let isClientConnected = true;

    req.on("close", () => {
      isClientConnected = false;
    });

    // We pass our state into the compiled LangGraph Router!
    const stream = await getCortexAgentApp().streamEvents(
      { messages: langchainMessages, userId: req.user._id.toString() },
      { version: "v2" }, // Required for streamEvents
    );

    // Loop through the graph events
    for await (const event of stream) {
      if (!isClientConnected) break;

      const nodeName = event?.metadata?.langgraph_node ?? event?.name;
      if (nodeName === "router_agent") continue;

      // LangGraph fires MANY events (tool calls, routing, etc.).
      // We only want to stream the actual text chunks back to the user interface!
      if (
        event.event === "on_chat_model_stream" &&
        event.data?.chunk?.content &&
        typeof event.data.chunk.content === "string" // Ignore complex tool call objects
      ) {
        fullAiResponse += event.data.chunk.content;
        res.write(
          `data: ${JSON.stringify({ chunk: event.data.chunk.content })}\n\n`,
        );
      }
    }

    // 5. Save the final AI response to the DB
    const finalContent = isClientConnected
      ? fullAiResponse
      : fullAiResponse + "\n\n*[Stopped by user]*";
    const aiMessage = await MessageModel.create({
      content: finalContent,
      chatId: activeChatId,
      role: "AI",
    });

    // 6. Close the connection cleanly
    if (isClientConnected) {
      res.write(
        `data: ${JSON.stringify({
          done: true,
          aiMessage,
          newTitle: generatedTitle,
          newChat: createdChat ?? undefined,
        })}\n\n`,
      );
      return res.end();
    }
  } catch (error) {
    console.error("Error in LangGraph Generation:", error);
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
