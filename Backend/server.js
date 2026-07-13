const express = require("express");
const app = express();
const {ConnectDB} = require("./DataBaseConnection");
const authRoutes = require("./Routers/authRoutes");
const chatRoutes = require("./Routers/chatsRoutes")
const MessageRoutes = require("./Routers/MessageRoutes");
const cors = require("cors");
const PORT = 5000

const corsOptions = {
    origin : "http://localhost:5173"
}

app.use(cors(corsOptions));
app.use(express.json());
ConnectDB("mongodb://127.0.0.1:27017/Cortex")
  .then(() => console.log("DataBase is Connected"))
  .catch((err) =>
    console.log("Error OCcured While Connecting the DataBase", err),
  );

app.use("/api/auth",authRoutes);
app.use("/api/chats",chatRoutes);
app.use("/api/messages", MessageRoutes);
app.listen(PORT , () => console.log("Server is Started at",PORT));