require("dotenv").config();
const express = require("express");
const app = express();
const { ConnectDB } = require("./DataBaseConnection");
const authRoutes = require("./Routers/authRoutes");
const chatRoutes = require("./Routers/chatsRoutes");
const MessageRoutes = require("./Routers/MessageRoutes");
const userRoutes = require("./Routers/userRoutes");
const documentRoutes = require("./Routers/documentRoutes");
const cors = require("cors");
const session = require("express-session"); 
const passport = require("./Config/Passport"); 

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET || "cortex_secret_key", 
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());


ConnectDB(process.env.MONGO_URI)
  .then(() => console.log("DataBase is Connected"))
  .catch((err) =>
    console.log("Error OCcured While Connecting the DataBase", err),
  );

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", MessageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);

app.listen(PORT, () => console.log("Server is Started at", PORT));
