const ChatModel = require("../Model/ChatModel");
const MessageModel = require("../Model/MessageModel");

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

const handleDeleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    // 1. Delete all messages associated with this chat
    await MessageModel.deleteMany({ chatId: id });
    // 2. Delete the chat itself (and ensure it belongs to the logged-in user)
    await ChatModel.findOneAndDelete({ _id: id, createdby: req.user._id });
    
    return res.status(200).json({ msg: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return res.status(500).json({ msg: "Failed to delete chat" });
  }
};

module.exports = { handleCreateChat, handleGetUserChats, handleDeleteChat };
