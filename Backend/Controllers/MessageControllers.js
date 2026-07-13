const MessageModel = require("../Model/MessageModel");

const handleGetMessages = async (req, res) => {
  if (!req.params.chatId)
    return res.status(400).json({ msg: "ChatId is needed" });
  const messages = await MessageModel.find({ chatId: req.params.chatId });
  return res.status(200).json({ messages });
};

const handleSendMessage = async (req, res) => {
  // Notice we do NOT grab role from req.body anymore
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // 1. Force the role to be USER for the incoming message
  const userMessage = await MessageModel.create({
    content: content,
    chatId: chatId,
    role: "USER",
  });

  // 2. Pretend to be the AI and save a response! (We will replace this with real AI later)
  const aiMessage = await MessageModel.create({
    content: "I am a fake AI response! You said: " + content,
    chatId: chatId,
    role: "AI",
  });

  // Send BOTH messages back to the frontend so it can update the screen instantly
  return res.status(201).json({
    msg: "Message Saved",
    userMessage,
    aiMessage,
  });
};

module.exports = {
  handleGetMessages,
  handleSendMessage,
};
