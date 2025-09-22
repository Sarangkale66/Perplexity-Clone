const cookie = require("cookie");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const aiService = require("../services/ai.service");
const messageModel = require("../model/message.model");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie;
    const { token } = cookies ? cookie.parse(cookies) : {};

    if (!token) return next(new Error("Authentication Error!"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error("Invalid Token!"));
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("ai-message", async (data) => {
      try {
        await messageModel.create({
          chat: data.chatId,
          user: socket.user.id,
          role: "user",
          text: data.message.trim(),
        });

        const history = await messageModel
          .find({ chat: data.chatId, user: socket.user.id })
          .sort({ createdAt: -1 })
          .limit(100)
          .sort({ createdAt: 1 })
          .lean();

        const messages = history.map((msg) =>
          msg.role === "user"
            ? new HumanMessage(msg.text)
            : new AIMessage(msg.text)
        );

        const responseTxt = await aiService.generateContentStream(
          messages,
          (chunk) => {
            socket.emit(
              "ai-response",
              JSON.stringify({
                chatId: data.chatId || socket.currentRoom,
                txt: chunk,
              })
            );
          }
        );

        if (responseTxt && responseTxt.trim().length > 0) {
          await messageModel.create({
            chat: data.chatId || socket.currentRoom,
            user: socket.user.id,
            role: "model",
            text: responseTxt.trim(),
          });
        } else {
          console.warn("Skipping save: Empty AI response");
        }
      } catch (err) {
        console.error("Error handling ai-message:", err);
        socket.emit("ai-error", { message: "Something went wrong with AI" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
}

module.exports = initSocket;
