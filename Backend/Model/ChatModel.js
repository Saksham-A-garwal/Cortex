const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    title : {
        type : String,
        default : "New Chat"
    },
    createdby : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps : true})

const ChatModel = mongoose.model("Chat" , chatSchema);

module.exports = ChatModel;