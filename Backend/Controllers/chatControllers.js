const ChatModel = require("../Model/ChatModel");

const handleCreateChat = async (req, res) => {
  const chat = await ChatModel.create({ createdby: req.user._id });
  return res.status(201).json({ msg: "chat Created successfully", chat: chat });
};

const handleGetUserChats = async (req, res) => {
  const chats = await ChatModel.find({ createdby: req.user._id }).sort({
    createdAt: -1,
  });
  return res.status(200).json({ chats: chats });
};

module.exports = { handleCreateChat, handleGetUserChats };
